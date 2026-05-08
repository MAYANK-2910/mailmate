import type { Email, EmailCategory } from '../../types/email';
import type { Stack } from '../../types/stack';
import { CATEGORIES, CATEGORY_MAP, type CategoryConfig } from '../../constants/categories';

function scoreCategoryMatch(email: Email, config: CategoryConfig): number {
  let score = 0;
  const subjectLower = email.subject.toLowerCase();
  const snippetLower = email.snippet.toLowerCase();
  const senderDomain = email.sender.domain.toLowerCase();

  for (const label of email.labels) {
    if (config.gmailLabels.includes(label)) {
      score += 50;
    }
  }

  for (const domain of config.domains) {
    if (senderDomain.includes(domain)) {
      score += 40;
    }
  }

  for (const keyword of config.keywords) {
    if (subjectLower.includes(keyword)) {
      score += 20;
    }
    if (snippetLower.includes(keyword)) {
      score += 10;
    }
  }

  return score;
}

export function categorizeEmail(email: Email): EmailCategory {
  let bestCategory: EmailCategory = 'updates';
  let bestScore = 0;

  for (const config of CATEGORIES) {
    const score = scoreCategoryMatch(email, config);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = config.id;
    }
  }

  if (bestScore === 0) {
    if (email.labels.includes('CATEGORY_PROMOTIONS')) return 'promotions';
    if (email.labels.includes('CATEGORY_SOCIAL')) return 'social';
    if (email.labels.includes('CATEGORY_UPDATES')) return 'updates';
    if (email.labels.includes('CATEGORY_FORUMS')) return 'social';
    if (email.labels.includes('CATEGORY_PERSONAL')) return 'personal';

    const senderDomain = email.sender.domain.toLowerCase();
    const isLikelyPersonal =
      !senderDomain.includes('noreply') &&
      !senderDomain.includes('no-reply') &&
      !senderDomain.includes('notifications') &&
      !senderDomain.includes('mailer');

    if (isLikelyPersonal && !email.sender.email.includes('noreply')) {
      return 'personal';
    }
  }

  return bestCategory;
}

export function categorizeEmails(emails: Email[]): Email[] {
  return emails.map((email) => ({
    ...email,
    category: categorizeEmail(email),
  }));
}

export function groupByCategory(emails: Email[]): Stack[] {
  const grouped = new Map<EmailCategory, Email[]>();

  for (const email of emails) {
    const existing = grouped.get(email.category) ?? [];
    existing.push(email);
    grouped.set(email.category, existing);
  }

  const stacks: Stack[] = [];
  for (const [category, categoryEmails] of grouped) {
    const config = CATEGORY_MAP.get(category);
    if (!config) continue;

    const sorted = [...categoryEmails].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    const unreadCount = sorted.filter((e) => e.isUnread).length;

    stacks.push({
      id: `stack-${category}`,
      category,
      label: config.label,
      icon: config.icon,
      color: config.color,
      emails: sorted,
      unreadCount,
      totalCount: sorted.length,
      isCollapsed: false,
      lastUpdated: sorted[0]?.date ?? new Date(),
      priority: calculateStackPriority(unreadCount, sorted),
    });
  }

  return stacks.sort((a, b) => b.priority - a.priority);
}

function calculateStackPriority(unreadCount: number, emails: Email[]): number {
  let priority = 0;

  priority += unreadCount * 10;

  const now = Date.now();
  const recentEmails = emails.filter(
    (e) => now - e.date.getTime() < 3600000
  );
  priority += recentEmails.length * 5;

  const importantEmails = emails.filter(
    (e) => e.priority === 'critical' || e.priority === 'important'
  );
  priority += importantEmails.length * 15;

  return priority;
}
