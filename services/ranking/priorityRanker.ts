import type { Email, PriorityLevel } from '../../types/email';

const URGENCY_KEYWORDS = [
  'urgent', 'asap', 'immediately', 'critical', 'deadline',
  'action required', 'time sensitive', 'important', 'emergency',
  'overdue', 'expire', 'expiring', 'final notice', 'last chance',
];

const WEIGHT_UNREAD = 30;
const WEIGHT_URGENCY_KEYWORD = 25;
const WEIGHT_RECENT_1H = 20;
const WEIGHT_RECENT_24H = 10;
const WEIGHT_STARRED = 15;
const WEIGHT_IMPORTANT_LABEL = 20;

function calculatePriorityScore(email: Email): number {
  let score = 0;

  if (email.isUnread) {
    score += WEIGHT_UNREAD;
  }

  if (email.isStarred) {
    score += WEIGHT_STARRED;
  }

  if (email.labels.includes('IMPORTANT')) {
    score += WEIGHT_IMPORTANT_LABEL;
  }

  const textToCheck = `${email.subject} ${email.snippet}`.toLowerCase();
  for (const keyword of URGENCY_KEYWORDS) {
    if (textToCheck.includes(keyword)) {
      score += WEIGHT_URGENCY_KEYWORD;
      break;
    }
  }

  if (email.isDirect) {
    score += 40;
  }

  const ageMs = Date.now() - email.date.getTime();
  const oneHour = 3600000;
  const twentyFourHours = 86400000;

  if (ageMs < oneHour) {
    score += WEIGHT_RECENT_1H;
  } else if (ageMs < twentyFourHours) {
    score += WEIGHT_RECENT_24H;
  }

  return score;
}

function scoreToLevel(score: number): PriorityLevel {
  if (score >= 70) return 'critical';
  if (score >= 45) return 'important';
  if (score >= 20) return 'medium';
  return 'low';
}

export function rankEmail(email: Email): Email {
  const score = calculatePriorityScore(email);
  return {
    ...email,
    priority: scoreToLevel(score),
  };
}

export function rankEmails(emails: Email[]): Email[] {
  return emails
    .map(rankEmail)
    .sort((a, b) => {
      const levelOrder: Record<PriorityLevel, number> = {
        critical: 4,
        important: 3,
        medium: 2,
        low: 1,
      };
      const priorityDiff = (levelOrder[b.priority] ?? 0) - (levelOrder[a.priority] ?? 0);
      if (priorityDiff !== 0) return priorityDiff;
      return b.date.getTime() - a.date.getTime();
    });
}
