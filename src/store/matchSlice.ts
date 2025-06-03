import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Match } from '../interfaces'
import logger from '../utils/logger'

interface MatchState {
  matches: Match[]
}

const initialState: MatchState = {
  matches: []
}

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload
    },
    addMatch: (state, action: PayloadAction<Match>) => {
      state.matches.push(action.payload);
      logger.info(`Añadido partido contra ${action.payload.rival}`)
    },
    deleteMatch: (state, action: PayloadAction<string>) => {
      const deleted = state.matches.find(m => m.id === action.payload)
      state.matches = state.matches.filter(m => m.id !== action.payload)
      logger.warn(`Eliminado partido contra ${deleted?.rival || 'desconocido'}`)
    },
    updateMatch: (state, action: PayloadAction<Match>) => {
      const index = state.matches.findIndex(m => m.id === action.payload.id)
      if (index !== -1) {
        state.matches[index] = action.payload
        logger.info(`Actualizado partido contra ${action.payload.rival}`)
      }
    }
  }
})

export const { addMatch, deleteMatch, updateMatch, setMatches } = matchSlice.actions
export default matchSlice.reducer
