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
    v-list-item {{ timelinesDoneToday }}
    v-list-item {{ kazisRemainedToday }}
    v-list-item-group(v-model="selected", active-class="blue--text", multiple)
      template(v-for="(item, idx) in items")
        v-list-item(:key="item.id")
          template(v-slot:default="{ active }")
            v-list-item-avatar
              v-img(:alt="item.name" :src="item.img")
            v-list-item-content
              v-list-item-title(v-text="item.name")
              v-list-item-subtitle(v-text="item.category.name").text--primary
              v-list-item-subtitle(v-text="item.memo")
            v-list-item-action
              v-list-item-action-text(v-text="item.displayDatetime")
              v-checkbox(:input-value="active" color="primary")
        v-divider(v-if="idx < items.length - 1" :key="idx")
</template>

<script lang="ts">
import 'vue-apollo'
import remainingKaziGql from '@/apollo/queries/remainingKazi.gql'
import { Query } from '@/types/generated/graphql'

interface Data {
  timelinesDoneToday?: Query
  selected: Array<boolean>
  items: Array<any>
}

export default {
  name: 'RemainingKajiList',
  // layout: 'protected',
  data(): Data {
    return {
      selected: [],
      items: [
        {
          id: 1001,
          img: 'noimage.png',
          name: '夕飯作り',
          category: {
            id: 2001,
            name: '料理',
          },
          displayDatetime: '17:00',
        },
        {
          id: 1002,
          img: 'noimage.png',
          name: '買い出し',
          category: {
            id: 2001,
            name: '料理',
          },
          displayDatetime: '14:00',
        },
        {
          id: 1003,
          img: 'noimage.png',
          name: '洗濯機回す',
          category: {
            id: 2002,
            name: '洗濯',
          },
          displayDatetime: '07:00',
        },
        {
          id: 1004,
          img: 'noimage.png',
          name: '洗濯ものたたむ',
          category: {
            id: 2002,
            name: '洗濯',
          },
          displayDatetime: '09:00',
        },
        {
          id: 1005,
          img: 'noimage.png',
          name: '掃除機かけ',
          category: {
            id: 2003,
            name: '掃除',
          },
          displayDatetime: '09:17',
          memo: 'やりました',
        },
      ],
    }
  },
  apollo: {
    timelinesDoneToday: {
      prefetch: true,
      query: remainingKaziGql,
    },
    kazisRemainedToday: {
      prefetch: true,
      query: remainingKaziGql,
    },
  },
}
</script>

<style lang="scss" scoped></style>
