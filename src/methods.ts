/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { HTTPMethod } from './http';
import { TypeLike } from './general';

export interface MethodArgument extends TypeLike {}

export interface RESTMethodArgument extends MethodArgument {
    transport?: string;
}

export interface Method<T extends MethodArgument> {
    description?: string;
    method: HTTPMethod;
    path: string;
    arguments?: {
        [key: string]: T;
    };
    responseType?: TypeLike;
}

export interface RESTMethod extends Method<RESTMethodArgument> {
    description?: string;
    method: HTTPMethod;
    path: string;
    arguments?: {
        [key: string]: RESTMethodArgument;
    };
    responseType?: TypeLike;
}
