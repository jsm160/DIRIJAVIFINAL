import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../pages/Login'
import { Provider } from 'react-redux'
import { store } from "c:/Users/javis/Desktop/MASTER/DIRI/DIRIFINAL/basketball-manager/src/store/index"
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import * as firebaseWrapper from '../services/firebaseAuthWrapper'

test('renderiza el formulario de login', () => {
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  )

    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar|submit/i })).toBeInTheDocument()

})

test('muestra alerta si las credenciales son incorrectas', async () => {
  // Mock de alert
  window.alert = vi.fn()

  // Mock de Firebase: forzar error
vi.spyOn(firebaseWrapper, 'loginWithEmail').mockRejectedValueOnce(new Error('Credenciales incorrectas'))

  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  )

  await userEvent.type(screen.getByLabelText(/usuario/i), 'incorrecto')
  await userEvent.type(screen.getByLabelText(/contraseña/i), 'mala')
  await userEvent.click(screen.getByRole('button', { name: /entrar|submit/i }))

  expect(window.alert).toHaveBeenCalledWith('Credenciales incorrectas') // si i18n está configurado así
})
