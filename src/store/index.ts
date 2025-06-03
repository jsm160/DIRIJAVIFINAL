// src/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage por defecto
import { combineReducers } from 'redux'
import authReducer from './authSlice'
import playerReducer from './playerSlice'
import matchReducer from './matchSlice'

// Configuración persistente para el slice auth
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // solo persistimos auth
}

const rootReducer = combineReducers({
  auth: authReducer,
  players: playerReducer,
  matches: matchReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false // necesario para redux-persist
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
