const validPackageAmounts = new Set([
  '395.50',
  '490',
  '499',
  '550',
  '750',
  '1000',
  '1100',
  '1400',
  '5500',
  '7500',
]);

export function hasValidGarenaCheckoutPackage(params: URLSearchParams): boolean {
  const packages = params.getAll('pkg');
  const uids = params.getAll('uid');

  if (packages.length !== 1 || uids.length !== 1) return false;

  const [packageAmount] = packages;
  const [uid] = uids;

  return validPackageAmounts.has(packageAmount) && /^\d{1,20}$/.test(uid);
}
