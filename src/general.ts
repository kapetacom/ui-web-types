/* GENERIC TYPES */

import {SchemaKind} from "./blocks";


export enum ItemType {
    BLOCK = "BLOCK",
    RESOURCE = "RESOURCE",
    CONNECTION = "CONNECTION"
}

export interface Type<T> extends Function {
    new (...args: any[]): T;
}

export type ComponentFunction<T> = (props:T) => JSX.Element;

export type ComponentType<T = any,U = any> = Type<React.Component<T,U>>|ComponentFunction<T>

export interface TypedName {
    name: string
    type: string
}


export interface Asset<T = SchemaKind> {
    ref:string
    path:string
    kind:string
    data:T
    exists:boolean
}
