<template>
  <div>
    <!-- <video @loadeddata="onloadeddata" :srcObject.prop="stream"></video> -->
    <video @loadeddata="onloadeddata" :src="src" controls></video>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      stream: undefined,
      src: undefined,
    }
  },
  methods: {
    onloadeddata(ev) {
      ev.target.play()
    },
  },
  async created() {
    // Webカメラを使う場合
    // this.stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true
    // })
    this.src =
      'https://pixabay.com/ja/videos/download/video-113004_medium.mp4'
  },
}
</script>
