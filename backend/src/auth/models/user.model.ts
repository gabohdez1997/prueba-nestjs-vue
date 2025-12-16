




export interface JwtPayload {
    userId: number;
    username: string;
}

export interface LoginResponse {
    accessToken: string;
    username: string;
    userId: number;
}