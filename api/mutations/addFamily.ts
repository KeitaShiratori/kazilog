import { User } from '~/types/generated/graphql'
import { db } from '../firebase'

export const addFamily = async (_parent: any, _args: any, _context: any) => {
  const { uid } = _context?.user
  const { name } = _args

  // family の レコード追加
  const userDocRef = db.collection('users').doc(uid)
  const payload = {
    name,
    users: [userDocRef],
  }
  const familyDoc = await db.collection('family').add(payload)

  // usersにもFamilyを追加
  await userDocRef.update({
    familyId: familyDoc.id,
    family: familyDoc,
  })

  return {
    id: familyDoc.id,
    name: name,
    users: [
      {
        uid: uid,
      },
    ],
  }
}
