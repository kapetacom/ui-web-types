import { HTTPRequest, HTTPResponse } from './http';

export interface Traffic {
    connectionId: string;
    consumerMethodId: string;
    created: number;
    ended: number;
    error: string;
    id: string;
    providerMethodId: string;
    request: HTTPRequest;
    response?: HTTPResponse;
}
