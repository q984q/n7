import { ProductCategory, ProductSubcategory } from "./products-types";

export interface SubcategoryInfo {
 slug: ProductSubcategory;
 parentCategory: ProductCategory;
 parentLabel: string;
 name: string;
 shortName: string;
 heroTitle: string;
 description: string;
 image: string;
 seoTitle: string;
 seoDescription: string;
 keyMetrics: { label: string; value: string }[];
}

export const SUBCATEGORIES: SubcategoryInfo[] = [
 {
 slug: "pvc",
 parentCategory: "flooring",
 parentLabel: "Спортивные покрытия",
 name: "Рулонные ПВХ-покрытия",
 shortName: "Рулонный ПВХ",
 heroTitle: "Спортивные, коммерческие и печатные рулонные ПВХ-покрытия (2–8 мм)",
 description:
 "Линейка включает спортивные рулоны Y-*6170 и Y-65170XS (7 мм), покрытие для настольного тенниса Y14155S (5,5 мм), серии Gem A-*9180 (8 мм) и A-*9160 (6 мм), покрытие под клён A-65160 (6 мм), гетерогенный и гомогенный ПВХ 2 мм (2×20 м), а также ПВХ с индивидуальным рисунком (2–8 мм).",
 image: "/images/pvc-hall.jpg",
 seoTitle: "Рулонные ПВХ-покрытия 2–8 мм | N7 CONSTRUCTION",
 seoDescription:
 "Спортивные и коммерческие рулонные ПВХ-покрытия Y-*6170, Y14155S, A-*9180, A-*9160, A-65160, ПВХ 2 мм и ПВХ с индивидуальным рисунком.",
 keyMetrics: [
 { label: "Толщины", value: "2,0 – 8,0 мм" },
 { label: "Ширина рулона", value: "1,5 / 1,8 / 2,0 м" },
 { label: "Позиций в разделе", value: "7 серий" },
 ],
 },
 {
 slug: "parquet",
 parentCategory: "flooring",
 parentLabel: "Спортивные покрытия",
 name: "Спортивный паркет",
 shortName: "Спортивный паркет",
 heroTitle: "Стационарные и сборно-разборные спортивные деревянные полы",
 description:
 "Стационарные системы из 6 пород древесины (канадский и китайский клён, берёза, дуб, сосна, каучуковое дерево) на 5 вариантах лаговых оснований (амортизация ≥ 53%, отскок ≥ 90%, класс E1) и сборно-разборный кленовый пол с модулем 1800 × 917 × 82 мм.",
 image: "/images/indoor-arena.jpg",
 seoTitle: "Спортивный паркет: стационарный и сборно-разборный | N7 CONSTRUCTION",
 seoDescription:
 "Стационарный спортивный паркет (6 пород древесины, 5 оснований, амортизация ≥ 53%) и сборно-разборный пол 1800×917×82 мм из массива клёна 22 мм.",
 keyMetrics: [
 { label: "Поглощение удара", value: "≥ 53% / ≥ 35%" },
 { label: "Отскок мяча", value: "≥ 90%" },
 { label: "Сборный модуль", value: "1800 × 917 × 82 мм" },
 ],
 },
 {
 slug: "modular",
 parentCategory: "flooring",
 parentLabel: "Спортивные покрытия",
 name: "Модульные покрытия",
 shortName: "Модульная плитка",
 heroTitle: "Модульные спортивные покрытия для уличных площадок и крытых залов",
 description:
 "Шесть серий модульных покрытий: SES Elite (25×25×2 см, FIBA / FIBA 3×3), E630 (30,5×30,5×1,6 см; а также E620 и S800), FLEX 16 / Soft-Connection (40×40×1,58 см, ITF / FIBA), DL (30,1×30,1×1,6 см, 9 цветов), Pearl Asterisk (30,48×30,48×1,38 см) и плоский зальный модуль с 50 резиновыми опорами.",
 image: "/images/outdoor-court.jpg",
 seoTitle: "Модульные спортивные покрытия SES Elite, E630, FLEX 16, DL | N7 CONSTRUCTION",
 seoDescription:
 "Модульная плитка для открытых и крытых спортивных площадок: SES Elite, E630, FLEX 16, DL, Pearl Asterisk и плоский модуль для зала.",
 keyMetrics: [
 { label: "Размеры модулей", value: "25×25 – 40×40 см" },
 { label: "Толщина", value: "1,38 – 2,0 см" },
 { label: "Гарантия по спецификации", value: "5–6 лет (уличные)" },
 ],
 },
 {
 slug: "track",
 parentCategory: "flooring",
 parentLabel: "Спортивные покрытия",
 name: "Беговые дорожки",
 shortName: "Беговые дорожки",
 heroTitle: "Сборные рулонные и полусборные беговые дорожки (9–15 мм)",
 description:
 "Сборная беговая дорожка в рулонах шириной 1,22 м и длиной 15–20 м (толщина 9 или 13 мм, резиновый верх и ячеистая основа) и полусборная система толщиной 9–15 мм с полиуретановым слоем поверх эластичной рулонной основы для парковых дорожек и фитнес-троп.",
 image: "/images/track-epdm.jpg",
 seoTitle: "Сборные и полусборные беговые дорожки 9–15 мм | N7 CONSTRUCTION",
 seoDescription:
 "Сборная рулонная беговая дорожка (ширина 1,22 м, толщина 9/13 мм) и полусборная дорожка 9–15 мм для стадионов, парков и фитнес-троп.",
 keyMetrics: [
 { label: "Сборный рулон", value: "1,22 × 15–20 м (9 / 13 мм)" },
 { label: "Полусборная система", value: "9–15 мм" },
 { label: "Допуск 13 мм ", value: "IAAF / World Athletics" },
 ],
 },
 {
 slug: "pickleball",
 parentCategory: "flooring",
 parentLabel: "Спортивные покрытия",
 name: "Покрытия для пиклбола",
 shortName: "Пиклбол",
 heroTitle: "Рулонные покрытия для открытых и крытых кортов пиклбола",
 description:
 "Три исполнения : уличные рулоны Y-2330P и Y-4330P (3 мм, 1,8 × 15 м, фактура «кристаллы песка»), акриловый рулон (2 или 3 мм, ширина 1,8 м, стекловолокно) и индивидуальный зальный корт (2,1 или 3,1 мм) с печатным слоем.",
 image: "/images/pickleball-court.jpg",
 seoTitle: "Покрытия для пиклбола Y-2330P / Y-4330P | N7 CONSTRUCTION",
 seoDescription:
 "Покрытия для площадок пиклбола: уличные рулоны Y-2330P и Y-4330P (3 мм), акриловый рулон (2/3 мм) и индивидуальный корт для зала (2,1/3,1 мм).",
 keyMetrics: [
 { label: "Уличный рулон", value: "3 мм • 1,8 × 15 м" },
 { label: "Акриловый рулон", value: "2 / 3 мм • шир. 1,8 м" },
 { label: "Зальный корт", value: "2,1 / 3,1 мм" },
 ],
 },
 {
 slug: "wet",
 parentCategory: "flooring",
 parentLabel: "Спортивные покрытия",
 name: "Покрытия для влажных зон",
 shortName: "Влажные зоны",
 heroTitle: "Дренажный модульный настил 3816 / 3817 / 3818 / 3819 для бассейнов",
 description:
 "Эластомерные дренажные плитки размером 20 × 20 × 0,9 см на защёлках с выпуклыми точками для сцепления босой стопы и открытым основанием для свободного отвода воды.",
 image: "/images/wet-area-pool.jpg",
 seoTitle: "Дренажный настил 3816–3819 для бассейнов и влажных зон | N7 CONSTRUCTION",
 seoDescription:
 "Модульный дренажный настил серий 3816, 3817, 3818 и 3819 размером 20×20×0,9 см для зон вокруг бассейнов и влажных помещений.",
 keyMetrics: [
 { label: "Серии", value: "3816, 3817, 3818, 3819" },
 { label: "Размер плитки", value: "20 × 20 × 0,9 см" },
 { label: "Соединение", value: "На защёлках" },
 ],
 },
 {
 slug: "led-titan",
 parentCategory: "lighting",
 parentLabel: "Светодиодное освещение",
 name: "Прожекторы N7 TITAN",
 shortName: "N7 TITAN (250–1250 Вт)",
 heroTitle: "Стадионные модульные прожекторы N7 TITAN E, TITAN S и TITAN DMX (250–1250 Вт)",
 description:
 "13 моделей по мощности с артикулами N7-LTE-0250…1250 (TITAN E), N7-LTS-0500…1250 (TITAN S) и N7-LTD-0500…1250 (TITAN DMX с управлением DALI / DMX). Светодиоды 5050 SMD, световая отдача 160–165 лм/Вт, 4 диапазона CCT (2700–6500K), 6 углов свечения, драйверы Sosen / Inventronics; гарантия уточняется при заказе.",
 image: "/images/products/led-titan-dmx-front.jpg",
 seoTitle: "Прожекторы N7 TITAN E / S / DMX (250–1250 Вт, 160–165 лм/Вт) | N7 CONSTRUCTION",
 seoDescription:
 "13 моделей стадионных прожекторов N7 TITAN (арт. N7-LTE, N7-LTS, N7-LTD) мощностью 250, 500, 750, 1000 и 1250 Вт, 160–165 лм/Вт, DALI/DMX, гарантия 5 лет.",
 keyMetrics: [
 { label: "Мощности", value: "250 / 500 / 750 / 1000 / 1250 Вт" },
 { label: "Световая отдача", value: "160 – 165 лм/Вт" },
 { label: "Позиций", value: "13 моделей (N7-LTE / LTS / LTD)" },
 ],
 },
 {
 slug: "led-vektor",
 parentCategory: "lighting",
 parentLabel: "Светодиодное освещение",
 name: "Прожекторы N7 VEKTOR",
 shortName: "N7 VEKTOR (120–600 Вт)",
 heroTitle: "Герметичные модульные прожекторы N7 VEKTOR и VEKTOR S (120–600 Вт, IP67, IK09)",
 description:
 "12 моделей по мощности с артикулами N7-LVK-0120…0600 (VEKTOR) и N7-LVS-0120…0600 (VEKTOR S): 120, 240, 320, 360, 480 и 600 Вт. Светодиоды 5050 SMD, отдача 150–160 лм/Вт, защита IP67 / IK09, драйвер Inventronics, 6 вариантов оптики; гарантия уточняется при заказе.",
 image: "/images/products/led-vektor-s-3m.jpg",
 seoTitle: "Прожекторы N7 VEKTOR и VEKTOR S (120–600 Вт, IP67, IK09) | N7 CONSTRUCTION",
 seoDescription:
 "12 моделей прожекторов N7 VEKTOR и N7 VEKTOR S (арт. N7-LVK, N7-LVS): 120, 240, 320, 360, 480 и 600 Вт, 150–160 лм/Вт, IP67, IK09, драйвер Inventronics.",
 keyMetrics: [
 { label: "Мощности", value: "120 / 240 / 320 / 360 / 480 / 600 Вт" },
 { label: "Защита корпуса", value: "IP67 • IK09" },
 { label: "Позиций", value: "12 моделей (N7-LVK / LVS)" },
 ],
 },
 {
 slug: "led-kron",
 parentCategory: "lighting",
 parentLabel: "Светодиодное освещение",
 name: "Прожекторы N7 KRON",
 shortName: "N7 KRON (150–600 Вт)",
 heroTitle: "Ударопрочные герметичные прожекторы N7 KRON и KRON S (150–600 Вт, IP67, IK10)",
 description:
 "8 моделей по мощности с артикулами N7-LKR-0150…0600 (KRON) и N7-LKS-0150…0600 (KRON S): 150, 300, 450 и 600 Вт. Светодиоды 3030 SMD, световая отдача 150–160 лм/Вт, сочетание IP67 и IK10, драйвер Inventronics, овальная оптика 30×90° / 30×110°; гарантия уточняется при заказе.",
 image: "/images/products/led-kron-s-3m.jpg",
 seoTitle: "Прожекторы N7 KRON и KRON S (150–600 Вт, IP67, IK10) | N7 CONSTRUCTION",
 seoDescription:
 "8 моделей прожекторов N7 KRON и N7 KRON S (арт. N7-LKR, N7-LKS): 150, 300, 450 и 600 Вт, 3030 SMD, 150–160 лм/Вт, IP67, IK10, драйвер Inventronics.",
 keyMetrics: [
 { label: "Мощности", value: "150 / 300 / 450 / 600 Вт" },
 { label: "Защита корпуса", value: "IP67 • IK10 (3030 SMD)" },
 { label: "Позиций", value: "8 моделей (N7-LKR / LKS)" },
 ],
 },
 {
 slug: "led-kort",
 parentCategory: "lighting",
 parentLabel: "Светодиодное освещение",
 name: "Прожекторы N7 KORT",
 shortName: "N7 KORT (100–600 Вт)",
 heroTitle: "Кортовые и зальные прожекторы N7 KORT и KORT S (100–600 Вт, IP66, IK10)",
 description:
 "12 моделей с шагом 100 Вт — артикулы N7-LCT-0100…0600 (KORT) и N7-LCS-0100…0600 (KORT S): 100, 200, 300, 400, 500 и 600 Вт. Светодиоды 5050 SMD, отдача 150–160 лм/Вт, защита IP66 / IK10, драйвер Inventronics, углы 60° / 90° / 120° / Asym 80×150°; гарантия уточняется при заказе.",
 image: "/images/products/led-kort-s-3m.jpg",
 seoTitle: "Прожекторы N7 KORT и KORT S (100–600 Вт, IP66, IK10) | N7 CONSTRUCTION",
 seoDescription:
 "12 моделей прожекторов N7 KORT и N7 KORT S (арт. N7-LCT, N7-LCS): 100, 200, 300, 400, 500 и 600 Вт, 5050 SMD, IP66, IK10, драйвер Inventronics, гарантия 5 лет.",
 keyMetrics: [
 { label: "Мощности", value: "100 / 200 / 300 / 400 / 500 / 600 Вт" },
 { label: "Защита корпуса", value: "IP66 • IK10 (5050 SMD)" },
 { label: "Позиций", value: "12 моделей (N7-LCT / LCS)" },
 ],
 },
];


export function getSubcategoryBySlug(slug: string): SubcategoryInfo | undefined {
  return SUBCATEGORIES.find((subcategory) => subcategory.slug === slug);
}
