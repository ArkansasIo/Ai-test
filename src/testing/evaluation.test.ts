import assert from 'node:assert/strict';
import test from 'node:test';
import { similarity, summarizeEvaluation } from '../evaluation/index.js';

test('evaluation similarity scores shared vocabulary', () => {
  assert.equal(similarity('hello world', 'hello world'), 1);
  assert.ok(similarity('hello world', 'hello') > 0);
  assert.equal(similarity('alpha', 'omega'), 0);
});

test('evaluation report applies a deterministic threshold', () => {
  const report = summarizeEvaluation([
    { caseId: '1', output: 'hello', score: 1, passed: false },
    { caseId: '2', output: 'partial', score: 0.4, passed: true },
  ]);
  assert.equal(report.total, 2);
  assert.equal(report.passed, 1);
  assert.equal(report.results[1]?.passed, false);
});
