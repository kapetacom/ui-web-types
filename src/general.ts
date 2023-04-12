/* GENERIC TYPES */
import {IconValue, Metadata} from "@kapeta/schemas";

export enum ItemType {
    BLOCK = "BLOCK",
    RESOURCE = "RESOURCE",
    CONNECTION = "CONNECTION"
}

export interface TypeLike {
    type?:string
    ref?:string
}

export interface SchemaKind<T = any, U = Metadata> {
    kind: string
    metadata: U
    spec: T
}

export interface ProviderBase<T = SchemaKind> {
    kind: string
    version: string
    icon?: IconValue
    title?: string
    definition: T
}

export interface Type<T> extends Function {
    new(...args: any[]): T;
}

export interface TypedName {
    name: string
    type: string
}

export interface TypedValue {
    type: string
    value: string
}

export interface Asset<T = SchemaKind> {
    ref: string
    path: string
    kind: string
    data: T
    exists: boolean
    ymlPath: string
    version: string
    editable: boolean
}
