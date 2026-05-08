export interface Sender {
  name: string;
  email: string;
  domain: string;
}

export interface Email {
  id: string;
  threadId: string;
  subject: string;
  sender: Sender;
  recipients: string[];
  snippet: string;
  body: string;
  date: Date;
  isUnread: boolean;
  isStarred: boolean;
  labels: string[];
  category: EmailCategory;
  priority: PriorityLevel;
}

export interface Thread {
  id: string;
  subject: string;
  emails: Email[];
  lastUpdated: Date;
  isUnread: boolean;
  participants: Sender[];
}

export type EmailCategory =
  | 'work'
  | 'personal'
  | 'finance'
  | 'shopping'
  | 'social'
  | 'newsletters'
  | 'promotions'
  | 'education'
  | 'updates'
  | 'spam'
  | 'important';

export type PriorityLevel = 'critical' | 'important' | 'medium' | 'low';

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  internalDate: string;
  payload: GmailPayload;
}

export interface GmailPayload {
  headers: GmailHeader[];
  mimeType: string;
  body: GmailBody;
  parts?: GmailPart[];
}

export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailBody {
  size: number;
  data?: string;
}

export interface GmailPart {
  mimeType: string;
  body: GmailBody;
  parts?: GmailPart[];
}

export interface GmailListResponse {
  messages: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export interface GmailThreadResponse {
  id: string;
  messages: GmailMessage[];
}
