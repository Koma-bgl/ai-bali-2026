import React from 'react';
import { Renderer } from '@json-render/react';
import { registry } from '@/registry';
import { CatalogType } from '@/catalog';

interface DashboardRendererProps {
  spec: React.ComponentProps<typeof Renderer<CatalogType>>['spec'];
}

const DashboardRenderer: React.FC<DashboardRendererProps> = ({ spec }) => {
  return <Renderer spec={spec} registry={registry} />;
};

export default DashboardRenderer;