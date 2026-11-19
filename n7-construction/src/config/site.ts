export const SITE_CONFIG = {
  name: "N7 CONSTRUCTION",
  legalName: "N7 CONSTRUCTION",
  tagline: "Покрытия, падел-корты и спортивный свет",
  url: "https://n7construction.kz",
  locale: "ru_KZ",
  language: "ru",
  country: "KZ",
  countryName: "Казахстан",
  currency: "KZT",
  currencySymbol: "₸",
  vatRate: 0.12,

  // Заполняются администратором в панели /admin (по умолчанию пустые — без вымышленных контактов)
  bin: "",
  iik: "",
  bank: "",
  bik: "",
  phone: "",
  phoneRaw: "",
  whatsappNumber: "",
  email: "",
  address: "",
  workingHours: "",

  stats: [
    { value: 72, suffix: "", label: "позиций в каталоге" },
    { value: 45, suffix: "", label: "LED-прожекторов N7" },
    { value: 165, suffix: " лм/Вт", label: "серия N7 TITAN" },
    { value: 20, suffix: "×10 м", label: "падел-корты PD001–008" },
  ],
} as const;

export function getWhatsAppUrl(whatsappNumber: string, message?: string): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  if (!digits) return "";
  const defaultMsg =
    "Здравствуйте, N7 CONSTRUCTION! Прошу направить коммерческое предложение по выбранным позициям каталога.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || defaultMsg)}`;
}
