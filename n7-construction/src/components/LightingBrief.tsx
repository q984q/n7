"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

export function LightingBrief() {
  const [object, setObject] = useState("Спортивный зал");
  const [sport, setSport] = useState("Баскетбол / волейбол");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const href = useMemo(() => {
    const brief = `Назначение: ${sport}`;
    const params = new URLSearchParams({
      object,
      need: "Светотехнический подбор",
      brief,
      size: length && width ? `${length} × ${width} м` : "",
      height,
    });
    return `/contacts?${params.toString()}#project`;
  }, [object, sport, length, width, height]);

  return (
    <section aria-labelledby="lighting-brief-title" className="mb-8 rounded-[28px] bg-ink p-5 text-white sm:p-7">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-track/15 text-track"><Ruler className="h-5 w-5" /></span>
          <h2 id="lighting-brief-title" className="mt-3 text-xl font-extrabold sm:text-2xl">Подготовьте запрос по освещению</h2>
          <p className="mt-2 text-xs leading-relaxed text-white/65">Укажите исходные данные — они будут добавлены в запрос вместе с просьбой уточнить подбор светильников.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5">
          <label className="text-xs font-semibold text-white/75">Объект<select value={object} onChange={e => setObject(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink"><option>Спортивный зал</option><option>Открытый корт</option><option>Поле или стадион</option><option>Другой объект</option></select></label>
          <label className="text-xs font-semibold text-white/75">Вид спорта / назначение<select value={sport} onChange={e => setSport(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink"><option>Баскетбол / волейбол</option><option>Футбол</option><option>Теннис / падел</option><option>Многофункциональная площадка</option><option>Другое</option></select></label>
          <label className="text-xs font-semibold text-white/75">Длина площадки, м<input type="number" min="1" inputMode="decimal" value={length} onChange={e => setLength(e.target.value)} placeholder="Например, 40" className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink placeholder:text-ink/35" /></label>
          <label className="text-xs font-semibold text-white/75">Ширина площадки, м<input type="number" min="1" inputMode="decimal" value={width} onChange={e => setWidth(e.target.value)} placeholder="Например, 20" className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink placeholder:text-ink/35" /></label>
          <label className="text-xs font-semibold text-white/75 sm:col-span-2">Высота установки, м (если известна)<input type="number" min="1" inputMode="decimal" value={height} onChange={e => setHeight(e.target.value)} placeholder="Например, 8" className="mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-ink placeholder:text-ink/35" /></label>
        </div>
        <div className="lg:col-span-3">
          <Link href={href} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-track px-5 text-sm font-extrabold text-white hover:bg-[#e54d2b]">Передать параметры <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-2 text-[10px] leading-relaxed text-white/45">Это не автоматический светотехнический расчёт. Результат требует проверки исходных данных и фотометрии конкретных моделей.</p>
        </div>
      </div>
    </section>
  );
}
