

export interface JwtPayload {
    sub: string;            // user.id
    email: string;
    username: string;
    roles: string[];
    avatar: string | null | undefined;
    iat?: number;           // issued at
    exp?: number;           // expiration
    aud?: string;
    iss?: string;
    uaIdHash?: string;     
}

export interface CurrentUser {
    userId: string;
    email: string;
    username: string;
}