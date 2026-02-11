import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react'
import { z } from 'zod'

const TextSchema = z.object({ content: z.string() })

const BetCardSchema = z.object({
  id: z.string(),
  sport: z.string(),
  event: z.string(),
  league: z.string(),
  selection: z.string(),
  odds: z.number(),
  stake: z.number(),
  payout: z.number().nullable(),
  result: z.enum(["won", "lost", "pending"]),
  type: z.enum(["single", "parlay", "system"]),
  placedAt: z.string(),
  settledAt: z.string().nullable(),
})

const catalog = defineCatalog(schema, {
  components: {
    Text: {
      props: TextSchema,
      slots: ['default'],
    },
    BetCard: {
      props: BetCardSchema,
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