import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Player } from '../interfaces'
import logger from '../utils/logger'

interface PlayerState {
  players: Player[]
}

const initialState: PlayerState = {
  players: []
}

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
      logger.info(`Jugador añadido: ${action.payload.name}`);
    },
    deletePlayer: (state, action: PayloadAction<string>) => {
      const index = state.players.findIndex(p => p.id === action.payload);
      if (index !== -1) {
        const deleted = state.players[index];
        state.players.splice(index, 1);
        logger.warn(`Jugador eliminado: ${deleted.name}`);
      }
    },

    updatePlayer: (state, action: PayloadAction<Player>) => {
      const index = state.players.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.players[index] = action.payload;
        logger.info(`Jugador editado: ${action.payload.name}`);
      }
    },
    
  }
})

export const { setPlayers, addPlayer, deletePlayer, updatePlayer } = playerSlice.actions
export default playerSlice.reducer
