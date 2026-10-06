import media from '../../docs/catalog-origin-media.json';
const originalUrls = new Map(media.assets.map(asset => [asset.url, asset.source]));
// Only hosting URLs are allowed to differ from the protected catalog snapshots.
export function restoreOriginImages(value: unknown): unknown {
  if (typeof value === 'string') return originalUrls.get(value) ?? value;
  if (Array.isArray(value)) return value.map(restoreOriginImages);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, restoreOriginImages(child)]));
  return value;
}

export function restoreOriginSource(source: string): string {
  for (const [hosted, original] of originalUrls) source = source.replaceAll(hosted, original);
  return source;
}
