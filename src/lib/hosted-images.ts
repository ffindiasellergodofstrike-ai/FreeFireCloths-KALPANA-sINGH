const deliveryBase =
  "https://res.cloudinary.com/smi5oqr3/image/upload/freefire_store_migration/";

// Old carts and orders can retain a local image path after the media migration.
// Resolve only our imported image paths; keep persisted order/cart data intact.
export function hostedImageForLegacyUrl(value: string, origin: string): string | null {
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || url.search || url.hash) return null;
    if (!/^\/(?:products|reviews\/photos)\/[a-f0-9]{24}\.webp$/.test(url.pathname))
      return null;
    return deliveryBase + url.pathname.slice(1).replaceAll("/", "_");
  } catch {
    return null;
  }
}

export function installHostedImageFallback(): void {
  document.addEventListener("error", (event) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const replacement = hostedImageForLegacyUrl(event.target.src, window.location.origin);
    if (replacement) event.target.src = replacement;
  }, true);
}
