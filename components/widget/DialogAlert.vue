<template>
  <v-dialog :value="isOpen" @click:outside="closeDialog">
    <v-card>
      <v-card-title class="justify-center">
        <span class="text-body-2 font-weight-bold">
          {{ dialogTitle }}
        </span>
      </v-card-title>
      <v-card-text>
        <div class="text-center mt-3 mx-8">
          <v-btn block outlined @click="closeDialog">
            {{ buttonName }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'DialogAlert',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    buttonName: {
      type: String,
      default: '閉じる',
    },
  },
  methods: {
    closeDialog() {
      // @ts-ignore
      this.$emit('closeDialog')
    },
  },
}
</script>

<style lang="scss" scoped></style>
