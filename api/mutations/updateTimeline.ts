import { db } from '../firebase'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const updateTimeline = async (
  _parent: any,
  _args: any,
  _context: any
) => {
  const { id, memo, uid, userName, doneAt } = _args

  const res = await db
    .collection('timeline')
    .doc(id)
    .update({
      memo,
      user: db.collection('users').doc(uid),
      doneAt: Timestamp.fromDate(new Date(doneAt)),
      updatedAt: FieldValue.serverTimestamp(),
    })
}
