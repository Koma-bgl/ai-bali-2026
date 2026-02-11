import React from 'react';
import { defineRegistry } from '@json-render/react';
import { catalog, CatalogType } from './catalog';

const Text = ({ content }: { content: string }) => {
  return <div>{content}</div>;
};

export const registry = defineRegistry<CatalogType>({
  Text,
});