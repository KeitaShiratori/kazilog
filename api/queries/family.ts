import { db } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { Family, User } from '@/types/generated/graphql'

export const family = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const resFamily = {
    id: '',
    name: '',
    users: [] as User[],
  } as Family

  try {
    const doc = await db.collection('users').doc(uid).get()
    const user = doc.data() as User

    if (!user) {
      console.log('@/api/queries/family no user.', 'uid:', uid)
      return resFamily
    }

    const familyRef = user.family as DocumentData

    if (!familyRef) {
      console.log(
        '@/api/queries/family user has no family.',
        'uid:',
        uid,
        'user:',
        user
      )
      return resFamily
    }

    resFamily.id = familyRef.id
    const family = (await familyRef.get()).data()

    if (!family) {
      console.log(
        "@/api/queries/family user's family is not found.",
        'uid:',
        uid,
        'user:',
        user
      )
      return resFamily
    }

    resFamily.name = family.name
    const userNames = await Promise.all(
      family.users.map(async (docRef: DocumentData) => {
        const doc = await docRef.get()
        const dat = doc.data()
        return {
          uid: doc.id,
          name: dat.name,
        }
      })
    ) as User[]
    resFamily.users = userNames
  } catch (e) {
    console.log('@/api/queries/family error.')
    console.log(e)
  }

  return resFamily
}
