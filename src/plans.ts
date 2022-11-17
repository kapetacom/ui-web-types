import {Dimensions} from "./shapes";
import {Metadata, SchemaKind} from "./core";
import {ConnectionMethodsMapping} from "./resource-types";


export const PLAN_KIND = 'core/plan';

export interface PlanMetadata extends Metadata {

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
