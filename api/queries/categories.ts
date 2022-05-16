import { db } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { User, Category } from '@/types/generated/graphql'

export const categories = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const resCategories = [] as Category[]

  try {
    const doc = await db.collection('users').doc(uid).get()

    const user = doc.data() as User
    const familyRef = user.family as DocumentData
    const familyId = familyRef.id

    const categoryRef = await db
      .collection('category')
      .where('familyId', '==', familyId)
      .get()

    const categories = await Promise.all(
      categoryRef.docs.map(
        async (doc: DocumentData) =>
          ({
            id: doc.id,
            name: doc.data().name,
          } as Category)
      )
    )
    resCategories.push(...categories)
  } catch (e) {
    console.log(e)
  }

  return resCategories
}
