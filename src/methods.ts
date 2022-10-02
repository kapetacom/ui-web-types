import {HTTPMethod} from "./http";
import {SchemaEntryType} from "./schemas";

export interface MethodArgument {
    type: SchemaEntryType
}

export interface RESTMethodArgument extends MethodArgument{
    transport?: string
}

export interface Method<T extends MethodArgument> {
    description?: string
    method: HTTPMethod
    path: string
    arguments?: {
        [key: string]: T
    }
    responseType?: SchemaEntryType
}

export interface RESTMethod extends Method<RESTMethodArgument> {
    description?: string
    method: HTTPMethod
    path: string
    arguments?: {
        [key: string]: RESTMethodArgument
    }
    responseType?: SchemaEntryType
}