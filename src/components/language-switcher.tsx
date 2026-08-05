"use client";

import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { locales, localeLabels, type LocaleId } from "@/lib/products";
import { FlagIcon } from "./flag-icons";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: LocaleId;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: LocaleId) {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    router.push(`/${next}${rest}`);
    router.refresh();
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors hover:bg-blush"
        >
          <FlagIcon locale={locale} className="h-4 w-5.5 shadow-sm ring-1 ring-ink/10" />
          <ChevronDownIcon className="h-3.5 w-3.5 text-ink/40" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 min-w-36 overflow-hidden rounded-xl border border-tan/40 bg-white p-1 shadow-lg shadow-ink/5"
        >
          {locales.map((id) => (
            <DropdownMenu.Item
              key={id}
              onSelect={() => switchTo(id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink outline-none data-[highlighted]:bg-blush"
            >
              <FlagIcon locale={id} className="h-4 w-5.5 shrink-0 ring-1 ring-ink/10" />
              <span className="flex-1 font-medium">{localeLabels[id]}</span>
              {id === locale && <CheckIcon className="h-4 w-4 text-terracotta" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
