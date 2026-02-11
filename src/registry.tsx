import { defineRegistry, ComponentFn, ComponentContext } from '@json-render/react'
import catalog from '@/catalog'
import BetCard, { type BetCardProps } from '@/components/BetCard'

const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: {
    Text: ({ props }) => <div>{props.content}</div>,
    BetCard: ((props: ComponentContext<any, BetCardProps>) => {
      return <BetCard {...props.props} />;
    }) as ComponentFn<any, BetCardProps>,
  },
})

export { registry, handlers, executeAction }
export default { registry, handlers, executeAction }