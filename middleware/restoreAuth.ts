import jwtDecode from 'jwt-decode'
import { Middleware, Context } from '@nuxt/types'
import Auth from '~/plugins/authCookie'
import { AuthStore } from '@/store'

const restoreAuth: Middleware = async (ctx: Context) => {
  console.log('@middleware/restoreAuth start')
  console.log(`Auth.authenticated(ctx.$cookies): ${Auth.authenticated(ctx.$cookies)}`)
  console.log(`!AuthStore.isAuthenticated: ${!AuthStore.isAuthenticated}`)
  if (Auth.authenticated(ctx.$cookies) && !AuthStore.isAuthenticated) {
    // cookie上はログインしているがStoreはログインできていない場合、
    // ページリロードなどでStoreが初期化されている状態なので、認証情報を復元する
    const user: any = jwtDecode(Auth.getAccessToken(ctx.$cookies))
    console.log(user)
    if (user) {
      AuthStore.setAuthState({
        displayName: user?.name,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        photoURL: user?.picture,
        providerId: user?.firebase?.sign_in_provider,
        uid: user?.user_id,
      })
    }
  }
  console.log('@middleware/restoreAuth end')
}

export default restoreAuth
