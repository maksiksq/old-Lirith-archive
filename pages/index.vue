<script setup>
import {onMounted} from "vue";
import {info} from '@tauri-apps/plugin-log';

onMounted(() => {
  const canvas = ref(null)
  const ctx = canvas.getContext('2d')
  const gridSize = ref(50)

  for (let i = 0; i < window.innerWidth/gridSize.value; i++) {
    info("ha")
    ctx.moveTo(i * gridSize.value, 0)
    ctx.lineTo(0, i * gridSize.value)
  }

  ctx.stroke()


  // canvas.width = window.innerWidth
})
</script>
<template>
  <div class="the-wrapper">
    <canvas ref="canvas" class="the-canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.the-wrapper {
  width: 100vw;
  height: 100vh;
  background: #3c3c3c;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
