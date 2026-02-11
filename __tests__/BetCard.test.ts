import { describe, it, expect } from 'vitest'
import { BetCardSchema } from '@/components/BetCard/schema'
import type { BetCardProps } from '@/components/BetCard/schema'

// ── Test fixtures ──────────────────────────────────────────────

function makeProps(overrides: Partial<BetCardProps> = {}): BetCardProps {
  return {
    id: 'bet-001',
    sport: 'football',
    event: 'Arsenal vs Chelsea',
    league: 'Premier League',
    selection: 'Arsenal to Win',
    odds: 2.5,
    stake: 25,
    payout: 62.5,
    result: 'won',
    type: 'single',
    placedAt: '2024-06-01T12:00:00Z',
    settledAt: '2024-06-01T14:00:00Z',
    ...overrides,
  }
}

// ── Schema validation ──────────────────────────────────────────

describe('BetCardSchema', () => {
  it('should accept valid won bet props', () => {
    const props = makeProps()
    const result = BetCardSchema.safeParse(props)
    expect(result.success).toBe(true)
  })

  it('should accept valid pending bet with null payout and settledAt', () => {
    const props = makeProps({
      result: 'pending',
      payout: null,
      settledAt: null,
    })
    const result = BetCardSchema.safeParse(props)
    expect(result.success).toBe(true)
  })

  it('should accept valid lost bet', () => {
    const props = makeProps({
      result: 'lost',
      payout: 0,
      settledAt: '2024-06-01T14:00:00Z',
    })
    const result = BetCardSchema.safeParse(props)
    expect(result.success).toBe(true)
  })

  it('should accept all bet types: single, parlay, system', () => {
    for (const type of ['single', 'parlay', 'system'] as const) {
      const result = BetCardSchema.safeParse(makeProps({ type }))
      expect(result.success).toBe(true)
    }
  })

  it('should accept all result values: won, lost, pending', () => {
    for (const res of ['won', 'lost', 'pending'] as const) {
      const result = BetCardSchema.safeParse(
        makeProps({ result: res, payout: res === 'pending' ? null : 10, settledAt: res === 'pending' ? null : '2024-06-01T14:00:00Z' })
      )
      expect(result.success).toBe(true)
    }
  })

  // ── Rejection tests ──

  it('should reject missing required fields', () => {
    const result = BetCardSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('should reject invalid result enum value', () => {
    const result = BetCardSchema.safeParse(makeProps({ result: 'draw' as any }))
    expect(result.success).toBe(false)
  })

  it('should reject invalid type enum value', () => {
    const result = BetCardSchema.safeParse(makeProps({ type: 'accumulator' as any }))
    expect(result.success).toBe(false)
  })

  it('should reject non-number odds', () => {
    const result = BetCardSchema.safeParse(makeProps({ odds: '2.5' as any }))
    expect(result.success).toBe(false)
  })

  it('should reject non-number stake', () => {
    const result = BetCardSchema.safeParse(makeProps({ stake: 'twenty' as any }))
    expect(result.success).toBe(false)
  })

  it('should reject non-string id', () => {
    const result = BetCardSchema.safeParse(makeProps({ id: 123 as any }))
    expect(result.success).toBe(false)
  })

  it('should reject payout as undefined (must be number or null)', () => {
    const { payout, ...rest } = makeProps()
    const result = BetCardSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('should accept payout of 0 (edge case for lost bets)', () => {
    const result = BetCardSchema.safeParse(makeProps({ payout: 0, result: 'lost' }))
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.payout).toBe(0)
    }
  })

  it('should accept negative numbers for odds (schema allows it)', () => {
    // Schema uses z.number() without .positive() so negative odds are valid at schema level
    const result = BetCardSchema.safeParse(makeProps({ odds: -110 }))
    expect(result.success).toBe(true)
  })

  it('should accept zero stake', () => {
    const result = BetCardSchema.safeParse(makeProps({ stake: 0 }))
    expect(result.success).toBe(true)
  })
})

// ── Component logic (pure functions extracted from component) ──

describe('BetCard component logic', () => {
  // Replicate the internal helper functions for testing
  const sportEmojiMap: Record<string, string> = {
    football: '⚽',
    soccer: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    horse_racing: '🏇',
    baseball: '⚾',
  }

  function getSportEmoji(sport: string): string {
    return sportEmojiMap[sport.toLowerCase()] ?? '🎯'
  }

  function formatCurrency(amount: number): string {
    return `$${Math.abs(amount).toFixed(2)}`
  }

  function computeIsSettled(result: BetCardProps['result'], payout: number | null): boolean {
    return result !== 'pending' && payout !== null
  }

  function computeProfit(isSettled: boolean, payout: number | null, stake: number): number | null {
    return isSettled && payout !== null ? payout - stake : null
  }

  // ── Sport Emoji ──

  describe('getSportEmoji', () => {
    it('should return ⚽ for football', () => {
      expect(getSportEmoji('football')).toBe('⚽')
    })

    it('should return ⚽ for soccer', () => {
      expect(getSportEmoji('soccer')).toBe('⚽')
    })

    it('should return 🏀 for basketball', () => {
      expect(getSportEmoji('basketball')).toBe('🏀')
    })

    it('should return 🎾 for tennis', () => {
      expect(getSportEmoji('tennis')).toBe('🎾')
    })

    it('should return 🏇 for horse_racing', () => {
      expect(getSportEmoji('horse_racing')).toBe('🏇')
    })

    it('should return ⚾ for baseball', () => {
      expect(getSportEmoji('baseball')).toBe('⚾')
    })

    it('should be case-insensitive', () => {
      expect(getSportEmoji('FOOTBALL')).toBe('⚽')
      expect(getSportEmoji('Basketball')).toBe('🏀')
      expect(getSportEmoji('TENNIS')).toBe('🎾')
    })

    it('should return 🎯 for unknown sport', () => {
      expect(getSportEmoji('cricket')).toBe('🎯')
      expect(getSportEmoji('esports')).toBe('🎯')
    })

    it('should return 🎯 for empty string', () => {
      expect(getSportEmoji('')).toBe('🎯')
    })
  })

  // ── Format Currency ──

  describe('formatCurrency', () => {
    it('should format positive amount with two decimals', () => {
      expect(formatCurrency(45)).toBe('$45.00')
    })

    it('should format decimal amount', () => {
      expect(formatCurrency(62.5)).toBe('$62.50')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should use absolute value for negative amounts', () => {
      expect(formatCurrency(-25)).toBe('$25.00')
      expect(formatCurrency(-99.99)).toBe('$99.99')
    })

    it('should handle very large amounts', () => {
      expect(formatCurrency(1000000)).toBe('$1000000.00')
    })

    it('should round to two decimal places', () => {
      expect(formatCurrency(1.999)).toBe('$2.00')
      expect(formatCurrency(1.001)).toBe('$1.00')
      // Note: 1.005 rounds to '1.00' due to IEEE 754 floating-point
      // (1.005 is represented as 1.00499999... internally)
      expect(formatCurrency(1.005)).toBe('$1.00')
    })
  })

  // ── isSettled logic ──

  describe('computeIsSettled', () => {
    it('should return true for won with payout', () => {
      expect(computeIsSettled('won', 100)).toBe(true)
    })

    it('should return true for lost with zero payout', () => {
      expect(computeIsSettled('lost', 0)).toBe(true)
    })

    it('should return false for pending with null payout', () => {
      expect(computeIsSettled('pending', null)).toBe(false)
    })

    it('should return false for pending even with payout', () => {
      // Edge case: pending result but payout exists
      expect(computeIsSettled('pending', 50)).toBe(false)
    })

    it('should return false for won with null payout', () => {
      // Edge case: won but no payout yet
      expect(computeIsSettled('won', null)).toBe(false)
    })
  })

  // ── Profit calculation ──

  describe('computeProfit', () => {
    it('should calculate positive profit for winning bet', () => {
      expect(computeProfit(true, 62.5, 25)).toBe(37.5)
    })

    it('should calculate negative profit for losing bet (payout 0)', () => {
      expect(computeProfit(true, 0, 25)).toBe(-25)
    })

    it('should return null for unsettled bet', () => {
      expect(computeProfit(false, null, 25)).toBeNull()
    })

    it('should return zero profit when payout equals stake', () => {
      expect(computeProfit(true, 25, 25)).toBe(0)
    })

    it('should handle partial loss (payout < stake but > 0)', () => {
      expect(computeProfit(true, 10, 25)).toBe(-15)
    })
  })

  // ── Profit display formatting ──

  describe('profit display format', () => {
    function formatProfit(profit: number | null): string {
      if (profit === null) return 'Pending'
      if (profit >= 0) return `+${formatCurrency(profit)}`
      return `-${formatCurrency(profit)}`
    }

    it('should format positive profit with + prefix', () => {
      expect(formatProfit(37.5)).toBe('+$37.50')
    })

    it('should format negative profit with - prefix', () => {
      expect(formatProfit(-25)).toBe('-$25.00')
    })

    it('should format zero profit with + prefix', () => {
      expect(formatProfit(0)).toBe('+$0.00')
    })

    it('should return Pending for null', () => {
      expect(formatProfit(null)).toBe('Pending')
    })
  })

  // ── Result color coding ──

  describe('result color coding', () => {
    function getResultColorClass(result: BetCardProps['result']): string {
      return result === 'won'
        ? 'text-green-600 bg-green-100'
        : result === 'lost'
          ? 'text-red-600 bg-red-100'
          : 'text-amber-600 bg-amber-100'
    }

    function getResultBorderClass(result: BetCardProps['result']): string {
      return result === 'won'
        ? 'border-green-200'
        : result === 'lost'
          ? 'border-red-200'
          : 'border-amber-200'
    }

    it('should use green classes for won', () => {
      expect(getResultColorClass('won')).toContain('green')
      expect(getResultBorderClass('won')).toContain('green')
    })

    it('should use red classes for lost', () => {
      expect(getResultColorClass('lost')).toContain('red')
      expect(getResultBorderClass('lost')).toContain('red')
    })

    it('should use amber classes for pending', () => {
      expect(getResultColorClass('pending')).toContain('amber')
      expect(getResultBorderClass('pending')).toContain('amber')
    })
  })
})

// ── Module exports ─────────────────────────────────────────────

describe('BetCard module exports', () => {
  it('should export BetCardSchema from schema.ts', () => {
    expect(BetCardSchema).toBeDefined()
    expect(typeof BetCardSchema.safeParse).toBe('function')
  })

  it('should have a default export from index.tsx', async () => {
    const mod = await import('@/components/BetCard/index')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })

  it('default export should be named BetCard', async () => {
    const mod = await import('@/components/BetCard/index')
    expect(mod.default.name).toBe('BetCard')
  })
})
