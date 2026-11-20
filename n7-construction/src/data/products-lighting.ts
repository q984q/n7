import { Product, ProductSubcategory, ProductVariant } from "./products-types";

export interface LightingSeriesMeta {
  code: string;
  skuPrefix: string;
  name: string;
  shortName: string;
  subcategory: ProductSubcategory;
  subcategoryLabel: string;
  tagline: string;
  wattages: number[];
  effMin: number;
  effMax: number;
  ledChip: string;
  voltage: string;
  cct: string;
  ip: string;
  ik: string;
  driver: string;
  driverOptions?: { suffix: string; brand: string; note: string }[];
  dimming?: string;
  mountNote: string;
  warrantyYears: number;
  environment: "outdoor" | "indoor" | "universal";
  environmentLabel: string;
  sports: string[];
  certifications: string[];
  beamAngles: string[];
  beamAnglesText: string;
  slugPrefix: string;
  featuredWattages?: number[];
  pickImage: (w: number) => { primary: string; gallery: string[] };
}

function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function padWatt(w: number): string {
  return String(w).padStart(4, "0");
}

export const LIGHTING_SERIES: LightingSeriesMeta[] = [
  // ===================== 1. ЛИНЕЙКА N7 TITAN (250–1250 Вт, 160–165 лм/Вт) =====================
  {
    code: "TITAN-E",
    skuPrefix: "N7-LTE",
    name: "N7 TITAN E",
    shortName: "TITAN E",
    subcategory: "led-titan",
    subcategoryLabel: "Прожекторы N7 TITAN",
    tagline: "Модульный прожектор высокой мощности с защитным козырьком и П-образной лирой",
    wattages: [250, 500, 750, 1000, 1250],
    effMin: 160,
    effMax: 165,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "2700–3000K / 4000–4500K / 5000–5500K / 5700–6500K",
    ip: "По паспорту модели",
    ik: "По паспорту модели",
    driver: "Sosen / Inventronics",
    driverOptions: [
      {
        suffix: "S",
        brand: "Sosen",
        note: "Комплектация с промышленным драйвером Sosen (AC100–277V, 50/60Hz)",
      },
      {
        suffix: "I",
        brand: "Inventronics",
        note: "Комплектация с промышленным драйвером Inventronics (AC100–277V, 50/60Hz)",
      },
    ],
    mountNote: "Поворотная П-образная лира с угловой шкалой и верхним козырьком",
    warrantyYears: 5,
    environment: "outdoor",
    environmentLabel: "Стадионы, открытые спортивные арены и высокомачтовые опоры",
    sports: ["Стадионы", "Открытые арены", "Лёгкая атлетика"],
    certifications: [],
    beamAngles: ["30°", "60°", "90°", "120°", "40×130°", "Asym 45°"],
    beamAnglesText: "30°, 60°, 90°, 120°, 40×130°, асимметричный 45°",
    slugPrefix: "n7-titan-e",
    pickImage: (w) => {
      if (w <= 250) {
        return {
          primary: "/images/products/led-titan-e-1m.jpg",
          gallery: [
            "/images/products/led-titan-e-1m.jpg",
            "/images/products/led-titan-e-2m.jpg",
            "/images/products/led-titan-e-3m.jpg",
          ],
        };
      }
      if (w <= 500) {
        return {
          primary: "/images/products/led-titan-e-2m.jpg",
          gallery: [
            "/images/products/led-titan-e-2m.jpg",
            "/images/products/led-titan-e-1m.jpg",
            "/images/products/led-titan-e-3m.jpg",
          ],
        };
      }
      return {
        primary: "/images/products/led-titan-e-3m.jpg",
        gallery: [
          "/images/products/led-titan-e-3m.jpg",
          "/images/products/led-titan-e-2m.jpg",
          "/images/products/led-titan-e-1m.jpg",
        ],
      };
    },
  },
  {
    code: "TITAN-S",
    skuPrefix: "N7-LTS",
    name: "N7 TITAN S",
    shortName: "TITAN S",
    subcategory: "led-titan",
    subcategoryLabel: "Прожекторы N7 TITAN",
    tagline: "Модульный прожектор высокой мощности на усиленном наклонном кронштейне с козырьком",
    wattages: [500, 750, 1000, 1250],
    effMin: 160,
    effMax: 165,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "2700–3000K / 4000–4500K / 5000–5500K / 5700–6500K",
    ip: "По паспорту модели",
    ik: "По паспорту модели",
    driver: "Sosen / Inventronics",
    driverOptions: [
      {
        suffix: "S",
        brand: "Sosen",
        note: "Комплектация с промышленным драйвером Sosen (AC100–277V, 50/60Hz)",
      },
      {
        suffix: "I",
        brand: "Inventronics",
        note: "Комплектация с промышленным драйвером Inventronics (AC100–277V, 50/60Hz)",
      },
    ],
    mountNote: "Усиленный треугольный кронштейн с подкосом и верхним козырьком",
    warrantyYears: 5,
    environment: "outdoor",
    environmentLabel: "Стадионы, открытые спортивные комплексы и мачтовое освещение",
    sports: ["Стадионы", "Открытые арены", "Лёгкая атлетика"],
    certifications: [],
    beamAngles: ["30°", "60°", "90°", "120°", "40×130°", "Asym 45°"],
    beamAnglesText: "30°, 60°, 90°, 120°, 40×130°, асимметричный 45°",
    slugPrefix: "n7-titan-s",
    pickImage: (w) => {
      if (w <= 500) {
        return {
          primary: "/images/products/led-titan-s-2m.jpg",
          gallery: [
            "/images/products/led-titan-s-2m.jpg",
            "/images/products/led-titan-s-3m.jpg",
            "/images/products/led-titan-s-4m.jpg",
          ],
        };
      }
      if (w <= 750) {
        return {
          primary: "/images/products/led-titan-s-3m.jpg",
          gallery: [
            "/images/products/led-titan-s-3m.jpg",
            "/images/products/led-titan-s-2m.jpg",
            "/images/products/led-titan-s-4m.jpg",
          ],
        };
      }
      return {
        primary: "/images/products/led-titan-s-4m.jpg",
        gallery: [
          "/images/products/led-titan-s-4m.jpg",
          "/images/products/led-titan-s-3m.jpg",
          "/images/products/led-titan-s-2m.jpg",
        ],
      };
    },
  },
  {
    code: "TITAN-DMX",
    skuPrefix: "N7-LTD",
    name: "N7 TITAN DMX",
    shortName: "TITAN DMX",
    subcategory: "led-titan",
    subcategoryLabel: "Прожекторы N7 TITAN",
    tagline: "Флагманский модульный прожектор с цифровым управлением DALI / DMX и драйвером Inventronics",
    wattages: [500, 750, 1000, 1250],
    effMin: 160,
    effMax: 165,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "2700–3000K / 4000–4500K / 5000–5500K / 5700–6500K",
    ip: "По паспорту модели",
    ik: "По паспорту модели",
    driver: "Inventronics",
    dimming: "DALI / DMX",
    mountNote: "Опорная рама с выносным блоком питания Inventronics и верхним козырьком",
    warrantyYears: 5,
    environment: "outdoor",
    environmentLabel: "Стадионы, открытые спортивные комплексы и арены со сценариями света",
    sports: ["Стадионы", "Открытые арены", "Лёгкая атлетика"],
    certifications: [],
    beamAngles: ["30°", "60°", "90°", "120°", "40×130°", "Asym 45°"],
    beamAnglesText: "30°, 60°, 90°, 120°, 40×130°, асимметричный 45°",
    slugPrefix: "n7-titan-dmx",
    featuredWattages: [1000],
    pickImage: () => ({
      primary: "/images/products/led-titan-dmx-front.jpg",
      gallery: [
        "/images/products/led-titan-dmx-front.jpg",
        "/images/products/led-titan-dmx-back.jpg",
      ],
    }),
  },

  // ===================== 2. ЛИНЕЙКА N7 VEKTOR (120–600 Вт, IP67, IK09) =====================
  {
    code: "VEKTOR",
    skuPrefix: "N7-LVK",
    name: "N7 VEKTOR",
    shortName: "VEKTOR",
    subcategory: "led-vektor",
    subcategoryLabel: "Прожекторы N7 VEKTOR",
    tagline: "Герметичный модульный прожектор IP67 / IK09 с 6 вариантами оптики и драйвером Inventronics",
    wattages: [120, 240, 320, 360, 480, 600],
    effMin: 150,
    effMax: 160,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "По спецификации заказа",
    ip: "IP67",
    ik: "IK09",
    driver: "Inventronics",
    mountNote: "Поворотная П-образная лира с независимым наклоном модулей",
    warrantyYears: 5,
    environment: "universal",
    environmentLabel: "Теннисные и падел-корты, открытые площадки и спортивные объекты",
    sports: ["Теннис", "Падел", "Баскетбол 3×3", "Мультиспорт"],
    certifications: ["IP67", "IK09"],
    beamAngles: ["30°", "60°", "90°", "120°", "40×130°", "Asym 45°"],
    beamAnglesText: "30°, 60°, 90°, 120°, 40×130°, асимметричный 45°",
    slugPrefix: "n7-vektor",
    featuredWattages: [480],
    pickImage: (w) => {
      if (w <= 120) {
        return {
          primary: "/images/products/led-vektor-1m.jpg",
          gallery: [
            "/images/products/led-vektor-1m.jpg",
            "/images/products/led-vektor-3m.jpg",
            "/images/products/led-vektor-5m.jpg",
          ],
        };
      }
      if (w <= 360) {
        return {
          primary: "/images/products/led-vektor-3m.jpg",
          gallery: [
            "/images/products/led-vektor-3m.jpg",
            "/images/products/led-vektor-1m.jpg",
            "/images/products/led-vektor-5m.jpg",
          ],
        };
      }
      return {
        primary: "/images/products/led-vektor-5m.jpg",
        gallery: [
          "/images/products/led-vektor-5m.jpg",
          "/images/products/led-vektor-3m.jpg",
          "/images/products/led-vektor-1m.jpg",
        ],
      };
    },
  },
  {
    code: "VEKTOR-S",
    skuPrefix: "N7-LVS",
    name: "N7 VEKTOR S",
    shortName: "VEKTOR S",
    subcategory: "led-vektor",
    subcategoryLabel: "Прожекторы N7 VEKTOR",
    tagline: "Герметичный модульный прожектор IP67 / IK09 в усиленном корпусе серии S",
    wattages: [120, 240, 320, 360, 480, 600],
    effMin: 150,
    effMax: 160,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "По спецификации заказа",
    ip: "IP67",
    ik: "IK09",
    driver: "Inventronics",
    mountNote: "Усиленный поворотный кронштейн серии S с градуировкой угла наклона",
    warrantyYears: 5,
    environment: "universal",
    environmentLabel: "Открытые корты, футбольные поля, спортивные площадки и мачты",
    sports: ["Теннис", "Падел", "Баскетбол 3×3", "Мультиспорт"],
    certifications: ["IP67", "IK09"],
    beamAngles: ["30°", "60°", "90°", "120°", "40×130°", "Asym 45°"],
    beamAnglesText: "30°, 60°, 90°, 120°, 40×130°, асимметричный 45°",
    slugPrefix: "n7-vektor-s",
    pickImage: (w) => {
      if (w <= 240) {
        return {
          primary: "/images/products/led-vektor-s-2m.jpg",
          gallery: [
            "/images/products/led-vektor-s-2m.jpg",
            "/images/products/led-vektor-s-3m.jpg",
            "/images/products/led-vektor-s-4m.jpg",
          ],
        };
      }
      if (w <= 360) {
        return {
          primary: "/images/products/led-vektor-s-3m.jpg",
          gallery: [
            "/images/products/led-vektor-s-3m.jpg",
            "/images/products/led-vektor-s-2m.jpg",
            "/images/products/led-vektor-s-4m.jpg",
          ],
        };
      }
      return {
        primary: "/images/products/led-vektor-s-4m.jpg",
        gallery: [
          "/images/products/led-vektor-s-4m.jpg",
          "/images/products/led-vektor-s-3m.jpg",
          "/images/products/led-vektor-s-2m.jpg",
        ],
      };
    },
  },

  // ===================== 3. ЛИНЕЙКА N7 KRON (150–600 Вт, 3030 SMD, IP67, IK10) =====================
  {
    code: "KRON",
    skuPrefix: "N7-LKR",
    name: "N7 KRON",
    shortName: "KRON",
    subcategory: "led-kron",
    subcategoryLabel: "Прожекторы N7 KRON",
    tagline: "Герметичный ударопрочный прожектор IP67 / IK10 на светодиодах 3030 SMD с овальной оптикой",
    wattages: [150, 300, 450, 600],
    effMin: 150,
    effMax: 160,
    ledChip: "3030 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "По спецификации заказа",
    ip: "IP67",
    ik: "IK10",
    driver: "Inventronics",
    mountNote: "Модульная П-образная лира с секциями по 150 Вт",
    warrantyYears: 5,
    environment: "universal",
    environmentLabel: "Спортивные площадки, корты, игровые залы и территории комплексов",
    sports: ["Корты", "Игровые площадки", "Спортивные залы"],
    certifications: ["IP67", "IK10"],
    beamAngles: ["30°", "60°", "90°", "30×90°", "30×110°"],
    beamAnglesText: "30°, 60°, 90°, 30×90°, 30×110°",
    slugPrefix: "n7-kron",
    pickImage: (w) => {
      const m = Math.min(4, Math.max(1, Math.round(w / 150)));
      const primary = `/images/products/led-kron-${m}m.jpg`;
      const all = [
        "/images/products/led-kron-1m.jpg",
        "/images/products/led-kron-2m.jpg",
        "/images/products/led-kron-3m.jpg",
        "/images/products/led-kron-4m.jpg",
      ];
      return { primary, gallery: [primary, ...all.filter((x) => x !== primary)] };
    },
  },
  {
    code: "KRON-S",
    skuPrefix: "N7-LKS",
    name: "N7 KRON S",
    shortName: "KRON S",
    subcategory: "led-kron",
    subcategoryLabel: "Прожекторы N7 KRON",
    tagline: "Герметичный ударопрочный прожектор IP67 / IK10 (3030 SMD) с зубчатой фиксацией кронштейна",
    wattages: [150, 300, 450, 600],
    effMin: 150,
    effMax: 160,
    ledChip: "3030 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "По спецификации заказа",
    ip: "IP67",
    ik: "IK10",
    driver: "Inventronics",
    mountNote: "Усиленная лира серии S с зубчатым фиксатором угла наклона (секции по 150 Вт)",
    warrantyYears: 5,
    environment: "universal",
    environmentLabel: "Открытые спортивные площадки, корты и всепогодные объекты",
    sports: ["Корты", "Игровые площадки", "Спортивные залы"],
    certifications: ["IP67", "IK10"],
    beamAngles: ["30°", "60°", "90°", "30×90°", "30×110°"],
    beamAnglesText: "30°, 60°, 90°, 30×90°, 30×110°",
    slugPrefix: "n7-kron-s",
    pickImage: (w) => {
      const m = Math.min(4, Math.max(1, Math.round(w / 150)));
      const primary = `/images/products/led-kron-s-${m}m.jpg`;
      const all = [
        "/images/products/led-kron-s-1m.jpg",
        "/images/products/led-kron-s-2m.jpg",
        "/images/products/led-kron-s-3m.jpg",
        "/images/products/led-kron-s-4m.jpg",
      ];
      return { primary, gallery: [primary, ...all.filter((x) => x !== primary)] };
    },
  },

  // ===================== 4. ЛИНЕЙКА N7 KORT (100–600 Вт, 5050 SMD, IP66, IK10) =====================
  {
    code: "KORT",
    skuPrefix: "N7-LCT",
    name: "N7 KORT",
    shortName: "KORT",
    subcategory: "led-kort",
    subcategoryLabel: "Прожекторы N7 KORT",
    tagline: "Ударопрочный прожектор IP66 / IK10 для падел-кортов, спортивных залов и игровых площадок",
    wattages: [100, 200, 300, 400, 500, 600],
    effMin: 150,
    effMax: 160,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "По спецификации заказа",
    ip: "IP66",
    ik: "IK10",
    driver: "Inventronics",
    mountNote: "Модульная П-образная лира со светло-серым корпусом (шаг 100 Вт)",
    warrantyYears: 5,
    environment: "universal",
    environmentLabel: "Падел-корты, крытые спортивные залы и открытые игровые площадки",
    sports: ["Падел", "Крытые залы", "Игровые площадки"],
    certifications: ["IP66", "IK10"],
    beamAngles: ["60°", "90°", "120°", "Asym 80×150°"],
    beamAnglesText: "60°, 90°, 120°, асимметричный 80×150°",
    slugPrefix: "n7-kort",
    pickImage: (w) => {
      if (w <= 200) {
        return {
          primary: "/images/products/led-kort-1m.jpg",
          gallery: [
            "/images/products/led-kort-1m.jpg",
            "/images/products/led-kort-3m.jpg",
            "/images/products/led-kort-5m.jpg",
          ],
        };
      }
      if (w <= 400) {
        return {
          primary: "/images/products/led-kort-3m.jpg",
          gallery: [
            "/images/products/led-kort-3m.jpg",
            "/images/products/led-kort-1m.jpg",
            "/images/products/led-kort-5m.jpg",
          ],
        };
      }
      return {
        primary: "/images/products/led-kort-5m.jpg",
        gallery: [
          "/images/products/led-kort-5m.jpg",
          "/images/products/led-kort-3m.jpg",
          "/images/products/led-kort-1m.jpg",
        ],
      };
    },
  },
  {
    code: "KORT-S",
    skuPrefix: "N7-LCS",
    name: "N7 KORT S",
    shortName: "KORT S",
    subcategory: "led-kort",
    subcategoryLabel: "Прожекторы N7 KORT",
    tagline: "Ударопрочный прожектор IP66 / IK10 серии S в тёмном или светло-сером корпусе",
    wattages: [100, 200, 300, 400, 500, 600],
    effMin: 150,
    effMax: 160,
    ledChip: "5050 SMD",
    voltage: "AC100–277V, 50/60Hz",
    cct: "По спецификации заказа",
    ip: "IP66",
    ik: "IK10",
    driver: "Inventronics",
    mountNote: "Поворотная лира серии S, исполнение корпуса в чёрном или светло-сером цвете",
    warrantyYears: 5,
    environment: "universal",
    environmentLabel: "Падел-корты, крытые арены, теннисные и универсальные площадки",
    sports: ["Падел", "Крытые залы", "Игровые площадки"],
    certifications: ["IP66", "IK10"],
    beamAngles: ["60°", "90°", "120°", "Asym 80×150°"],
    beamAnglesText: "60°, 90°, 120°, асимметричный 80×150°",
    slugPrefix: "n7-kort-s",
    pickImage: (w) => {
      if (w <= 200) {
        return {
          primary: "/images/products/led-kort-s-2m.jpg",
          gallery: [
            "/images/products/led-kort-s-2m.jpg",
            "/images/products/led-kort-s-3m.jpg",
          ],
        };
      }
      return {
        primary: "/images/products/led-kort-s-3m.jpg",
        gallery: [
          "/images/products/led-kort-s-3m.jpg",
          "/images/products/led-kort-s-2m.jpg",
        ],
      };
    },
  },
];

function buildLightingProducts(): Product[] {
  const out: Product[] = [];
  let seq = 1;

  for (const s of LIGHTING_SERIES) {
    for (const w of s.wattages) {
      const id = `l-${String(seq).padStart(2, "0")}`;
      seq += 1;

      const sku = `${s.skuPrefix}-${padWatt(w)}`;
      const slug = `${s.slugPrefix}-${w}w`;
      const modelTitle = `${s.name} ${w}`;
      const efficacy = `${s.effMin}–${s.effMax} лм/Вт`;
      const fluxMin = w * s.effMin;
      const fluxMax = w * s.effMax;
      const fluxRange = `${fmtNum(fluxMin)}–${fmtNum(fluxMax)} лм`;
      const hasProtection = s.certifications.length > 0;
      const protectionText = hasProtection ? `${s.ip}, ${s.ik}` : "";

      const nameSuffix = s.dimming
        ? `${w} Вт, ${efficacy}, ${s.dimming}`
        : hasProtection
          ? `${w} Вт, ${s.ip}, ${s.ik}`
          : `${w} Вт, ${efficacy}`;

      const name = `Светодиодный прожектор ${modelTitle} (${nameSuffix})`;
      const shortName = `Прожектор ${s.name} · ${w} Вт`;

      const badge = s.dimming
        ? `${w} Вт • ${s.dimming}`
        : hasProtection
          ? `${w} Вт • ${s.ip} / ${s.ik}`
          : `${w} Вт • ${efficacy}`;

      const variants: ProductVariant[] = s.driverOptions
        ? s.driverOptions.map((opt) => ({
            code: `${sku}-${opt.suffix}`,
            spec: `${w} Вт • драйвер ${opt.brand} • ${efficacy}`,
            detail: `${opt.note}; светодиоды ${s.ledChip}, гарантия ${s.warrantyYears} лет`,
          }))
        : [
            {
              code: sku,
              spec: `${w} Вт • драйвер ${s.driver}${s.dimming ? ` • ${s.dimming}` : ""}`,
              detail: `${efficacy} (${fluxRange}), ${s.ledChip}, ${s.voltage}${
                hasProtection ? `, ${protectionText}` : ""
              }, гарантия ${s.warrantyYears} лет`,
            },
          ];

      const specs = [
        { label: "Артикул", value: sku, highlight: true },
        { label: "Серия", value: s.name, highlight: true },
        { label: "Номинальная мощность", value: `${w} Вт`, highlight: true },
        { label: "Световая отдача", value: efficacy, highlight: true },
        { label: "Расчётный световой поток", value: fluxRange, highlight: true },
        { label: "Тип светодиодов", value: s.ledChip },
        { label: "Драйвер", value: s.driver, highlight: true },
        ...(s.dimming
          ? [{ label: "Протокол управления", value: s.dimming, highlight: true }]
          : []),
        { label: "Входное напряжение", value: s.voltage },
        ...(s.cct !== "По спецификации заказа"
          ? [{ label: "Цветовая температура (CCT)", value: s.cct }]
          : []),
        ...(hasProtection
          ? [{ label: "Степень защиты корпуса", value: protectionText, highlight: true }]
          : []),
        { label: "Углы свечения", value: s.beamAnglesText, highlight: true },
        { label: "Конструкция крепления", value: s.mountNote },
      ];

      const advantages = [
        `Фиксированная мощность ${w} Вт со световой отдачей ${efficacy} (расчётный поток ${fluxRange})`,
        `Светодиоды ${s.ledChip}, питание ${s.voltage}, драйвер ${s.driver}${
          s.dimming ? ` с цифровым диммированием ${s.dimming}` : ""
        }`,
        hasProtection
          ? `Защита корпуса ${s.ip} и класс ударопрочности ${s.ik}; гарантия ${s.warrantyYears} лет`
          : `Четыре диапазона цветовой температуры (${s.cct}); гарантия ${s.warrantyYears} лет`,
        `Выбор угла оптики под проект: ${s.beamAnglesText}`,
      ];

      // Похожие модели из других серий N7 близкой мощности (чтобы не дублировать переключатель мощностей)
      const crossSeriesSlugs = LIGHTING_SERIES.filter((os) => os.code !== s.code)
        .map((os) => {
          const nearest = [...os.wattages].sort(
            (a, b) => Math.abs(a - w) - Math.abs(b - w)
          )[0];
          const sameFamily = os.subcategory === s.subcategory ? 0 : 1;
          return {
            slug: `${os.slugPrefix}-${nearest}w`,
            diff: Math.abs(nearest - w),
            sameFamily,
          };
        })
        .sort((a, b) => a.diff - b.diff || a.sameFamily - b.sameFamily)
        .slice(0, 3)
        .map((x) => x.slug);

      const imgs = s.pickImage(w);

      const summary = `${s.tagline}. Мощность ${w} Вт, световая отдача ${efficacy} (${fluxRange}), светодиоды ${s.ledChip}, драйвер ${s.driver}${
        s.dimming ? `, управление ${s.dimming}` : ""
      }${hasProtection ? `, защита ${s.ip} / ${s.ik}` : ""}, гарантия ${s.warrantyYears} лет.`;

      const description = `Светодиодный прожектор ${modelTitle} (артикул ${sku}) входит в фирменную линейку освещения ${s.subcategoryLabel} от N7 CONSTRUCTION. При номинальной мощности ${w} Вт и световой отдаче ${efficacy} прибор формирует расчётный световой поток ${fluxRange}. Модули выполнены на светодиодах ${s.ledChip} и работают от сети ${s.voltage} с промышленным драйвером ${s.driver}${
        s.dimming ? ` и поддержкой цифрового управления ${s.dimming}` : ""
      }.${
        hasProtection
          ? ` Корпус рассчитан на эксплуатацию со степенью пылевлагозащиты ${s.ip} и ударопрочностью ${s.ik}.`
          : ` Для заказа доступны четыре диапазона цветовой температуры: ${s.cct}.`
      } Доступные углы распределения света: ${s.beamAnglesText}. Срок гарантии по технической спецификации — ${s.warrantyYears} лет.`;

      out.push({
        id,
        sku,
        slug,
        name,
        shortName,
        seriesCode: s.code,
        seriesName: s.name,
        category: "lighting",
        categoryLabel: "Светодиодное освещение",
        subcategory: s.subcategory,
        subcategoryLabel: s.subcategoryLabel,
        unit: "шт",
        minOrder: 1,
        stepQty: 1,
        price: 0,
        installPrice: 0,
        tiers: [
          { minQty: 1, label: "От 1 шт", price: 0, discount: "По запросу" },
          { minQty: 8, label: "Комплект от 8 шт", price: 0, discount: "По запросу" },
          { minQty: 24, label: "Объект от 24 шт", price: 0, discount: "По запросу" },
        ],
        variants,
        inStock: true,
        stockNote: s.driverOptions
          ? "Выбор драйвера (Sosen / Inventronics), CCT и оптики под проект"
          : "Подбор угла свечения и комплектации под проект",
        warrantyYears: s.warrantyYears,
        environment: s.environment,
        environmentLabel: s.environmentLabel,
        sports: s.sports,
        certifications: s.certifications,
        badge,
        featured: s.featuredWattages?.includes(w) || false,
        image: imgs.primary,
        gallery: imgs.gallery,
        summary,
        description,
        advantages,
        specs,
        photometry: {
          wattage: w,
          lumens: fluxMax,
          fluxRange,
          efficacy,
          ledChip: s.ledChip,
          voltage: s.voltage,
          dimming: s.dimming,
          cct: s.cct,
          ip: s.ip,
          ik: s.ik,
          driver: s.driver,
          beamAngles: s.beamAngles,
        },
        relatedSlugs: crossSeriesSlugs,
        seoTitle: `Прожектор ${modelTitle} (${w} Вт, арт. ${sku}) | N7 CONSTRUCTION`,
        seoDescription: `Светодиодный прожектор ${modelTitle} (${sku}): мощность ${w} Вт, ${efficacy} (${fluxRange}), ${s.ledChip}, драйвер ${s.driver}${
          s.dimming ? `, ${s.dimming}` : ""
        }${hasProtection ? `, ${s.ip}, ${s.ik}` : ""}, гарантия ${s.warrantyYears} лет.`,
      });
    }
  }

  return out;
}

export const LIGHTING_PRODUCTS: Product[] = buildLightingProducts();
