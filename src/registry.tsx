import { defineRegistry } from '@json-render/react'
import catalog from '@/catalog'
import BetCard from './components/BetCard'
import FAQ from './components/FAQ'
import StatsOverview from './components/StatsOverview'
import TrendLineChart from './components/TrendLineChart'

const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: {
    Text: ({ props }) => <div>{props.content}</div>,
    BetCard,
    FAQ,
    StatsOverview,
    TrendLineChart,
  },
})

export { registry, handlers, executeAction }
export default { registry, handlers, executeAction }
