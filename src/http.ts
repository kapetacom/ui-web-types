/* GENERIC TYPES*/

export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
    OPTION = 'OPTION',
}

export enum HTTPTransport {
    PATH = 'PATH',
    BODY = 'BODY',
    QUERY = 'QUERY',
    HEADER = 'HEADER',
}

export interface HTTPRequest {
    url: string;
    method: string;
    body: string;
    headers: { [key: string]: string };
}
export interface HTTPResponse {
    code: number;
    body?: string;
    headers: { [key: string]: string };
}
