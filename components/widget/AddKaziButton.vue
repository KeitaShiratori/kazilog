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
import MAddKaziGql from '@/apollo/mutations/addKazi.gql'
import QKazisTodayGql from '@/apollo/queries/kazisToday.gql'
import { DispKazi } from '~/types/generated/graphql'

export default Vue.extend({
  data() {
    return {
      dialog: false,
      name: '',
      point: 1,
      category: { id: '', name: '' },
      repeatType: '',
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
    async save() {
      console.log(
        'name:',
        this.name,
        'point:',
        this.point,
        'category:',
        this.category,
        'repeatType:',
        this.repeatType,
        'activatedAt:',
        this.activatedAt
      )
      console.log('save')
      await this.addKazi()
      this.dialog = false
    },
    async addKazi() {
      await this.$apollo.mutate({
        mutation: MAddKaziGql,
        variables: {
          name: this.name,
          categoryId: this.category.id,
          point: this.point,
          repeatType: this.repeatType,
          activatedAt: this.activatedAt,
        },
        update: (store: any, _data: { data: { addKazi: DispKazi } }) => {
          console.log('addKazi updateddddddddddddddd')
          const QKazisToday = store.readQuery({
            query: QKazisTodayGql,
          })
          const { kazisToday } = QKazisToday
          console.log(kazisToday)
          console.log(typeof kazisToday)
          const addKazi = _data.data.addKazi
          kazisToday.push(addKazi)
          store.writeQuery({ query: QKazisTodayGql, data: QKazisToday })
        },
      })
    },
  },
})
</script>
