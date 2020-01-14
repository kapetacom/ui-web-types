import { Component } from 'react';

import {Type} from "./general";

export interface TargetConfigProps<T extends Object> {
    value: T
    onOptionsChanged: (options:T) => void
}

export interface TargetConfig<T extends Object> {
    kind: string
    blockKinds: string[]
    name: string
    componentType?: Type<Component<TargetConfigProps<T>,any>>
    validate?: (options:T) => string[];
}