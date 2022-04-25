<template lang="pug">  
v-container(fill-height)
  PagesIndexHero
  .container
    PagesIndexGuestContents(v-if="!this.isAuthenticated")
    PagesIndexUserContents(v-else)

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {}
  },
  methods: {
    ...mapActions('auth', ['firebaseAuthLogin']),
    login() {
      this.firebaseAuthLogin({
        loginMailAddress: this.loginMailAddress,
        loginPassword: this.loginPassword,
      })
    },
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  mounted() {
    console.log('@pages/index.vue mouted start')
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 30px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
