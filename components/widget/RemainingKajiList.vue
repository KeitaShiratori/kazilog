<template lang="pug">  
v-card.mx-auto
  v-toolbar(color="blue darken-4", dark)
    v-toolbar-title 今日の家事一覧
    v-spacer
    v-btn(icon)
      v-icon mdi-magnify
    v-btn(icon)
      v-icon mdi-checkbox-marked-circle
  v-list(two-line)
    v-list-item-group(v-model="selected", active-class="blue--text", multiple)
      template(v-for="(item, idx) in kazisToday")
        v-list-item(:key="item.id" @click="doneKazi(item.id)")
          template(v-slot:default="{ active }")
            v-list-item-avatar
              v-img(:alt="item.name" :src="item.img || 'noimage.png'")
            v-list-item-content
              v-list-item-title(v-text="item.name")
              v-list-item-subtitle(v-text="item.category.name").text--primary
              v-list-item-subtitle(v-text="item.memo")
            v-list-item-action
              v-list-item-action-text(v-text="dispDate(item, 'hh:mm')")
              v-checkbox(:input-value="active" color="primary")
        v-divider(v-if="idx < kazisToday.length - 1" :key="idx")
    //- v-list-item {{ kazisToday }}
    //- v-list-item {{ selected }}
</template>

<script lang="ts">
import 'vue-apollo'
import QKazisTodayGql from '@/apollo/queries/kazisToday.gql'
import MDoneKaziGql from '@/apollo/mutations/doneKazi.gql'
import { DispKazi } from '@/types/generated/graphql'
import { dateFormat } from '@/utils/myutil'

interface Data {
  kazisToday: DispKazi[]
  selected: Array<Number>
}

export default {
  name: 'RemainingKajiList',
  // layout: 'protected',
  data(): Data {
    return {
      selected: [],
      kazisToday: [],
    }
  },
  apollo: {
    kazisToday: {
      prefetch: true,
      query: QKazisTodayGql,
    },
    selected: {
      prefetch: true,
      query: QKazisTodayGql,
      update: (data: { kazisToday: DispKazi[] }) => {
        return data.kazisToday.reduce((ret, dat, idx) => {
          if (!!dat.user) ret.push(idx)
          return ret
        }, [] as Number[])
      },
    },
  },
  methods: {
    dispDate(item: DispKazi, format: String): String {
      const date = item.doneAt
        ? new Date(item.doneAt)
        : new Date(item.repeat?.activatedAt ?? 0)
      return dateFormat(date, format)
    },
    async doneKazi(kaziId: String) {
      // @ts-ignore
      await this.$apollo.mutate({
        mutation: MDoneKaziGql,
        variables: {
          kaziId: kaziId,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
