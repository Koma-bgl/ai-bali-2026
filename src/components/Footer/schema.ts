import { z } from "zod";

const SocialLinkSchema = z.object({
  label: z.string(),
  href: z.string().url(),
  icon: z.string(),
});

export const FooterSchema = z.object({
  socialLinks: z.array(SocialLinkSchema),
  copyrightText: z.string(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type FooterProps = z.infer<typeof FooterSchema>;
