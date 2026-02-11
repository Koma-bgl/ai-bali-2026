import { defineRegistry } from '@json-render/react'
import { TrendLineChart } from '@/src/components/TrendLineChart'
import catalog from '@/src/catalog'

const registry = defineRegistry(catalog, {
  components: {
    TrendLineChart: (ctx) => {
      const { data, height } = ctx.props
      return <TrendLineChart data={data} height={height} />
    },
  },
})

export default registry