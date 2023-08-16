import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { todoApi } from './todosApi'
import { authApi } from './authApi'
import userReducer from './stateReducers/userReducer'

export const store = configureStore({
    reducer: {
        [todoApi.reducerPath]: todoApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        'user': userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(todoApi.middleware).concat(authApi.middleware)
})

setupListeners(store.dispatch)