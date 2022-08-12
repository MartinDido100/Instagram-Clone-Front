
export interface image{
    id: number,
    user_id: number,
    titulo: string,
    image_path: string,
    uploaded_at: string
}

export interface DashboardItem{
    id: number,
    user_id: number,
    titulo: string,
    image_path: string,
    uploaded_at: string,
    username?: string,
    avatar_path?: string,
    likes: number,
    comment_number: number
    comments: Comment[]
}

export interface Comment{
    id: number,
    user_id: number,
    content: string,
    user: CommentUser,
}

interface CommentUser{
    name: string,
    surname: string,
    username: string,
    avatar_path: string
}

export interface Dashboard{
    ok: boolean,
    data: DashboardItem[]
}

export interface myLikesResp{
    myLikes: myLikes[]
}

export interface myLikes{
    image_id: number
}

export interface Profile{
    ok: boolean,
    id: number,
    name: string,
    images: DashboardItem[],
    follows: number,
    followers: number,
    avatar_path: string
}
