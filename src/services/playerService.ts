import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { Player } from '../interfaces'
import { getAuth } from 'firebase/auth'

// Añadir jugador
export const addPlayerToFirestore = async (player: Omit<Player, 'id'>): Promise<Player> => {
  const uid = getAuth().currentUser?.uid
  if (!uid) throw new Error('Usuario no autenticado')

  const docRef = await addDoc(collection(db, 'players'), {
    ...player,
    createdBy: uid
  })

  return { ...player, id: docRef.id }
}



// Obtener todos los jugadores
export const fetchPlayersFromFirestore = async (): Promise<Player[]> => {
  const snapshot = await getDocs(collection(db, 'players'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player))
}

// Eliminar
export const deletePlayerFromFirestore = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'players', id))
}

// Actualizar
export const updatePlayerInFirestore = async (player: Player): Promise<void> => {
  const { id, ...data } = player
  await updateDoc(doc(db, 'players', id), data)
}


