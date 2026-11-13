import { ShieldCheck, Truck, BadgeCheck, CreditCard } from "lucide-react";

export function Benefits() {
  const items = [
    { icon: Truck, title: "Envío rápido", text: "Despacho a todo Chile" },
    { icon: BadgeCheck, title: "100% originales", text: "Marcas certificadas" },
    { icon: CreditCard, title: "Pago seguro", text: "Checkout de Shopify" },
    { icon: ShieldCheck, title: "Compra protegida", text: "Soporte post-venta" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-8 w-8 flex-shrink-0 text-primary" />
            <div>
              <p className="font-bold uppercase">{title}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-3xl">POWER<span className="text-primary">FUEL</span></p>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PowerFuel Suplementos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
