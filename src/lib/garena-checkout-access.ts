export function hasValidGarenaCheckoutPackage(params: URLSearchParams): boolean {
  const packages = params.getAll('pkg');
  const uids = params.getAll('uid');

  if (packages.length !== 1 || uids.length !== 1) return false;

  const [packageAmount] = packages;
  const [uid] = uids;

  return /^\d+(?:\.\d+)?$/.test(packageAmount) &&
    Number.isFinite(Number(packageAmount)) &&
    Number(packageAmount) > 0 &&
    /^\d{1,20}$/.test(uid);
}
