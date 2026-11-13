import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Truck } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { CATEGORIES } from "@/lib/categories";

export function Header() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
          <Truck className="h-4 w-4" /> Despacho a todo Chile · Productos 100% originales
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <Link to="/" className="font-display text-3xl leading-none text-foreground">
          POWER<span className="text-primary text-glow">FUEL</span>
        </Link>
        <form
          className="relative mx-auto hidden w-full max-w-xl md:block"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/shop", search: { q: q || undefined, cat: undefined } });
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar proteínas, creatina, pre-entrenos..."
            className="h-11 w-full rounded-sm border border-input bg-card pl-4 pr-12 text-sm outline-none focus:border-primary"
          />
          <button type="submit" aria-label="Buscar" className="absolute right-1 top-1 flex h-9 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <Search className="h-4 w-4" />
          </button>
        </form>
        <div className="ml-auto md:ml-0">
          <CartDrawer />
        </div>
      </div>
      <nav className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 text-sm font-semibold uppercase tracking-wide">
          <Link to="/shop" search={{ q: undefined, cat: undefined }} className="whitespace-nowrap text-primary">Todos</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.label} to="/shop" search={{ q: undefined, cat: c.label }} className="whitespace-nowrap text-muted-foreground transition-colors hover:text-primary">
              {c.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
