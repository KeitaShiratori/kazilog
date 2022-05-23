import { db } from '../firebase'
import { User } from '@/types/generated/graphql'

export const familyId = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const resFamilyId = { id: '' }

  try {
    const doc = await db.collection('users').doc(uid).get()
    const user = doc.data() as User
    if (user && user.family && user.family.id) resFamilyId.id = user.family.id
  } catch (e) {
    console.log(e)
  }

  return resFamilyId
}
