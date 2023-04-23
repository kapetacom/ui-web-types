import {ComponentType} from "react";
import {Traffic} from "./traffic";
import {BlockDefinition, Connection, Entity, Resource, ResourceType} from "@kapeta/schemas";
import {ProviderBase} from "./general";


export enum ResourceRole {
    CONSUMES = 'CONSUMES',
    PROVIDES = 'PROVIDES'
}

export enum ResourceProviderType {
    INTERNAL = 'INTERNAL',
    OPERATOR = 'OPERATOR',
    EXTENSION = 'EXTENSION'
}

export interface ResourceConnectionMappingChange<T = any,U = any, V = any> {
    source: Resource
    sourceEntities: Entity[]
    target: Resource
    targetEntities: Entity[]
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

export interface ResourceTypeProviderMappingProps<T = any,U = any, V = any> {
    source: Resource
    target: Resource
    value?: V
    sourceEntities: Entity[]
    targetEntities: Entity[]
    title:string
    onDataChanged?: (change: ResourceConnectionMappingChange<T,U,V>) => void
}

export interface ResourceTypeProviderInspectorProps {
    trafficLines: Traffic[]
    mapping: ConnectionMethodsMapping
}

export interface ResourceTypeProviderEditorProps {
    block: BlockDefinition
    creating?:boolean //True if the resource is new
}

export interface IResourceTypeConverter<T = any,V = ConnectionMethodsMapping> {
    mappingComponentType?: ComponentType<ResourceTypeProviderMappingProps>
    inspectComponentType?: ComponentType<ResourceTypeProviderInspectorProps>
    fromKind: string
    createFrom?: (source:Resource) => Resource,
    validateMapping?:(connection:Connection, from:Resource, to: Resource, fromEntities:Entity[], toEntities:Entity[]) => string[],
    updateMapping?: (connection:Connection, from:Resource, to: Resource, fromEntities:Entity[], toEntities:Entity[]) => V
    createMapping?: (from:Resource, to:Resource, fromEntities:Entity[], toEntities:Entity[]) => V
}

export interface IResourceTypeProviderConfig<T = any,U = any> {
    resolveEntities?: (resource: Resource) => string[];
    renameEntityReferences?: (resource: Resource, from:string, to:string) => void;
    converters?: IResourceTypeConverter<U>[];
    componentType?: ComponentType<ResourceTypeProviderEditorProps>;
    getCounterValue?: (data: Resource) => number;
    hasMethod?: (data: Resource, methodId:string) => boolean;
    validate?: (data: Resource, entities:Entity[]) => string[];
}

export interface ResourceTypeShapeProps {
    resource: Resource
    role: ResourceRole;
    index: number;
    readOnly?: boolean;
}

export interface IResourceTypeProvider<T = any,U = any>  extends IResourceTypeProviderConfig<T,U>, ProviderBase<ResourceType> {
    role: ResourceRole;
    type: ResourceProviderType;
    consumableKind?: string;

    //Allows overwriting the shape / rendering of the resource
    shapeComponent?: ComponentType<ResourceTypeShapeProps>
}