<template lang="pug">  
v-container(fluid)
  v-row(dense)
    v-col(v-for="book in books" :key="book.title" :cols="12")
      v-card
        NuxtLink(:to="`books/${book.title}`")
          v-card-title(v-text="book.title")
  br
  v-expansion-panels(accordion)
    v-expansion-panel
      v-expansion-panel-header 検索結果
      v-expansion-panel-content {{ books }}
</template>

<script lang="ts">
import "vue-apollo"
import booksGql from "@/apollo/queries/books.gql"
import { Query } from '@/types/generated/graphql'

let numGetBooks = 10
interface Data {
  books?: Query
}
export default {
  // layout: 'protected',
  data(): Data {
    return {
      books: undefined
    }
  },
  apollo: {
    books: {
      prefetch: "loading",
      query: booksGql,
    }
  }
}
</script>

<style scoped>
</style>
