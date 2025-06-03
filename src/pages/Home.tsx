import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../store'
import { logout } from '../store/authSlice'
import { useTranslation } from 'react-i18next'
import { onSnapshot, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect } from 'react'
import { setMatches } from '../store/matchSlice'
import type { Match } from '../interfaces'

import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stack
} from '@mui/material'

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const matches = useSelector((state: RootState) => state.matches.matches)

  const total = matches.length
  const victories = matches.filter(m => (m.stats?.pointsFor ?? 0) > (m.stats?.pointsAgainst ?? 0)).length
  const defeats = matches.filter(m => (m.stats?.pointsFor ?? 0) < (m.stats?.pointsAgainst ?? 0)).length
  const avgFor = total ? matches.reduce((sum, m) => sum + (m.stats?.pointsFor ?? 0), 0) / total : 0
  const avgAgainst = total ? matches.reduce((sum, m) => sum + (m.stats?.pointsAgainst ?? 0), 0) / total : 0

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'matches'), (snapshot) => {
      const matchesFromDB = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[]
      dispatch(setMatches(matchesFromDB))
    })

    return () => unsubscribe()
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        {t('team')}
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Paper sx={{ p: 1, flex: 1, mr: 1 }}>{t('victories')} / {t('defeats')}</Paper>
          <Paper sx={{ p: 1, flex: 1 }}>{victories} / {defeats}</Paper>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Paper sx={{ p: 1, flex: 1, mr: 1 }}>{t('avgPointsFor')}</Paper>
          <Paper sx={{ p: 1, flex: 1 }}>{avgFor.toFixed(1)}</Paper>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Paper sx={{ p: 1, flex: 1, mr: 1 }}>{t('avgPointsAgainst')}</Paper>
          <Paper sx={{ p: 1, flex: 1 }}>{avgAgainst.toFixed(1)}</Paper>
        </Box>
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#42a5f5',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2
          }}
          onClick={() => navigate('/players')}
        >
          {t('players').toUpperCase()}
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#42a5f5',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2
          }}
          onClick={() => navigate('/matches')}
        >
          {t('matches').toUpperCase()}
        </Button>
      </Stack>


      <Button variant="outlined" color="error" onClick={handleLogout}>
        {t('logout')}
      </Button>
    </Container>
  )
}
