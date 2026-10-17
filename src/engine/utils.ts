import { randomUUID } from 'node:crypto';

export const id = (): string => randomUUID();
export const now = (): string => new Date().toISOString();
export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function safeJsonParse<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}
