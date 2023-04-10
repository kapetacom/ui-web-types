import { BlockDefinition, BlockType, LanguageTarget } from '@kapeta/schemas';
import {ComponentType} from 'react';
import {ProviderBase} from "./general";

export interface ILanguageTargetProvider<T = any> extends ProviderBase<LanguageTarget> {
    blockKinds: string[]
    componentType?: ComponentType
    validate?: (options:T) => string[];
}

export interface BlockTypeProviderProps {
    creating?:boolean
}

export interface IBlockTypeProvider  extends ProviderBase<BlockType> {
    componentType: ComponentType<BlockTypeProviderProps>
    validate?: (block: BlockDefinition) => string[];
}