export const CATEGORIES = [
  { label: "Proteínas", query: "product_type:Proteína OR title:protein* OR title:proteína*" },
  { label: "Creatinas", query: "product_type:Creatina OR title:creatin*" },
  { label: "Pre-entrenos", query: "product_type:Pre-entreno OR title:pre*" },
  { label: "Aminoácidos", query: "product_type:Aminoácidos OR title:bcaa* OR title:amino*" },
  { label: "Vitaminas", query: "product_type:Vitaminas OR title:vitamin*" },
  { label: "Accesorios", query: "product_type:Accesorios OR title:shaker*" },
] as const;
