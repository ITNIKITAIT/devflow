import { GodClassRule } from './rules/god-class';
import { LargeFileRule } from './rules/large-file';
import { LongFunctionRule } from './rules/long-function';
import { LongParameterListRule } from './rules/long-parameter-list';
import { MagicNumberRule } from './rules/magic-number';
import type { AnalyzerRule, CodeIssue } from './types';

export class CodeAnalyzer {
  private rules: AnalyzerRule[];

  constructor() {
    this.rules = [
      new MagicNumberRule(),
      new LongFunctionRule(),
      new LongParameterListRule(),
      new GodClassRule(),
      new LargeFileRule(),
    ];
  }

  analyzeFile(content: string, filePath: string): CodeIssue[] {
    // Only JS/TS files
    if (!/\.(js|jsx|ts|tsx)$/.test(filePath)) {
      return [];
    }
    if (filePath.includes('test')) {
      return [];
    }

    return this.rules.flatMap((rule) => rule.analyze(content, filePath));
  }
}
