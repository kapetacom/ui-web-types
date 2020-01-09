import { Component } from "react";
import {Type} from "./general";
import {BlockKind, BlockMetadata, BlockServiceSpec, SchemaKind} from "./blocks";
import {EntityConfigProps} from "./schemas";

export interface BlockConfigProps<U = BlockMetadata, T = any> extends EntityConfigProps<U,T> {
    onDataChanged: (metadata:U, spec:T) => void
}

export interface BlockConfig<T = BlockServiceSpec> {
    kind: string
    name: string
    componentType: Type<Component<BlockConfigProps, any>>
    validate?: (block: BlockKind<T>) => string[];
}