<template lang="pug">
v-dialog(v-model="dialog", persistent, max-width="400px")
  template(v-slot:activator="{ on, attrs }")
    v-btn(icon, v-bind="attrs" v-on="on")
      v-icon mdi-plus-circle
  WidgetAddKaziForm(
    @update="update"
  )
    template(v-slot:actions)
      v-card-actions
        v-spacer
        v-btn(color='primary' text='' @click='closeDialog')
          | Close
        v-btn(color='primary' text='' @click='save')
          | Save
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      dialog: false,
      name: '',
      point: 1,
      category: '',
      repeatCode: '',
      activatedAt: '',
    }
  },
  methods: {
    openAddKazi() {
      console.log('openAddKazi')
    },
    update(kv: { key: string; val: any }) {
      console.log('update catch', kv.key, kv.val)
      const { key, val } = Object.assign({}, kv) // kvはオブジェクトなので、参照渡しを避けるためObject.assignする
      this.$data[key] = val
    },
    closeDialog() {
      this.dialog = false
      console.log('closeDialog')
    },
    save() {
      console.log(
        "name:", this.name,
        "point:", this.point,
        "category:", this.category,
        "repeatCode:", this.repeatCode,
        "activatedAt:", this.activatedAt,
      )
      console.log('save')
      this.dialog = false
    },
  },
})
</script>
