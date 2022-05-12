import { db } from '../firebase'
import { DocumentData, DocumentSnapshot } from 'firebase/firestore'
import { User, Category } from '@/types/generated/graphql'

export const categories = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const doc = await db.collection('users').doc(uid).get()

  const user = doc.data() as User
  const familyRef = user.family as DocumentData
  const familyId = familyRef.id

  const categoryRef = await db
    .collection('category')
    .where('familyId', '==', familyId)
    .get()

  const dat = categoryRef.docs[0].data()
  return await Promise.all(
    categoryRef.docs.map(
      async (doc: DocumentData) =>
        ({
          id: doc.id,
          name: doc.data().name,
        } as Category)
    )
  )
}
