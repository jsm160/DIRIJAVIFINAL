import { useDispatch, useSelector } from 'react-redux'
import { deletePlayer, updatePlayer, setPlayers } from '../store/playerSlice'
import type { RootState } from '../store'
import type { Player } from '../interfaces'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  deletePlayerFromFirestore,
  updatePlayerInFirestore
} from '../services/playerService'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'

import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function Players() {
  const { t } = useTranslation()
  const players = useSelector((state: RootState) => state.players.players)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  useEffect(() => {
    const uid = getAuth().currentUser?.uid
    if (!uid) return

    const q = query(collection(db, 'players'), where('createdBy', '==', uid))
    const unsubscribe = onSnapshot(q, snapshot => {
      const playersFromFirestore = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Player[]
      dispatch(setPlayers(playersFromFirestore))
    })

    return () => unsubscribe()
  }, [dispatch])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t('confirmDelete') || '¿Estás seguro de que quieres eliminar este elemento?')
    if (!confirmed) return
    try{
      await deletePlayerFromFirestore(id)
      dispatch(deletePlayer(id))
    }catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPlayer) return

    const formData = new FormData(e.currentTarget)
    const points = Number(formData.get('points'))
    const rebounds = Number(formData.get('rebounds'))
    const assists = Number(formData.get('assists'))

    if (points < 0 || rebounds < 0 || assists < 0) {
      alert(t('noNegative'))
      return
    }

    const updated: Player = {
      ...editingPlayer,
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      height: Number(formData.get('height')),
      jersey: Number(formData.get('jersey')),
      stats: { points, rebounds, assists }
    }

    await updatePlayerInFirestore(updated)
    dispatch(updatePlayer(updated))
    setEditingPlayer(null)
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('players')}
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => navigate('/players/new')}
      >
        ➕ {t('newPlayer')}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('username')}</TableCell>
            <TableCell>{t('position')}</TableCell>
            <TableCell>{t('height')}</TableCell>
            <TableCell>{t('points')}</TableCell>
            <TableCell>{t('rebounds')}</TableCell>
            <TableCell>{t('assists')}</TableCell>
            <TableCell>{t('edit')} / {t('delete')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players
            .filter(player => player.id?.trim() !== '')
            .map(player => (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.height} cm</TableCell>
                <TableCell>{player.stats.points}</TableCell>
                <TableCell>{player.stats.rebounds}</TableCell>
                <TableCell>{player.stats.assists}</TableCell>
                <TableCell>
                  <Tooltip title={t('edit')}>
                    <IconButton onClick={() => setEditingPlayer(player)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('delete')}>
                    <IconButton onClick={() => handleDelete(player.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingPlayer} onClose={() => setEditingPlayer(null)} fullWidth>
        <DialogTitle>{t('edit')} {editingPlayer?.name}</DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField name="name" label={t('name')} defaultValue={editingPlayer?.name} fullWidth />
            <TextField
              name="position"
              label={t('position')}
              defaultValue={editingPlayer?.position}
              select
              fullWidth
            >
              <MenuItem value="Base">{t('base')}</MenuItem>
              <MenuItem value="Escolta">{t('shootingGuard')}</MenuItem>
              <MenuItem value="Alero">{t('smallForward')}</MenuItem>
              <MenuItem value="Ala-Pivot">{t('powerForward')}</MenuItem>
              <MenuItem value="Pívot">{t('center')}</MenuItem>
            </TextField>
            <TextField name="height" type="number" label={t('height')} defaultValue={editingPlayer?.height} />
            <TextField name="jersey" type="number" label={t('jersey')} defaultValue={editingPlayer?.jersey} />
            <TextField name="points" type="number" label={t('points')} defaultValue={editingPlayer?.stats.points} />
            <TextField name="rebounds" type="number" label={t('rebounds')} defaultValue={editingPlayer?.stats.rebounds} />
            <TextField name="assists" type="number" label={t('assists')} defaultValue={editingPlayer?.stats.assists} />
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained">{t('save')}</Button>
            <Button onClick={() => setEditingPlayer(null)}>{t('cancel')}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
  ⬅️     {t('backToHome') || 'Volver a inicio'}
      </Button>
    </Container>
  )
}
