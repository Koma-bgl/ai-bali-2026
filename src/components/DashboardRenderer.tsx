import React from 'react';
import { Renderer } from '@json-render/react';
import registry from '../src/registry';

interface DashboardRendererProps {
  spec: any;
}

const DashboardRenderer: React.FC<DashboardRendererProps> = ({ spec }) => {
  return <Renderer spec={spec} registry={registry} />;
};

export default DashboardRenderer;