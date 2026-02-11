import { defineRegistry, ComponentFn } from '@json-render/react'
import { StatsOverviewSpec, TodoButtonSpec } from '@/catalog'
import StatsOverview from '@/components/StatsOverview'
import TodoButton from '@/components/TodoButton'
import { z } from 'zod'

const { registry, handlers, executeAction } = defineRegistry({
  components: {
    Text: ({ props }) => <div>{props.content}</div>,
    [StatsOverviewSpec.id]: StatsOverview as ComponentFn<z.infer<typeof StatsOverviewSpec.schema>, string>,
    [TodoButtonSpec.id]: TodoButton as ComponentFn<any, string>
  },
})

export { registry, handlers, executeAction }
export default { registry, handlers, executeAction }