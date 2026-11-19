import Link from "next/link";
import { CATEGORIES, type Product } from "@/data/products";
import { SUBCATEGORIES } from "@/data/subcategories";

export function CatalogDirectory({ products, onNavigate }: { products: Product[]; onNavigate: () => void }) {
  return <div className="grid gap-4 lg:grid-cols-3">
    {CATEGORIES.map(category => {
      const items = products.filter(p => p.category === category.id);
      if (!items.length) return null;
      return <section key={category.id} className="min-w-0">
        <h3 className="mb-2 border-l-2 border-track pl-2 text-sm font-bold text-white"><Link href={`/catalog/category/${category.slug}`} onClick={onNavigate}>{category.name}</Link></h3>
        {SUBCATEGORIES.filter(sub => sub.parentCategory === category.id).map(sub => {
          const models = items.filter(p => p.subcategory === sub.slug);
          if (!models.length) return null;
          return <details key={sub.slug} className="mb-1.5 rounded-xl bg-white/[0.06]">
            <summary className="cursor-pointer px-3 py-3 text-xs font-semibold text-white/90 hover:text-white">{sub.name} <span className="ml-1 text-white/60">({models.length})</span></summary>
            <ul className="border-t border-white/10 px-2 pb-2 text-xs">
              <li><Link className="block px-2 py-2 text-white/65 hover:underline" href={`/catalog/sub/${sub.slug}`} onClick={onNavigate}>Все товары группы →</Link></li>
              {models.map(p => <li key={p.id}><Link className="block rounded-lg px-2 py-2.5 text-white hover:bg-white/10 focus-visible:bg-white/10" href={`/catalog/${p.slug}`} onClick={onNavigate}>{p.shortName}</Link></li>)}
            </ul>
          </details>;
        })}
      </section>;
    })}
  </div>;
}
