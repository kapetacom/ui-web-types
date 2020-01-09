import { Component } from 'react';

import {Type} from "./general";

export interface TargetConfigProps {
    value: Object
    onOptionsChanged: (options:Object) => void
}

export interface TargetConfig {
    kind: string
    name: string
    componentType?: Type<Component<TargetConfigProps,any>>
    validate?: (options:Object) => string[];
}