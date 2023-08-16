import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from './api/api';

export const authApi = createApi({
    reducerPath: 'authReducer',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        login: builder.mutation<User, Partial<User>>({
            query: (user) => ({
                url: 'users/login',
                method: 'POST',
                body: user,
            }),
        }),
        register: builder.mutation<User, Partial<User>>({
            query: (user) => ({
                url: 'users/register',
                method: 'POST',
                body: user,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;