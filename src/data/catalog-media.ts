import exclusions from './media-exclusions.json';

// Display curation only. Preserve source assets, product records and review text.
const excluded = new Set(exclusions.map(item => item.url));
export function catalogImages(images: string[]): string[] {
  return images.filter(url => !excluded.has(url));
}
