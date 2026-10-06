import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { COLLECTIONS, PRICE_EDITS } from "../data/reference-products";
import ProductCard from "../components/ProductCard";

export default function Collection() {
  const { category = "all" } = useParams();
  const [params, setParams] = useSearchParams();
  const { products } = useProducts();
  const [sort, setSort] = useState("featured");
  const [range, setRange] = useState("all");
  const [limit, setLimit] = useState(24);
  const departments = ["men", "women", "kids"];
  const [selectedCats, setSelectedCats] = useState(departments);
  const price = PRICE_EDITS.find(
    (value) => value === Number(params.get("price")),
  );
  const label =
    COLLECTIONS.find((c) => c.id === category)?.label ||
    {
      all: "The complete edit",
      new: "Fresh perspectives",
      men: "Men’s collection",
      women: "Women’s collection",
      kids: "Kids’ collection",
    }[category] ||
    "The collection";
  useEffect(() => {
    document.title = `${label} – Free Fire Store`;
    setSelectedCats(departments.includes(category) ? [category] : departments);
    setRange("all");
  }, [category]);
  useEffect(() => {
    setLimit(24);
  }, [category, price, range, sort, selectedCats]);
  const items = products
    .filter((p) => {
      const categoryMatches =
        ["all", ...departments].includes(category) ||
        (category === "new" ? p.badge === "NEW" : p.collection === category);
      return (
        categoryMatches &&
        selectedCats.includes(p.cat) &&
        (!price || p.price === price) &&
        (range !== "under500" || p.price < 500) &&
        (range !== "500to1000" || (p.price >= 500 && p.price <= 1000)) &&
        (range !== "1000to2000" || (p.price >= 1000 && p.price <= 2000)) &&
        (range !== "over2000" || p.price > 2000)
      );
    })
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "new"
            ? Number(b.badge === "NEW") - Number(a.badge === "NEW")
            : 0,
    );
  return (
    <section className="edit-section edit-collection" id="collection-page-root">
      <div className="edit-collection-title">
        <span className="edit-eyebrow">THE FREE FIRE STORE WARDROBE</span>
        <h1>{price ? `The ₹${price.toLocaleString("en-IN")} edit` : label}</h1>
        <p>Considered pieces. Endless possibilities.</p>
      </div>
      <div className="edit-filter" aria-label="Filter by price">
        <span>Shop by price</span>
        {[undefined, ...PRICE_EDITS].map((value) => (
          <button
            key={value || "all"}
            aria-pressed={price === value}
            onClick={() => {
              const next = new URLSearchParams(params);
              value ? next.set("price", String(value)) : next.delete("price");
              setParams(next);
              setRange("all");
            }}
          >
            {value ? `₹${value.toLocaleString("en-IN")}` : "All prices"}
          </button>
        ))}
      </div>
      <nav className="edit-collection-links" aria-label="Collections">
        {[
          { id: "all", label: "All pieces" },
          { id: "new", label: "New arrivals" },
          ...COLLECTIONS,
        ].map((c) => (
          <Link
            aria-current={category === c.id ? "page" : undefined}
            key={c.id}
            to={`/collections/${c.id}`}
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <div className="edit-toolbar">
        <fieldset>
          <legend className="sr-only">Departments</legend>
          {departments.map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={selectedCats.includes(cat)}
                onChange={() =>
                  setSelectedCats((current) =>
                    current.includes(cat)
                      ? current.filter((c) => c !== cat)
                      : [...current, cat],
                  )
                }
              />
              {cat}
            </label>
          ))}
        </fieldset>
        <label>
          <span className="sr-only">Price range</span>
          <select
            aria-label="Price range"
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              const next = new URLSearchParams(params);
              next.delete("price");
              setParams(next);
            }}
          >
            <option value="all">All price ranges</option>
            <option value="under500">Under ₹500</option>
            <option value="500to1000">₹500 – ₹1,000</option>
            <option value="1000to2000">₹1,000 – ₹2,000</option>
            <option value="over2000">Above ₹2,000</option>
          </select>
        </label>
        <span role="status">{items.length} pieces</span>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="new">New arrivals</option>
        </select>
      </div>
      {items.length ? (
        <div className="grid-4" id="shopAllGrid">
          {items.slice(0, limit).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="edit-empty">
          <h2>No pieces found.</h2>
          <p>Try another price or department.</p>
          <button
            className="edit-button"
            onClick={() => {
              setRange("all");
              setSelectedCats(departments);
              setParams({});
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      {limit < items.length && (
        <div className="edit-load">
          <button
            className="edit-button edit-outline"
            onClick={() => setLimit((value) => value + 24)}
          >
            Discover more ({items.length - limit})
          </button>
        </div>
      )}
    </section>
  );
}
