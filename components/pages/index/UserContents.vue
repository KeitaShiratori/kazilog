<template lang="pug">  
v-container
  v-row
    v-col.col-md-4.offset-md-0.col-sm-10.offset-sm-1.col-xs-12
      WidgetFamilyCard
    v-col.col-md-8.offset-md-0.col-sm-10.offset-sm-1.col-xs-12
      WidgetRemainingKajiList
</template>

<script lang="ts">
import 'vue-apollo'

export default {
  name: 'PagesIndexUserContents',
}
</script>

<style scoped></style>
