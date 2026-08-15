import { FacebookIcon, InstagramIcon, TikTokIcon } from "./social-icons";
import { socialLinks } from "@/lib/social";

const platforms = [
  { href: socialLinks.instagram, label: "Instagram", icon: InstagramIcon },
  { href: socialLinks.tiktok, label: "TikTok", icon: TikTokIcon },
  { href: socialLinks.facebook, label: "Facebook", icon: FacebookIcon },
];

/*
 * Minimal outline social buttons in the brand palette — `tone` picks the
 * scheme: "dark" ink outlines for light surfaces, "light" cream outlines
 * for dark surfaces (e.g. the footer).
 */
export function SocialLinks({
  size = "md",
  tone = "dark",
}: {
  size?: "sm" | "md";
  tone?: "dark" | "light";
}) {
  const badgeSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-[1.1rem] w-[1.1rem]";
  const scheme =
    tone === "light"
      ? "border-cream/30 text-cream/80 hover:border-yolk hover:bg-yolk/10 hover:text-yolk"
      : "border-ink/20 text-ink/70 hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta";

  return (
    <div className="flex items-center gap-2.5">
      {platforms.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={`flex ${badgeSize} items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 ${scheme}`}
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
  );
}
