/* GENERIC TYPES */

import {BlockConnectionSpec} from "./plans";
import {SchemaKind} from "./core";

export enum ItemType {
    BLOCK = "BLOCK",
    RESOURCE = "RESOURCE",
    CONNECTION = "CONNECTION"
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


export interface DataWrapper<T = SchemaKind | BlockConnectionSpec> {
    id: string
    getData: () => T
    setData: (data: T) => void
}
