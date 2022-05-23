<template>
  <div />
</template>
<script>
import Vue from 'vue'
import Auth from '~/plugins/authCookie'
import { AuthStore } from '@/store'

export default Vue.extend({
  async middleware({ app, redirect, $cookies }) {
    console.log('logout start')
    await AuthStore.firebaseAuthLogout()
    Auth.removeAccessToken($cookies) // Cookieのtokenを削除
    await app.apolloProvider.defaultClient.clearStore()
    await app.apolloProvider.defaultClient.resetStore()
    redirect('/')
    app.router.go(0)
    console.log('logout end')
  },
})
</script>
