<template lang="pug">
v-card
  v-card-title
    span.text-h5 家事登録
  v-card-subtitle 新しい家事を追加する
  v-card-text
    v-container
      v-row
        v-col(cols='12')
          ItemsCategoryInput
        v-col(cols='12')
          v-text-field(label='家事名' required='' v-model="name")
        v-col(cols='12')
          v-slider(v-model="point" :max="20").align-center
            template(v-slot:append)
              v-text-field(label='ポイント' required='' type="number" v-model="point")
        v-col(cols="12")
          v-select(
            v-model="repeatCode"
            :items="repeatCodes"
            label="繰り返し"
          )
        v-col(cols='12')
          datetime(
            type="datetime"
            :flow="['time']"
            v-model="activatedAt"
            :inputValue="new Date(activatedAt)"
            :inputStyle="inputStyle" style="position:relative"
          )
            template(v-slot:before)
              small(v-if="activatedAt") 時間
            template(v-slot:after)
              v-label.pb-4(v-if="!activatedAt" absolute) 時間
  slot(name="actions")
</template>

<script lang="ts">
import Vue from 'vue'
import { REPEAT_CODE } from '@/utils/constants'

export default Vue.extend({
  props: {
    inputName: {
      type: String,
      default: () => '',
    },
    inputPoint: {
      type: Number,
      default: () => 1,
    },
    inputCategory: {
      type: String,
      default: () => '',
    },
    inputRepeatCode: {
      type: String,
      default: () => '',
    },
    inputActivatedAt: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      categories: ['洗濯', '料理', '掃除'],
      repeatCodes: Object.keys(REPEAT_CODE),
      name: this.inputName,
      point: this.inputPoint,
      category: this.inputCategory,
      repeatCode: this.inputRepeatCode,
      activatedAt: this.inputActivatedAt,
      inputStyle: {
        color: '#FFFFFF',
        'background-color': 'transparent',
        'border-bottom-style': 'solid',
        flex: '1 1 auto',
        'line-height': '20px',
        padding: '8px 0 8px',
        'max-width': '100%',
        'min-width': '0px',
        width: '100%',
        position: 'relative',
      },
    }
  },
  methods: {
    update(key: string, val: any) {
      console.log(key, val)
      this.$emit('update', { key, val })
    },
  },
  watch: {
    name() {
      this.update('name', this.name)
    },
    point() {
      this.update('point', this.point)
    },
    category(){
      this.update('category', this.category)
    },
    repeatCode(){
      this.update('repeatCode', this.repeatCode)
    },
    activatedAt() {
      this.update('activatedAt', this.activatedAt)
    },
  },
})
</script>
