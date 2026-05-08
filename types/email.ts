export interface Sender {
  name: string;
  email: string;
  domain: string;
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
