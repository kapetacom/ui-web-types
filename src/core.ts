
export interface Metadata {
    name: string
    title?: string
}

export interface SchemaKind<T = any, U = any> {
    kind: string
    metadata: U
    spec: T
}