import { UserInfo } from 'firebase/auth'

export type AuthState = {
  isLoggedIn: boolean
  uid: string | null
  user: UserInfo | null
  familyId: string | null
}
