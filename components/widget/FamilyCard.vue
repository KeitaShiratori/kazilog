<template lang="pug">  
v-card
  v-card-title(v-text="family.name ? family.name : ''")
  v-list
    v-list-item-group(no-action, sub-group)
      v-list-item-title
        v-list-item-title
  v-list
    v-list-group(:value='true' prepend-icon='mdi-account-circle')
      template(v-slot:activator='')
        v-list-item-title 家族一覧
      v-list-item(v-for="user, idx in family.users" :key="idx")
        v-list-item
          v-list-item-icon
            v-icon mdi-account
          v-list-item-title(v-text="`${user.name}さん`")
</template>

<script lang="ts">
import 'vue-apollo'
import familyGql from '@/apollo/queries/family.gql'
import { Family } from '@/types/generated/graphql'

interface Data {
  family: Family
}
export default {
  name: 'WidgetFamilyCard',
  // layout: 'protected',
  data(): Data {
    return {
      family: { name: '' },
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
