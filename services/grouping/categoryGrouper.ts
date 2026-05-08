import type { Email, EmailCategory } from '../../types/email';
import { CATEGORIES } from '../../constants/categories';

function scoreCategoryMatch(email: Email, config: any): number {
  let score = 0;
  const subjectLower = email.subject.toLowerCase();
  const senderDomain = email.sender.domain.toLowerCase();
  for (const label of email.labels) {
    if (config.gmailLabels.includes(label)) score += 50;
  }
  for (const domain of config.domains) {
    if (senderDomain.includes(domain)) score += 40;
  }
  for (const keyword of config.keywords) {
    if (subjectLower.includes(keyword)) score += 20;
  }
  return score;
}
