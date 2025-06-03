// src/tests/Players.test.tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import Players from '../pages/Players'
import { setPlayers } from '../store/playerSlice'

test('renderiza la lista de jugadores', () => {
  store.dispatch(setPlayers([
    {
      id: '1',
      name: 'Juan',
      position: 'Base',
      height: 180,
      jersey: 7,
      stats: { points: 10, rebounds: 5, assists: 3 }
    }
  ]))

  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Players />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  )

  expect(screen.getByText('Juan')).toBeInTheDocument()
  expect(screen.getByText('Base')).toBeInTheDocument()
})
