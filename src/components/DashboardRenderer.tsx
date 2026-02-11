import { Renderer, DefineRegistryResult } from '@json-render/react'
import registry from '@/registry'
import catalog, { Catalog } from '@/catalog'

interface DashboardRendererProps {
  spec: any // TODO: refine spec type
}

const DashboardRenderer = ({ spec }: DashboardRendererProps) => {
  return <Renderer spec={spec} registry={registry as DefineRegistryResult} catalog={catalog} />
}

export default DashboardRenderer