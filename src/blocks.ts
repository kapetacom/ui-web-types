import {Dimensions} from "./shapes";
import {SchemaEntity} from "./schemas";
import {ConnectionMethodsMapping} from "./resource-types";

export interface SchemaKind<T = any, U = any> {
    kind: string
    metadata: U
    spec: T
}


export interface DataWrapper<T = SchemaKind|BlockConnectionSpec> {
    id:string
    getData: () => T
    setData: (data: T) => void
}

export interface BlockWrapper<T = SchemaKind> extends DataWrapper<T> {
    getEntityNames: () => string[]
    addEntity: (entity: SchemaEntity) => void
}

/* RESOURCE */

export interface ResourceMetadata {
    name: string
}

export type ResourceKind<T = any|undefined, U = ResourceMetadata> = SchemaKind<T,U>;

/* BLOCK */

export interface BlockServiceTarget {
    kind: string
    options?: any
}
export enum BlockType{
    SERVICE="service",
    
}

export interface BlockServiceSpec {
    target: BlockServiceTarget
    type:BlockType
    entities?: SchemaEntity[]
    consumers?: ResourceKind[]
    providers?: ResourceKind[]
}

export interface BlockMetadata {
    name: string
    version: string
}

export type BlockKind<T = BlockServiceSpec, U = BlockMetadata> = SchemaKind<T,U>;

/* Plan */
export const PLAN_KIND = 'core.blockware.com/v1/Plan';

export interface PlanMetadata {
    name: string
}

export interface BlockReference {
    ref:string;
}

export interface BlockInstanceSpec {
    id:string;
    name:string;
    block: BlockReference;
    dimensions?: Dimensions;
}

export interface BlockResourceReferenceSpec {
    blockId: string;
    resourceName: string;
}

export interface BlockConnectionSpec<T = ConnectionMethodsMapping> {
    from: BlockResourceReferenceSpec
    to: BlockResourceReferenceSpec,
    mapping?: T
}

export interface PlanSpec {
    blocks?: BlockInstanceSpec[];
    connections?: BlockConnectionSpec[];
}

export type PlanKind = SchemaKind<PlanSpec,PlanMetadata>;
