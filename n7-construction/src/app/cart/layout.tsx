import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Список позиций для запроса КП | N7 CONSTRUCTION",
  description:
    "Формирование спецификации и отправка запроса коммерческого предложения по позициям каталога N7 CONSTRUCTION.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
