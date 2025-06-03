import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import type { LoginFormData } from '../interfaces'
import { useTranslation } from 'react-i18next'
import logger from '../utils/logger'
//import * as firebaseAuth from 'firebase/auth'
//import { auth } from '../firebase'
import { loginWithEmail } from '../services/firebaseAuthWrapper'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper
} from '@mui/material'

export default function Login() {
  const { t } = useTranslation()
  const { register, handleSubmit } = useForm<LoginFormData>()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormData) => {
    //const auth = getAuth()
    try {
      const userCredential = await loginWithEmail(data.username, data.password)
      const user = userCredential.user
      dispatch(login({ uid: user.uid, email: user.email || '' }))
      navigate('/')
      logger.info(`Login correcto: ${user.email}`)
    } catch (error) {
      alert(t('loginError') || 'Error al iniciar sesión')
      logger.error('Login fallido:', error)
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          {t('login')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label={t('username')}
            type="email"
            margin="normal"
            {...register('username')}
          />
          <TextField
            fullWidth
            label={t('password')}
            type="password"
            margin="normal"
            {...register('password')}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            {t('submit')}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
