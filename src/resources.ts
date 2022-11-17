
/* RESOURCE */



import type {SchemaKind} from "./core";

export interface ResourceMetadata {
    name: string
}

export type ResourceKind<T = any|undefined, U = ResourceMetadata> = SchemaKind<T,U>;