interface Todo {
    id?: string
    title?: string,
    completed?: boolean,
    created_at?: string,
    user_id?: string
}
interface User {
    id?: string,
    username?: string,
    password?: string,
    token?: string
}