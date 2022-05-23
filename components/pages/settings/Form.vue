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
        ) Settings
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
            v-label 家族設定
            v-radio-group(v-model="familyRegistrationMode")
              v-radio(
                v-for="i in [...Array(FamilyRegistrationMode.length)].keys()"
                :key="i"
                :label="FamilyRegistrationMode[i].label"
                :value="FamilyRegistrationMode[i].key"
              )
            v-text-field(
              v-if="familyRegistrationMode==KeysFamilyRegistrationMode.CREATE"
              label='家族名'
              v-model="familyName"
              @change="upsertFamily"
            )
            v-autocomplete(
              v-if="familyRegistrationMode==KeysFamilyRegistrationMode.SEARCH"
              v-model="selectedFamily"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              chips
              clearable
              hide-no-data
              hide-details
              hide-selected
              no-filter
              item-text="Description"
              item-value="id"
              label="家族のメールアドレスを検索"
              prepend-icon="mdi-database-search"
            )
              template(v-slot:selection="{attr, on , item, selected }")
                v-chip.white--text(
                  v-bind="attr"
                  :input-value="selected"
                  color="blue-grey"
                  v-on="on"
                )
                  v-icon(left) mdi-account-multiple
                  span(v-text="item.Description")
              template(v-slot:item="{item, on}")
                v-list-item(@click="joinFamily(item)" v-on="on")
                  v-list-item-avatar.text-h5.font-weight-light.white--text(color="primary") {{ item.name.charAt(0) }}
                  v-list-item-content
                    v-list-item-title(v-text="item.Description")
                  v-list-item-action 
                    v-icon mdi-account-multiple
      v-divider
      v-card-actions(align="center")
        v-spacer
        v-btn(text to="/")
          v-icon mdi-home
          | HOMEへ
        v-spacer
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import QSearchFamilyGql from '@/apollo/queries/searchFamily.gql'
import MUpdateUserGql from '@/apollo/mutations/updateUser.gql'
import MJoinFamilyGql from '@/apollo/mutations/joinFamily.gql'
import { Family } from '~/types/generated/graphql'
import {
  FAMILY_REGISTRATION_MODE,
  convertToArray,
  convertToKeys,
} from '@/utils/constants'

export default Vue.extend({
  data() {
    const FamilyRegistrationMode = convertToArray(FAMILY_REGISTRATION_MODE)
    const KeysFamilyRegistrationMode = convertToKeys(FAMILY_REGISTRATION_MODE)
    const ALLOWED_MAIL_DOMAINS = ['gmail.com', 'test.com']
    return {
      name: '',
      familyRegistrationMode: KeysFamilyRegistrationMode.CREATE,
      familyName: '',
      FAMILY_REGISTRATION_MODE,
      FamilyRegistrationMode,
      KeysFamilyRegistrationMode,
      // for autocomplete
      descriptionLimit: 20,
      searchFamily: [] as Family[],
      selectedFamily: null as Family | null,
      search: null as any,
      isLoading: false,
      ALLOWED_MAIL_DOMAINS,
    }
  },
  apollo: {
    searchFamily: {
      query: QSearchFamilyGql,
      variables() {
        console.log(
          '@/components/pages/settings/Form apollo variables start',
          this.search
        )
        return {
          email: this.search,
        }
      },
      skip() {
        const SKIP = true
        const EXEC = false
        console.log(
          '@/components/pages/settings/Form apollo skip start',
          this.search
        )
        if (!this.search) return SKIP
        const reg =
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        if (!this.search.match(reg)) {
          console.log(
            '@/components/pages/settings/Form apollo skip not match email format',
            this.search
          )
          return SKIP
        }
        const maildomain = this.search.split('@')[1]
        if (this.ALLOWED_MAIL_DOMAINS.includes(maildomain)) {
          this.isLoading = true
          return EXEC
        }
        return SKIP
      },
      result(_data: { data: { searchFamily: Family[] } }) {
        console.log(
          '@/components/pages/settings/Form apollo result start',
          _data
        )
        this.isLoading = false
        const { searchFamily } = _data.data
        console.log(searchFamily)
        const newItems = searchFamily.map((f: Family) => {
          if (!f.name) return Object.assign({}, f, { Description: '' })
          const Description =
            f.name.length > this.descriptionLimit
              ? f.name.slice(0, this.descriptionLimit) + '...'
              : f.name
          return Object.assign({}, f, { Description })
        })
        console.log(
          '@/components/pages/settings/Form apollo result end',
          newItems
        )
        this.searchFamily = [...newItems]
        // return newItems
      },
    },
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
    async upsertFamily() {
      await this.$apollo.mutate({
        mutation: MJoinFamilyGql,
        variables: {
          name: this.familyName,
        },
        update: (store: any, _data: { data: { joinFamily: Family } }) => {
          const { id } = _data.data.joinFamily
          this.setFamilyId(id)
        },
      })
    },
    async joinFamily(family: Family) {
      console.log('@/components/pages/settings/Form joinFamily start', family)
      await this.$apollo.mutate({
        mutation: MJoinFamilyGql,
        variables: {
          id: family.id,
        },
        update: (store: any, _data: { data: { joinFamily: Family } }) => {
          const { id } = _data.data.joinFamily
          this.setFamilyId(id)
        },
      })
    },
  },
  computed: {
    items() {
      console.log(
        '@/components/pages/settings/Form computed items start',
        this.searchFamily
      )
      // @ts-ignore
      const entries = this.searchFamily.map((f: Family) => {
        if (!f.name) return Object.assign({}, f, { Description: '' })
        const Description =
          f.name.length > this.descriptionLimit
            ? f.name.slice(0, this.descriptionLimit) + '...'
            : f.name
        return Object.assign({}, f, { Description })
      })
      console.log(
        '@/components/pages/settings/Form computed items end',
        entries
      )
      return entries
    },
  },
})
</script>
