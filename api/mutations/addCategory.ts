import { db } from '../firebase'
import { Category, User } from '@/types/generated/graphql'

export const addCategory = async (_parent: any, _args: any, _context: any) => {
  const { name } = _args
  const { uid } = _context?.user

  const userDoc = db.collection('users').doc(uid)
  const userSnapShot = await userDoc.get()
  const user = userSnapShot.data() as User
  const family = user.family
  const familyId = family?.id

  const docRef = await db.collection('category').add({
    family,
    familyId,
    name,
  })

  console.log(docRef)

  const doc = await docRef.get()
  const dat = doc.data() as Category

  return {
    id: doc.id,
    name: dat.name,
  }
}
