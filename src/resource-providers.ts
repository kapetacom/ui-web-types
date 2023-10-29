/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ComponentType } from 'react';
import { Traffic } from './traffic';
import { BlockDefinition, Connection, Entity, Resource, ResourceType } from '@kapeta/schemas';
import { ProviderBase } from './general';

export enum ResourceRole {
    CONSUMES = 'CONSUMES',
    PROVIDES = 'PROVIDES',
}

export enum ResourceProviderType {
    INTERNAL = 'INTERNAL',
    OPERATOR = 'OPERATOR',
    EXTENSION = 'EXTENSION',
}

export interface ResourceConnectionMappingChange<T = any, U = any, V = any> {
    source: Resource;
    sourceEntities: Entity[];
    target: Resource;
    targetEntities: Entity[];
    data: V;
}

export enum ConnectionMethodMappingType {
    EXACT = 'EXACT',
}

export interface ConnectionMethodMapping {
    targetId: string;
    type: ConnectionMethodMappingType;
}

export type ConnectionMethodsMapping = { [key: string]: ConnectionMethodMapping };

export interface ResourceTypeProviderMappingProps<T = any, U = any, V = any> {
    source: Resource;
    target: Resource;
    value?: V;
    sourceEntities: Entity[];
    targetEntities: Entity[];
    title: string;
    onDataChanged?: (change: ResourceConnectionMappingChange<T, U, V>) => void;
}

export interface ResourceTypeProviderInspectorProps {
    trafficLines: Traffic[];
    mapping: ConnectionMethodsMapping;
}

export interface ResourceTypeProviderEditorProps {
    block: BlockDefinition;
    creating?: boolean; //True if the resource is new
}

export interface IResourceTypeConverter<T = any, V = ConnectionMethodsMapping> {
    mappingComponentType?: ComponentType<ResourceTypeProviderMappingProps>;
    inspectComponentType?: ComponentType<ResourceTypeProviderInspectorProps>;
    fromKind: string;
    createFrom?: (source: Resource) => Resource;
    validateMapping?: (
        connection: Connection,
        from: Resource,
        to: Resource,
        fromEntities: Entity[],
        toEntities: Entity[]
    ) => string[];
    updateMapping?: (
        connection: Connection,
        from: Resource,
        to: Resource,
        fromEntities: Entity[],
        toEntities: Entity[]
    ) => V;
    createMapping?: (from: Resource, to: Resource, fromEntities: Entity[], toEntities: Entity[]) => V;
}

export interface IResourceTypeProviderConfig<T = any, U = any> {
    //Function that can resolve entities from a resource
    resolveEntities?: (resource: Resource) => string[];

    //Function that can rename entity references in a resource
    renameEntityReferences?: (resource: Resource, from: string, to: string) => void;

    //List of converters that can convert this kind into other kinds - and also provides mapping UI
    converters?: IResourceTypeConverter<U>[];

    //React component for editing the resource type
    editorComponent?: ComponentType<ResourceTypeProviderEditorProps>;

    //Function that determines has a counter and what that counter is
    getCounterValue?: (data: Resource) => number;

    //For resources that provide methods - this function determines if the resource has a specific method
    hasMethod?: (data: Resource, methodId: string) => boolean;

    //Validates a resource and returns a list of errors
    validate?: (data: Resource, entities: Entity[]) => string[];
}

export interface ResourceTypeShapeProps {
    resource: Resource;
    role: ResourceRole;
    index: number;
    readOnly?: boolean;
}

export interface IResourceTypeProvider<T = any, U = any>
    extends IResourceTypeProviderConfig<T, U>,
        ProviderBase<ResourceType> {
    //Defines the role of the resource - either provider or consumer.
    role: ResourceRole;

    //Defines the type of resource.
    type: ResourceProviderType;

    //If this is a provider (See role) - consumableKind defines the kind of resource that can consume this - if any
    consumableKind?: string;

    //React component that allows overwriting the shape / rendering of the resource
    shapeComponent?: ComponentType<ResourceTypeShapeProps>;
}
