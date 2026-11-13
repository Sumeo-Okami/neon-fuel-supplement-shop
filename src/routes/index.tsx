import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-athlete.jpg";
import { fetchProducts } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { ProductGrid } from "@/components/store/ProductCard";
import { Benefits } from "@/components/store/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PowerFuel Suplementos | Proteínas, creatina y pre-entrenos" },
      { name: "description", content: "Compra suplementos deportivos originales: proteínas, creatinas, pre-entrenos y vitaminas con despacho a todo Chile." },
      { property: "og:title", content: "PowerFuel Suplementos" },
      { property: "og:description", content: "Suplementos deportivos originales con despacho a todo Chile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const best = useQuery({ queryKey: ["products", "best"], queryFn: () => fetchProducts({ first: 8, sortKey: "BEST_SELLING" }) });
  const latest = useQuery({ queryKey: ["products", "new"], queryFn: () => fetchProducts({ first: 8, sortKey: "CREATED_AT", reverse: true }) });

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <img src={hero} alt="Atleta levantando peso con iluminación verde neón" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20">
          <span className="mb-4 w-fit rounded-sm border border-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">Nueva temporada</span>
          <h1 className="max-w-2xl font-display text-6xl leading-[0.9] md:text-8xl">
            Rompe tus <span className="text-primary text-glow">límites</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Suplementos originales para entrenar más fuerte, recuperarte mejor y alcanzar tus metas.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" search={{ q: undefined, cat: undefined }} className="flex items-center gap-2 rounded-sm bg-primary px-6 py-3 font-bold uppercase text-primary-foreground shadow-neon transition-opacity hover:opacity-90">
              Comprar ahora <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/shop" search={{ q: undefined, cat: "Proteínas" }} className="rounded-sm border border-border px-6 py-3 font-bold uppercase transition-colors hover:border-primary hover:text-primary">
              Ver proteínas
            </Link>
          </div>
        </div>
      </section>

      <Benefits />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-6 font-display text-4xl">Categorías</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link key={c.label} to="/shop" search={{ q: undefined, cat: c.label }} className="group flex aspect-[4/3] items-end rounded-sm border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-neon">
              <span className="font-display text-2xl transition-colors group-hover:text-primary">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <SectionTitle title="Más vendidos" />
        <ProductGrid products={best.data ?? []} loading={best.isLoading} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle title="Novedades" />
        <ProductGrid products={latest.data ?? []} loading={latest.isLoading} />
      </section>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
      <h2 className="font-display text-4xl">
        {title}
        <span className="text-primary">.</span>
      </h2>
      <Link to="/shop" search={{ q: undefined, cat: undefined }} className="text-sm font-bold uppercase text-primary hover:underline">Ver todo</Link>
    </div>
  );
}
