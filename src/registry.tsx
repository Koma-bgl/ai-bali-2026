import React from 'react';
import { defineRegistry } from '@json-render/react';
import { Catalog } from './catalog';

const registry = defineRegistry<Catalog>({
  Text: ({ content }) => {
    return React.createElement('div', null, content);
  },
});

export default registry;