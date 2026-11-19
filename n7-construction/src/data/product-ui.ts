import { Product, ProductSubcategory, formatWarranty } from "./products";

export interface SwatchItem {
  label: string;
  hex: string;
  hex2?: string;
}

export interface SwatchGroup {
  id: string;
  title: string;
  items: SwatchItem[];
}

export interface SportFilterItem {
  id: string;
  label: string;
}

export const SPORT_FILTERS: SportFilterItem[] = [
  { id: "basketball", label: "Баскетбол и 3×3" },
  { id: "volleyball", label: "Волейбол и гандбол" },
  { id: "padel", label: "Падел-клубы" },
  { id: "tennis", label: "Теннис и пиклбол" },
  { id: "stadium", label: "Стадионы и арены" },
  { id: "track", label: "Бег и дорожки" },
  { id: "table-tennis", label: "Настольный теннис" },
  { id: "futsal-gym", label: "Футзал и фитнес" },
  { id: "pool", label: "Бассейны и душевые" },
];

export function matchesSportFilter(product: Product, filterId: string): boolean {
  if (!filterId || filterId === "all") return true;
  const hay = [
    ...product.sports,
    product.subcategoryLabel,
    product.environmentLabel,
    product.shortName,
  ]
    .join(" ")
    .toLowerCase();

  switch (filterId) {
    case "basketball":
      return (
        hay.includes("баскетбол") ||
        product.subcategory === "led-vektor" ||
        product.subcategory === "led-kort"
      );
    case "volleyball":
      return (
        hay.includes("волейбол") ||
        hay.includes("гандбол") ||
        hay.includes("бадминтон") ||
        product.subcategory === "led-kort"
      );
    case "padel":
      return product.subcategory === "padel" || product.subcategory === "led-kort";
    case "tennis":
      return (
        hay.includes("теннис") && !hay.includes("настольный")
      ) ||
        hay.includes("пиклбол") ||
        product.subcategory === "pickleball" ||
        product.subcategory === "led-kort" ||
        product.subcategory === "led-kron";
    case "stadium":
      return (
        product.subcategory === "led-titan" ||
        product.subcategory === "led-vektor" ||
        product.subcategory === "led-kron" ||
        product.sku === "TRACK-PREFAB" ||
        product.sku === "WOOD-PORTABLE"
      );
    case "track":
      return product.subcategory === "track";
    case "table-tennis":
      return hay.includes("настольный теннис");
    case "futsal-gym":
      return (
        hay.includes("футзал") ||
        hay.includes("фитнес") ||
        hay.includes("мультиспорт") ||
        hay.includes("общественные")
      );
    case "pool":
      return product.subcategory === "wet";
    default:
      return true;
  }
}

/** Понятная человеку подпись «для чего этот товар» */
const PURPOSE_BY_SKU: Record<string, string> = {
  "Y-6170": "Баскетбол, волейбол, гандбол · залы",
  Y14155S: "Залы настольного тенниса",
  "A-9180": "Игровые залы · баскетбол и волейбол",
  "A-9160": "Универсальные спортзалы и школы",
  "A-65160": "Игровые залы · текстура клёна",
  "PVC-2MM": "Коридоры, раздевалки и общие зоны",
  "PVC-CUSTOM": "Фитнес-зоны и залы с брендингом",
  "WOOD-FIXED": "Баскетбольные и игровые арены",
  "WOOD-PORTABLE": "Турнирные арены · быстрый монтаж",
  "SES-ELITE": "Уличный баскетбол 3×3 и корты",
  E630: "Открытые площадки · баскетбол, волейбол",
  "FLEX-16": "Уличные теннисные и игровые корты",
  DL: "Открытые универсальные площадки",
  "PEARL-ASTERISK": "Уличные школьные и дворовые корты",
  "INDOOR-FLAT": "Крытые залы · футзал и мультиспорт",
  "WET-3816": "Бассейны, душевые и раздевалки",
  "TRACK-PREFAB": "Легкоатлетические стадионы",
  "TRACK-SEMI": "Беговые и парковые дорожки",
  "Y-2330P": "Открытые и крытые корты пиклбола",
  "PD001-PD005": "Падел-клубы и турнирные арены",
  PD006: "Уличный падел с защитой от солнца и осадков",
  "PD007-PD008": "Клубные и открытые падел-площадки",
};

const PURPOSE_BY_SERIES: Record<string, string> = {
  "TITAN-E": "Стадионы и высокие мачты · П-лира",
  "TITAN-S": "Стадионы и мачты · усиленный кронштейн",
  "TITAN-DMX": "Арены и стадионы · управление DALI / DMX",
  VEKTOR: "Поля и спорткомплексы · защита IP67",
  "VEKTOR-S": "Поля и арены · IP67, усиленный кронштейн",
  KRON: "Открытые корты и мачты · IP67 / IK10",
  "KRON-S": "Мачты и площадки · зубчатый кронштейн",
  KORT: "Падел-корты, теннис и крытые залы",
  "KORT-S": "Корты и залы · чёрный или серый корпус",
};

export function getProductPurpose(product: Product): string {
  if (product.sku in PURPOSE_BY_SKU) return PURPOSE_BY_SKU[product.sku];
  if (product.seriesCode && product.seriesCode in PURPOSE_BY_SERIES) {
    return PURPOSE_BY_SERIES[product.seriesCode];
  }
  if (product.sports.length > 0) {
    return product.sports.slice(0, 2).join(" · ");
  }
  return product.environmentLabel;
}

/** Короткие, никогда не обрезающиеся чипы для карточек */
const CHIPS_BY_SKU: Record<string, string[]> = {
  "Y-6170": ["7,0 мм", "Шир. 1,8 м", "6 цветов"],
  Y14155S: ["5,5 мм", "1,8 × 15–25 м", "ITTF"],
  "A-9180": ["8,0 мм", "1,8 × 15 м", "4 цвета"],
  "A-9160": ["6,0 мм", "1,8 × 15 м", "5 цветов"],
  "A-65160": ["6,0 мм", "1,8 × 15 м", "Под клён"],
  "PVC-2MM": ["2,0 мм", "Рулон 2 × 20 м"],
  "PVC-CUSTOM": ["2–8 мм", "Свой дизайн"],
  "WOOD-FIXED": ["Аморт. ≥ 53%", "6 пород", "Класс E1"],
  "WOOD-PORTABLE": ["Клён 22 мм", "Модуль 82 мм", "2 года"],
  "SES-ELITE": ["25×25×2 см", "FIBA 3×3", "5 лет"],
  E630: ["30,5×30,5 см", "Аморт. 20–25%", "6 лет"],
  "FLEX-16": ["40×40 см", "ITF / FIBA", "6 лет"],
  DL: ["30,1×30,1 см", "9 цветов", "6 лет"],
  "PEARL-ASTERISK": ["30,5×30,5 см", "Толщ. 13,8 мм", "6 лет"],
  "INDOOR-FLAT": ["30,5×30,5 см", "50 опор", "Для зала"],
  "WET-3816": ["20×20×0,9 см", "Дренаж", "Защёлки"],
  "TRACK-PREFAB": ["9 / 13 мм", "Шир. 1,22 м", "IAAF"],
  "TRACK-SEMI": ["9–15 мм", "PU + эластомер"],
  "Y-2330P": ["2–3,1 мм", "Шир. 1,8 м", "3 версии"],
  "PD001-PD005": ["20 × 10 м", "Стекло 12 мм", "4×400 Вт"],
  PD006: ["20 × 10 м", "Навес", "Стекло 12 мм"],
  "PD007-PD008": ["20 × 10 м", "Стекло 12 мм", "Усиленный"],
};

export function getProductCardChips(product: Product): string[] {
  if (product.sku in CHIPS_BY_SKU) return CHIPS_BY_SKU[product.sku];

  if (product.category === "lighting" && product.photometry) {
    const chips: string[] = [
      `${product.photometry.wattage} Вт`,
      product.photometry.efficacy,
    ];
    if (product.photometry.dimming) {
      chips.push(product.photometry.dimming);
    } else if (
      product.photometry.ip &&
      !product.photometry.ip.toLowerCase().includes("паспорту")
    ) {
      chips.push(`${product.photometry.ip} · ${product.photometry.ik}`);
    } else {
      chips.push("5 лет");
    }
    return chips;
  }

  return product.specs
    .slice(0, 2)
    .map((s) => (s.value.length > 18 ? s.value.split(/[•(,]/)[0].trim() : s.value))
    .filter(Boolean);
}

/** 3 главные плашки наверху страницы товара — только полезные цифры */
export function getProductHeroMetrics(
  product: Product
): { label: string; value: string }[] {
  if (product.category === "lighting" && product.photometry) {
    const ph = product.photometry;
    const hasIp = Boolean(ph.ip && !ph.ip.toLowerCase().includes("паспорту"));
    return [
      { label: "Мощность", value: `${ph.wattage} Вт` },
      {
        label: ph.fluxRange ? "Световой поток" : "Светоотдача",
        value: ph.fluxRange || ph.efficacy || "По спецификации",
      },
      {
        label: hasIp ? "Защита · гарантия" : "Отдача · гарантия",
        value: hasIp
          ? `${ph.ip}${ph.ik ? ` / ${ph.ik}` : ""} · 5 лет`
          : `${ph.efficacy || "LED"} · 5 лет`,
      },
    ];
  }

  const CUSTOM: Record<string, { label: string; value: string }[]> = {
    "Y-6170": [
      { label: "Толщина", value: "7,0 мм" },
      { label: "Ширина рулона", value: "1,8 м (длина под зал)" },
      { label: "Назначение", value: "Баскетбол · Волейбол" },
    ],
    Y14155S: [
      { label: "Толщина", value: "5,5 мм" },
      { label: "Рулон", value: "1,8 × 15–25 м" },
      { label: "Фактура", value: "Плетёная · ITTF" },
    ],
    "A-9180": [
      { label: "Толщина", value: "8,0 мм" },
      { label: "Рулон", value: "1,8 × 15 м" },
      { label: "Цвета", value: "4 цвета · фактура Gem" },
    ],
    "A-9160": [
      { label: "Толщина", value: "6,0 мм" },
      { label: "Рулон", value: "1,8 × 15 м" },
      { label: "Цвета", value: "5 цветов · фактура Gem" },
    ],
    "A-65160": [
      { label: "Толщина", value: "6,0 мм" },
      { label: "Рулон", value: "1,8 × 15 м" },
      { label: "Декор", value: "Текстура клёна" },
    ],
    "PVC-2MM": [
      { label: "Толщина", value: "2,0 мм" },
      { label: "Рулон", value: "2,0 × 20 м (40 м²)" },
      { label: "Исполнения", value: "Гетеро и гомогенный" },
    ],
    "PVC-CUSTOM": [
      { label: "Толщина", value: "2 / 3 / 4,5 / 6 / 8 мм" },
      { label: "Рулон", value: "1,5–1,8 × 10–15 м" },
      { label: "Дизайн", value: "Принт и разметка под зал" },
    ],
    "WOOD-FIXED": [
      { label: "Амортизация", value: "≥ 53% (отскок ≥ 90%)" },
      { label: "Древесина", value: "6 пород массива" },
      { label: "Основание", value: "5 лаговых систем · E1" },
    ],
    "WOOD-PORTABLE": [
      { label: "Модуль", value: "1800 × 917 × 82 мм" },
      { label: "Верхний слой", value: "Массив клёна 22 мм" },
      { label: "Отскок · гарантия", value: "≥ 90% · 2 года" },
    ],
    "SES-ELITE": [
      { label: "Модуль", value: "25 × 25 × 2,0 см" },
      { label: "Амортизация", value: "25–35% · FIBA 3×3" },
      { label: "Гарантия", value: formatWarranty(product.warrantyYears) },
    ],
    E630: [
      { label: "Модуль", value: "30,5 × 30,5 × 1,6 см" },
      { label: "Амортизация", value: "20–25%" },
      { label: "Гарантия", value: formatWarranty(product.warrantyYears) },
    ],
    "FLEX-16": [
      { label: "Модуль", value: "40 × 40 × 1,58 см" },
      { label: "Допуски модели", value: "ITF / FIBA" },
      { label: "Гарантия", value: formatWarranty(product.warrantyYears) },
    ],
    DL: [
      { label: "Модуль", value: "30,1 × 30,1 × 1,6 см" },
      { label: "Палитра", value: "9 цветов" },
      { label: "Гарантия", value: formatWarranty(product.warrantyYears) },
    ],
    "PEARL-ASTERISK": [
      { label: "Модуль", value: "30,48 × 30,48 × 1,38 см" },
      { label: "Основание", value: "Упругие арки" },
      { label: "Гарантия", value: formatWarranty(product.warrantyYears) },
    ],
    "INDOOR-FLAT": [
      { label: "Модуль", value: "30,48 × 30,48 × 1,5 см" },
      { label: "Амортизация", value: "50 резиновых опор" },
      { label: "Применение", value: "Крытые спортзалы" },
    ],
    "WET-3816": [
      { label: "Плитка", value: "20 × 20 × 0,9 см" },
      { label: "Серии", value: "3816 · 3817 · 3818 · 3819" },
      { label: "Монтаж", value: "Замки-защёлки · дренаж" },
    ],
    "TRACK-PREFAB": [
      { label: "Толщина", value: "9 или 13 мм" },
      { label: "Рулон", value: "1,22 × 15–20 м" },
      { label: "Уровень", value: "IAAF / World Athletics" },
    ],
    "TRACK-SEMI": [
      { label: "Толщина", value: "9–15 мм" },
      { label: "Конструкция", value: "PU + рулонный эластомер" },
      { label: "Основание", value: "Бетон или асфальт" },
    ],
    "Y-2330P": [
      { label: "Толщина", value: "2,0 – 3,1 мм" },
      { label: "Рулон", value: "1,8 × 15 м" },
      { label: "Исполнения", value: "Улица, акрил и зал" },
    ],
    "PD001-PD005": [
      { label: "Размер корта", value: "20 × 10 м" },
      { label: "Остекление", value: "18 стёкол × 12 мм" },
      { label: "Газон и свет", value: "200 м² · 4 × 400 Вт" },
    ],
    PD006: [
      { label: "Размер корта", value: "20 × 10 м" },
      { label: "Конструкция", value: "Встроенный навес" },
      { label: "Комплект", value: "Стекло 12 мм · газон · LED" },
    ],
    "PD007-PD008": [
      { label: "Размер корта", value: "20 × 10 м" },
      { label: "Каркас", value: "Классический усиленный" },
      { label: "Комплект", value: "Стекло 12 мм · газон · LED" },
    ],
  };

  if (product.sku in CUSTOM) return CUSTOM[product.sku];

  const fallback = product.specs
    .slice(0, product.warrantyYears > 0 ? 2 : 3)
    .map((s) => ({ label: s.label, value: s.value }));
  if (product.warrantyYears > 0) {
    fallback.push({
      label: "Гарантия",
      value: formatWarranty(product.warrantyYears),
    });
  }
  return fallback;
}

/** Наглядные цветовые свотчи — строго по цветам/породам/CCT из каталогов */
const PADEL_SWATCHES: SwatchGroup[] = [
  {
    id: "turf",
    title: "Цвет газона (ворс 12 мм)",
    items: [
      { label: "Синий", hex: "#1D63B8" },
      { label: "Зелёный", hex: "#1F7A4C" },
      { label: "Кирпичный", hex: "#B8472A" },
      { label: "Чёрный", hex: "#1E232A" },
      { label: "Розовый", hex: "#D95B8A" },
    ],
  },
  {
    id: "frame",
    title: "Каркас по RAL",
    items: [
      { label: "Чёрный RAL", hex: "#14181F" },
      { label: "Графит RAL", hex: "#475569" },
      { label: "Синий RAL", hex: "#1E4E8C" },
      { label: "Зелёный RAL", hex: "#1E6B45" },
      { label: "Красный RAL", hex: "#C23B22" },
    ],
  },
];

const CCT_SWATCHES: SwatchGroup = {
  id: "cct",
  title: "Температура света (CCT)",
  items: [
    { label: "5700–6500K", hex: "#E6F2FF" },
    { label: "5000–5500K", hex: "#F5F8FF" },
    { label: "4000–4500K", hex: "#FFF4DC" },
    { label: "2700–3000K", hex: "#FFDFA6" },
  ],
};

export function getProductSwatches(product: Product): SwatchGroup[] {
  if (product.subcategory === "padel") return PADEL_SWATCHES;

  if (product.category === "lighting") {
    const groups: SwatchGroup[] = [];
    if (
      product.photometry?.cct &&
      !product.photometry.cct.toLowerCase().includes("спецификации")
    ) {
      groups.push(CCT_SWATCHES);
    }
    if (product.seriesCode === "KORT-S") {
      groups.push({
        id: "housing",
        title: "Цвет корпуса",
        items: [
          { label: "Чёрный", hex: "#181C22" },
          { label: "Светло-серый", hex: "#CBD2DC" },
        ],
      });
    }
    return groups;
  }

  switch (product.sku) {
    case "Y-6170":
      return [
        {
          id: "color",
          title: "Цвет / декор",
          items: [
            { label: "Клён", hex: "#D8A46B" },
            { label: "Дуб (Y-65170XS)", hex: "#B57F4A" },
            { label: "Синий", hex: "#2563EB" },
            { label: "Зелёный", hex: "#1E8E5A" },
            { label: "Оранжевый", hex: "#EA6A2A" },
            { label: "Розовый", hex: "#DB5A8C" },
          ],
        },
      ];
    case "A-9180":
      return [
        {
          id: "color",
          title: "Цвет рулона",
          items: [
            { label: "Синий", hex: "#2563EB" },
            { label: "Зелёный", hex: "#1E8E5A" },
            { label: "Серый", hex: "#6B7280" },
            { label: "Розовый", hex: "#DB5A8C" },
          ],
        },
      ];
    case "A-9160":
      return [
        {
          id: "color",
          title: "Цвет рулона",
          items: [
            { label: "Синий", hex: "#2563EB" },
            { label: "Зелёный", hex: "#1E8E5A" },
            { label: "Красный", hex: "#CE3B2B" },
            { label: "Оранжевый", hex: "#EA6A2A" },
            { label: "Серый", hex: "#6B7280" },
          ],
        },
      ];
    case "WOOD-FIXED":
      return [
        {
          id: "wood",
          title: "Порода древесины",
          items: [
            { label: "Канадский клён", hex: "#E4BC8A" },
            { label: "Клён северо-вост.", hex: "#D9A972" },
            { label: "Берёза", hex: "#E8CCA2" },
            { label: "Дуб", hex: "#B4834E" },
            { label: "Сосна", hex: "#DFB578" },
            { label: "Каучуковое дерево", hex: "#C89562" },
          ],
        },
      ];
    case "DL":
      return [
        {
          id: "color",
          title: "Цвет модуля (9 вариантов)",
          items: [
            { label: "Синий", hex: "#1D5FBF" },
            { label: "Голубой", hex: "#3898EC" },
            { label: "Красный", hex: "#C8372D" },
            { label: "Зелёный", hex: "#248A52" },
            { label: "Тёмно-зелёный", hex: "#195838" },
            { label: "Оранжевый", hex: "#E66A25" },
            { label: "Жёлтый", hex: "#E5B323" },
            { label: "Светло-серый", hex: "#9CA3AF" },
            { label: "Серый", hex: "#525B68" },
          ],
        },
      ];
    default:
      return [];
  }
}

/** Понятные подписи для 11 линеек на главной */
export const SUBCATEGORY_CARD_HINT: Record<ProductSubcategory, string> = {
  pvc: "Игровые залы · 2–8 мм",
  parquet: "Арены · массив клёна и дуба",
  modular: "Уличные корты и залы · 6 серий",
  track: "Стадионы и парки · 9–15 мм",
  pickleball: "Улица и зал · 2–3,1 мм",
  wet: "Бассейны, душевые и SPA",
  padel: "20 × 10 м · панорама, навес, классика",
  "led-titan": "Большие стадионы · 250–1250 Вт",
  "led-vektor": "Поля и арены IP67 · 120–600 Вт",
  "led-kron": "Мачты и корты IK10 · 150–600 Вт",
  "led-kort": "Падел, теннис и залы · 100–600 Вт",
};

/** Гид по 4 линейкам прожекторов N7: «какую куда брать» */
export const LIGHTING_FAMILY_GUIDE: {
  subcategory: ProductSubcategory;
  name: string;
  power: string;
  purpose: string;
  badge: string;
  count: number;
}[] = [
  {
    subcategory: "led-kort",
    name: "N7 KORT",
    power: "100–600 Вт",
    purpose: "Падел-корты, теннис и крытые залы",
    badge: "IP66 · IK10",
    count: 12,
  },
  {
    subcategory: "led-kron",
    name: "N7 KRON",
    power: "150–600 Вт",
    purpose: "Открытые площадки и мачты с ударозащитой",
    badge: "IP67 · IK10",
    count: 8,
  },
  {
    subcategory: "led-vektor",
    name: "N7 VEKTOR",
    power: "120–600 Вт",
    purpose: "Футбольные поля и открытые арены",
    badge: "IP67 · IK09",
    count: 12,
  },
  {
    subcategory: "led-titan",
    name: "N7 TITAN",
    power: "250–1250 Вт",
    purpose: "Стадионы, высокие мачты и сценарии DMX",
    badge: "165 лм/Вт · DMX",
    count: 13,
  },
];

/** Короткое отличие каждой из 9 серий света */
export const LIGHTING_SERIES_BADGE: Record<string, string> = {
  "TITAN-E": "П-образная лира · козырёк",
  "TITAN-S": "Усиленный кронштейн · козырёк",
  "TITAN-DMX": "Управление DALI / DMX",
  VEKTOR: "IP67 · IK09 · стандартная лира",
  "VEKTOR-S": "IP67 · IK09 · усиленный кронштейн",
  KRON: "IP67 · IK10 · 3030 SMD",
  "KRON-S": "IP67 · IK10 · зубчатый фиксатор",
  KORT: "IP66 · IK10 · серый корпус",
  "KORT-S": "IP66 · IK10 · чёрный / серый",
};

/** Быстрые пресеты размеров площадки для калькулятора м² */
export const AREA_PRESETS = [
  { label: "Волейбол 18×9", l: 18, w: 9 },
  { label: "Зал 24×12", l: 24, w: 12 },
  { label: "Баскетбол 28×15", l: 28, w: 15 },
  { label: "Арена 36×18", l: 36, w: 18 },
];

/** Как мы работаем — строго подтверждённые условия N7 CONSTRUCTION */
export const WORK_STEPS = [
  {
    num: "01",
    title: "Подбор и образцы",
    text: "Подбираем покрытие, корт или оптику под задачу. Образцы покрытий — по запросу.",
  },
  {
    num: "02",
    title: "Расчёт КП по проекту",
    text: "Считаем объём и комплектацию по размерам площадки, плану или вашему ТЗ.",
  },
  {
    num: "03",
    title: "Договор и счёт",
    text: "Работаем с юридическими лицами и частными заказчиками официально по договору.",
  },
  {
    num: "04",
    title: "Поставка по Казахстану",
    text: "Организуем отгрузку во все регионы РК. Монтаж и шеф-монтаж — по запросу.",
  },
];

/** Короткие и честные ответы на главные вопросы клиента */
export const FAQ_ITEMS = [
  {
    q: "В какие города осуществляется поставка?",
    a: "Поставляем спортивные покрытия, комплекты падел-кортов и светодиодные прожекторы N7 по всему Казахстану — во все регионы РК.",
  },
  {
    q: "Выполняете ли вы монтаж покрытий и падел-кортов?",
    a: "Основной профиль — комплектация и поставка на объект. Монтаж или шеф-монтаж обсуждаются и подключаются по запросу под параметры вашего проекта.",
  },
  {
    q: "Можно ли получить образцы покрытий перед заказом?",
    a: "Да, по запросу предоставляем образцы покрытий, чтобы согласовать толщину, фактуру и цвет до оформления поставки.",
  },
  {
    q: "Работаете ли вы с юридическими лицами по договору?",
    a: "Да, работаем как с юридическими лицами и подрядными организациями, так и с частными заказчиками — официально по договору и счёту на оплату.",
  },
  {
    q: "Почему цены указаны «По запросу» и что нужно для расчёта?",
    a: "Итоговая стоимость зависит от объёма партии, выбранного исполнения (толщины, породы дерева, цвета RAL, драйвера или оптики) и города доставки в РК. Достаточно указать размеры или прикрепить план/смету в форме заявки.",
  },
  {
    q: "Как выбрать серию прожекторов N7 под мой объект?",
    a: "N7 KORT (100–600 Вт, IP66/IK10) — для падел-кортов, тенниса и залов; N7 KRON (150–600 Вт, IP67/IK10) — для уличных площадок и мачт; N7 VEKTOR (120–600 Вт, IP67) — для полей и спорткомплексов; N7 TITAN (250–1250 Вт, до 165 лм/Вт, версия DMX) — для крупных стадионов и высокомачтовых опор.",
  },
];
