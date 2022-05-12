import { db } from '../firebase'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { User } from '@/types/generated/graphql'

export const doneKazi = async (_parent: any, _args: any, _context: any) => {
  const { kaziId } = _args
  const { uid } = _context?.user

  const kaziDoc = db.collection('kazi').doc(kaziId)
  const userDoc = db.collection('users').doc(uid)
  const userSnapShot = await userDoc.get()
  const user = userSnapShot.data() as User
  const family = user.family
  const familyId = family?.id

  const timelineDoc = await db.collection('timeline').add({
    user: userDoc,
    family,
    familyId,
    kazi: kaziDoc,
    doneAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  console.log(timelineDoc)

  const timeline = (await timelineDoc.get()).data()

  return {
    id: timelineDoc.id,
    kazi: {
      id: kaziId,
    },
    user: {
      uid: userDoc.id,
      name: user.name,
    },
    doneAt: timeline?.doneAt.toDate().toISOString(),
  }
}
