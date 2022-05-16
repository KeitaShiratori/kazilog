import { db } from '../firebase'

const DEFAULT_STATE = (uid: string) => ({
  uid,
  name: '',
  familyId: '',
})

export const login = async (_parent: any, _args: any, _context: any) => {
  const { uid } = _context?.user
  const userDoc = await db.collection('users').doc(uid).get()
  const state = DEFAULT_STATE(uid)

  const user = await userDoc.data()

  if (!user) {
    // userが存在しない場合、初回登録なのでuserを作成する
    await db.collection('users').doc(uid).create(state)
    return state
  }

  if(!user.family){
    return state
  }

  state.name = user.name
  state.familyId = user.family.id
  return state
}
