import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "CLP";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Abrir carrito" className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:border-primary hover:text-primary">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col border-border bg-background sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl">Tu carrito</SheetTitle>
          <SheetDescription>{totalItems === 0 ? "Tu carrito está vacío" : `${totalItems} producto${totalItems !== 1 ? "s" : ""}`}</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col pt-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 rounded-sm border border-border bg-card p-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold">{item.product.node.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.selectedOptions.map((o) => o.value).join(" • ")}</p>
                      <p className="font-bold text-primary">{formatPrice(item.price.amount, item.price.currencyCode)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.variantId)} aria-label="Eliminar">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Menos">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Más">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="font-display text-3xl text-primary">{formatPrice(String(totalPrice), currency)}</span>
                </div>
                <Button onClick={handleCheckout} size="lg" className="w-full font-bold uppercase shadow-neon" disabled={isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ExternalLink className="mr-2 h-4 w-4" />Ir a pagar</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
