<template lang="pug">
v-app
  pages-layouts-app-bar
  v-main
    v-container
      Nuxt
  pages-layouts-footer
</template>

<script>
import { AuthStore } from '@/store'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  computed: {
    isAuthenticated() {
      return AuthStore.isAuthenticated
    },
  },
}
</script>
