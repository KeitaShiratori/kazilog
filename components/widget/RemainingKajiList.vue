<template lang="pug">  
v-card
  v-toolbar(color="blue darken-4", dark)
    v-toolbar-title 今日の家事一覧
    v-spacer
    WidgetAddKaziButton
  v-list(two-line)
    v-list-item-group(v-model="selected", @click="" active-class="blue--text", multiple, prevent)
      template(v-for="(item, idx) in kazisToday")
        v-list-item(:key="item.id" @click="handleKazi(item, idx)")
          template(v-slot:default="{ active }")
            v-list-item-avatar
              v-img(:alt="item.name" :src="item.img || 'noimage.png'")
            v-list-item-content
              v-list-item-title(v-text="item.name")
              v-list-item-subtitle(v-text="item.category.name").text--primary
              v-list-item-subtitle(v-text="item.memo")
            v-list-item-action
              v-list-item-action-text(v-text="dispDate(item, 'hh:mm')")
              v-icon(v-if="!isSelected(idx)" color="grey darken-1") mdi-checkbox-blank-outline
              v-icon(v-else color="primary") mdi-checkbox-marked
        v-divider(v-if="idx < kazisToday.length - 1" :key="idx")
    //- v-list-item {{ kazisToday }}
    //- v-list-item {{ selected }}
    //- v-list-item {{ inputDispKazi }}
  WidgetDialogHandleTimeline(
    :dialog="dialogOpen" 
    :input="inputDispKazi"
    @closeDialog="closeDialog" 
    @save="updateTimeline"
  )
</template>

<script lang="ts">
import Vue from 'vue'
import 'vue-apollo'
import QKazisTodayGql from '@/apollo/queries/kazisToday.gql'
import MDoneKaziGql from '@/apollo/mutations/doneKazi.gql'
import MUpdateTimelineGql from '@/apollo/mutations/updateTimeline.gql'
import { DispKazi, Maybe, Timeline } from '@/types/generated/graphql'
import { dateFormat } from '@/utils/myutil'

interface Data {
  kazisToday: DispKazi[]
  selected: Number[]
  dialogOpen: Boolean
  inputDispKazi: DispKazi
}

export default Vue.extend({
  name: 'RemainingKajiList',
  // layout: 'protected',
  data(): Data {
    return {
      selected: [],
      kazisToday: [],
      dialogOpen: false,
      inputDispKazi: {
        name: '',
        memo: '',
        doneAt: '',
        user: {
          uid: '',
          name: '',
        },
      },
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
    async handleKazi(dispKazi: DispKazi, idx: Number) {
      if (this.isSelected(idx)) {
        // 選択中の場合、timeline変更ポップアップを開く
        this.inputDispKazi = dispKazi
        this.dialogOpen = true
        this.selected.push(idx) // v-list-item-groupのデフォルト動作でselected状態が反転してしまうので、仕方なく自分で再度有効化している
      } else {
        // 未選択の場合、家事を実行したことにする
        this.doneKazi(dispKazi.id!)
      }
    },
    async doneKazi(kaziId: String) {
      await this.$apollo.mutate({
        mutation: MDoneKaziGql,
        variables: {
          kaziId: kaziId,
        },
        update: (store: any, _data: { data: { doneKazi: Timeline } }) => {
          console.log('doneKazi updateddddddddddddddd')
          const QKazisToday = store.readQuery({
            query: QKazisTodayGql,
          })
          const { kazisToday } = QKazisToday
          console.log(kazisToday)
          console.log(typeof kazisToday)
          const doneKazi = _data.data.doneKazi
          const updatedKazi = kazisToday.find(
            (k: DispKazi) => k.id == doneKazi.kazi!.id
          )!
          updatedKazi.timelineId = doneKazi.id
          updatedKazi.user = doneKazi.user
          updatedKazi.doneAt = doneKazi.doneAt
          updatedKazi.memo = doneKazi.memo ?? ''
          store.writeQuery({ query: QKazisTodayGql, data: QKazisToday })
        },
      })
    },
    async updateTimeline() {
      console.log(this.inputDispKazi)

      console.log(this.inputDispKazi.doneAt)
      console.log(this.kazisToday)
      await this.$apollo.mutate({
        mutation: MUpdateTimelineGql,
        variables: {
          id: this.inputDispKazi.timelineId,
          memo: this.inputDispKazi.memo ?? '',
          uid: this.inputDispKazi.user!.uid,
          userName: this.inputDispKazi.user!.name,
          doneAt: this.inputDispKazi.doneAt,
        },
        update: () => {
          console.log('updatedddddddddd')
        },
      })
      console.log('★★ @components/widget/RemainingKaziList #input')
      console.log(this.inputDispKazi)
      this.closeDialog()
    },
    closeDialog() {
      this.dialogOpen = false
    },
    isSelected(idx: Number): Boolean {
      return this.selected.includes(idx)
    },
  },
})
</script>

<style lang="scss" scoped></style>
