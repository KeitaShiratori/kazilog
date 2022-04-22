// import User from "@/store/auth";
// const token = Cookies.get('apollo-token')
import { Context } from '@nuxt/types'
import Auth from '~/plugins/authCookie'

export default function (ctx: Context) {
  return {
    httpEndpoint: process.env.GRAPHQL_URL,
    httpLinkOptions: {
      headers: Auth.authenticated(ctx.$cookies)
        ? {
            authorization: `Bearer ${Auth.getAccessToken(ctx.$cookies)}`,
          }
        : {},
    },
  }
}
