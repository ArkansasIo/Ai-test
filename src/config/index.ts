export interface PlatformConfig {
  host: string;
  port: number;
  environment: 'development' | 'test' | 'production';
  maxBodyBytes: number;
  requestTimeoutMs: number;
}

const numberEnv = (name: string, fallback: number): number => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PlatformConfig {
  const environment = env.NODE_ENV === 'production' ? 'production' : env.NODE_ENV === 'test' ? 'test' : 'development';
  return {
    host: env.HOST ?? '127.0.0.1',
    port: numberEnv('PORT', 3000),
    environment,
    maxBodyBytes: numberEnv('MAX_BODY_BYTES', 1024 * 1024),
    requestTimeoutMs: numberEnv('REQUEST_TIMEOUT_MS', 30_000),
  };
}
