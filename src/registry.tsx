import React from 'react';
import { catalog } from '@/catalog';
import { defineRegistry } from "@json-render/react";

const Text = ({ content }: { content: string }) => {
  return <div>{content}</div>;
};

export const registry = defineRegistry(catalog, {
    Text,
});