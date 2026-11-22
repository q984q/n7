import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

export function WhyN7Section() {
  const items = [
    { icon: PackageCheck, title: "Одна заявка на систему", text: "Покрытия, падел-корты и свет можно сразу согласовать под один объект." },
    { icon: Truck, title: "Доставка по Казахстану", text: "Регион, срок, стоимость перевозки и условия отгрузки фиксируются в КП." },
    { icon: ShieldCheck, title: "Проверяемые параметры", text: "Артикул, комплектацию, версию исполнения и гарантию просим указать до оплаты." },
    { icon: Wrench, title: "Монтаж по запросу", text: "Поставка — основной профиль; монтаж и шеф-монтаж подключаем под проект." },
  ];
  return (
    <section className="bg-ink py-14 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-track">Почему N7</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">Не просто каталог, а поставка под объект</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {items.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10"><Icon aria-hidden="true" className="h-5 w-5 text-track" /><h3 className="mt-4 text-sm font-extrabold text-white">{title}</h3><p className="mt-1.5 text-xs leading-relaxed text-white/65">{text}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuoteChecklistSection() {
  const checklist = [
    "Артикулы, исполнение и количество",
    "Итоговая цена, налоги и порядок оплаты",
    "Срок поставки и срок действия КП",
    "Доставка в ваш город и разгрузка",
    "Монтаж, шеф-монтаж или только поставка",
    "Паспорт, сертификаты, гарантия и образцы",
  ];
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[32px] bg-canvas p-6 ring-1 ring-ink/[0.07] sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-track">Коммерческое предложение</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Что должно быть в вашем КП</h2>
            <p className="mt-3 text-xs leading-relaxed text-ink/60 sm:text-sm">Это список того, что стоит уточнить до согласования, чтобы после оплаты не оказалось другой версии модели или скрытых расходов.</p>
            <Link href="/contacts#project" className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-xs font-extrabold text-white transition-colors hover:bg-track">Получить КП<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2 lg:col-span-8">
            {checklist.map((item, index) => <li key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06]"><FileCheck2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-track" /><span><span className="mr-1 font-mono text-[10px] font-extrabold text-ink/35">0{index + 1}</span><span className="text-xs font-bold leading-relaxed text-ink/80">{item}</span></span></li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function ProjectFitBlock() {
  const paths = [
    { title: "Спортивный зал", text: "ПВХ, паркет, модульные покрытия, свет", href: "/catalog?sport=futsal-gym" },
    { title: "Открытый корт", text: "Модульные покрытия, падел и уличное освещение", href: "/catalog?sport=padel" },
    { title: "Поле и стадион", text: "Беговые дорожки, покрытия и мачты N7", href: "/catalog?sport=stadium" },
  ];
  return (
    <section className="bg-canvas py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-track">По объекту</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">С чего начать подбор</h2></div><BadgeCheck aria-hidden="true" className="h-6 w-6 text-track" /></div><div className="grid gap-3 sm:grid-cols-3">{paths.map(path => <Link key={path.title} href={path.href} className="group rounded-3xl bg-white p-5 ring-1 ring-ink/[0.07] transition hover:-translate-y-0.5 hover:ring-track/50"><h3 className="font-extrabold text-ink group-hover:text-track">{path.title}</h3><p className="mt-2 text-xs leading-relaxed text-ink/60">{path.text}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-track">Открыть подбор<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></span></Link>)}</div></div>
    </section>
  );
}
