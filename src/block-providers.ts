import { BlockDefinition, BlockType, LanguageTarget } from '@kapeta/schemas';
import {ComponentType} from 'react';
import {ProviderBase} from "./general";
import {BlockInstance} from "@kapeta/schemas/dist/cjs";

export interface ILanguageTargetProvider<T = any> extends ProviderBase<LanguageTarget> {
    blockKinds: string[]
    componentType?: ComponentType
    validate?: (options:T) => string[];
}

export interface BlockTypeEditorProps<T = BlockDefinition> {
    block: T
    creating?:boolean
    readOnly?: boolean;
}

export interface BlockTypeConfigProps<T = BlockDefinition> {
    block: T
    instance: BlockInstance
    readOnly?: boolean;
}

export interface BlockTypeShapeProps<T = BlockDefinition> {
    block: T
    instance: BlockInstance
    readOnly?: boolean;
}

export interface IBlockTypeProvider<T = BlockDefinition>  extends ProviderBase<BlockType> {
    editorComponent: ComponentType<BlockTypeEditorProps<T>>

    //Allows overwriting the shape / rendering of the block itself
    configComponent?: ComponentType<BlockTypeConfigProps<T>>
    createDefaultConfig?: (block: T, instance: BlockInstance) => {[key:string]:any}

    //Allows overwriting the shape / rendering of the block itself
    shapeComponent?: ComponentType<BlockTypeShapeProps<T>>
    validate?: (block: T) => string[];
}