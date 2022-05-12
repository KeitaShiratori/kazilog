<template lang="pug">
v-card
  v-card-title
    span.text-h5 家事登録
  v-card-subtitle 新しい家事を追加する
  v-card-text
    v-container
      v-row
        v-col(cols='12')
          ItemsCategoryInput(:value="category", :list="categories" @selectItem="selectItem")
        v-col(cols='12')
          v-text-field(label='家事名' required='' v-model="name")
        v-col(cols='12')
          v-slider(v-model="point" :max="20").align-center
            template(v-slot:append)
              v-text-field(label='ポイント' required='' type="number" v-model="point")
        v-col(cols="12")
          v-select(
            v-model="repeatType"
            :items="repeatTypes"
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
import { REPEAT_TYPE } from '@/utils/constants'
import QCategoriesGql from '@/apollo/queries/categories.gql'
import { Category } from '@/types/generated/graphql'

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
      type: Object,
      default: () => null,
    },
    inputRepeatType: {
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
      categories: [],
      repeatTypes: Object.keys(REPEAT_TYPE),
      name: this.inputName,
      point: this.inputPoint,
      category: this.inputCategory,
      repeatType: this.inputRepeatType,
      activatedAt: this.inputActivatedAt,
      inputStyle: {
        color: 'black',
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
  apollo: {
    categories: {
      prefetch: true,
      query: QCategoriesGql,
      // update(data: { categories: Category[] }) {
      //   console.log('categories got')
      //   const categories = data.categories
      //   console.log(categories)

      // },
    },
  },
  methods: {
    update(key: string, val: any) {
      console.log(key, val)
      this.$emit('update', { key, val })
    },
    selectItem(kv: { key: string; val: any }) {
      console.log('selectItem catch', kv.key, kv.val)
      const { key, val } = Object.assign({}, kv) // kvはオブジェクトなので、参照渡しを避けるためObject.assignする
      this.$data[key] = val
    },
  },
  watch: {
    categories(val, prev) {
      console.log('val', val)
      console.log('prev', prev)
      console.log('this.categories', this.categories)
    },
    name() {
      this.update('name', this.name)
    },
    point() {
      this.update('point', this.point)
    },
    category() {
      this.update('category', this.category)
    },
    repeatType() {
      this.update('repeatType', this.repeatType)
    },
    activatedAt() {
      this.update('activatedAt', this.activatedAt)
    },
  },
})
</script>
