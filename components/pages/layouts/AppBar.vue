<template lang="pug">
v-container
  NavigationDrawer(v-model="drawer", :items="items")
  v-app-bar(:clipped-left="clipped", fixed, app)
    v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    v-btn(icon, @click.stop="miniVariant = !miniVariant")
      v-icon mdi-
        | {{ `chevron-${miniVariant ? &apos;right&apos; : &apos;left&apos;}` }}
    v-toolbar-title(v-text="title")
    v-spacer
    v-btn(text, to="/logout", v-if="this.isAuthenticated")
      v-icon mdi-logout
      | logout
    v-btn(text, color="primary", to="/login", v-else)
      v-icon mdi-login
      | login
</template>

<script lang="ts">
import { AuthStore } from '@/store'
import NavigationDrawer from'@/components/pages/layouts/NavigationDrawer.vue'
export default {
  name: 'PagesLayoutsAppBar',
  components:{
    NavigationDrawer
  },
  props: {
    title:{
      type: String,
      required: false,
      default: () => 'カジログ',
    },
  },
  data() {
    return {
      fixed: false,
      miniVariant: false,
      clipped: false,
      drawer: false,
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
    }
  },
  computed: {
    isAuthenticated() {
      return AuthStore.isAuthenticated
    },
  },
}
</script></script>

<style lang="scss" scoped></style>
