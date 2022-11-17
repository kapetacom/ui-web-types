import type { Component } from "react";
import type {Type} from "./general";
import type {BlockKind, BlockMetadata, BlockServiceSpec} from "./blocks";
import type {EntityConfigProps} from "./schemas";

export interface BlockConfigProps<U = BlockMetadata, T = any> extends EntityConfigProps<U,T> {
    onDataChanged: (metadata:U, spec:T) => void
}

export interface BlockConfig<T = BlockServiceSpec> {
    kind: string
    title?: string
    componentType: Type<Component<BlockConfigProps, any>>
    validate?: (block: BlockKind<T>) => string[];
}