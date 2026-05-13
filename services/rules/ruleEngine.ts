export interface Rule {
  id: string;
  name: string;
  condition: (context: any) => boolean;
  action: (context: any) => void;
}

class RuleEngine {
  private rules: Rule[] = [];

  public addRule(rule: Rule) {
    this.rules.push(rule);
  }

  public process(context: any) {
    this.rules.forEach(rule => {
      if (rule.condition(context)) {
        rule.action(context);
      }
    });
  }
}

export const ruleEngine = new RuleEngine();
