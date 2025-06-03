import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setMatches, deleteMatch, updateMatch } from '../store/matchSlice'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import type { RootState } from '../store'
import type { Match } from '../interfaces'

import {
  Container, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'

export default function Matches() {
  const { t } = useTranslation()
  const matches = useSelector((state: RootState) => state.matches.matches)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return

    const uid = user.uid
    const q = query(collection(db, 'matches'), where('createdBy', '==', uid))

    const unsubscribe = onSnapshot(q, snapshot => {
      const loaded: Match[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[]
      dispatch(setMatches(loaded))
    })

    return () => unsubscribe()
  }, [dispatch])

  const handleDelete = (id: string) => {
    dispatch(deleteMatch(id))
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingMatch) return

    const formData = new FormData(e.currentTarget)
    const rival = formData.get('rival')?.toString().trim() || ''
    const date = formData.get('date')?.toString() || ''
    const isHome = formData.get('isHome') === 'true'
    const pointsFor = Number(formData.get('pointsFor'))
    const pointsAgainst = Number(formData.get('pointsAgainst'))

    const newErrors: { [key: string]: string } = {}
    if (!rival) newErrors.rival = t('requiredRival')
    if (!date) newErrors.date = t('requiredDate')
    if (isNaN(pointsFor) || pointsFor < 0) newErrors.pointsFor = t('validPoints')
    if (isNaN(pointsAgainst) || pointsAgainst < 0) newErrors.pointsAgainst = t('validPoints')

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
      return
    }

    const updated: Match = {
      ...editingMatch,
      rival,
      date,
      isHome,
      result: isHome
        ? `${pointsFor} - ${pointsAgainst}`
        : `${pointsAgainst} - ${pointsFor}`,
      stats: { pointsFor, pointsAgainst }
    }

    dispatch(updateMatch(updated))
    setEditingMatch(null)
    setFormErrors({})
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>{t('matches')}</Typography>
      <Button variant="contained" onClick={() => navigate('/matches/new')} sx={{ mb: 2 }}>
        ➕ {t('newMatch')}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('rival')}</TableCell>
            <TableCell>{t('date')}</TableCell>
            <TableCell>{t('result')}</TableCell>
            <TableCell>{t('homeAway')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map(match => (
            <TableRow key={match.id}>
              <TableCell>{match.rival}</TableCell>
              <TableCell>{match.date}</TableCell>
              <TableCell>{match.result}</TableCell>
              <TableCell>{match.isHome ? t('home') : t('away')}</TableCell>
              <TableCell>
                <Button onClick={() => setEditingMatch(match)}>✏️</Button>
                <Button onClick={() => handleDelete(match.id)}>🗑️</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de edición */}
      <Dialog open={!!editingMatch} onClose={() => setEditingMatch(null)} maxWidth="sm" fullWidth>
        <form onSubmit={handleUpdate}>
          <DialogTitle>{t('editMatch')}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="rival"
              label={t('rival')}
              defaultValue={editingMatch?.rival}
              error={!!formErrors.rival}
              helperText={formErrors.rival}
            />
            <TextField
              name="date"
              type="date"
              label={t('date')}
              defaultValue={editingMatch?.date}
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.date}
              helperText={formErrors.date}
            />
            <FormControl>
              <InputLabel>{t('homeAway')}</InputLabel>
              <Select
                name="isHome"
                defaultValue={editingMatch?.isHome ? 'true' : 'false'}
                label={t('homeAway')}
              >
                <MenuItem value="true">{t('home')}</MenuItem>
                <MenuItem value="false">{t('away')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="pointsFor"
              type="number"
              label={t('points')}
              defaultValue={editingMatch?.stats.pointsFor}
              error={!!formErrors.pointsFor}
              helperText={formErrors.pointsFor}
            />
            <TextField
              name="pointsAgainst"
              type="number"
              label={t('pointsAgainst')}
              defaultValue={editingMatch?.stats.pointsAgainst}
              error={!!formErrors.pointsAgainst}
              helperText={formErrors.pointsAgainst}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingMatch(null)}>{t('cancel')}</Button>
            <Button type="submit" variant="contained">{t('save')}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
