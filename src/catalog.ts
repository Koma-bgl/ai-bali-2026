import { defineCatalog } from '@json-render/react'
import { z } from 'zod'

const TextSchema = z.object({ content: z.string() })

const catalog = defineCatalog({
  components: {
    Text: {
      schema: TextSchema,
    },
  },
  actions: {
    setState: {
      schema: z.object({ key: z.string(), value: z.any() }),
      action: () => {},
    },
  },
})

export type Catalog = typeof catalog

export default catalog