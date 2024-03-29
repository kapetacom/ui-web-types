/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { BlockDefinition, BlockType, LanguageTarget } from '@kapeta/schemas';
import { ComponentType } from 'react';
import { ProviderBase } from './general';
import { BlockInstance } from '@kapeta/schemas';

export interface DSLInclude {
    source: string;
    language: string;
    version: string;
}

export enum IncludeContextType {
    REST,
    ENTITIES,
    CONFIG,
}

export interface ILanguageTargetProvider<T = any> extends ProviderBase<LanguageTarget> {
    //List of block kinds that this target can be applied to.
    blockKinds: string[];

    //List of resource kinds that this target supports. If not specified, target can consume any resource
    resourceKinds?: string[];
    editorComponent?: ComponentType;
    getDSLIncludes?: (context: IncludeContextType) => DSLInclude;
    validate?: (options: T) => string[];
}

export interface BlockTypeEditorProps<T = BlockDefinition> {
    block: T;
    creating?: boolean;
    readOnly?: boolean;
}

export interface BlockTypeConfigProps<T = BlockDefinition> {
    block: T;
    instance: BlockInstance;
    readOnly?: boolean;
}

export interface BlockTypeShapeProps<T = BlockDefinition> {
    block: T;
    instance: BlockInstance;
    height: number;
    width: number;
    status?: any;
    valid?: boolean;
    readOnly?: boolean;
}

export interface IBlockTypeProvider<T = BlockDefinition> extends ProviderBase<BlockType> {
    //React Component for editing the block definition
    editorComponent: ComponentType<BlockTypeEditorProps<T>>;

    //React component that allows overwriting the shape / rendering of the block itself
    configComponent?: ComponentType<BlockTypeConfigProps<T>>;

    //Create default configuration for the block
    createDefaultConfig?: (block: T, instance: BlockInstance) => { [key: string]: any };

    //React component that allows overwriting the shape / rendering of the block itself
    shapeComponent?: ComponentType<BlockTypeShapeProps<T>>;
    shapeWidth?: number;
    getShapeHeight?: (resourceHeight: number) => number;

    // List of resource kinds that this block type supports.
    // If not specified, block supports any type (depends on target)
    resourceKinds?: string[];

    //Validate block definition. Returns array of errors
    validate?: (block: T) => string[];

    //Validate block configuration. Returns array of errors
    validateConfiguration?: (block: T, instance: BlockInstance, config: { [key: string]: any }) => string[];
}
