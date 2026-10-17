export type ID = string;
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
export interface Timestamped { createdAt: string; updatedAt?: string; }
export interface Result<T> { ok: boolean; value?: T; error?: { code: string; message: string }; }
