import {
  getFirebaseAuth,
  providers,
  signInWithPopup,
  GoogleAuthProvider,
} from '@/plugins/firebase'
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

  private static getDefaultState = (): AuthState => ({
    isLoggedIn: false,
    uid: null,
    user: null,
    familyId: null,
    email: null,
  })

  public get isAuthenticated() {
    return !!this.authState.isLoggedIn
  }

  public get currentUserInfo() {
    return this.authState.user
  }

  public get hasFamilyId() {
    return !!this.authState.familyId
  }

  public get getAuthState() {
    return this.authState
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
  @Mutation
  private async _setFamilyId(familyId: string) {
    this.authState.familyId = familyId
  }
  @Mutation
  private async _setEmail(email: string) {
    this.authState.email = email
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
      const token = await getIdToken(user)
      return token
    } catch (error) {
      console.log(error)
      // ??????????????????
    }
  }

  @Action({ rawError: true })
  public async signInWithGoogle() {
    const auth = getFirebaseAuth()
    try {
      const result = await signInWithPopup(auth, providers.google)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const user = result.user
      this.logIn(user)
      const token = await getIdToken(user)
      return token
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
    }
  }

  @Action({ rawError: true })
  public async firebaseAuthLogout() {
    const auth = getFirebaseAuth()
    try {
      await signOut(auth)
      await this.logOut(auth)
    } catch (error) {
      // ?????????????????????
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

  @Action({ rawError: true })
  public setFamilyId(familyId: string) {
    this._setFamilyId(familyId)
  }

  @Action({ rawError: true })
  public setEmail(email: string) {
    this._setEmail(email)
  }
}
