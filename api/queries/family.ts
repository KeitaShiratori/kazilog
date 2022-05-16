import { db } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { Family, User } from '@/types/generated/graphql'

export const family = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const resFamily = {
    id: '',
    name: '',
    users: [],
  } as Family

  try {
    const doc = await db.collection('users').doc(uid).get()
    const user = doc.data() as User

    if (!user) return resFamily

    const familyRef = user.family as DocumentData

    if (!familyRef) return resFamily

    resFamily.id = familyRef.id
    const family = (await familyRef.get()).data()

    if (!family) return resFamily

    resFamily.name = family.name
    const userNames = await Promise.all(
      family.users.map(async (docRef: DocumentData) => {
        return { name: (await docRef.get()).data().name }
      })
    )
    resFamily.users = userNames
  } catch (e) {
    console.log(e)
  }

  return resFamily
}
