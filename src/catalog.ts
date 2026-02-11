import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react'
import { z } from 'zod'

const TextSchema = z.object({ content: z.string() })

const catalog = defineCatalog(schema, {
  components: {
    Text: {
      props: TextSchema,
      slots: ['default'],
    },
  },
  actions: {
    setState: {
      params: z.object({ key: z.string(), value: z.any() }),
    },
  },
})

export type Catalog = typeof catalog

export default catalog