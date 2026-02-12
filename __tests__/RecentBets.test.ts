import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  sortBetsByDateDesc,
  getResultColorClass,
} from '@/components/RecentBets/index'
import RecentBets from '@/components/RecentBets/index'
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
// formatCurrency  (Intl.NumberFormat based)
// ---------------------------------------------------------------------------

describe('formatCurrency', () => {
  it('formats a normal amount with $ prefix and 2 decimals', () => {
    expect(formatCurrency(50)).toBe('$50.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats a large number with comma grouping', () => {
    expect(formatCurrency(12345.6)).toBe('$12,345.60')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(9.999)).toBe('$10.00')
  })

  it('handles small fractions', () => {
    expect(formatCurrency(0.1)).toBe('$0.10')
  })

  it('handles negative amounts with minus before $', () => {
    // Intl.NumberFormat places minus sign before the currency symbol
    expect(formatCurrency(-25)).toBe('-$25.00')
  })

  it('handles very small positive amounts', () => {
    expect(formatCurrency(0.01)).toBe('$0.01')
  })

  it('formats a number with exactly two decimals already', () => {
    expect(formatCurrency(99.99)).toBe('$99.99')
  })

  it('handles millions with comma grouping', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
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

  it('uses UTC so midnight does not shift to previous day', () => {
    // Midnight UTC on Feb 29 should stay Feb 29 regardless of local TZ
    const result = formatDate('2024-02-29T00:00:00Z')
    expect(result).toContain('Feb')
    expect(result).toContain('29')
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

  it('handles dates spanning multiple years', () => {
    const bets: Bet[] = [
      makeBet({ id: '2022', date: '2022-01-01T00:00:00Z' }),
      makeBet({ id: '2025', date: '2025-12-31T00:00:00Z' }),
      makeBet({ id: '2023', date: '2023-06-15T00:00:00Z' }),
    ]
    const sorted = sortBetsByDateDesc(bets)
    expect(sorted.map((b) => b.id)).toEqual(['2025', '2023', '2022'])
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

// ---------------------------------------------------------------------------
// RecentBets – module exports
// ---------------------------------------------------------------------------

describe('RecentBets – module exports', () => {
  it('has a default export that is a function', () => {
    expect(typeof RecentBets).toBe('function')
  })

  it('default export is named RecentBets', () => {
    expect(RecentBets.name).toBe('RecentBets')
  })

  it('formatCurrency is a named export', () => {
    expect(typeof formatCurrency).toBe('function')
  })

  it('formatDate is a named export', () => {
    expect(typeof formatDate).toBe('function')
  })

  it('sortBetsByDateDesc is a named export', () => {
    expect(typeof sortBetsByDateDesc).toBe('function')
  })

  it('getResultColorClass is a named export', () => {
    expect(typeof getResultColorClass).toBe('function')
  })
})
