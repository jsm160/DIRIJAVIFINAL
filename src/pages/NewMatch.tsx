import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAuth } from 'firebase/auth'
import { addMatchToFirestore } from '../services/matchService'
import type { MatchFormData, Match } from '../interfaces'

import {
  Container, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material'

export default function NewMatch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MatchFormData>()

  const onSubmit = async (data: MatchFormData) => {
    const uid = getAuth().currentUser?.uid
    if (!uid) {
      alert(t('notLoggedIn'))
      return
    }

    const isHome = data.isHome === 'true'
    const pointsFor = Number(data.pointsFor)
    const pointsAgainst = Number(data.pointsAgainst)

    const match: Omit<Match, 'id'> = {
      rival: data.rival.trim(),
      date: data.date,
      isHome,
      result: isHome
        ? `${pointsFor} - ${pointsAgainst}`
        : `${pointsAgainst} - ${pointsFor}`,
      stats: { pointsFor, pointsAgainst },
      createdBy: uid
    }

    try {
      await addMatchToFirestore(match)
      navigate('/matches')
    } catch (error) {
      console.error('Error al guardar el partido en Firebase:', error)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>{t('newMatch')}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <TextField
          label={t('rival')}
          {...register('rival', { required: t('requiredRival') })}
          error={!!errors.rival}
          helperText={errors.rival?.message}
        />

        <TextField
          label={t('date')}
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register('date', { required: t('requiredDate') })}
          error={!!errors.date}
          helperText={errors.date?.message}
        />

        <FormControl error={!!errors.isHome}>
          <InputLabel>{t('homeAway')}</InputLabel>
          <Select
            defaultValue=""
            label={t('homeAway')}
            {...register('isHome', { required: true })}
          >
            <MenuItem value="true">{t('home')}</MenuItem>
            <MenuItem value="false">{t('away')}</MenuItem>
          </Select>
          {errors.isHome && <FormHelperText>{t('requiredField')}</FormHelperText>}
        </FormControl>

        <TextField
          label={t('pointsFor')}
          type="number"
          {...register('pointsFor', { min: { value: 0, message: t('validPoints') } })}
          error={!!errors.pointsFor}
          helperText={errors.pointsFor?.message}
        />

        <TextField
          label={t('pointsAgainst')}
          type="number"
          {...register('pointsAgainst', { min: { value: 0, message: t('validPoints') } })}
          error={!!errors.pointsAgainst}
          helperText={errors.pointsAgainst?.message}
        />

        <Button type="submit" variant="contained">{t('save')}</Button>
      </form>
    </Container>
  )
}
