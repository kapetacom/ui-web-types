import { BlockDefinition } from '@kapeta/schemas';
import {ComponentType} from 'react';

export interface LanguageTargetProvider<T = any> {
    kind: string
    version: string
    blockKinds: string[]
    title?: string
    componentType?: ComponentType
    validate?: (options:T) => string[];
}


export interface BlockTypeProviderProps {
    creating?:boolean
}

export interface BlockTypeProvider {
    kind: string
    version: string
    title?: string
    componentType: ComponentType<BlockTypeProviderProps>
    validate?: (block: BlockDefinition) => string[];
}