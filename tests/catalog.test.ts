import { describe, it, expect } from 'vitest'
import { createCatalog } from '@json-render/react'
import { z } from 'zod'

describe('Catalog', () => {
  const catalog = createCatalog({
    components: {
      Text: {
        schema: z.object({ content: z.string() }),
      },
    },
    actions: {
      setState: {
        schema: z.object({ key: z.string(), value: z.any() }),
        action: () => {},
      },
    },
  })

  it('should define the Text component with the correct schema', () => {
    expect(catalog.components.Text.schema).toBeDefined()
    expect(catalog.components.Text.schema).instanceOf(z.ZodObject)
  })

  it('should define the setState action with the correct schema', () => {
    expect(catalog.actions.setState.schema).toBeDefined()
    expect(catalog.actions.setState.schema).instanceOf(z.ZodObject)
  })

  it('should have a type definition', () => {
    // This is a type-level test to ensure the Catalog type is exported correctly
    type CatalogType = typeof catalog
    expect<CatalogType>(catalog).toBeDefined()
  })
})
