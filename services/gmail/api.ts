import { gmailFetch } from './auth';
import type {
  GmailListResponse,
  GmailMessage,
  GmailThreadResponse,
  Email,
  Sender,
  GmailPart,
} from '../../types/email';

export async function listMessages(
  query: string = '',
  maxResults: number = 100,
  pageToken?: string
): Promise<GmailListResponse> {
  const params = new URLSearchParams({
    maxResults: String(maxResults),
    q: query || 'in:inbox',
  });
  if (pageToken) {
    params.set('pageToken', pageToken);
  }
  return gmailFetch<GmailListResponse>(`/messages?${params.toString()}`);
}

export async function getMessage(messageId: string, format: 'full' | 'metadata' | 'minimal' = 'full'): Promise<GmailMessage> {
  return gmailFetch<GmailMessage>(`/messages/${messageId}?format=${format}`);
}

export async function getThread(threadId: string): Promise<GmailThreadResponse> {
  return gmailFetch<GmailThreadResponse>(`/threads/${threadId}?format=full`);
}

export async function batchGetMessages(
  messageIds: string[],
  format: 'full' | 'metadata' | 'minimal' = 'metadata'
): Promise<GmailMessage[]> {
  const batchSize = 20;
  const results: GmailMessage[] = [];

  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const promises = batch.map((id) => getMessage(id, format));
    const batchResults = await Promise.allSettled(promises);

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    }
  }

  return results;
}

export async function getLabels(): Promise<Array<{ id: string; name: string; type: string }>> {
  const response = await gmailFetch<{
    labels: Array<{ id: string; name: string; type: string }>;
  }>('/labels');
  return response.labels;
}

export async function getUserProfile(): Promise<{ emailAddress: string; messagesTotal: number; threadsTotal: number }> {
  return gmailFetch('/profile');
}

function getHeaderValue(headers: Array<{ name: string; value: string }>, name: string): string {
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header?.value ?? '';
}

function parseSender(from: string): Sender {
  const match = from.match(/^(?:"?(.+?)"?\s)?<?([^>]+)>?$/);
  if (match) {
    const email = match[2]?.trim() ?? from.trim();
    return {
      name: match[1]?.trim() ?? email.split('@')[0] ?? email,
      email,
      domain: email.split('@')[1] ?? '',
    };
  }
  return {
    name: from.split('@')[0] ?? from,
    email: from,
    domain: from.split('@')[1] ?? '',
  };
}

function extractBody(payload: GmailMessage['payload']): string {
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts) {
    const htmlPart = findPart(payload.parts, 'text/html');
    if (htmlPart?.body?.data) {
      return decodeBase64Url(htmlPart.body.data);
    }

    const textPart = findPart(payload.parts, 'text/plain');
    if (textPart?.body?.data) {
      return decodeBase64Url(textPart.body.data);
    }
  }

  return '';
}

function findPart(parts: GmailPart[], mimeType: string): GmailPart | undefined {
  for (const part of parts) {
    if (part.mimeType === mimeType) {
      return part;
    }
    if (part.parts) {
      const found = findPart(part.parts, mimeType);
      if (found) return found;
    }
  }
  return undefined;
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    try {
      return atob(base64);
    } catch {
      return '';
    }
  }
}

function parseRecipients(to: string): string[] {
  if (!to) return [];
  return to.split(',').map((r) => r.trim());
}

export function parseGmailMessage(msg: GmailMessage): Email {
  const headers = msg.payload.headers;
  const from = getHeaderValue(headers, 'From');
  const to = getHeaderValue(headers, 'To');
  const subject = getHeaderValue(headers, 'Subject');
  const date = getHeaderValue(headers, 'Date');

  return {
    id: msg.id,
    threadId: msg.threadId,
    subject: subject || '(No Subject)',
    sender: parseSender(from),
    recipients: parseRecipients(to),
    snippet: msg.snippet,
    body: extractBody(msg.payload),
    date: date ? new Date(date) : new Date(parseInt(msg.internalDate, 10)),
    isUnread: msg.labelIds?.includes('UNREAD') ?? false,
    isStarred: msg.labelIds?.includes('STARRED') ?? false,
    labels: msg.labelIds ?? [],
    category: 'updates',
    priority: 'medium',
  };
}

export async function fetchInboxEmails(
  maxResults: number = 200,
  query: string = 'in:inbox'
): Promise<Email[]> {
  const listResponse = await listMessages(query, maxResults);

  if (!listResponse.messages || listResponse.messages.length === 0) {
    return [];
  }

  const messages = await batchGetMessages(
    listResponse.messages.map((m) => m.id),
    'full'
  );

  return messages.map(parseGmailMessage);
}
