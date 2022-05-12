<template lang="pug">
v-card(id="create")
  v-speed-dial(
      v-model='fab'
      :top='fabLocation.top'
      :bottom='fabLocation.bottom'
      :right='fabLocation.right'
      :left='fabLocation.left'
      :direction='direction'
      :open-on-hover='hover'
      :transition='transition'
    )
    template(v-slot:activator)
      v-btn(v-model='fab' color='blue darken-2' dark fab)
        v-icon(v-if='fab')
          | mdi-close
        v-icon(v-else)
          | mdi-apps
    slot(name="buttons")
</template>

<script lang="ts">
import Vue from 'vue'

interface Data {
  fab: Boolean
  fabLocation: {
    top: Boolean
    bottom: Boolean
    right: Boolean
    left: Boolean
  }
  direction: String
  hover: Boolean
  transition: String
}

export default Vue.extend({
  data(): Data {
    const FAB_LOCATION = {
      tr: [true, true, false, false],
      br: [false, true, true, false],
      tl: [true, false, false, true],
      bl: [false, false, true, true],
    }
    const HOVER = {
      t: true,
      f: false,
    }
    const DIRECTION = {
      t: 'top',
      r: 'right',
      b: 'bottom',
      l: 'left',
    }
    const TRANSITION = {
      y: 'slide-y-transition',
      yReverse: 'slide-y-reverse-transition',
      x: 'slide-x-transition',
      xReverse: 'slide-x-reverse-transition',
      scale: 'scale-transition',
    }
    const fabLocationType = 'tr' // br is bottom right
    return {
      fab: false,
      fabLocation: {
        top: FAB_LOCATION[fabLocationType][0],
        right: FAB_LOCATION[fabLocationType][1],
        bottom: FAB_LOCATION[fabLocationType][2],
        left: FAB_LOCATION[fabLocationType][3],
      },
      hover: HOVER.f,
      direction: DIRECTION.t,
      transition: TRANSITION.yReverse,
    }
  },
})
</script>

<style lang="scss" scoped>
#create .v-speed-dial {
  position: absolute;
  bottom: 0;
  right: 0;
}
#create .v-btn--floating {
  position: absolute;
}
</style>
