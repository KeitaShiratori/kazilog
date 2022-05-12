<template lang="pug">
div
  v-dialog(v-model="dialog", persistent, max-width="400px")
    template(v-slot:activator="{ on, attrs }")
      v-btn(color="primary", dark, v-bind="attrs" v-on="on")
        v-icon(v-if="icon") {{ icon }}
        span {{ button }}
    slot(name="contents")
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    button: {
      type: String,
      required: false,
      default: 'open',
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  watch: {
    dialog() {
      if (this.dialog) {
        // ダイアログが開いた時の処理
      } else {
        // ダイアログが閉じたときの処理
        this.$emit('close')
      }
    },
  },
})
</script>
