import {ComponentType} from 'react';

export interface TargetConfig<T = Object> {
    kind: string
    version: string
    blockKinds: string[]
    title?: string
    componentType?: ComponentType
    validate?: (options:T) => string[];
}