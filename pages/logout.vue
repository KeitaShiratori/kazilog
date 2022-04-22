<template>
  <div />
</template>
<script>
import Vue from 'vue'
import Auth from "~/plugins/authCookie"
import { AuthStore } from '@/store'

export default Vue.extend({
  async middleware ({redirect, $cookies }) {
    await AuthStore.firebaseAuthLogout()
    Auth.removeAccessToken($cookies);  // Cookieのtokenを削除
    redirect("/");
  },
})
</script> 