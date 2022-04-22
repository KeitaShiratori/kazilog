<template lang="pug">  
v-container(fill-height)
  Hero
  .container
    GuestContents(v-if="!this.isAuthenticated")
    UserContents(v-else)

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Hero from '@/components/blocks/index/Hero'
import GuestContents from '@/components/blocks/index/GuestContents'
import UserContents from '@/components/blocks/index/UserContents'

export default {
  components: {
    Hero,
    GuestContents,
    UserContents
  },
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

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

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
