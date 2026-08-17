import csv
import json
import re
import urllib.request
import concurrent.futures
from collections import OrderedDict

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
    res = re.sub(r'\s+', ' ', res).strip()
    res = re.sub(r'SAV-', 'PRD-', res)
    return res

def clean_html(html_text: str) -> str:
    if not html_text:
        return ""
    t = re.sub(r'<br\s*/?>', '\n', html_text, flags=re.IGNORECASE)
    t = re.sub(r'</p>', '\n', t, flags=re.IGNORECASE)
    t = re.sub(r'<[^>]+>', '', t)
    t = t.replace('&amp;', '&').replace('&nbsp;', ' ')
    lines = [clean_text(line.strip()) for line in t.split('\n') if line.strip()]
    return '\n'.join(lines)

# Fallback verified working images for the 5 items whose original CDN links returned 404
FALLBACK_IMAGES = {
    "beaded-a-line-dress-2316052": [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop"
    ],
    "backless-a-line-dress-2316062": [
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop"
    ],
    "tie-up-bodycon-dress-2317992": [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop"
    ],
    "ruffle-tube-dress-2318202": [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop"
    ],
    "sheer-a-line-dress-2319832": [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop"
    ]
}

# Unique, descriptive titles for all 31 products to eliminate any duplicate names
DISTINCT_TITLES = {
    "embroidered-a-line-dress-2271892": "Yellow Embroidered A-Line Dress",
    "gathered-a-line-dress-2289332": "Red Gathered A-Line Dress",
    "sheer-a-line-dress-2293422": "Black Sheer A-Line Dress",
    "a-line-dress-2293502": "Light Blue Tiered A-Line Dress",
    "ruffle-a-line-dress-2296342": "Pink Ruffle A-Line Dress",
    "ruffle-bodycon-dress-2297832": "Emerald Ruffle Bodycon Dress",
    "beaded-a-line-dress-2316052": "Beaded Glam A-Line Dress",
    "backless-a-line-dress-2316062": "Open-Back Flare A-Line Dress",
    "tie-up-bodycon-dress-2317992": "Tie-Up Ruched Bodycon Dress",
    "ruffle-tube-dress-2318202": "Ruffle Trim Tube Dress",
    "3d-embroidery-a-line-dress-2319742": "3D Embroidery A-Line Dress",
    "sheer-a-line-dress-2319832": "Sheer Overlay A-Line Dress",
    "gathered-a-line-dress-2319962": "Sunset Orange Gathered Dress",
    "backless-a-line-dress-2322742": "Pastel Blue Backless A-Line Dress",
    "sheer-bodycon-dress-2322802": "Sheer Mesh Bodycon Dress",
    "button-shirt-dress-2322952": "Classic Button Shirt Dress",
    "gathered-shirt-dress-2325942": "Gathered Waist Shirt Dress",
    "draped-bodycon-dress-2326822": "Draped Evening Bodycon Dress",
    "embroidered-slip-dress-2331472": "Embroidered Velvet Slip Dress",
    "bow-a-line-dress-2333102": "Bow Accent A-Line Dress",
    "embroidered-a-line-dress-2333392": "Blush Pink Embroidered A-Line Dress",
    "scarf-tube-dress-2333682": "Scarf Neckline Tube Dress",
    "sheer-bodycon-dress-2335462": "Sheer Lace Cocktail Dress",
    "gathered-a-line-dress-2336642": "Floral Gathered A-Line Dress",
    "asymmetric-a-line-dress-2345392": "Asymmetric Hem A-Line Dress",
    "ruffle-bodycon-dress-2345742": "Ribbed Ruffle Bodycon Dress",
    "backless-a-line-dress-2347782": "Strappy Backless A-Line Dress",
    "crossed-fishtail-dress-2369452": "Crossed Fishtail Evening Dress",
    "crossed-a-line-dress-2369492": "Crossed Halter A-Line Dress",
    "scarf-cocktail-dress-2376002": "Scarf Detail Cocktail Dress",
    "ruffle-bodycon-dress-2305582": "Apricot Ruffle Bodycon Dress"
}

# Duplicate / redundant fragment handles to omit
FRAGMENT_HANDLES_TO_SKIP = {
    "backless-a-line-dress-2316062",
    "a-line-dress-2359522",
    "fake-2-pcs-shirt-dress-2361702",
    "ruffle-a-line-dress-2361882",
    "bow-tank-dress-2352622",
    "pocket-shirt-dress-2352562",
    "draped-cocktail-dress-2352452",
    "tie-up-a-line-dress-2351542",
    "backless-bodycon-dress-2347902",
    "gathered-a-line-dress-2331462",
    "embroidered-slip-dress-2331592",
    "ruffle-fishtail-dress-2369092",
    "embroidered-cocktail-dress-2369522",
    "a-line-dress-2371212",
    "gathered-tube-dress-2371482",
    "gathered-a-line-dress-2371552",
    "gathered-a-line-dress-2336782",
    "sheer-bodycon-dress-2335472",
    "sheer-cocktail-dress-2371792",
    "bow-a-line-dress-2372112"
}

# Consolidated photo sets for the multi-angle photoshoots
CONSOLIDATED_CUSTOM_IMAGES = {
    # Yellow floral photoshoot (all 8 unique angles)
    "gathered-a-line-dress-2336642": [
        "https://img201.savana.com/goods-pic/8b7a619e16d74f98b74902bd5e3dd047_w1440_q90",
        "https://img201.savana.com/goods-pic/84c36aab626240e9813af2bc0f20a9b8_w1440_q90",
        "https://img201.savana.com/goods-pic/23e70e5441fe43cf84f76e74a855ea28_w1440_q90",
        "https://img201.savana.com/goods-pic/409b918027a74383a2877180899c6a9a_w1440_q90",
        "https://img201.savana.com/goods-pic/20bb713946b34f3fbb90adab9aaeee49_w1440_q90",
        "https://img201.savana.com/goods-pic/670c1fe44f554eb88eb770ad4c4a6746_w1440_q90",
        "https://img201.savana.com/goods-pic/fb03e2ada03f4f6e97ad979f2973e28b_w1440_q90",
        "https://img201.savana.com/goods-pic/a5bc0217aedd448db966c6119fa0d06a_w1440_q90"
    ],
    # White lace photoshoot (all 5 unique angles)
    "sheer-bodycon-dress-2335462": [
        "https://img201.savana.com/goods-pic/82857fa8cedc472a80960a769d49f4c2_w1440_q90",
        "https://img201.savana.com/goods-pic/7e7de808fef74548821081449c0ff014_w1440_q90",
        "https://img201.savana.com/goods-pic/6abbb24194134050bc8cda8f83d138ad_w1440_q90",
        "https://img201.savana.com/goods-pic/27d4f355541d43c0a2bd7552e94ad7c4_w1440_q90",
        "https://img201.savana.com/goods-pic/7e3bc97749aa4b559794e793ed9d5171_w1440_q90"
    ]
}

def run():
    with open("scripts/raw_csv_complete.txt", "r", encoding="utf-8", errors="ignore") as f:
        rows = list(csv.reader(f))

    handles = OrderedDict()
    for r in rows:
        if not r or len(r) < 2:
            continue
        h = r[0].strip()
        if not h or h.lower() == "handle":
            continue
        if h not in handles:
            handles[h] = {
                "handle": h,
                "first_row": r,
                "rows": []
            }
        handles[h]["rows"].append(r)

    all_raw_images = set()
    for d in handles.values():
        for r in d["rows"]:
            img = r[23].strip() if len(r) > 23 else ""
            if img.startswith("http"):
                all_raw_images.add(img)

    for fb_list in FALLBACK_IMAGES.values():
        for u in fb_list:
            all_raw_images.add(u)

    def check_url(url):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                return url, resp.status == 200
        except Exception:
            return url, False

    image_status = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=25) as executor:
        for url, ok in executor.map(check_url, list(all_raw_images)):
            image_status[url] = ok

    clean_products = []
    start_id = 501

    for handle, data in handles.items():
        if handle in FRAGMENT_HANDLES_TO_SKIP:
            continue

        prod_rows = data["rows"]
        first_row = prod_rows[0]

        title = DISTINCT_TITLES.get(handle, clean_text(first_row[1]))
        if not title:
            title = ' '.join(w.capitalize() for w in handle.split('-') if not w.isdigit())

        body_html = first_row[2] if len(first_row) > 2 else ""
        desc = clean_html(body_html)
        if not desc:
            desc = f"Elegant {title} — perfect for parties, evenings out, dates and special occasions.\n✓ 7 days easy return & exchange\n✓ Free shipping available\n✓ Delivery in 3-10 days\n✓ Cash on delivery available"

        category = "women"

        # Determine images
        images = []
        seen = set()

        if handle in CONSOLIDATED_CUSTOM_IMAGES:
            for img in CONSOLIDATED_CUSTOM_IMAGES[handle]:
                if image_status.get(img, False) and img not in seen:
                    images.append(img)
                    seen.add(img)
        elif handle in FALLBACK_IMAGES:
            for img in FALLBACK_IMAGES[handle]:
                if image_status.get(img, False) and img not in seen:
                    images.append(img)
                    seen.add(img)
        else:
            for r in prod_rows:
                img_src = r[23].strip() if len(r) > 23 else ""
                if img_src.startswith("http") and image_status.get(img_src, False) and img_src not in seen:
                    images.append(img_src)
                    seen.add(img_src)

        if not images:
            images = ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"]

        sizes = []
        colors = []
        variants = []
        min_price = float('inf')
        max_orig = 0.0

        for r in prod_rows:
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
            colors = ["Standard"]

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
            "featured": False,
            "desc": desc,
            "images": images,
            "variants": variants if variants else None
        }

        clean_products.append(product_obj)
        start_id += 1

    print(f"Generated {len(clean_products)} clean, distinct imported dress products.")

    total_imgs = 0
    for p in clean_products:
        for u in p["images"]:
            assert image_status.get(u, False), f"Image failed validation: {u}"
            total_imgs += 1

    print(f"All {total_imgs} images across {len(clean_products)} products passed 100% HTTP 200 validation!")

    ts_code = "import { Product } from './products';\n\n"
    ts_code += "export const IMPORTED_DRESSES: Product[] = "
    ts_code += json.dumps(clean_products, indent=2)
    ts_code += ";\n"

    with open("src/data/imported_dresses.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)

    print("Successfully wrote src/data/imported_dresses.ts")

if __name__ == "__main__":
    run()
