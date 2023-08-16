import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './api/api';
const token = localStorage.getItem("user_token")
const baseQueryHeaders = token ? { Authorization: `${token}` } : undefined;
export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL, headers: baseQueryHeaders
    }),
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], string>({
            query: (user_id) => `todos/${user_id}`,
        }),
        addTodo: builder.mutation<Todo, Partial<Todo>>({
            query: (newTodo) => ({
                url: `todos`,
                method: 'POST',
                body: newTodo,
            }),
        }),
        deleteTodo: builder.mutation<void, { id: string, user_id: string }>({
            query: ({ id, user_id }) => ({
                url: `todos/${id}`,
                method: 'DELETE',
                body: { user_id }
            }),
        }),
        updateTodo: builder.mutation<void, { id: string, data: Partial<Todo> }>({
            query: ({ id, data }) => ({
                url: `todos/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation } = todoApi;