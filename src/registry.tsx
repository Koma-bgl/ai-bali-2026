import { defineRegistry } from '@json-render/react'
import catalog from '@/catalog'

const registry = defineRegistry({
    Text: (props: any) => {
        return <div>{props.content}</div>;
    }
});

export default registry