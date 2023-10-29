/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

export interface Identity {
    id: string;
    name: string;
    handle: string;
    type: string;
    data: object;
}

export interface MemberIdentity {
    identity: Identity;
    scopes: string[];
}
