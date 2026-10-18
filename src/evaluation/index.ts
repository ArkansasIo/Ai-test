export interface EvaluationCase {
  id: string;
  input: string;
  expected: string;
  tags?: string[];
}

export interface EvaluationResult {
  caseId: string;
  output: string;
  score: number;
  passed: boolean;
}

export interface EvaluationReport {
  total: number;
  passed: number;
  averageScore: number;
  results: EvaluationResult[];
}

export const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ');

export function similarity(expected: string, actual: string): number {
  const a = new Set(normalize(expected).split(' ').filter(Boolean));
  const b = new Set(normalize(actual).split(' ').filter(Boolean));
  if (!a.size && !b.size) return 1;
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection++;
  return intersection / new Set([...a, ...b]).size;
}

export function summarizeEvaluation(results: EvaluationResult[], threshold = 0.5): EvaluationReport {
  const passed = results.filter((result) => result.score >= threshold).length;
  return {
    total: results.length,
    passed,
    averageScore: results.length ? results.reduce((sum, result) => sum + result.score, 0) / results.length : 0,
    results: results.map((result) => ({ ...result, passed: result.score >= threshold })),
  };
}
