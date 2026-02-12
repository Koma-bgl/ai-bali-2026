import { describe, it, expect } from 'vitest'
import { RecentBetsSchema } from '@/components/RecentBets/schema'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function validBet(overrides: Record<string, unknown> = {}) {
  return {
    id: 'bet-1',
    date: '2024-06-15T12:00:00Z',
    event: 'Lakers vs Celtics',
    type: 'single',
    amount: 50,
    odds: 2.15,
    result: 'pending',
    payout: 0,
    ...overrides,
  }
}

function parse(data: unknown) {
  return RecentBetsSchema.safeParse(data)
}

// ---------------------------------------------------------------------------
// Valid inputs
// ---------------------------------------------------------------------------

describe('RecentBetsSchema – valid inputs', () => {
  it('accepts a minimal valid payload with one bet', () => {
    const result = parse({ bets: [validBet()] })
    expect(result.success).toBe(true)
  })

  it('defaults maxRows to 10 when omitted', () => {
    const result = parse({ bets: [validBet()] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.maxRows).toBe(10)
    }
  })

  it('accepts explicit maxRows', () => {
    const result = parse({ bets: [validBet()], maxRows: 5 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.maxRows).toBe(5)
    }
  })

  it('accepts an empty bets array', () => {
    const result = parse({ bets: [] })
    expect(result.success).toBe(true)
  })

  it('accepts all bet types', () => {
    for (const type of ['single', 'parlay', 'system'] as const) {
      const result = parse({ bets: [validBet({ type })] })
      expect(result.success).toBe(true)
    }
  })

  it('accepts all result values', () => {
    for (const res of ['won', 'lost', 'pending'] as const) {
      const result = parse({ bets: [validBet({ result: res })] })
      expect(result.success).toBe(true)
    }
  })

  it('accepts multiple bets', () => {
    const result = parse({
      bets: [
        validBet({ id: '1' }),
        validBet({ id: '2', result: 'won', payout: 100 }),
        validBet({ id: '3', result: 'lost', payout: 0 }),
      ],
    })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Invalid inputs – bets array
// ---------------------------------------------------------------------------

describe('RecentBetsSchema – invalid bets', () => {
  it('rejects missing bets field', () => {
    const result = parse({})
    expect(result.success).toBe(false)
  })

  it('rejects bets as non-array', () => {
    const result = parse({ bets: 'not-an-array' })
    expect(result.success).toBe(false)
  })

  it('rejects bet with missing id', () => {
    const { id: _, ...noid } = validBet()
    const result = parse({ bets: [noid] })
    expect(result.success).toBe(false)
  })

  it('rejects bet with invalid date (not ISO datetime)', () => {
    const result = parse({ bets: [validBet({ date: 'not-a-date' })] })
    expect(result.success).toBe(false)
  })

  it('rejects bet with invalid type enum', () => {
    const result = parse({ bets: [validBet({ type: 'accumulator' })] })
    expect(result.success).toBe(false)
  })

  it('rejects bet with invalid result enum', () => {
    const result = parse({ bets: [validBet({ result: 'cancelled' })] })
    expect(result.success).toBe(false)
  })

  it('rejects bet with string amount', () => {
    const result = parse({ bets: [validBet({ amount: '50' })] })
    expect(result.success).toBe(false)
  })

  it('rejects bet with string odds', () => {
    const result = parse({ bets: [validBet({ odds: '2.15' })] })
    expect(result.success).toBe(false)
  })

  it('rejects bet with string payout', () => {
    const result = parse({ bets: [validBet({ payout: '0' })] })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Invalid inputs – maxRows
// ---------------------------------------------------------------------------

describe('RecentBetsSchema – invalid maxRows', () => {
  it('rejects maxRows of 0', () => {
    const result = parse({ bets: [validBet()], maxRows: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects negative maxRows', () => {
    const result = parse({ bets: [validBet()], maxRows: -5 })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer maxRows', () => {
    const result = parse({ bets: [validBet()], maxRows: 2.5 })
    expect(result.success).toBe(false)
  })

  it('rejects string maxRows', () => {
    const result = parse({ bets: [validBet()], maxRows: 'ten' })
    expect(result.success).toBe(false)
  })
})
