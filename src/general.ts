/* GENERIC TYPES */

export enum ItemType {
    BLOCK = "BLOCK",
    RESOURCE = "RESOURCE",
    CONNECTION = "CONNECTION"
}

import {Metadata} from "@kapeta/schemas";

export interface SchemaKind<T = any, U = Metadata> {
    kind: string
    metadata: U
    spec: T
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
