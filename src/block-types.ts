import type {BlockKind, BlockServiceSpec} from "./blocks";
import {ComponentType} from "react";


interface BlockConfigComponentProps {
    creating?:boolean
}

export interface BlockConfig<T = BlockServiceSpec> {
    kind: string
    version: string
    title?: string
    componentType: ComponentType<BlockConfigComponentProps>
    validate?: (block: BlockKind<T>) => string[];
}