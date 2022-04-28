<template lang="pug">
v-dialog(v-model="dialog" persistent='' max-width='600px')
  v-card
    v-card-title
      span.text-h5 家事履歴の編集
    v-card-text
      v-container
        v-row
          v-col(cols='12' sm='12' md='6')
            v-text-field(label='メモ' required='' v-model="input.memo")
          v-col(cols='12' sm='12' md='6')
            datetime(type="datetime" v-model="input.doneAt" :inputValue="new Date(input.doneAt)" :inputStyle="inputStyle" style="position:relative")
              template(v-slot:before)
                small(v-if="input.doneAt") 時間
              template(v-slot:after)
                v-label.pb-4(v-if="!input.doneAt" absolute) 時間
          v-col(cols='12' sm='12' md='6')
            v-text-field(label='やった人' required='' v-model="input.user.name")
    v-card-actions
      v-spacer
      v-btn(color='blue darken-1' text='' @click='closeDialog')
        | Close
      v-btn(color='blue darken-1' text='' @click='save')
        | Save
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'WidgetDialogHandleTimeline',
  data() {
    return {
      isDatetimeOpen: false,
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
  props: {
    dialog: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    input: {
      required: true,
    },
  },
  methods: {
    openDatetime() {
      this.isDatetimeOpen = true
    },
    clickOutside() {
      this.isDatetimeOpen = false
    },
    save() {
      this.$emit('save')
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
  computed: {},
})
</script>

<style lang="scss" scoped></style>
