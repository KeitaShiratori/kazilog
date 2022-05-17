import { db } from '../firebase'
import { DocumentData } from 'firebase/firestore'
import { Timeline, User, DispKazi } from '@/types/generated/graphql'

export const kazisToday = async (_parent: any, _args: any, _context: any) => {
  const uid = _context?.user?.uid
  const resKazisToday = [] as DispKazi[]

  try {
    const doc = await db.collection('users').doc(uid).get()

    const user = doc.data() as User

    if (!user) {
      console.log('@/api/queries/kazisToday no user.', 'uid:', uid)
      return resKazisToday
    }

    const familyRef = user.family as DocumentData

    if (!familyRef) {
      console.log(
        '@/api/queries/kazisToday user has no family.',
        'uid:',
        uid,
        'user:',
        user
      )
      return resKazisToday
    }

    const familyId = familyRef.id

    const today = new Date(Date.now())
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    const timelineRef = await db
      .collection('timeline')
      .where('familyId', '==', familyId)
      .orderBy('doneAt', 'asc')
      .startAt(today)
      .get()

    const kaziRef = await db
      .collection('kazi')
      .where('familyId', '==', familyId)
      .get()

    const timelines = await Promise.all(
      timelineRef.docs.map(async (doc) => {
        const kazi = (await (doc.data().kazi as DocumentData).get()).data()
        const categoryName = (await kazi.category.get()).data().name
        const userName = (await doc.data().user.get()).data().name
        return {
          id: doc.id,
          kazi: {
            id: doc.data().kazi.id,
            category: {
              id: kazi.categoryId,
              name: categoryName,
            },
            name: kazi.name,
            point: kazi.point,
            repeat: kazi.repeat,
          },
          user: {
            uid: doc.data().user.id,
            name: userName,
          },
          memo: doc.data().memo,
          doneAt: doc.data().doneAt,
        }
      })
    )

    const kazis = await Promise.all(
      kaziRef.docs.map(async (doc) => {
        const dat = doc.data()
        const categoryDocRef = dat.category
        const categoryDoc = await categoryDocRef.get()
        const categorySS = categoryDoc.data()
        return {
          id: doc.id,
          category: {
            id: categoryDoc.id,
            name: categorySS.name,
          },
          name: doc.data().name,
          point: doc.data().point,
          repeat: {
            type: doc.data().repeat.type,
            activatedAt: doc.data().repeat.activatedAt.toDate().toISOString(),
          },
        } as DispKazi
      })
    )

    for (const kazi of kazis) {
      const timeline = timelines.find((t: any) => t.kazi.id === kazi.id)
      if (!timeline) continue
      kazi.timelineId = timeline.id
      ;(kazi.user = timeline.user as User),
        (kazi.doneAt = timeline.doneAt?.toDate().toISOString())
      kazi.memo = timeline.memo
    }

    resKazisToday.push(...kazis)
  } catch (e) {
    console.log(e)
  }

  return resKazisToday
}
