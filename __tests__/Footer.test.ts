import { describe, it, expect } from 'vitest'
import { DEFAULT_SOCIAL_LINKS, DEFAULT_COPYRIGHT } from '@/components/Footer'

describe('Footer – default exports', () => {
  it('should export exactly three default social links', () => {
    expect(DEFAULT_SOCIAL_LINKS).toHaveLength(3)
  })

  it('should include Twitter, Discord, and Telegram labels', () => {
    const labels = DEFAULT_SOCIAL_LINKS.map((l) => l.label)
    expect(labels).toEqual(['Twitter', 'Discord', 'Telegram'])
  })

  it('each social link should have a non-empty href starting with https://', () => {
    for (const link of DEFAULT_SOCIAL_LINKS) {
      expect(link.href).toMatch(/^https:\/\//)
    }
  })

  it('each social link should have a non-empty icon string', () => {
    for (const link of DEFAULT_SOCIAL_LINKS) {
      expect(link.icon.length).toBeGreaterThan(0)
    }
  })

  it('should have the correct default copyright text', () => {
    expect(DEFAULT_COPYRIGHT).toBe('© 2026 AI Bali. All rights reserved.')
  })

  it('social links should contain expected hrefs', () => {
    const hrefs = DEFAULT_SOCIAL_LINKS.map((l) => l.href)
    expect(hrefs).toContain('https://twitter.com')
    expect(hrefs).toContain('https://discord.com')
    expect(hrefs).toContain('https://telegram.org')
  })
})
