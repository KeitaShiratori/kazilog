import { getFirebaseAuth } from '@/plugins/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserInfo,
  getIdToken,
  Auth,
  Unsubscribe,
} from 'firebase/auth'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { AuthState } from '@/types/store'
import { deepCopy } from '@/utils/myutil'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthStore extends VuexModule {
  private authState: AuthState = Object.assign({}, AuthStore.getDefaultState())

  private static getDefaultState(): AuthState {
    return deepCopy({
      isLoggedIn: false,
      uid: null,
      user: null,
    })
  }

  public get isAuthenticated() {
    return !!this.authState.isLoggedIn
  }

  public get currentUserInfo() {
    return this.authState.user
  }

  @Mutation
  private async logOut(auth: Auth) {
    this.authState = AuthStore.getDefaultState()
  }
  @Mutation
  private logIn(user: UserInfo) {
    this.authState.user = deepCopy(user)
    this.authState.uid = this.authState.user?.uid ?? null
    this.authState.isLoggedIn = true
  }

  // const provider = new GoogleAuthProvider();
  // const signInResult: UserCredential = await signInWithPopup(auth, provider);
  // const crrentUser: User = signInResult.user;

  @Action({ rawError: true })
  public async firebaseAuthLogin(loginInfo: any) {
    if (!loginInfo.loginMailAddress || !loginInfo.loginPassword) return null
    const auth = getFirebaseAuth()
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginInfo.loginMailAddress,
        loginInfo.loginPassword
      )
      const user = userCredential.user
      this.logIn(user)
      return await getIdToken(user)
    } catch (error) {
      console.log(error)
      // ログイン失敗
    }
  }

  @Action({ rawError: true })
  public async firebaseAuthLogout() {
    const auth = getFirebaseAuth()
    try {
      await signOut(auth)
      await this.logOut(auth)
    } catch (error) {
      // ログアウト失敗
      console.log(error)
    }
  }

  @Action({ rawError: true })
  public setAuthChangedListener() {
    const auth = getFirebaseAuth()
    onAuthStateChanged(auth, async (user: UserInfo | null) => {
      user ? this.logIn(user) : await this.logOut(auth)
    })
  }

  @Action({ rawError: true })
  public setAuthState(user: {
    displayName: string
    email: string
    phoneNumber: string
    photoURL: string
    providerId: string
    uid: string
  }) {
    this.logIn(user)
  }
}
