import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from "c:/Users/javis/Desktop/MASTER/DIRI/DIRIFINAL/basketball-manager/src/store/index"
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

test('renderiza título del equipo', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Home />
        </I18nextProvider>
      </MemoryRouter>
    </Provider>
  )

  expect(screen.getByText(/equipo/i)).toBeInTheDocument()

})
