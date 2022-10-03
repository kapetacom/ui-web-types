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

export interface SchemaEntityBase {
    type: SchemaEntityType
    name: string
    description?: string
}

export interface SchemaEnum extends SchemaEntityBase {
    type: SchemaEntityType.ENUM
    values: string[]
}

export interface SchemaDTO extends SchemaEntityBase {
    type: SchemaEntityType.DTO
    status?: boolean
    properties: SchemaProperties
}

export type SchemaEntity = SchemaDTO|SchemaEnum;

export interface EntityConfigProps<U = any , T = any> extends SchemaKind<T,U> {
    creating?:boolean //True if the entity is a new one
    onDataChanged: (metadata:U, spec:T) => void
}
