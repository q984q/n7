"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { SUBCATEGORIES } from "@/data/subcategories";
import { ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStore } from "@/context/StoreContext";

const groups = [
  ...([{id:"flooring", title:"Покрытия"}, {id:"lighting", title:"Освещение N7"}, {id:"infrastructure", title:"Падел-корты"}].map(group => ({ title:group.title, links:SUBCATEGORIES.filter(sub=>sub.parentCategory===group.id).map(sub=>({href:`/catalog/sub/${sub.slug}`,label:sub.name})) }))),
  {title:"Покупателю", links:[{href:"/catalog",label:"Каталог"},{href:"/pricelist",label:"Скачать каталог"},{href:"/compare",label:"Сравнение"},{href:"/cart",label:"Список КП"},{href:"/contacts",label:"Контакты и заявка"}]}
];
function FooterLinks({ links }: {links: typeof groups[number]["links"]}) {
  return <ul>{links.map(link => <li key={link.href}><Link href={link.href} className="flex min-h-11 items-center py-1 text-sm text-white/80 hover:text-white lg:min-h-8">{link.label}</Link></li>)}</ul>;
}

export function Footer() {
  const pathname = usePathname();
  const { liveSettings, openLeadModal } = useStore();

  if (pathname?.startsWith("/admin")) return null;

  const hasAnyContact = Boolean(
    liveSettings.phone ||
      liveSettings.email ||
      liveSettings.address ||
      liveSettings.workingHours ||
      liveSettings.bin
  );

  return (
    <footer className="bg-ink text-white pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_2.5fr] lg:gap-10">
          {/* Бренд */}
          <div className="space-y-4">
            <BrandLogo theme="dark" />
            <p className="text-sm leading-relaxed text-white/75 max-w-prose">
              Поставка спортивных покрытий, падел-кортов и света по всему Казахстану. Договор и счёт · образцы и монтаж по запросу.
            </p>
            <button
              type="button"
              onClick={() =>
                openLeadModal({
                  title: "Запросить КП",
                  source: "Подвал сайта",
                })
              }
              className="inline-flex min-h-11 w-full justify-center sm:w-auto items-center gap-1.5 rounded-full bg-track px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#e54d2b] transition-colors"
            >
              Запросить КП
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <nav aria-label="Разделы внизу страницы" className="lg:grid lg:grid-cols-4 lg:gap-4">
              {groups.map(group => <div key={group.title}>
                <details className="group border-t border-white/15 lg:hidden">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-2 font-semibold [&::-webkit-details-marker]:hidden">{group.title}<ChevronDown aria-hidden="true" className="h-4 w-4 text-white/60 group-open:rotate-180" /></summary>
                  <FooterLinks links={group.links} />
                </details>
                <div className="hidden lg:block"><h3 className="mb-2 text-sm font-bold">{group.title}</h3><FooterLinks links={group.links} /></div>
              </div>)}
            </nav>
            {hasAnyContact && (
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-white/75">
                {liveSettings.phone && (
                  <a
                    href={`tel:+${liveSettings.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2 font-semibold text-white hover:text-track"
                  >
                    <Phone className="h-3.5 w-3.5 text-track shrink-0" />
                    {liveSettings.phone}
                  </a>
                )}
                {liveSettings.email && (
                  <a
                    href={`mailto:${liveSettings.email}`}
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5 text-track shrink-0" />
                    {liveSettings.email}
                  </a>
                )}
                {liveSettings.address && (
                  <div className="flex items-start gap-2 text-white/60">
                    <MapPin className="h-3.5 w-3.5 text-track shrink-0 mt-0.5" />
                    <span>{liveSettings.address}</span>
                  </div>
                )}
                {liveSettings.workingHours && (
                  <div className="text-[11px] text-white/50">
                    {liveSettings.workingHours}
                  </div>
                )}
                {liveSettings.bin && (
                  <div className="text-[11px] text-white/45 font-mono">
                    БИН: {liveSettings.bin}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/60">
          <span>
            © {new Date().getFullYear()} N7 CONSTRUCTION · Параметры соответствуют паспортам конкретных моделей и партий.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/map" className="hover:text-white/75 transition-colors">
              Карта сайта
            </Link>
            <Link href="/admin" className="hover:text-white/75 transition-colors">
              Управление
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
