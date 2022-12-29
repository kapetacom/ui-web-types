import { Component } from 'react';

import {Type} from "./general";

export interface TargetConfigProps<T = Object> {
    value: T
    onOptionsChanged: (options:T) => void
}

export interface TargetConfig<T = Object> {
    kind: string
    version: string
    blockKinds: string[]
    title?: string
    componentType?: Type<Component<TargetConfigProps<T>,any>>
    validate?: (options:T) => string[];
}