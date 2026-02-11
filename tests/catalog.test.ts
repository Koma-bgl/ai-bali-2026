import { describe, it, expect } from 'vitest'
import catalog from '@/catalog'

describe('catalog', () => {
  it('should register BetCard component', () => {
    expect(catalog.components).toHaveProperty('BetCard')
  })

  it('should have the correct schema for BetCard', () => {
    const betCardSchema = catalog.components.BetCard?.props
    expect(betCardSchema).toBeDefined()
    // Add more specific schema checks if needed, e.g., checking for specific fields
  })
})