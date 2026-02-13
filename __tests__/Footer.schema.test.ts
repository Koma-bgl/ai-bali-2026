import { describe, it, expect } from 'vitest'
import { FooterSchema } from '@/components/Footer/schema'
import { DEFAULT_SOCIAL_LINKS, DEFAULT_COPYRIGHT } from '@/components/Footer'

describe('FooterSchema validation', () => {
  const validData = {
    socialLinks: DEFAULT_SOCIAL_LINKS,
    copyrightText: DEFAULT_COPYRIGHT,
  }

  it('should accept valid footer props', () => {
    const result = FooterSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should accept an empty socialLinks array', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [],
      copyrightText: 'Some text',
    })
    expect(result.success).toBe(true)
  })

  it('should reject when socialLinks is missing', () => {
    const result = FooterSchema.safeParse({
      copyrightText: 'text',
    })
    expect(result.success).toBe(false)
  })

  it('should reject when copyrightText is missing', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [],
    })
    expect(result.success).toBe(false)
  })

  it('should reject a social link with an invalid URL', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [{ label: 'Bad', href: 'not-a-url', icon: '🔗' }],
      copyrightText: 'text',
    })
    expect(result.success).toBe(false)
  })

  it('should reject a social link missing label', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [{ href: 'https://example.com', icon: '🔗' }],
      copyrightText: 'text',
    })
    expect(result.success).toBe(false)
  })

  it('should reject a social link missing icon', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [{ label: 'Test', href: 'https://example.com' }],
      copyrightText: 'text',
    })
    expect(result.success).toBe(false)
  })

  it('should reject non-string copyrightText', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [],
      copyrightText: 123,
    })
    expect(result.success).toBe(false)
  })

  it('should accept multiple custom social links', () => {
    const result = FooterSchema.safeParse({
      socialLinks: [
        { label: 'GitHub', href: 'https://github.com', icon: '🐙' },
        { label: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
      ],
      copyrightText: '© 2025 Custom Corp.',
    })
    expect(result.success).toBe(true)
  })

  it('should parse and return the correct data shape', () => {
    const result = FooterSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.socialLinks).toHaveLength(3)
      expect(result.data.copyrightText).toBe(DEFAULT_COPYRIGHT)
      expect(result.data.socialLinks[0]).toHaveProperty('label')
      expect(result.data.socialLinks[0]).toHaveProperty('href')
      expect(result.data.socialLinks[0]).toHaveProperty('icon')
    }
  })
})
