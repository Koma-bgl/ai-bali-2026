'use client'

import { Renderer } from '@json-render/react'
import registry from '@/registry'

interface DashboardRendererProps {
  spec: any // TODO: refine spec type
}

const DashboardRenderer = ({ spec }: DashboardRendererProps) => {
  return <Renderer spec={spec} registry={registry.registry} />
}

export default DashboardRenderer