import { db } from '../firebase'
import { Timestamp } from 'firebase-admin/firestore'
import { DispKazi, Kazi, User } from '@/types/generated/graphql'

export const addKazi = async (_parent: any, _args: any, _context: any) => {
  const { name, categoryId, point, repeatType, activatedAt } = _args
  const { uid } = _context?.user

  const categoryDocRef = db.collection('category').doc(categoryId)
  const userDoc = db.collection('users').doc(uid)
  const userSnapShot = await userDoc.get()
  const user = userSnapShot.data() as User
  const family = user.family
  const familyId = family?.id

  const docRef = await db.collection('kazi').add({
    family,
    familyId,
    name,
    point,
    categoryId,
    category: categoryDocRef,
    repeat: {
      type: repeatType,
      activatedAt: Timestamp.fromDate(new Date(activatedAt)),
    },
  })

  console.log(docRef)

  const doc = await docRef.get()
  const dat = doc.data() as DispKazi
  const categoryDoc = await categoryDocRef.get()
  const categoryDat = categoryDoc.data()

  return {
    id: doc.id,
    category: {
      id: categoryDoc.id,
      name: categoryDat?.name,
    },
    name: dat.name,
    point: dat.point,
    repeat: {
      type: dat.repeat?.type,
      // @ts-ignore
      activatedAt: dat.repeat?.activatedAt.toDate().toISOString(),
    },
  }
}
