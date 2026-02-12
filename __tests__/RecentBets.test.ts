import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  sortBetsByDateDesc,
  getResultColorClass,
} from '@/components/RecentBets/index'
import type { Bet } from '@/components/RecentBets/schema'

// ---------------------------------------------------------------------------
// Helper factory
// ---------------------------------------------------------------------------
function makeBet(overrides: Partial<Bet> = {}): Bet {
  return {
    id: '1',
    date: '2024-06-15T00:00:00.000Z',
    event: 'Lakers vs Celtics',
    type: 'single',
    amount: 50,
    odds: 2.15,
    result: 'won',
    payout: 107.5,
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

  it('formats a fractional amount', () => {
    expect(formatCurrency(99.9)).toBe('$99.90')
  })

  it('formats a large amount', () => {
    expect(formatCurrency(12345.678)).toBe('$12345.68')
  })

  it('formats a very small amount', () => {
    expect(formatCurrency(0.1)).toBe('$0.10')
  })

  it('formats negative amounts (edge case)', () => {
    // The function doesn't explicitly handle negatives, verify current behaviour
    expect(formatCurrency(-25)).toBe('$-25.00')
  })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('formats an ISO date string to en-US short format', () => {
    const result = formatDate('2024-06-15T00:00:00.000Z')
    expect(result).toBe('Jun 15, 2024')
  })

  it('formats a date at end of year', () => {
    expect(formatDate('2024-12-31T23:59:59.000Z')).toBe('Dec 31, 2024')
  })

  it('formats a date at start of year', () => {
    expect(formatDate('2024-01-01T00:00:00.000Z')).toBe('Jan 1, 2024')
  })

  it('handles date-only ISO strings', () => {
    // date-only strings are interpreted as UTC by spec
    expect(formatDate('2023-03-05')).toBe('Mar 5, 2023')
  })
})

// ---------------------------------------------------------------------------
// sortBetsByDateDesc
// ---------------------------------------------------------------------------
describe('sortBetsByDateDesc', () => {
  it('sorts bets with most recent first', () => {
    const bets: Bet[] = [
      makeBet({ id: 'old', date: '2024-01-01T00:00:00.000Z' }),
      makeBet({ id: 'new', date: '2024-06-15T00:00:00.000Z' }),
      makeBet({ id: 'mid', date: '2024-03-10T00:00:00.000Z' }),
    ]
    const sorted = sortBetsByDateDesc(bets)
    expect(sorted.map((b) => b.id)).toEqual(['new', 'mid', 'old'])
  })

  it('does not mutate the original array', () => {
    const bets: Bet[] = [
      makeBet({ id: 'a', date: '2024-01-01T00:00:00.000Z' }),
      makeBet({ id: 'b', date: '2024-06-15T00:00:00.000Z' }),
    ]
    const original = [...bets]
    sortBetsByDateDesc(bets)
    expect(bets.map((b) => b.id)).toEqual(original.map((b) => b.id))
  })

  it('returns empty array when given empty array', () => {
    expect(sortBetsByDateDesc([])).toEqual([])
  })

  it('handles a single element', () => {
    const bets: Bet[] = [makeBet({ id: 'only' })]
    const sorted = sortBetsByDateDesc(bets)
    expect(sorted).toHaveLength(1)
    expect(sorted[0].id).toBe('only')
  })

  it('handles bets with the same date', () => {
    const bets: Bet[] = [
      makeBet({ id: 'a', date: '2024-06-15T00:00:00.000Z' }),
      makeBet({ id: 'b', date: '2024-06-15T00:00:00.000Z' }),
    ]
    const sorted = sortBetsByDateDesc(bets)
    expect(sorted).toHaveLength(2)
    // Both present, order between ties is stable in modern engines
    expect(sorted.map((b) => b.id)).toContain('a')
    expect(sorted.map((b) => b.id)).toContain('b')
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
