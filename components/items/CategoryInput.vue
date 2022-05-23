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
import MAddCategoryGql from '@/apollo/mutations/addCategory.gql'
import QCategoriesGql from '@/apollo/queries/categories.gql'
import { Category } from '~/types/generated/graphql'
interface DispCategory {
  id: String
  name: String
  color: String
}
interface DispHeader {
  header: String
}

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
    const items = [{ header: 'カテゴリを選択または作成' }] as Array<
      DispHeader | DispCategory
    >
    return {
      activator: null,
      attach: null,
      colors,
      editing: null,
      editingIndex: -1,
      items,
      nonce: items.length % colors.length,
      menu: false,
      model: null as DispCategory | null,
      x: 0,
      search: null,
      y: 0,
    }
  },
  watch: {
    list(val, prev) {
      console.log('list watch start', val, prev)
      val.map((v: Category) => {
        if (!prev.includes(v)) {
          this.addItems(v)
        }
      })
    },
    model(val) {
      if (typeof val === 'string') {
        // 新規入力した場合
        console.log('val: ', val)
        val = this.makeDispCategory(val)
        this.createCategory(val.name)
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
    makeDispCategory(val: String | Category): DispCategory {
      return typeof val === 'string'
        ? {
            id: '',
            name: val,
            color: this.colors[this.nonce - 1],
          }
        : Object.assign(val as Category, {
            color: this.colors[this.items.length % this.colors.length],
          })
    },
    addItems(val: String | Category): DispCategory {
      const dispCategory = this.makeDispCategory(val)
      this.items.push(dispCategory)
      return dispCategory
    },
    async createCategory(name: String) {
      await this.$apollo.mutate({
        mutation: MAddCategoryGql,
        variables: {
          name: name,
        },
        update: (store: any, _data: { data: { addCategory: Category } }) => {
          console.log('addKazi updateddddddddddddddd')
          const QCategories = store.readQuery({
            query: QCategoriesGql,
          })
          const { categories } = QCategories
          console.log(categories)
          console.log(typeof categories)
          const { addCategory } = _data.data
          categories.push(addCategory)
          store.writeQuery({ query: QCategoriesGql, data: QCategories })
        },
      })
    },
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
