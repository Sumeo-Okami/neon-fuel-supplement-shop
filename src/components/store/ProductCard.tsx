import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const image = p.images.edges[0]?.node;

  const add = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions || [] });
    toast.success("Agregado al carrito", { description: p.title, position: "top-center" });
  };

  return (
    <Link to="/product/$handle" params={{ handle: p.handle }} className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all hover:border-primary hover:shadow-neon">
      <div className="aspect-square overflow-hidden bg-secondary">
        {image ? (
          <img src={image.url} alt={image.altText || p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-muted-foreground">Sin imagen</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {p.productType && <span className="text-xs font-bold uppercase tracking-wider text-primary">{p.productType}</span>}
        <h3 className="line-clamp-2 font-sans text-base font-semibold leading-snug">{p.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-2xl text-primary">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
          <button
            onClick={add}
            disabled={isLoading || !variant?.availableForSale}
            className="flex h-10 items-center gap-2 rounded-sm bg-primary px-3 text-xs font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            {variant?.availableForSale === false ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products, loading }: { products: ShopifyProduct[]; loading?: boolean }) {
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-card" />)}
      </div>
    );
  if (products.length === 0)
    return (
      <div className="rounded-sm border border-dashed border-border py-16 text-center">
        <p className="font-display text-3xl">No products found</p>
        <p className="mt-2 text-muted-foreground">Aún no hay productos en esta sección.</p>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
    </div>
  );
}
