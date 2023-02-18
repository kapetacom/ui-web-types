import {ComponentType} from "react";
import {BlockKind, BlockWrapper} from "./blocks";
import {SchemaEntity} from "./schemas";
import {Traffic} from "./traffic";
import {ResourceKind, ResourceMetadata} from "./resources";
import {BlockConnectionSpec} from "./plans";

export enum ResourceRole {
    CONSUMES = 'CONSUMES',
    PROVIDES = 'PROVIDES'
}

export enum ResourceType {
    SERVICE = 'SERVICE',
    DATABASE = 'DATABASE',
    EXTENSION = 'EXTENSION'
}

export interface MappingChange<T = any,U = any, V = any> {
    source: ResourceKind<T>
    sourceEntities: SchemaEntity[]
    target: ResourceKind<U>
    targetEntities: SchemaEntity[]
    data:V
}

export enum ConnectionMethodMappingType {
    EXACT = 'EXACT'
}

export interface ConnectionMethodMapping {
    targetId: string
    type: ConnectionMethodMappingType
}

export type ConnectionMethodsMapping = {[key:string]:ConnectionMethodMapping};

export interface ResourceMapperProps<T = any,U = any, V = any> {
    source: ResourceKind<T>
    target: ResourceKind<U>
    value?: V
    sourceEntities: SchemaEntity[]
    targetEntities: SchemaEntity[]
    title:string
    onDataChanged?: (change: MappingChange<T,U,V>) => void
}

export interface ResourceInspectProps {
    trafficLines: Traffic[]
    mapping: ConnectionMethodsMapping
}

export interface ResourceConfigProps<T = ResourceMetadata,U = any> extends ResourceKind<U,T> {
    block: BlockWrapper<BlockKind>
    creating?:boolean //True if the resource is new
    onDataChanged: (metadata:T, spec?:U) => void
}

export interface ResourceConverter<T = any,V = ConnectionMethodsMapping> {
    mappingComponentType?: ComponentType<ResourceMapperProps>
    inspectComponentType?: ComponentType<ResourceInspectProps>
    fromKind: string
    createFrom?: (source:ResourceKind) => ResourceKind,
    validateMapping?:(connection:BlockConnectionSpec<V>, from:ResourceKind<T>, to: ResourceKind<T>, fromEntities:SchemaEntity[], toEntities:SchemaEntity[]) => string[],
    updateMapping?: (connection:BlockConnectionSpec<V>, from:ResourceKind<T>, to: ResourceKind<T>, fromEntities:SchemaEntity[], toEntities:SchemaEntity[]) => V
    createMapping?: (from:ResourceKind<T>, to:ResourceKind<T>, fromEntities:SchemaEntity[], toEntities:SchemaEntity[]) => V
}

export interface ResourceProviderConfig<T = any,U = any> {
    resolveEntities?: (resource: ResourceKind<U,T>) => string[];
    renameEntityReferences?: (resource: ResourceKind, from:string, to:string) => void;
    converters?: ResourceConverter<U>[];
    componentType?: ComponentType<ResourceConfigProps<T,U>>;
    getCounterValue?: (data: ResourceKind<U, T>) => number;
    hasMethod?: (data: ResourceKind<U, T>, methodId:string) => boolean;
    validate?: (data: ResourceKind<U, T>, entities:SchemaEntity[]) => string[];
}

export interface ResourceConfig<T = any,U = any>  extends ResourceProviderConfig<T,U> {
    kind: string;
    version: string
    title?: string;
    role: ResourceRole;
    type: ResourceType;
    consumableKind?: string;
}