import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  sortBetsByDateDesc,
  getResultColorClass,
} from '@/components/RecentBets/index'
import type { Bet } from '@/components/RecentBets/schema'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeBet(overrides: Partial<Bet> = {}): Bet {
  return {
    id: '1',
    date: '2024-06-15T00:00:00Z',
    event: 'Lakers vs Celtics',
    type: 'single',
    amount: 50,
    odds: 2.15,
    result: 'pending',
    payout: 0,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------

describe('formatCurrency', () => {
  it('formats a normal amount with $ prefix and 2 decimals', () => {
    expect(formatCurrency(50)).toBe('$50.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats a large number', () => {
    expect(formatCurrency(12345.6)).toBe('$12345.60')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(9.999)).toBe('$10.00')
  })

  it('handles small fractions', () => {
    expect(formatCurrency(0.1)).toBe('$0.10')
  })

  it('handles negative amounts ($ prefix then negative sign)', () => {
    // toFixed places the minus before digits, so result is $-25.00
    expect(formatCurrency(-25)).toBe('$-25.00')
  })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats an ISO datetime string to readable date', () => {
    const result = formatDate('2024-06-15T00:00:00Z')
    expect(result).toContain('Jun')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats a date at end of year', () => {
    const result = formatDate('2024-12-31T23:59:59Z')
    expect(result).toContain('Dec')
    expect(result).toContain('31')
    expect(result).toContain('2024')
  })

  it('formats a date at beginning of year', () => {
    const result = formatDate('2024-01-01T00:00:00Z')
    expect(result).toContain('Jan')
    expect(result).toContain('1')
    expect(result).toContain('2024')
  })
})

// ---------------------------------------------------------------------------
// sortBetsByDateDesc
// ---------------------------------------------------------------------------

describe('sortBetsByDateDesc', () => {
  it('sorts bets with most recent first', () => {
    const bets: Bet[] = [
      makeBet({ id: 'old', date: '2024-01-01T00:00:00Z' }),
      makeBet({ id: 'new', date: '2024-06-15T00:00:00Z' }),
      makeBet({ id: 'mid', date: '2024-03-10T00:00:00Z' }),
    ]

    const sorted = sortBetsByDateDesc(bets)
    expect(sorted.map((b) => b.id)).toEqual(['new', 'mid', 'old'])
  })

  it('returns empty array when given empty array', () => {
    expect(sortBetsByDateDesc([])).toEqual([])
  })

  it('returns single-element array unchanged', () => {
    const bets = [makeBet({ id: 'only' })]
    const sorted = sortBetsByDateDesc(bets)
    expect(sorted).toHaveLength(1)
    expect(sorted[0].id).toBe('only')
  })

  it('does not mutate the original array', () => {
    const bets: Bet[] = [
      makeBet({ id: 'a', date: '2024-01-01T00:00:00Z' }),
      makeBet({ id: 'b', date: '2024-06-01T00:00:00Z' }),
    ]
    const original = [...bets]
    sortBetsByDateDesc(bets)
    expect(bets.map((b) => b.id)).toEqual(original.map((b) => b.id))
  })

  it('handles bets with identical dates', () => {
    const bets: Bet[] = [
      makeBet({ id: 'a', date: '2024-06-15T00:00:00Z' }),
      makeBet({ id: 'b', date: '2024-06-15T00:00:00Z' }),
    ]
    const sorted = sortBetsByDateDesc(bets)
    expect(sorted).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// getResultColorClass
// ---------------------------------------------------------------------------

describe('getResultColorClass', () => {
  it('returns green class for "won"', () => {
    expect(getResultColorClass('won')).toBe('text-green-600')
  })

  it('returns red class for "lost"', () => {
    expect(getResultColorClass('lost')).toBe('text-red-600')
  })

  it('returns yellow class for "pending"', () => {
    expect(getResultColorClass('pending')).toBe('text-yellow-500')
  })
})
