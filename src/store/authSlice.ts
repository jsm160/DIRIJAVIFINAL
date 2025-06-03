import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import logger from '../utils/logger'

interface AuthState {
  isAuthenticated: boolean
  uid?: string
  email?: string
}

const initialState: AuthState = {
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ uid: string, email: string }>) => {
      state.isAuthenticated = true
      state.uid = action.payload.uid
      state.email = action.payload.email
      logger.info(`Usuario autenticado: ${action.payload.email}`)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.uid = undefined
      state.email = undefined
      logger.info('Usuario cerró sesión')
    }
  }
})


export const { login, logout } = authSlice.actions
export default authSlice.reducer
