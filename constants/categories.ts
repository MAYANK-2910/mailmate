import type { EmailCategory } from '../types/email';

export interface CategoryConfig {
  id: EmailCategory;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  keywords: string[];
  domains: string[];
  gmailLabels: string[];
}

export const CATEGORIES: CategoryConfig[] = [];
export const CATEGORY_MAP = new Map<EmailCategory, CategoryConfig>();
export const FOCUS_MODE_HIDDEN: EmailCategory[] = ['newsletters', 'promotions', 'spam', 'updates'];
export const FOCUS_MODE_PRIORITY: EmailCategory[] = ['important', 'work', 'personal', 'finance'];
