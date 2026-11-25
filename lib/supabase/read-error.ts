// Log only the operation, status and a bounded machine code, never raw upstream
// messages, requests, headers, credentials, or settings/profile values.
export class ContentReadError extends Error {}
export function readFailure(resource: string, status: number, code?: string) {
  const safeCode = code && /^[A-Z0-9_]{1,32}$/i.test(code) ? code : 'unknown';
  console.error(`[CGS CMS] ${resource}: HTTP ${status}, code ${safeCode}`);
  return new ContentReadError(`Content unavailable: ${resource}`);
}
