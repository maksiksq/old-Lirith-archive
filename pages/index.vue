<script setup>
import { ref, onMounted, computed } from 'vue'
import info from '@tauri-apps/plugin-log';

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)

const canvas = ref(null)

const drawGrid = () => {
  const ctx = canvas.value.getContext('2d')
  const { width, height } = canvas.value
  ctx.clearRect(0, 0, width, height)

  const gridSize = 50 * scale.value
  const offsetX = translateX.value % gridSize
  const offsetY = translateY.value % gridSize

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1

  ctx.beginPath()

  for (let x = offsetX; x < width; x += gridSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }

  for (let y = offsetY; y < height; y += gridSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }

  ctx.stroke()
  updatePositions()
}

const resizeCanvas = () => {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  drawGrid()
}

const startPan = (event) => {
  if (event.button !== 1) return
  isPanning.value = true
  startX.value = event.clientX - translateX.value
  startY.value = event.clientY - translateY.value
  window.addEventListener('mousemove', pan)
  window.addEventListener('mouseup', stopPan)
}

const pan = (event) => {
  if (!isPanning.value) return
  translateX.value = event.clientX - startX.value
  translateY.value = event.clientY - startY.value
  drawGrid()
}

const stopPan = () => {
  isPanning.value = false
  window.removeEventListener('mousemove', pan)
  window.removeEventListener('mouseup', stopPan)
}

const zoom = (event) => {
  const zoomIntensity = 0.1
  const newScale = Math.min(3, Math.max(0.5, scale.value - event.deltaY * zoomIntensity * 0.01))
  scale.value = newScale
  drawGrid()
}

const worldElementPos = ref({ x: 500, y: 500 })

const shelf = ref(null)

const screenX = ref(500)
const screenY = ref(500)


function updatePositions() {
  if (!shelf.value) return;

  const worldX = worldElementPos.value.x
  const worldY = worldElementPos.value.y

  screenX.value = worldX * scale.value + translateX.value
  screenY.value = worldY * scale.value + translateY.value

  info(shelf.value.toString())
  shelf.value.style.transform = `translate(${screenX}px, ${screenY}px) scale(${scale.value})`
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})
</script>


<template>
  <div class="grid-container" ref="grid"
       @mousedown="startPan"
       @wheel.prevent="zoom">
    <canvas ref="canvas"></canvas>
<!--    time to reinvent grid wahooo-->
    <div ref="shelf" class="shelf"
    :style="{
      transform: `translate(${screenX}, ${screenY})`,
      width: (50*scale).toString()+'px',
      height: (50*scale).toString()+'px',
      scale: scale
    }"
    >
      <div>cheesecake</div>
      <div>croissant</div>
      <div>french</div>
      <div>baguette</div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.grid-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #222;

  .shelf {
    position: absolute;
    background-color: #161616;
    border-radius: 0 0 8px 8px;
    // dimensions and positions in the js
  }
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
