import type { FooterProps, SocialLink } from "./schema";

/**
 * Default social links used when no props are provided.
 * Kept as a module-level constant so the reference is stable and testable.
 */
export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { label: "Twitter", href: "https://twitter.com", icon: "🐦" },
  { label: "Discord", href: "https://discord.com", icon: "💬" },
  { label: "Telegram", href: "https://telegram.org", icon: "✈️" },
];

export const DEFAULT_COPYRIGHT = "© 2026 AI Bali. All rights reserved.";

export default function Footer({
  props,
}: {
  props?: Partial<FooterProps>;
}) {
  const socialLinks = props?.socialLinks ?? DEFAULT_SOCIAL_LINKS;
  const copyrightText = props?.copyrightText ?? DEFAULT_COPYRIGHT;

  return (
    <footer
      className="w-full border-t border-gray-200 bg-white py-6"
      data-testid="footer"
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Social links */}
        <nav aria-label="Social media links" className="mb-4 flex justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-colors hover:text-gray-700"
              aria-label={link.label}
              data-testid={`social-link-${link.label.toLowerCase()}`}
            >
              <span className="mr-1" role="img" aria-hidden={true}>
                {link.icon}
              </span>
              <span className="text-sm">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-sm text-gray-400" data-testid="footer-copyright">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
