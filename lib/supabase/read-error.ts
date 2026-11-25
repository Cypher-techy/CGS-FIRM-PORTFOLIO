// Classify a failed read without publishing raw error messages, identifiers or headers.
export function supportCode(status: number, code?: string) {
  if (code === 'INVALID_CONFIG' || code === 'INCOMPLETE_CONFIG') return 'CMS-CONFIG';
  if (code === '42501') return 'CMS-PERMISSION';
  if (['42P01','PGRST205'].includes(code || '')) return 'CMS-RELATION';
  if (['42703','PGRST204','PGRST200'].includes(code || '')) return 'CMS-SCHEMA';
  if (status === 401) return 'CMS-KEY';
  if (status === 403 || code === 'PGRST106') return 'CMS-ACCESS';
  if (status === 0) return 'CMS-CONNECTION';
  return 'CMS-UPSTREAM';
}
export class ContentReadError extends Error {
  constructor(resource: string, readonly digest: string) { super(`Content unavailable: ${resource}`); }
}
export function readFailure(resource: string, status: number, code?: string) {
  const safeCode = code && /^[A-Z0-9_]{1,32}$/i.test(code) ? code : 'unknown';
  const digest = supportCode(status, code);
  console.error(`[CGS CMS] ${resource}: HTTP ${status}, code ${safeCode} (${digest})`);
  return new ContentReadError(resource, digest);
}
