import { EntityProperty } from "@kapeta/schemas";
import {HTTPMethod} from "./http";



export interface MethodArgument {
    type: EntityProperty
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
    responseType?: EntityProperty
}

export interface RESTMethod extends Method<RESTMethodArgument> {
    description?: string
    method: HTTPMethod
    path: string
    arguments?: {
        [key: string]: RESTMethodArgument
    }
    responseType?: EntityProperty
}