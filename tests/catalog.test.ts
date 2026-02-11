import { describe, it, expect } from 'vitest'
import { createCatalog } from '@json-render/core'
import { z } from 'zod'

describe('Catalog', () => {
  const catalog = createCatalog({
    components: {
      Text: {
        props: z.object({ content: z.string() }),
      },
    },
    actions: {
      setState: {
        params: z.object({ key: z.string(), value: z.any() }),
      },
    },
  })

  it('should define the Text component with the correct schema', () => {
    expect(catalog.components.Text.props).toBeDefined()
    expect(catalog.components.Text.props).instanceOf(z.ZodObject)
  })

  it('should define the setState action with the correct schema', () => {
    expect(catalog.actions.setState.params).toBeDefined()
    expect(catalog.actions.setState.params).instanceOf(z.ZodObject)
  })

  it('should have a type definition', () => {
    // This is a type-level test to ensure the Catalog type is exported correctly
    type CatalogType = typeof catalog
    expect<CatalogType>(catalog).toBeDefined()
  })
})
