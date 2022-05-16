<template lang="pug">
v-container
  v-row(justify="center")
    v-card(max-width="400px" width="100%")
      v-img(
        style="position: relative;"
        height="200px"
        src="https://cdn.pixabay.com/photo/2016/09/19/17/20/home-1680800_960_720.jpg"
        v-show="true"
      )
        template(v-slot:placeholder)
          v-row.fill-height.ma-0(align="center" justify="center")
            v-progress-circular(indeterminate color="grey darken-4")
        v-card-title.text-h4(
          style="position: absolute; bottom: 0px;"
        ) Welcome
      v-card-title ユーザー設定
      v-list
        v-list-item-group
          v-col(cols="10" offset="1")
            v-text-field(
              label='お名前'
              v-model="name"
              @change="updateUser"
            )
        v-list-item-group
          v-col(cols="10" offset="1")
            v-text-field(
              label='家族名'
              v-model="familyName"
              @change="addFamily"
            )
      v-divider
      v-card-actions(align="center")
        v-spacer
        v-btn(text to="/")
          v-icon mdi-home
          | HOMEへ進む
        v-spacer
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import MUpdateUserGql from '@/apollo/mutations/updateUser.gql'
import MAddFamilyGql from '@/apollo/mutations/addFamily.gql'
import { Family } from '~/types/generated/graphql'
export default Vue.extend({
  data() {
    return {
      name: '',
      familyName: '',
    }
  },
  methods: {
    ...mapActions('auth', ['setFamilyId']),
    async updateUser() {
      await this.$apollo.mutate({
        mutation: MUpdateUserGql,
        variables: {
          name: this.name,
        },
      })
    },
    async addFamily() {
      await this.$apollo.mutate({
        mutation: MAddFamilyGql,
        variables: {
          name: this.familyName,
        },
        update: (store: any, _data: { data: { addFamily: Family } }) => {
          const { id } = _data.data.addFamily
          this.setFamilyId(id)
        },
      })
    },
  },
})
</script>
