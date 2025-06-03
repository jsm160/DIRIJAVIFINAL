import { db } from '../firebase'
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import type { Match } from '../interfaces'

//const matchesRef = collection(db, 'matches')


export const addMatchToFirestore = async (
  match: Omit<Match, 'id'>
): Promise<Match> => {
  const docRef = await addDoc(collection(db, 'matches'), match)

  return {
    ...match,
    id: docRef.id
  }
}



export const deleteMatchFromFirestore = async (id: string) => {
  await deleteDoc(doc(db, 'matches', id))
}

export const updateMatchInFirestore = async (match: Match) => {
  const { id, ...data } = match
  await updateDoc(doc(db, 'matches', id), data)
}
