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
        span.pr-2 {{ item.text }}
        v-icon(small, @click="model=null") $delete
    template(v-slot:item="{ index, item }")
      v-text-field(
        v-if="editing === item",
        v-model="editing.text", 
        autofocus, 
        flat, 
        background-color="transparent", 
        hide-details, 
        solo, 
        @keyup.enter="edit(index, item)"
      )
      v-chip(v-else, :color="`${item.color} lighten-3`", dark, label, small) {{ item.text }}
      v-spacer
      v-list-item-action(@click.stop)
        v-btn(icon, @click.stop.prevent="edit(index, item)")
          v-icon {{ editing !== item ? &apos;mdi-pencil&apos; : &apos;mdi-check&apos; }}
</template>

<script lang="ts">
import Vue from 'vue'
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
  data: () => ({
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    editing: null,
    editingIndex: -1,
    items: [
      { header: 'カテゴリを選択または作成' },
      {
        text: 'Foo',
        color: 'blue',
      },
      {
        text: 'Bar',
        color: 'red',
      },
    ],
    nonce: 1,
    menu: false,
    model: null,
    x: 0,
    search: null,
    y: 0,
  }),

  watch: {
    model(val) {
      if (typeof val === 'string') {
        // stringで来るということは、新規？
        console.log('val: ', val)
        val = {
          text: val,
          color: this.colors[this.nonce - 1],
        }

        this.items.push(val)
        this.model = val

        this.nonce++
      }
      if (this.editing) {
        console.log('edit finish', JSON.stringify(val))
        this.editing = null
        this.editingIndex = -1
      }
      this.$emit('selectItem', { key: 'category', val })
    },
  },

  methods: {
    edit(index: any, item: any) {
      if (!this.editing) {
        console.log('edit start', JSON.stringify(item))
        this.editing = item
        this.editingIndex = index
      } else {
        //ここがたぶん編集確定
        console.log('edit finish', JSON.stringify(item))
        this.editing = null
        this.editingIndex = -1
      }
    },
    filter(item: any, queryText: any, itemText: any) {
      if (item.header) return false

      const hasValue = (val: any) => (val != null ? val : '')

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      )
    },
  },
})
</script>

<style lang="scss" scoped></style>
