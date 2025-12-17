import { LongFunctionRule } from './rules/long-function';
import { MagicNumberRule } from './rules/magic-number';
import type { AnalyzerRule, CodeIssue } from './types';

export class CodeAnalyzer {
  private rules: AnalyzerRule[];

  constructor() {
    this.rules = [new MagicNumberRule(), new LongFunctionRule()];
  }

  analyzeFile(content: string, filePath: string): CodeIssue[] {
    // Only JS/TS files
    if (!/\.(js|jsx|ts|tsx)$/.test(filePath)) {
      return [];
    }

    return this.rules.flatMap((rule) => rule.analyze(content, filePath));
  }
}
