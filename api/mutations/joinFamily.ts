import { DocumentReference, Firestore } from 'firebase-admin/firestore'
import { Family, Maybe, User } from '~/types/generated/graphql'
import { db } from '../firebase'

interface Payload {
  name?: string
  users?: FirebaseFirestore.DocumentReference[]
}
export const joinFamily = async (_parent: any, _args: any, _context: any) => {
  const { uid } = _context?.user
  const { id, name } = _args

  const userRef = db.collection('users').doc(uid)
  const userSs = await userRef.get()
  const user = userSs.data() as User

  // family の登録データ
  const payload = {} as Payload
  let result

  if (name) {
    // 引数にnameがある場合、※idはないはず。
    // 自分に紐付く既存のfamilyが存在するかチェック
    // 入力されたnameでfamily.nameを登録する
    payload.name = name
    if (user.family) {
      result = await db.collection('family').doc(user.family.id).update(payload)
      return {
        id: user.family.id,
        name: payload.name,
        users: user.family.users,
      }
    } else {
      // まだ自分のfamilyがない場合、usersに自分を追加する
      payload.users = [userRef]
      result = await db.collection('family').add(payload)
      // usersにもFamilyを追加
      await userRef.update({
        familyId: result.id,
        family: result,
      })
      return {
        id: result.id,
        name: payload.name,
        users: payload.users?.map((doc) => ({
          uid: doc.id,
        })),
      }
    }
  } else if (id) {
    // 引数にidがある場合
    // 既存のfamilyを検索してusersに自分を追加
    const familyRef = db.collection('family').doc(id)
    const familySs = await familyRef.get()
    const family = familySs.data()
    // @ts-ignore
    payload.users = family.users
    // @ts-ignore
    payload.users.push(userRef)
    result = await familyRef.update(payload)
    // usersにもFamilyを追加
    await userRef.update({
      familyId: id,
      family: familyRef,
    })
    return {
      id,
      // @ts-ignore
      name: family.name,
      users: payload.users?.map((doc) => ({
        uid: doc.id,
      })),
    }
  }
}
