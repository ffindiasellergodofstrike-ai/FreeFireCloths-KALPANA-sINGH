import csv
import json
import re

BANNED_BRANDS = [
    r'\bSavana\b', r'\bSAVANA\b', r'\bsavana\b',
    r'\bNike\b', r'\bNIKE\b', r'\bnike\b',
    r'\bAdidas\b', r'\bADIDAS\b', r'\badidas\b',
    r'\bPuma\b', r'\bPUMA\b',
    r'\bZara\b', r'\bZARA\b',
    r'\bH&M\b', r'\bHM\b',
    r'\bGucci\b', r'\bGUCCI\b',
    r'\bShein\b', r'\bSHEIN\b'
]

def clean_text(text: str) -> str:
    if not text:
        return ""
    res = text
    for pattern in BANNED_BRANDS:
        res = re.sub(pattern, '', res, flags=re.IGNORECASE)
    # Clean up double spaces or dangling commas/dashes
    res = re.sub(r'\s+', ' ', res).strip()
    res = re.sub(r'SAV-', 'PRD-', res)
    return res

def clean_html(html_text: str) -> str:
    if not html_text:
        return ""
    # Replace <br/>, </p> with \n
    t = re.sub(r'<br\s*/?>', '\n', html_text, flags=re.IGNORECASE)
    t = re.sub(r'</p>', '\n', t, flags=re.IGNORECASE)
    t = re.sub(r'<[^>]+>', '', t)
    # Clean entities
    t = t.replace('&amp;', '&').replace('&nbsp;', ' ')
    lines = [clean_text(line.strip()) for line in t.split('\n') if line.strip()]
    return '\n'.join(lines)

def run():
    with open("scripts/raw_csv_complete.txt", "r", encoding="utf-8", errors="ignore") as f:
        rows = list(csv.reader(f))

    products_by_handle = {}
    for row in rows:
        if not row or len(row) < 2:
            continue
        handle = row[0].strip()
        if not handle or handle.lower() == "handle":
            continue
        if handle not in products_by_handle:
            products_by_handle[handle] = []
        products_by_handle[handle].append(row)

    print(f"Processing {len(products_by_handle)} unique handles...")

    imported_products = []
    start_id = 501

    for handle, prod_rows in products_by_handle.items():
        first_row = prod_rows[0]
        title = clean_text(first_row[1])
        if not title:
            # Fallback title from handle
            title = ' '.join(w.capitalize() for w in handle.split('-') if not w.isdigit())

        body_html = first_row[2] if len(first_row) > 2 else ""
        desc = clean_html(body_html)
        if not desc:
            desc = f"Elegant {title} — perfect for parties, evenings out, dates and special occasions.\n✓ 7 days easy return & exchange\n✓ Free shipping available\n✓ Delivery in 3-10 days\n✓ Cash on delivery available"

        tags_raw = first_row[6].lower() if len(first_row) > 6 else ""
        title_lower = title.lower()

        # Check category accurately with regex word boundaries
        if re.search(r'\b(kids|girl|girls|child|children|baby|boy|boys)\b', tags_raw + ' ' + title_lower):
            category = "kids"
        elif re.search(r'\b(men|man|mens|men\'s)\b', tags_raw + ' ' + title_lower) and not re.search(r'\b(women|woman|womens|women\'s)\b', tags_raw + ' ' + title_lower):
            category = "men"
        else:
            category = "women"

        # Collect images
        images = []
        seen_images = set()
        sizes = []
        colors = []
        variants = []
        min_price = float('inf')
        max_orig = 0

        for r in prod_rows:
            # Check for image
            img_src = r[23].strip() if len(r) > 23 else ""
            if img_src and img_src.startswith("http") and img_src not in seen_images:
                images.append(img_src)
                seen_images.add(img_src)

            # Check variant options
            opt1_name = r[8].strip().lower() if len(r) > 8 else ""
            opt1_val = r[9].strip() if len(r) > 9 else ""
            opt2_name = r[10].strip().lower() if len(r) > 10 else ""
            opt2_val = r[11].strip() if len(r) > 11 else ""

            var_size = ""
            var_color = ""

            if opt1_name == "size":
                var_size = opt1_val
            elif opt1_name == "color":
                var_color = opt1_val

            if opt2_name == "size":
                var_size = opt2_val
            elif opt2_name == "color":
                var_color = opt2_val

            if var_size and var_size not in sizes:
                sizes.append(var_size)
            if var_color and var_color not in colors:
                colors.append(var_color)

            # Variant price
            price_val = 0.0
            orig_val = 0.0
            try:
                if len(r) > 18 and r[18].strip():
                    price_val = float(r[18].strip())
            except ValueError:
                pass

            try:
                if len(r) > 19 and r[19].strip():
                    orig_val = float(r[19].strip())
            except ValueError:
                pass

            if price_val > 0 and price_val < min_price:
                min_price = price_val
            if orig_val > max_orig:
                max_orig = orig_val

            sku = clean_text(r[12].strip()) if len(r) > 12 else ""
            if sku:
                variants.append({
                    "size": var_size,
                    "color": var_color,
                    "sku": sku,
                    "price": price_val if price_val > 0 else 1251,
                    "orig": orig_val if orig_val > price_val else 0,
                    "stock": 100
                })

        if min_price == float('inf'):
            min_price = 1251.0
        if max_orig <= min_price:
            max_orig = round(min_price * 1.25)

        if not sizes:
            sizes = ["XS", "S", "M", "L", "XL"]
        if not colors:
            colors = ["Black"]

        # If no images, fallback to high quality dress image
        if not images:
            images = ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"]

        product_obj = {
            "id": start_id,
            "handle": handle,
            "cat": category,
            "name": title,
            "price": int(min_price) if float(min_price).is_integer() else min_price,
            "orig": int(max_orig) if float(max_orig).is_integer() else max_orig,
            "sizes": sizes,
            "colors": colors,
            "rating": round(4.5 + (start_id % 5) * 0.1, 1),
            "reviews": 40 + (start_id * 7 % 130),
            "badge": "NEW" if start_id % 3 == 0 else "",
            "featured": False, # Explicitly false so homepage remains unchanged
            "desc": desc,
            "images": images,
            "variants": variants if variants else None
        }

        imported_products.append(product_obj)
        start_id += 1

    print(f"Generated {len(imported_products)} imported products.")

    # Write to src/data/imported_dresses.ts
    ts_code = "import { Product } from './products';\n\n"
    ts_code += "export const IMPORTED_DRESSES: Product[] = "
    ts_code += json.dumps(imported_products, indent=2)
    ts_code += ";\n"

    with open("src/data/imported_dresses.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)

    print("Successfully wrote src/data/imported_dresses.ts")

if __name__ == "__main__":
    run()
