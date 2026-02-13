import { z } from "zod";

/**
 * Restrict hrefs to http(s) protocols only to prevent
 * javascript: / data: XSS vectors in social links.
 */
const SafeUrlSchema = z
  .string()
  .url()
  .refine(
    (val) => /^https?:\/\//i.test(val),
    { message: "URL must use http or https protocol" },
  );

const SocialLinkSchema = z.object({
  label: z.string(),
  href: SafeUrlSchema,
  icon: z.string(),
});

export const FooterSchema = z.object({
  socialLinks: z.array(SocialLinkSchema),
  copyrightText: z.string(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type FooterProps = z.infer<typeof FooterSchema>;
