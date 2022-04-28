<template lang="pug">
v-row(justify="center" align-content="center")
  v-col(cols="12" align-self="auto")
    h1.text-center カジログ
  v-col(cols="12" align-self="auto")
    h2.text-center 家はこうして作られる
  v-btn(cols="6" align-self="auto")
    nuxt-link(to="/login") ログイン
</template>

<script lang="ts">
export default {
  name: 'PagesIndexGuestContents',
  props: [],
  methods: {},
  mounted() {},
}
</script>
