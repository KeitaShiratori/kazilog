<template lang="pug">
  v-footer(:absolute="!fixed", app)
    span ©
      | {{ new Date().getFullYear() }}
</template>

<script lang="ts">
export default {
  name: 'PagesLayoutsFooter',
  props: {
    fixed: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
