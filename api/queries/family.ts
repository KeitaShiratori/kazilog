import { db } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { User } from '@/types/generated/graphql'

export const family = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const doc = await db.collection('users').doc(uid).get()

  const user = doc.data() as User
  const familyRef = user.family as DocumentData
  const family = (await familyRef.get()).data()
  const userNames = await Promise.all(
    family.users.map(async (docRef: DocumentData) => {
      return { name: (await docRef.get()).data().name }
    })
  )
  family.users = userNames
  family.id = familyRef.id
  return family
}
