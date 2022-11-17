import {SchemaEntity} from "./schemas";
import {DataWrapper, TypedValue} from "./general";
import {ResourceKind} from "./resources";
import {Metadata, SchemaKind} from "./core";


export interface BlockWrapper<T = SchemaKind> extends DataWrapper<T> {
    getEntityNames: () => string[]
    addEntity: (entity: SchemaEntity) => void
}


export interface BlockServiceTarget {
    kind: string
    options?: any
}
export enum BlockType {
    SERVICE="service",
}

export interface BlockServiceSpec {
    target: BlockServiceTarget
    type:BlockType
    entities?: {
        source: TypedValue,
        types: SchemaEntity[]
    }
    consumers?: ResourceKind[]
    providers?: ResourceKind[]
}


export interface BlockMetadata extends Metadata {

}

export type BlockKind<T = BlockServiceSpec, U = BlockMetadata> = SchemaKind<T,U>;
