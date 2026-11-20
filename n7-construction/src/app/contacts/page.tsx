import React from "react";
import {
  Clock,
  FileCheck2,
  Layers,
  Mail,
  MapPin,
  Phone,
  Truck,
  Wrench,
} from "lucide-react";
import { readCms } from "@/lib/cms";
import { getWhatsAppUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";
import { FaqSection } from "@/components/WorkAndFaq";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Заявка, условия поставки и контакты | N7 CONSTRUCTION",
  description:
    "Проектные поставки спортивных покрытий, падел-кортов PD001–PD008 и светодиодных прожекторов N7 по всему Казахстану. Договор и счёт, образцы и монтаж — по запросу.",
  path: "/contacts",
});

const TERMS = [
  {
    icon: Truck,
    title: "Весь Казахстан",
    text: "Отгрузка и доставка покрытий, кортов и света во все регионы РК.",
  },
  {
    icon: FileCheck2,
    title: "Договор и счёт",
    text: "Работаем с юридическими лицами, подрядчиками и частными заказчиками.",
  },
  {
    icon: Layers,
    title: "Образцы покрытий",
    text: "Отправляем образцы по запросу для согласования толщины и цвета.",
  },
  {
    icon: Wrench,
    title: "Монтаж по запросу",
    text: "Основной профиль — поставка; монтаж и шеф-монтаж подключаем под проект.",
  },
];

export default async function ContactsPage() {
  const db = await readCms();
  const s = db.settings;

  const hasContacts = Boolean(
    s.phone ||
      s.whatsappNumber ||
      s.email ||
      s.address ||
      s.workingHours ||
      s.bin ||
      s.iik
  );
  const waUrl = getWhatsAppUrl(s.whatsappNumber);

  return (
    <>
      <section className="pt-10 sm:pt-14 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Заявка и условия", path: "/contacts" }]} />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
              {hasContacts ? "Контакты и заявка" : "Условия работы и заявка"}
            </h1>
            <span className="text-xs font-semibold text-ink/50">
              N7 CONSTRUCTION · Республика Казахстан
            </span>
          </div>

          {/* Прямые контакты — автоматически появляются, как только заполнены в /admin */}
          {hasContacts && (
            <div className="mt-7 rounded-[28px] bg-white p-6 ring-1 ring-ink/[0.08] shadow-card">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm items-center">
                {s.phone && (
                  <a
                    href={`tel:+${s.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2.5 font-extrabold text-ink hover:text-track"
                  >
                    <Phone className="h-4 w-4 text-track shrink-0" />
                    {s.phone}
                  </a>
                )}
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100"
                  >
                    Написать в WhatsApp
                  </a>
                )}
                {s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    className="flex items-center gap-2.5 font-bold text-ink hover:text-track"
                  >
                    <Mail className="h-4 w-4 text-track shrink-0" />
                    {s.email}
                  </a>
                )}
                {s.address && (
                  <div className="flex items-center gap-2.5 text-ink/75 text-xs">
                    <MapPin className="h-4 w-4 text-track shrink-0" />
                    {s.address}
                  </div>
                )}
                {s.workingHours && (
                  <div className="flex items-center gap-2.5 text-ink/75 text-xs">
                    <Clock className="h-4 w-4 text-track shrink-0" />
                    {s.workingHours}
                  </div>
                )}
              </div>
              {(s.bin || s.iik || s.bank) && (
                <div className="mt-4 border-t border-ink/[0.06] pt-3 text-[11px] font-mono text-ink/55 flex flex-wrap gap-4">
                  {s.bin && <span>БИН: {s.bin}</span>}
                  {s.iik && <span>ИИК: {s.iik}</span>}
                  {s.bank && <span>Банк: {s.bank}</span>}
                </div>
              )}
            </div>
          )}

          {/* 4 понятные карточки условий поставки */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TERMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[24px] bg-white p-5 ring-1 ring-ink/[0.07] shadow-card"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-track/10 text-track">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="mt-3.5 text-base font-extrabold text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Что уточнить перед заказом</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">{[
          ['Стоимость и оплата','Укажите артикул, исполнение и количество. Попросите указать в КП итоговую сумму, налоги и порядок оплаты.'],
          ['Доставка по Казахстану','Укажите город, адрес объекта и желаемую дату. Наличие, стоимость перевозки и срок поставки уточняются для конкретного заказа.'],
          ['Монтаж и документы','Если нужен монтаж, укажите площадь и тип основания. Паспорт модели, сертификаты, гарантию и образцы запросите до оплаты.']
        ].map(([title,body])=><div key={title} className="rounded-2xl bg-white p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-ink-muted">{body}</p></div>)}</div>
      </section>
      <LeadCaptureSection
        title="Подбор под ваш объект"
        subtitle="Оставьте телефон или WhatsApp — можно сразу прикрепить план зала, смету или техническое задание."
        source="Страница контактов и заявки"
      />

      <FaqSection white />
    </>
  );
}
