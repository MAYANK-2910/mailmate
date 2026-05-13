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

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'important',
    label: 'Important',
    icon: 'star',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.12)',
    keywords: ['urgent', 'asap', 'important', 'critical', 'deadline', 'action required', 'immediate'],
    domains: [],
    gmailLabels: ['IMPORTANT', 'STARRED'],
  },
  {
    id: 'work',
    label: 'Work',
    icon: 'work',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    keywords: ['meeting', 'standup', 'sprint', 'jira', 'confluence', 'deploy', 'review', 'pr', 'merge', 'pipeline', 'release'],
    domains: ['github.com', 'gitlab.com', 'atlassian.com', 'jira.com', 'slack.com', 'notion.so', 'linear.app', 'figma.com', 'vercel.com', 'netlify.com'],
    gmailLabels: [],
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: 'person',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    keywords: ['family', 'birthday', 'party', 'dinner', 'weekend', 'vacation', 'trip'],
    domains: [],
    gmailLabels: ['CATEGORY_PERSONAL'],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'payments',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.12)',
    keywords: ['invoice', 'payment', 'receipt', 'transaction', 'bank', 'statement', 'tax', 'refund', 'billing', 'subscription'],
    domains: ['paypal.com', 'stripe.com', 'venmo.com', 'chase.com', 'wellsfargo.com', 'bankofamerica.com', 'wise.com', 'revolut.com'],
    gmailLabels: [],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: 'shopping_cart',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    keywords: ['order', 'shipped', 'delivered', 'tracking', 'purchase', 'cart', 'discount', 'sale'],
    domains: ['amazon.com', 'ebay.com', 'walmart.com', 'shopify.com', 'etsy.com', 'aliexpress.com', 'bestbuy.com', 'target.com'],
    gmailLabels: ['CATEGORY_PURCHASES'],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'group',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
    keywords: ['follow', 'like', 'comment', 'mention', 'friend', 'connection', 'invite'],
    domains: ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'reddit.com', 'tiktok.com', 'discord.com'],
    gmailLabels: ['CATEGORY_SOCIAL'],
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    icon: 'article',
    color: '#14b8a6',
    bgColor: 'rgba(20, 184, 166, 0.12)',
    keywords: ['newsletter', 'digest', 'weekly', 'roundup', 'unsubscribe', 'edition', 'issue'],
    domains: ['substack.com', 'mailchimp.com', 'convertkit.com', 'beehiiv.com', 'buttondown.email', 'revue.email'],
    gmailLabels: [],
  },
  {
    id: 'promotions',
    label: 'Promotions',
    icon: 'sell',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    keywords: ['promo', 'offer', 'deal', 'coupon', 'free', 'limited time', 'exclusive', 'save', 'off', 'special'],
    domains: [],
    gmailLabels: ['CATEGORY_PROMOTIONS'],
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'school',
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.12)',
    keywords: ['course', 'lesson', 'assignment', 'grade', 'class', 'lecture', 'enrollment', 'certificate'],
    domains: ['coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org', 'udacity.com', 'skillshare.com'],
    gmailLabels: [],
  },
  {
    id: 'updates',
    label: 'Updates',
    icon: 'notifications',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    keywords: ['update', 'notification', 'alert', 'reminder', 'verify', 'confirm', 'security', 'password'],
    domains: ['google.com', 'apple.com', 'microsoft.com', 'dropbox.com'],
    gmailLabels: ['CATEGORY_UPDATES'],
  },
  {
    id: 'spam',
    label: 'Spam',
    icon: 'block',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    keywords: ['winner', 'congratulations', 'claim', 'lottery', 'million', 'inheritance'],
    domains: [],
    gmailLabels: ['SPAM'],
  },
];

export const CATEGORY_MAP = new Map<EmailCategory, CategoryConfig>(
  CATEGORIES.map((c) => [c.id, c])
);

export const FOCUS_MODE_HIDDEN: EmailCategory[] = ['newsletters', 'promotions', 'spam', 'updates'];
export const FOCUS_MODE_PRIORITY: EmailCategory[] = ['important', 'work', 'personal', 'finance'];
