import Link from 'next/link';
import { Scale, ChevronDown } from 'lucide-react';
import type { Product } from '@/data/products';

/** A local comparison, independent of the customer's saved four-model shortlist. */
export function LightingSeriesComparison({product, siblings}: {product: Product; siblings: Product[]}) {
  const models = siblings.filter(model => model.category === 'lighting' && model.photometry);
  if (models.length < 2) return null;
  return <details className="group rounded-2xl border border-ink/10 bg-white">
    <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold hover:bg-canvas focus-visible:outline-track [&::-webkit-details-marker]:hidden">
      <Scale aria-hidden className="h-4 w-4 shrink-0 text-track" />Сравнить мощности серии <ChevronDown aria-hidden className="ml-auto h-4 w-4 shrink-0 group-open:rotate-180" />
    </summary>
    <div className="border-t border-ink/10 px-3 pb-4 pt-2">
      <table className="w-full table-fixed border-collapse text-left text-xs">
        <caption className="pb-3 text-left text-sm font-bold">{product.seriesName} · варианты мощности</caption>
        <thead><tr className="text-ink-muted"><th scope="col" className="w-[52%] py-2">Модель и артикул</th><th scope="col">Расчётный поток, лм</th></tr></thead>
        <tbody>{models.map(model => {
          const ph = model.photometry!;
          const current = product.id === model.id;
          return <tr key={model.id} className={`border-t border-ink/10 ${current ? 'bg-track-light' : ''}`}>
            <th scope="row" className="p-2 font-medium">{current ? <span className="font-bold">{ph.wattage} Вт · выбрана</span> : <Link className="inline-flex min-h-8 items-center font-bold text-track-dark underline" aria-label={`Открыть ${model.shortName}`} href={`/catalog/${model.slug}`}>{ph.wattage} Вт ↗</Link>}<small className="block break-all font-mono text-ink-muted">{model.sku}</small></th>
            <td className="p-1 tabular-nums">{ph.fluxRange?.replace(/\s*лм$/, '') || 'Уточняется'}</td>
          </tr>;
        })}</tbody>
      </table>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">Поток рассчитан по мощности и светоотдаче модели. Для подбора освещённости площадки нужны её размеры, высота установки и оптика.</p>
    </div>
  </details>;
}
