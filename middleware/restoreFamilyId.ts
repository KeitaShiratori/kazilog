import { Middleware, Context } from '@nuxt/types'
import Auth from '~/plugins/authCookie'
import { AuthStore } from '@/store'
import familyIdGql from '@/apollo/queries/familyId.gql'

const restoreFamilyId: Middleware = async (ctx: Context) => {
  console.log('@middleware/restoreFamilyId start')
  console.log(
    `Auth.authenticated(ctx.$cookies): ${Auth.authenticated(ctx.$cookies)}`
  )
  console.log(`!AuthStore.hasFamilyId: ${!AuthStore.hasFamilyId}`)
  if (Auth.authenticated(ctx.$cookies) && !AuthStore.hasFamilyId) {
    // cookie上はログインしているがStoreはログインできていない場合、
    // ページリロードなどでStoreが初期化されている状態または初回登録直後で本当にFamilyIdがない状態
    // 前者ならapolloからFamilyIdを取得してStoreにセットする。後者なら設定画面にリダイレクトする
    // console.log(ctx.app)
    console.log(Object.keys(ctx.app))
    // await ctx.app.apolloProvider.defaultClient.query({
    //   // prefetch: true,
    //   query: familyIdGql,
    //   // @ts-ignore
    //   update({ familyId }) {
    //     console.log('@middleware/restoreFamilyId update familyId')
    //     const { id } = familyId
    //     this.setFamilyId(id)
    //     console.log(
    //       '@middleware/restoreFamilyId update familyId end: familyId is ',
    //       id
    //     )
    //     if (this.isAuthenticated && !id) {
    //       ctx.redirect('/settings')
    //     }
    //   },
    // })

    // if (!AuthStore.hasFamilyId) {
    //   console.log('@middleware/restoreFamilyId redirect to /settings')
    //   ctx.redirect('/settings')
    // }
  }  
  console.log('@middleware/restoreFamilyId end')
}

export default restoreFamilyId
