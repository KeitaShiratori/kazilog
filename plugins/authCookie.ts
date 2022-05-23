import { NuxtCookies } from 'cookie-universal-nuxt'

export default class Auth {
  // Cookieに保存するときのキー名
  private static ACCESS_TOKEN_KEY: string = '__kzlg_access_token'

  // 認証済みかどうかの判定
  public static authenticated(cookie: NuxtCookies): boolean {
    let payload = this.getPayload(cookie)
    if (payload) {
      // トークンの有効期限を検証
      let exp = parseInt(payload['exp'])
      let now = Math.floor(new Date().getTime() / 1000)
      if (exp && exp > now) {
        return true
      }
    }
    return false
  }

  // CookieからJWTを削除
  public static removeAccessToken(cookie: NuxtCookies): void {
    console.log('@/plugins/authCookie removeAccessToken start')
    cookie.remove(this.ACCESS_TOKEN_KEY)
    console.log('@/plugins/authCookie removeAccessToken end')
  }

  // CookieからJWTを取得
  public static getAccessToken(cookie: NuxtCookies): string {
    return cookie.get(this.ACCESS_TOKEN_KEY)
  }

  // JWTをCookieに保存
  public static setAccessToken(cookie: NuxtCookies, token: string): void {
    return cookie.set(this.ACCESS_TOKEN_KEY, token)
  }

  // Cookieに保存されているTokenのJWTのheaderをオブジェクト形式で取得する
  public static getHeader(
    cookie: NuxtCookies
  ): { [index: string]: string } | null {
    let token = this.getAccessToken(cookie)
    if (!token) return null
    let header = token.split('.')[0]
    let decoded = Buffer.from(header, 'base64').toString()
    return JSON.parse(decoded)
  }

  // Cookieに保存されているTokenのJWTのpayloadをオブジェクト形式で取得する
  public static getPayload(
    cookie: NuxtCookies
  ): { [index: string]: string } | null {
    let token = this.getAccessToken(cookie)
    if (!token) return null
    let payload = token.split('.')[1]
    let decoded = Buffer.from(payload, 'base64').toString()
    return JSON.parse(decoded)
  }
}
