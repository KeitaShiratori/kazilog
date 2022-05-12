<template lang="pug">
.text-center
  v-dialog(v-model="dialog", width="500")
    template(v-slot:activator="{ on, attrs }")
      v-btn(color="red lighten-2", dark, v-bind="attrs", v-on="on") Click Me
    v-card
      v-card-title.text-h5.grey.lighten-2 Privacy Policy
      v-card-text Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      v-divider
      v-card-actions
        v-spacer
        v-btn(color="primary", text, @click="dialog = false") I accept
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      dialog: false,
    }
  },
})
</script>
