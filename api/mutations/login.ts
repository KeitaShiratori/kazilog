import { db } from '../firebase'
import jwtDecode from 'jwt-decode'
import { decode } from 'punycode'

const DEFAULT_STATE = (uid: string) => ({
  uid,
  name: '',
  familyId: '',
  email: '',
})
interface DecodedToken {
  email: string
}

export const login = async (_parent: any, _args: any, _context: any) => {
  const { uid } = _context?.user
  const { token } = _args
  const decodedToken = jwtDecode(token) as DecodedToken
  const userDoc = await db.collection('users').doc(uid).get()
  const state = DEFAULT_STATE(uid)

  state.email = decodedToken?.email

  const user = await userDoc.data()

  if (!user) {
    // userが存在しない場合、初回登録なのでuserを作成する
    await db.collection('users').doc(uid).create(state)
    return state
  }

  if (!user.family) {
    return state
  }

  state.name = user.name
  state.familyId = user.family.id
  return state
}
