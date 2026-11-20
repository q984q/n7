import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Сравнение характеристик | N7 CONSTRUCTION",
  description:
    "Сравнение технических параметров спортивных покрытий, падел-кортов и светодиодных прожекторов из каталога N7 CONSTRUCTION.",
  path: "/compare",
});

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
