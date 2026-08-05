import { FacebookIcon, InstagramIcon, TikTokIcon } from "./social-icons";
import { socialLinks } from "@/lib/social";

const platforms = [
  {
    href: socialLinks.instagram,
    label: "Instagram",
    icon: InstagramIcon,
    badge: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
  },
  {
    href: socialLinks.tiktok,
    label: "TikTok",
    icon: TikTokIcon,
    badge: "bg-ink",
  },
  {
    href: socialLinks.facebook,
    label: "Facebook",
    icon: FacebookIcon,
    badge: "bg-[#1877F2]",
  },
];

export function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const badgeSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-4.5 w-4.5";

  return (
    <div className="flex items-center gap-2">
      {platforms.map(({ href, label, icon: Icon, badge }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={`flex ${badgeSize} items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${badge}`}
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
  );
}
