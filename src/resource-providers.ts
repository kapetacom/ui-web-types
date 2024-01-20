/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ComponentType } from 'react';
import { Traffic } from './traffic';
import { BlockDefinition, Connection, Entity, Resource, ResourceMetadata, ResourceType } from '@kapeta/schemas';
import { ProviderBase } from './general';
import { IBlockTypeProvider, ILanguageTargetProvider } from './block-providers';

interface ResourceContainerContext {
    blockProvider: IBlockTypeProvider;
    languageProvider?: ILanguageTargetProvider;
}

export enum ResourceRole {
    CONSUMES = 'CONSUMES',
    PROVIDES = 'PROVIDES',
}

export enum ResourceProviderType {
    INTERNAL = 'INTERNAL',
    OPERATOR = 'OPERATOR',
    EXTENSION = 'EXTENSION',
}

export interface ResourceConnectionMappingChange<EntityType = Entity, DataType = any, ResourceSpec = any> {
    source: ResourceWithSpec<ResourceSpec>;
    sourceEntities: EntityType[];
    target: ResourceWithSpec<ResourceSpec>;
    targetEntities: EntityType[];
    data: DataType;
}

export enum ConnectionMethodMappingType {
    EXACT = 'EXACT',
}

export interface ConnectionMethodMapping {
    targetId: string;
    type: ConnectionMethodMappingType;
}

export type ConnectionMethodsMapping = { [key: string]: ConnectionMethodMapping };

export interface ResourceWithSpec<Spec, Metadata = ResourceMetadata> extends Omit<Resource, 'spec' | 'metadata'> {
    spec: Spec;
    metadata: Metadata;
}

export interface ResourceTypeProviderMappingProps<
    SourceSpec = any,
    TargetSpec = any,
    DataType = any,
    EntityType = Entity
> {
    source: ResourceWithSpec<SourceSpec>;
    target: ResourceWithSpec<TargetSpec>;
    value?: DataType;
    sourceEntities: EntityType[];
    targetEntities: EntityType[];
    title: string;
    onDataChanged?: (change: ResourceConnectionMappingChange<EntityType, DataType, TargetSpec>) => void;
}

export interface ResourceTypeProviderInspectorProps {
    trafficLines: Traffic[];
    mapping: ConnectionMethodsMapping;
    context?: ResourceContainerContext;
}

export interface ResourceTypeProviderEditorProps {
    block: BlockDefinition;
    creating?: boolean; //True if the resource is new
    context?: ResourceContainerContext;
}

export interface IResourceTypeConverter<
    ResourceSpecType = any,
    MappingType = ConnectionMethodsMapping,
    EntityType = Entity,
    MetadataType = ResourceMetadata
> {
    mappingComponentType?: ComponentType<
        ResourceTypeProviderMappingProps<ResourceSpecType, ResourceSpecType, MappingType, EntityType>
    >;
    inspectComponentType?: ComponentType<ResourceTypeProviderInspectorProps>;
    fromKind: string;
    createFrom?: (
        source: ResourceWithSpec<ResourceSpecType, MetadataType>
    ) => ResourceWithSpec<ResourceSpecType, MetadataType>;
    validateMapping?: (
        connection: Connection,
        from: ResourceWithSpec<ResourceSpecType, MetadataType>,
        to: ResourceWithSpec<ResourceSpecType, MetadataType>,
        fromEntities: EntityType[],
        toEntities: EntityType[]
    ) => string[];
    updateMapping?: (
        connection: Connection,
        from: ResourceWithSpec<ResourceSpecType, MetadataType>,
        to: ResourceWithSpec<ResourceSpecType, MetadataType>,
        fromEntities: EntityType[],
        toEntities: EntityType[]
    ) => MappingType;
    createMapping?: (
        from: ResourceWithSpec<ResourceSpecType, MetadataType>,
        to: ResourceWithSpec<ResourceSpecType, MetadataType>,
        fromEntities: EntityType[],
        toEntities: EntityType[]
    ) => MappingType;
}

export interface IResourceTypeProviderConfig<
    MetadataType = ResourceMetadata,
    ResourceSpecType = any,
    EntityType = Entity
> {
    //Function that can resolve entities from a resource
    resolveEntities?: (resource: ResourceWithSpec<ResourceSpecType, MetadataType>) => string[];

    //Function that can rename entity references in a resource
    renameEntityReferences?: (
        resource: ResourceWithSpec<ResourceSpecType, MetadataType>,
        from: string,
        to: string
    ) => void;

    //List of converters that can convert this kind into other kinds - and also provides mapping UI
    converters?: IResourceTypeConverter<ResourceSpecType, ConnectionMethodsMapping, EntityType, MetadataType>[];

    //React component for editing the resource type
    editorComponent?: ComponentType<ResourceTypeProviderEditorProps>;

    //Function that determines has a counter and what that counter is
    getCounterValue?: (data: ResourceWithSpec<ResourceSpecType, MetadataType>) => number;

    //For resources that provide methods - this function determines if the resource has a specific method
    hasMethod?: (data: ResourceWithSpec<ResourceSpecType, MetadataType>, methodId: string) => boolean;

    //Validates a resource and returns a list of errors
    validate?: (data: ResourceWithSpec<ResourceSpecType, MetadataType>, entities: EntityType[]) => string[];
}

export interface ResourceTypeShapeProps<ResourceSpecType = any, MetadataType = ResourceMetadata> {
    resource: ResourceWithSpec<ResourceSpecType, MetadataType>;
    role: ResourceRole;
    index: number;
    readOnly?: boolean;
    context?: ResourceContainerContext;
}

export interface IResourceTypeProvider<MetadataType = ResourceMetadata, ResourceSpecType = any, EntityType = Entity>
    extends IResourceTypeProviderConfig<MetadataType, ResourceSpecType, EntityType>,
        ProviderBase<ResourceType> {
    //Defines the role of the resource - either provider or consumer.
    role: ResourceRole;

    //Defines the type of resource.
    type: ResourceProviderType;

    //If this is a provider (See role) - consumableKind defines the kind of resource that can consume this - if any
    consumableKind?: string;

    //React component that allows overwriting the shape / rendering of the resource
    shapeComponent?: ComponentType<ResourceTypeShapeProps<ResourceSpecType, MetadataType>>;

    capabilities?: {
        /**
         * If true, the resource can be handle and is expecting DSL types directly
         * instead of the Entity types
         */
        directDSL?: boolean;
    };
}
