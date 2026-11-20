import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({
  items,
  dark = false,
}: {
  items: Crumb[];
  dark?: boolean;
}) {
  const fullItems: Crumb[] = [{ name: "Главная", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(fullItems)} />
      <nav
        aria-label="Хлебные крошки"
        className="mb-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap text-xs py-0.5"
      >
        {fullItems.map((item, idx) => {
          const isLast = idx === fullItems.length - 1;
          return (
            <React.Fragment key={item.path + idx}>
              {idx > 0 && (
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 ${
                    dark ? "text-white/30" : "text-ink/30"
                  }`}
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={`shrink-0 font-medium ${
                    dark ? "text-white/80" : "text-ink/75"
                  }`}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={`shrink-0 transition-colors ${
                    dark
                      ? "text-white/55 hover:text-white"
                      : "text-ink/55 hover:text-track"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
