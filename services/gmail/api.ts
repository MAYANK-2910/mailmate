import { gmailFetch } from './auth';
import type { GmailListResponse, GmailMessage } from '../../types/email';

export async function listMessages(
  query: string = '',
  maxResults: number = 100,
  pageToken?: string
): Promise<GmailListResponse> {
  const params = new URLSearchParams({
    maxResults: String(maxResults),
    q: query || 'in:inbox',
  });
  if (pageToken) params.set('pageToken', pageToken);
  return gmailFetch<GmailListResponse>(`/messages?${params.toString()}`);
}

export async function getMessage(messageId: string, format: 'full' | 'metadata' | 'minimal' = 'full'): Promise<GmailMessage> {
  return gmailFetch<GmailMessage>(`/messages/${messageId}?format=${format}`);
}
