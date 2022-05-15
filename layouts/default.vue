<template lang="pug">
v-app
  pages-layouts-app-bar
  v-main
    v-container
      Nuxt
  pages-layouts-footer
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { AuthStore } from '@/store'
import 'vue-apollo'
import familyIdGql from '@/apollo/queries/familyId.gql'
import { FamilyId } from '~/types/generated/graphql'

export default Vue.extend({
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
      familyId: null,
    }
  },
  apollo: {
    familyId: {
      prefetch: true,
      query: familyIdGql,
      update({ familyId }) {
        console.log('@/layout/defaul update familyId')
        const { id } = familyId
        this.setFamilyId(id)
        console.log('@/layout/defaul update familyId end: familyId is ', id)
        if (this.isAuthenticated && !id) {
          this.$router.push({ name: 'settings' })
        }
      },
    },
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('auth', ['setFamilyId']),
  },
})
</script>
