import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { ProductGrid } from "@/components/store/ProductCard";

const SORTS = {
  best: { label: "Más vendidos", sortKey: "BEST_SELLING", reverse: false },
  new: { label: "Novedades", sortKey: "CREATED_AT", reverse: true },
  low: { label: "Precio: menor a mayor", sortKey: "PRICE", reverse: false },
  high: { label: "Precio: mayor a menor", sortKey: "PRICE", reverse: true },
} as const;
type SortId = keyof typeof SORTS;

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined; cat?: string | undefined; sort?: SortId | undefined } => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    cat: typeof s["cat"] === "string" ? s["cat"] : undefined,
    sort: typeof s["sort"] === "string" && s["sort"] in SORTS ? (s["sort"] as SortId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tienda | PowerFuel Suplementos" },
      { name: "description", content: "Explora todo nuestro catálogo de suplementos deportivos originales." },
      { property: "og:title", content: "Tienda | PowerFuel Suplementos" },
      { property: "og:description", content: "Explora todo nuestro catálogo de suplementos deportivos originales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { q, cat, sort = "best" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const catQuery = CATEGORIES.find((c) => c.label === cat)?.query;
  const query = [catQuery && `(${catQuery})`, q].filter(Boolean).join(" AND ") || undefined;
  const s = SORTS[sort];
  const products = useQuery({ queryKey: ["products", query, sort], queryFn: () => fetchProducts({ first: 48, query, sortKey: s.sortKey, reverse: s.reverse }) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-5xl md:text-6xl">
        {cat ?? (q ? `"${q}"` : "Todos los productos")}
        <span className="text-primary">.</span>
      </h1>
      <div className="my-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Chip active={!cat} to={undefined} q={q} label="Todos" />
          {CATEGORIES.map((c) => <Chip key={c.label} active={cat === c.label} to={c.label} q={q} label={c.label} />)}
        </div>
        <select
          value={sort}
          onChange={(e) => navigate({ search: (prev) => ({ ...prev, sort: e.target.value as SortId }) })}
          className="h-10 rounded-sm border border-input bg-card px-3 text-sm outline-none focus:border-primary"
        >
          {Object.entries(SORTS).map(([id, v]) => <option key={id} value={id}>{v.label}</option>)}
        </select>
      </div>
      <ProductGrid products={products.data ?? []} loading={products.isLoading} />
    </div>
  );
}

function Chip({ active, to, q, label }: { active: boolean; to?: string | undefined; q?: string | undefined; label: string }) {
  return (
    <Link
      to="/shop"
      search={{ q, cat: to }}
      className={`rounded-sm border px-3 py-1.5 text-sm font-semibold uppercase transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
    >
      {label}
    </Link>
  );
}
