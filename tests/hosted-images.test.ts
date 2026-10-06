import test from "node:test";
import assert from "node:assert/strict";
import { hostedImageForLegacyUrl } from "../src/lib/hosted-images";

test("legacy image resolution preserves external and unrelated image URLs", () => {
  const origin = "https://store.example";
  const path = "/products/00084a5ace060ec4bfe3f4e0.webp";
  const expected = "https://res.cloudinary.com/smi5oqr3/image/upload/freefire_store_migration/products_00084a5ace060ec4bfe3f4e0.webp";
  assert.equal(hostedImageForLegacyUrl(path, origin), expected);
  assert.equal(hostedImageForLegacyUrl(origin + path, origin), expected);
  for (const value of [
    expected, "https://another.example" + path, "//another.example" + path,
    "/logo.webp", "/products/new-photo.webp", path + "?size=50", path + "#x",
    "data:image/webp;base64,AA", "http://[invalid",
  ]) assert.equal(hostedImageForLegacyUrl(value, origin), null, value);
});
