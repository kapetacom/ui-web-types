import type { SchemaKind } from './blocks';

/* SCHEMA TYPES */

export type SchemaProperties = {[key:string]:SchemaEntry};
export type SchemaEntryType = string|{$ref:string};

export enum SchemaEntityType {
    DTO = 'dto',
    ENUM = 'enum'
}

export interface SchemaEntry {
    type: SchemaEntryType
    description?: string
    items?: SchemaEntry
    properties?: SchemaProperties
    required?: string[]
    enum?: string[]
}

export interface SchemaEntity {
    type: SchemaEntityType
    name: string
    description?: string
}

export interface SchemaEnum extends SchemaEntity {
    values: string[]
}

export interface SchemaDTO extends SchemaEntity {
    status?: boolean
    properties: SchemaProperties
}

export interface EntityConfigProps<U = any , T = any> extends SchemaKind<T,U> {
    creating?:boolean //True if the entity is a new one
    onDataChanged: (metadata:U, spec:T) => void
}
