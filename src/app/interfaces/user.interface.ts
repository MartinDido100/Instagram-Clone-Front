export interface AuthResponse{
    ok: boolean,
    token: string
    msg?: string,
    user?: Usuario
}

export interface UserResponse{
    ok: boolean,
    following?: Usuario[],
    followers?: Usuario[],
    msg?: string
}

export interface Usuario{
    id: number,
    name: string,
    surname: string,
    username: string,
    email?: string,
    avatar_path: string
}