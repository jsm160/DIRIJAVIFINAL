import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { NewPlayerFormData } from '../interfaces'
import { useTranslation } from 'react-i18next'
import { addPlayerToFirestore } from '../services/playerService'
import { getAuth } from 'firebase/auth'

import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box
} from '@mui/material'

export default function NewPlayer() {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors } } = useForm<NewPlayerFormData>()
  const navigate = useNavigate()

  const onSubmit = async (data: NewPlayerFormData) => {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      alert(t('notLoggedIn'))
      return
    }

    const uid = currentUser.uid

    const newPlayer = {
      name: data.name,
      position: data.position,
      height: Number(data.height),
      jersey: Number(data.jersey),
      stats: {
        points: Number(data.points),
        rebounds: Number(data.rebounds),
        assists: Number(data.assists)
      },
      createdBy: uid
    }

    try {
      await addPlayerToFirestore(newPlayer)
      navigate('/players')
    } catch (error) {
      console.error('Error al guardar el jugador en Firebase:', error)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('newPlayer')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label={t('name')}
          {...register('name', { required: t('requiredName') })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <FormControl fullWidth error={!!errors.position}>
          <InputLabel>{t('position')}</InputLabel>
          <Select
            defaultValue=""
            label={t('position')}
            {...register('position', { required: t('requiredPosition') })}
          >
            <MenuItem value="Base">{t('base')}</MenuItem>
            <MenuItem value="Escolta">{t('shootingGuard')}</MenuItem>
            <MenuItem value="Alero">{t('smallForward')}</MenuItem>
            <MenuItem value="Ala-Pivot">{t('powerForward')}</MenuItem>
            <MenuItem value="Pívot">{t('center')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="number"
          label={`${t('height')} (cm)`}
          {...register('height', {
            required: t('requiredHeight'),
            min: { value: 100, message: t('minHeight') }
          })}
          error={!!errors.height}
          helperText={errors.height?.message}
        />

        <TextField
          type="number"
          label={t('jersey')}
          {...register('jersey', {
            required: t('requiredJersey'),
            min: 0,
            max: 99
          })}
          error={!!errors.jersey}
          helperText={errors.jersey && t('jerseyRange')}
        />

        <TextField
          type="number"
          label={t('points')}
          {...register('points', {
            min: { value: 0, message: t('noNegative') }
          })}
          error={!!errors.points}
          helperText={errors.points?.message}
        />

        <TextField
          type="number"
          label={t('rebounds')}
          {...register('rebounds', {
            min: { value: 0, message: t('noNegative') }
          })}
          error={!!errors.rebounds}
          helperText={errors.rebounds?.message}
        />

        <TextField
          type="number"
          label={t('assists')}
          {...register('assists', {
            min: { value: 0, message: t('noNegative') }
          })}
          error={!!errors.assists}
          helperText={errors.assists?.message}
        />

        <Button variant="contained" type="submit">
          {t('save')}
        </Button>
      </Box>
    </Container>
  )
}
