import { Email, StackData } from '../../types/email';
import { CATEGORY_MAP } from '../../constants/categories';

/**
 * Enhanced stack grouping engine with deterministic type classification.
 */
export class StackGrouper {
  public static group(emails: Email[]): StackData[] {
    const groups: Record<string, Email[]> = {};

    emails.forEach(email => {
      const category = email.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(email);
    });

    return Object.entries(groups).map(([id, emails]) => ({
      id,
      name: CATEGORY_MAP[id]?.name || id,
      icon: CATEGORY_MAP[id]?.icon || 'folder',
      count: emails.length,
      emails,
    }));
  }
}
