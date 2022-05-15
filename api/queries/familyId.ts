import { db } from '../firebase'
import { User } from '@/types/generated/graphql'

export const familyId = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const familyId = { id: '' }

  if (!uid) return familyId

  const doc = await db.collection('users').doc(uid).get()

  const user = doc.data() as User
  familyId.id = user.family?.id ?? ''

  return familyId
}
