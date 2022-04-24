<template lang="pug">  
v-container
  v-card
    v-card-title {{ family.name }}
    v-card-content(app)
      v-list
        v-subheader 家族一覧
        v-list-item-group
          v-list-item(v-for="user, idx in family.users" :key="idx")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-content
              v-text(app) {{ user.name }} さん
</template>

<script lang="ts">
import 'vue-apollo'
import familyGql from '@/apollo/queries/family.gql'
import { Query } from '@/types/generated/graphql'

interface Data {
  family?: Query
}
export default {
  name: 'WidgetFamilyCard',
  // layout: 'protected',
  data(): Data {
    return {
      family: undefined,
    }
  },
  apollo: {
    family: {
      prefetch: true,
      query: familyGql,
    },
  },
}
</script>

<style scoped></style>
