import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { FaqSection, HowWeWorkSection } from "@/components/WorkAndFaq";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";
import { ScrollRail } from "@/components/ScrollRail";
import { ProjectFitWizard } from "@/components/ProjectFitWizard";
import { Reveal } from "@/components/MotionPrimitives";

export const metadata = buildMetadata({
  title:
    "N7 CONSTRUCTION — Спортивные покрытия, падел-корты и LED-прожекторы в Казахстане",
  description:
    "Поставка спортивных покрытий, падел-кортов 20×10 м (PD001–PD008) и 45 моделей светодиодных прожекторов N7 TITAN, VEKTOR, KRON, KORT по всему Казахстану. Образцы и монтаж — по запросу.",
  path: "/",
  image: "/images/padel-court.jpg",
});

const DIRECTION_CARDS = [
  {
    slug: "flooring",
    title: "Спортивные покрытия",
    meta: `Моделей: ${PRODUCTS.filter(p => p.category === "flooring").length}`,
    tags: "Залы, стадионы, уличные корты и бассейны",
    image: "/images/indoor-arena.jpg",
    style: "photo" as const,
  },
  {
    slug: "infrastructure",
    title: "Падел-корты",
    meta: "PD001–PD008",
    tags: "20 × 10 м · Панорамные, с навесом, классика",
    image: "/images/padel-canopy.jpg",
    style: "photo" as const,
  },
  {
    slug: "lighting",
    title: "LED-прожекторы N7",
    meta: "45 моделей",
    tags: "Корты, поля и стадионы · 100–1250 Вт",
    image: "/images/products/led-titan-dmx-front.jpg",
    style: "studio" as const,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Тёмный спортивный hero; ниже сохраняется светлый каталог */}
      <section className="relative flex min-h-[82svh] sm:min-h-[86svh] flex-col justify-end overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-stadium-night.jpg"
            alt="Визуализация ночного спортивного объекта с искусственным освещением"
            fill
            priority
            sizes="100vw"
            className="n7-hero-photo object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" />
          <div className="absolute inset-0 bg-blueprint-dark opacity-25 [mask-image:linear-gradient(to_right,black,transparent_75%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="n7-enter n7-delay-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/15 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-track" />
              N7 CONSTRUCTION · СПОРТИВНАЯ ИНФРАСТРУКТУРА
            </span>

            <h1 className="n7-enter n7-delay-2 mt-5 text-[32px] sm:text-5xl lg:text-[62px] font-extrabold leading-[1.05] tracking-[-0.03em]">
              <span className="block">ПРОСТРАНСТВО</span>
              <span className="block text-track">ДЛЯ СПОРТА</span>
            </h1>

            <p className="n7-enter n7-delay-3 mt-4 text-sm sm:text-lg font-medium text-white/75 max-w-2xl">
              Покрытия, падел-корты и спортивное освещение для залов,
              открытых кортов и стадионов. Подбор решения — под ваш объект.
            </p>

            <div className="n7-enter n7-delay-4 mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href="/catalog"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-track px-7 text-xs font-extrabold uppercase tracking-wider text-white shadow-glow hover:bg-[#e54d2b] active:scale-[0.98] transition-all"
              >
                Смотреть каталог
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacts#project"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-6 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                Подобрать под объект
              </Link>
              <a
                href="#directions"
                aria-label="Перейти к направлениям"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white/80 ring-1 ring-white/15 backdrop-blur-md hover:bg-white/15 hover:text-white transition-colors"
              >
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ЗАЛ", "ОТКРЫТЫЙ КОРТ", "ПОЛЕ И СТАДИОН"].map((label) => (
                <span key={label} className="rounded-full border border-white/20 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-white/80 backdrop-blur-sm">{label}</span>
              ))}
            </div>
            <p className="mt-5 text-[10px] text-white/45">Визуализация спортивного объекта</p>
          </div>

          <div className="mt-9 sm:mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4 border-t border-white/15 pt-7">
            {SITE_CONFIG.stats.map((st) => (
              <div key={st.label}>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">{st.value}{st.suffix && <span className="text-track">{st.suffix}</span>}</div>
                <div className="mt-0.5 text-xs text-white/60">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 направления + быстрый переход по виду спорта */}
      <section id="directions" className="py-16 sm:py-24 bg-canvas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-track">Каталог N7</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-[-0.025em] text-ink">
                Выберите направление
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/55">Спортивные покрытия, падел-корты и свет — переходите сразу к нужной группе.</p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-xs font-bold text-ink/65 hover:text-track transition-colors"
            >
              Все {PRODUCTS.length} позиций
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Мобильная свайп-лента */}
          <div className="lg:hidden">
            <ScrollRail
              fadeColor="canvas"
              showArrows={false}
              showProgress
              snap
              stepRatio={0.86}
              trackClassName="flex items-stretch gap-4 pb-1"
              ariaLabel="Направления каталога"
            >
              {DIRECTION_CARDS.map((card, index) => (
                <DirectionCard
                  key={card.slug}
                  card={card}
                  index={index}
                  className="w-[84vw] max-w-[360px] shrink-0 snap-start"
                />
              ))}
            </ScrollRail>
          </div>

          {/* Десктоп: 3 визуальные карточки */}
          <div className="hidden lg:grid gap-5 lg:grid-cols-3">
            {DIRECTION_CARDS.map((card, index) => (
              <DirectionCard key={card.slug} card={card} index={index} />
            ))}
          </div>

        </div>
      </section>

      {/* Подбор по задаче — один явный путь вместо повторяющихся витрин */}
      <Reveal><ProjectFitWizard /></Reveal>

      {/* Как мы работаем (4 понятных шага) */}
      <Reveal delay={0.05}><HowWeWorkSection /></Reveal>

      {/* Короткие ответы на частые вопросы (свёрнуты по умолчанию) */}
      <Reveal delay={0.05}><FaqSection white /></Reveal>

      {/* Округлый остров заявки с прикреплением плана / ТЗ */}
      <Reveal><LeadCaptureSection source="Главная страница" /></Reveal>
    </>
  );
}

function DirectionCard({
  card,
  index = 0,
  className = "",
}: {
  card: (typeof DIRECTION_CARDS)[number];
  index?: number;
  className?: string;
}) {
  const isStudio = card.style === "studio";
  return (
    <Reveal delay={index * 0.08} className={`h-full ${className}`}>
      <Link
        href={`/catalog/category/${card.slug}`}
        className="group flex h-full min-h-[330px] flex-col overflow-hidden rounded-[26px] bg-white ring-1 ring-ink/[0.08] shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-track"
      >
        <div className={`relative aspect-[16/10] overflow-hidden ${isStudio ? "bg-[#eef1f4]" : "bg-ink/5"}`}>
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 1024px) 85vw, 33vw"
            className={`${isStudio ? "object-contain p-7 sm:p-9" : "object-cover"} transition-transform duration-700 ease-out group-hover:scale-[1.035]`}
          />
          {!isStudio && <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />}
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-ink shadow-sm backdrop-blur-sm">
            {card.meta}
          </span>
          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-card transition-all duration-300 group-hover:bg-track group-hover:text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-extrabold tracking-[-0.02em] text-ink transition-colors group-hover:text-track sm:text-xl">
            {card.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-ink/55 sm:text-sm">{card.tags}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-extrabold text-ink/65 transition-colors group-hover:text-track">
            Перейти в раздел <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
