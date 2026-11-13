import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Producto | PowerFuel Suplementos" },
      { name: "description", content: "Detalle del producto, sabores, tamaños y precio." },
      { property: "og:title", content: "Producto | PowerFuel Suplementos" },
      { property: "og:description", content: "Detalle del producto, sabores, tamaños y precio." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", handle], queryFn: () => fetchProductByHandle(handle) });
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const cartLoading = useCartStore((s) => s.isLoading);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const variant = useMemo(() => {
    const vs = product?.node.variants.edges.map((e) => e.node) ?? [];
    return vs.find((v) => v.selectedOptions.every((o) => (selected[o.name] ?? vs[0]?.selectedOptions.find((x) => x.name === o.name)?.value) === o.value)) ?? vs[0];
  }, [product, selected]);

  if (isLoading) return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!product)
    return (
      <div className="py-32 text-center">
        <h1 className="font-display text-5xl">Producto no encontrado</h1>
        <Link to="/shop" search={{ q: undefined, cat: undefined }} className="mt-4 inline-block text-primary hover:underline">Volver a la tienda</Link>
      </div>
    );

  const p = product.node;
  const images = p.images.edges.map((e) => e.node);
  const realOptions = p.options.filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"));

  const add = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: qty, selectedOptions: variant.selectedOptions });
    toast.success("Agregado al carrito", { description: p.title, position: "top-center" });
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/shop" search={{ q: undefined, cat: undefined }} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Volver a la tienda
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-sm border border-border bg-card">
            {images[imgIdx] ? <img src={images[imgIdx].url} alt={images[imgIdx].altText || p.title} className="h-full w-full object-cover" /> : null}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button key={img.url} onClick={() => setImgIdx(i)} className={`aspect-square overflow-hidden rounded-sm border ${i === imgIdx ? "border-primary" : "border-border"}`}>
                  <img src={img.url} alt={img.altText || p.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {p.productType && <span className="text-xs font-bold uppercase tracking-widest text-primary">{p.productType}</span>}
          <h1 className="mt-2 font-display text-5xl leading-none md:text-6xl">{p.title}</h1>
          <p className="mt-4 font-display text-5xl text-primary text-glow">{variant && formatPrice(variant.price.amount, variant.price.currencyCode)}</p>

          {realOptions.map((opt) => (
            <div key={opt.name} className="mt-6">
              <p className="mb-2 text-sm font-bold uppercase">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const active = variant?.selectedOptions.find((o) => o.name === opt.name)?.value === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelected((s) => ({ ...s, [opt.name]: val }))}
                      className={`rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-sm border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center hover:text-primary" aria-label="Menos"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-12 w-12 items-center justify-center hover:text-primary" aria-label="Más"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={add}
              disabled={cartLoading || !variant?.availableForSale}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary font-bold uppercase text-primary-foreground shadow-neon transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
              {variant?.availableForSale === false ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>

          {p.description && (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="mb-3 font-display text-3xl">Descripción</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
