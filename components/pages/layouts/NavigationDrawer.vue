<template lang="pug">
v-navigation-drawer(:value="value", @input="$emit('input', $event)", fixed, app)
  v-list
    v-list-item(v-for="(item, i) in items", :key="i", :to="item.to", router, exact)
      v-list-item-action
        v-icon {{ item.icon }}
      v-list-item-content
        v-list-item-title(v-text="item.title")
</template>

<script lang="ts">
export default {
  name: 'PagesLayoutsNavigationDrawer',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
