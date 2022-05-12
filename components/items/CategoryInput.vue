<template lang="pug">
div
  v-label カテゴリ
  v-combobox(
    v-model="model"
    :filter="filter"
    :hide-no-data="!search"
    :items="items"
    :search-input.sync="search"
    hide-selected
    label="カテゴリを選択"
    small-chips
    solo
  )
    template(v-slot:no-data)
      v-list-item
        span.subheading 新しいカテゴリを追加する
        v-chip(:color="`${colors[nonce - 1]} lighten-3`", label, small) {{ search }}
    template(v-slot:selection="{ attrs, item, parent, selected }")
      v-chip(
        v-if="item === Object(item)"
        v-bind="attrs"
        :color="`${item.color} lighten-3`"
        :input-value="selected"
        label
        small
      )
        span.pr-2 {{ item.name }}
        v-icon(small, @click="model=null") $delete
    template(v-slot:item="{ index, item }")
      v-text-field(
        v-if="editing === item",
        v-model="editing.name", 
        autofocus, 
        flat, 
        background-color="transparent", 
        hide-details, 
        solo, 
        @keyup.enter="edit(index, item)"
      )
      v-chip(v-else, :color="`${item.color} lighten-3`", dark, label, small) {{ item.name }}
      v-spacer
      v-list-item-action(@click.stop)
        v-btn(icon, @click.stop.prevent="edit(index, item)")
          v-icon {{ editing !== item ? &apos;mdi-pencil&apos; : &apos;mdi-check&apos; }}
</template>

<script lang="ts">
import Vue from 'vue'
import { Category } from '~/types/generated/graphql'
export default Vue.extend({
  props: {
    value: {
      type: Object,
      default: () => null,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const colors = ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange']
    const items = [
      { header: 'カテゴリを選択または作成' },
      ...this.list.map((o: any, i) => {
        if (!o.color) o.color = colors[i % colors.length]
        return o
      }),
    ]
    return {
      activator: null,
      attach: null,
      colors,
      editing: null,
      editingIndex: -1,
      items,
      nonce: items.length % colors.length,
      menu: false,
      model: null,
      x: 0,
      search: null,
      y: 0,
    }
  },
  watch: {
    list(val, prev) {
      console.log('list watch start', val, prev)
      val.map((v: any, i) => {
        if (!prev.includes(v)) {
          if (!v.color) v.color = this.colors[i % this.colors.length]
          this.items.push(v)
        }
      })
    },
    model(val) {
      if (typeof val === 'string') {
        // 新規入力した場合
        console.log('val: ', val)
        val = {
          name: val,
          color: this.colors[this.nonce - 1],
        }

        this.items.push(val)
        this.model = val

        this.nonce++
      }
      if (this.editing) {
        this.update(val)
      }
      this.$emit('selectItem', { key: 'category', val })
    },
  },
  methods: {
    edit(index: any, item: any) {
      if (!this.editing) {
        // 編集開始
        console.log('edit start', JSON.stringify(item))
        this.editing = item
        this.editingIndex = index
      } else {
        // 編集確定
        this.update(item)
      }
    },
    update(item: any) {
      console.log('edit finish', JSON.stringify(item))
      this.editing = null
      this.editingIndex = -1
    },
    filter(item: any, queryText: any, itemText: any) {
      if (item.header) return false

      const hasValue = (val: any) => (val != null ? val : '')

      const name = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        name.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      )
    },
  },
})
</script>

<style lang="scss" scoped></style>
