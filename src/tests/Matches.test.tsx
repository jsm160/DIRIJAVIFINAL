// src/tests/Matches.test.tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import Matches from '../pages/Matches'
import { setMatches } from '../store/matchSlice'

test('renderiza la lista de partidos', () => {
  store.dispatch(setMatches([
    {
      id: 'match1',
      rival: 'Tigers',
      date: '2025-06-01',
      isHome: true,
      result: '80 - 70',
      stats: { pointsFor: 80, pointsAgainst: 70 },
      createdBy: 'test-uid'
    }
  ]))

  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Matches />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  )

  expect(screen.getByText('Tigers')).toBeInTheDocument()
  expect(screen.getByText('80 - 70')).toBeInTheDocument()
})
