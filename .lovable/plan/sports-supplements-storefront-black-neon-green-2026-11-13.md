# Sports Supplements Storefront (Black + Neon Green)

Custom storefront connected to your existing Shopify store (nexjp7-za), inspired by chilesuplementos.cl.

## Look and feel
- Near-black background, neon green (#39FF14-style) accents for buttons, prices, badges and glows.
- Bold athletic headings (Bebas Neue / Barlow), condensed uppercase labels.
- Dense, conversion-focused layout like the reference site: promo top bar, big hero, category tiles, product grids.

## Pages
- **Home**: promo bar (free shipping / offers), header with logo, search, categories menu and cart; hero banner with call to action; category tiles (Proteins, Creatine, Pre-workout, Vitamins, Accessories); "Best sellers" and "New arrivals" product grids from Shopify; benefits strip (fast shipping, secure payment, genuine products); footer.
- **Shop** (/shop): all products with category/collection filter and sorting.
- **Product** (/product/[handle]): image gallery, variant picker (flavor/size), price, quantity, add to cart, description.
- **Cart drawer**: edit quantities, remove items, total, "Checkout" opens real Shopify checkout.

## Data
- Real products from your Shopify store only; empty state "No products found" if none.
- No fake reviews or ratings.

## Technical details
- Storefront API 2026-10, Zustand persisted cart with cartCreate/cartLinesAdd/Update/Remove, checkout URL with channel=online_store opened in new tab, useCartSync in root.
- Design tokens in styles.css (oklch), fonts via link in __root, per-route head() metadata.
- Hero image generated.
