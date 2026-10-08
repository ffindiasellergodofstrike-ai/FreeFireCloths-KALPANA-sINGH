export function hasValidGarenaCheckoutPackage(params: URLSearchParams): boolean {
  return readCheckoutParameters(params) !== null;
}

export type CheckoutParameters = { pkg: string; diamonds: string; uid: string; nick: string; level: string };

// Syntax validation only. Knowing these parameters is not customer authentication.
export function readCheckoutParameters(params: URLSearchParams): CheckoutParameters | null {
  const fields = ['pkg', 'diamonds', 'uid', 'nick', 'level'] as const;
  if (fields.some(field => params.getAll(field).length !== 1)) return null;
  const value = Object.fromEntries(fields.map(field => [field, params.get(field)!])) as CheckoutParameters;
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value.pkg) || Number(value.pkg) <= 0 || Number(value.pkg) > 1_000_000) return null;
  if (!/^\d{1,9}$/.test(value.diamonds) || Number(value.diamonds) <= 0) return null;
  if (!/^\d{1,20}$/.test(value.uid) || /^0+$/.test(value.uid)) return null;
  if (!/^\d{1,3}$/.test(value.level) || Number(value.level) <= 0) return null;
  if (!value.nick.trim() || value.nick.length > 60 || /[\u0000-\u001f\u007f]/.test(value.nick)) return null;
  return value;
}
