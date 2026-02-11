import { describe, it, expect } from 'vitest'
import { BetCardSchema } from '../src/components/BetCard/schema'

describe('BetCardSchema', () => {
  it('should validate a valid BetCardProps object', () => {
    const validBetCardProps = {
      id: '123',
      sport: 'football',
      event: 'Super Bowl',
      league: 'NFL',
      selection: 'Team A to win',
      odds: 1.90,
      stake: 10,
      payout: 19,
      result: 'won',
      type: 'single',
      placedAt: '2024-01-01T12:00:00.000Z',
      settledAt: '2024-01-02T12:00:00.000Z',
    }

    const result = BetCardSchema.safeParse(validBetCardProps)
    expect(result.success).toBe(true)
  })

  it('should invalidate an invalid BetCardProps object', () => {
    const invalidBetCardProps = {
      id: 123, // Incorrect type
      sport: 'football',
      event: 'Super Bowl',
      league: 'NFL',
      selection: 'Team A to win',
      odds: 1.90,
      stake: 10,
      payout: '19', // Incorrect type
      result: 'won',
      type: 'single',
      placedAt: '2024-01-01T12:00:00.000Z',
      settledAt: '2024-01-02T12:00:00.000Z',
    }

    const result = BetCardSchema.safeParse(invalidBetCardProps)
    expect(result.success).toBe(false)
  })

  it('should handle null payout', () => {
    const validBetCardProps = {
      id: '123',
      sport: 'football',
      event: 'Super Bowl',
      league: 'NFL',
      selection: 'Team A to win',
      odds: 1.90,
      stake: 10,
      payout: null,
      result: 'pending',
      type: 'single',
      placedAt: '2024-01-01T12:00:00.000Z',
      settledAt: null,
    }

    const result = BetCardSchema.safeParse(validBetCardProps)
    expect(result.success).toBe(true)
  })

  it('should invalidate incorrect result type', () => {
      const invalidBetCardProps = {
        id: '123',
        sport: 'football',
        event: 'Super Bowl',
        league: 'NFL',
        selection: 'Team A to win',
        odds: 1.90,
        stake: 10,
        payout: 19,
        result: 'invalid',
        type: 'single',
        placedAt: '2024-01-01T12:00:00.000Z',
        settledAt: '2024-01-02T12:00:00.000Z',
      }

      const result = BetCardSchema.safeParse(invalidBetCardProps)
      expect(result.success).toBe(false)
    })
})
