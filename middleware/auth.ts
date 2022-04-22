import { Middleware, Context } from "@nuxt/types"
import Auth from "~/plugins/authCookie"

const allowUnauthorizedPages = ["index", "login"];
const banAuthorizedPages = ["login"];

const auth: Middleware = (ctx: Context) => {
  console.log('@middleware/auth start')
  console.log(`authenticated is ${Auth.authenticated(ctx.$cookies)}`)
  console.log(`idToken is ${Auth.getAccessToken(ctx.$cookies)}`)
  if (
    !Auth.authenticated(ctx.$cookies) &&
    !allowUnauthorizedPages.includes(ctx.route.name?? "")
  ) {
    // 未ログインかつ、未ログインで入ってはいけないページの場合はログインページへ
    ctx.redirect("/login");
  }
  if (
    Auth.authenticated(ctx.$cookies) &&
    banAuthorizedPages.includes(ctx.route.name?? "")
  ) {
    // ログイン済みかつ、ログイン済みで入ってはいけないページの場合はホームへ
    ctx.redirect("/");
  }
  console.log('@middleware/auth end')
}

export default auth; 