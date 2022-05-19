import { db } from '../firebase'
import { Family } from '@/types/generated/graphql'

export const searchFamily = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const { email } = _args
  const defaultRes = [] as Family[]

  try {
    const querySs = await db
      .collection('users')
      .where('email', '==', email)
      .get()
    if (querySs.empty) return defaultRes

    await Promise.all(
      querySs.docs.map(async (doc) => {
        const user = doc.data()
        if (user?.family) {
          const familyRef = await user.family.get()
          const familySs = familyRef.data()
          const familyId = familyRef.id
          const familyName = familySs.name
          if (familyId && familyName) {
            defaultRes.push({
              id: familyId,
              name: familyName,
            })
          }
        }
      })
    )
  } catch (e) {
    console.log(e)
  }

  return defaultRes
}
