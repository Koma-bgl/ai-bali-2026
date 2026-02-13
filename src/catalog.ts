import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react'
import { z } from 'zod'
import { BetCardSchema } from './components/BetCard/schema'
import { FAQSchema } from './components/FAQ/schema'
import { StatsOverviewSchema } from './components/StatsOverview/schema'
import { TrendLineChartSchema } from './components/TrendLineChart/schema'

const TextSchema = z.object({ content: z.string() })

const catalog = defineCatalog(schema, {
  components: {
    Text: {
      props: TextSchema,
      slots: ['default'],
    },
    BetCard: {
      props: BetCardSchema,
    },
    FAQ: {
      props: FAQSchema,
    },
    StatsOverview: {
      props: StatsOverviewSchema,
    },
    TrendLineChart: {
      props: TrendLineChartSchema,
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
