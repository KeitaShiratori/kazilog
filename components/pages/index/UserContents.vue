<template lang="pug">  
v-container
  v-row
    v-col(cols="12" xs="12" sm="10" md="4").offset-md-0.offset-sm-1
      WidgetFamilyCard
      v-dialog(transition="dialog-bottom-transition" max-width="600px")
        template(v-slot:activator="{ on, attrs }")
          v-card(v-bind="attrs" v-on="on" active-class="blue--text")
            v-card-title 家族一覧を表示
        WidgetFamilyCard
    v-col(cols="12" xs="12" sm="10" md="8").offset-md-0.offset-sm-1
      WidgetRemainingKajiList
   
</template>

<script lang="ts">
export default {
  name: 'PagesIndexUserContents',
}
</script>

<style scoped>
</style>
