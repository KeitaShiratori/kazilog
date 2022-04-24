<template lang="pug">  
v-container
  v-card
    v-card-title {{ family.name }}
    v-card-content
      v-list
        v-subheader 家族一覧
        v-list-item-group
          v-list-item(v-for="user in family.users" :key="user")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-content
              v-text {{ user.name }} さん
</template>

<script lang="ts">
import "vue-apollo"
import familyGql from "@/apollo/queries/family.gql"
import { Query } from '@/types/generated/graphql'

interface Data {
  family?: Query
}
export default {
  // layout: 'protected',
  data(): Data {
    return {
      family: undefined
    }
  },
  apollo: {
    family: {
      prefetch: "loading",
      query: familyGql,
    }
  }
}
</script>

<style scoped>
</style>
