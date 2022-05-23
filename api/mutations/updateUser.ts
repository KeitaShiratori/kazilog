import { db } from '../firebase'

export const updateUser = async (_parent: any, _args: any, _context: any) => {
  const { uid } = _context?.user
  const { name } = _args

  await db.collection('users').doc(uid).update({
    name
  })

  return {
    uid,
    name,
  }
}
