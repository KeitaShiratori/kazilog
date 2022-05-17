<template>
  <div />
</template>
<script>
import Vue from 'vue'
import Auth from '~/plugins/authCookie'
import { AuthStore } from '@/store'

export default Vue.extend({
  async middleware(ctx) {
    console.log('logout start')
    await AuthStore.firebaseAuthLogout()
    Auth.removeAccessToken(ctx.$cookies) // Cookieのtokenを削除
    await ctx.app.apolloProvider.defaultClient.clearStore()
    await ctx.app.apolloProvider.defaultClient.resetStore()
    ctx.redirect('/')
    console.log('logout end')
  },
})
</script>
