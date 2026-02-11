import { defineRegistry } from '@json-render/react'
import catalog from '@/catalog'

const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: {
    Text: ({ props }) => <div>{props.content}</div>,
  },
})

export { registry, handlers, executeAction }
export default { registry, handlers, executeAction }