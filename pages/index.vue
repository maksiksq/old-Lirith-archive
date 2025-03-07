<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {info} from '@tauri-apps/plugin-log';
import Shelf from '@/components/Shelf.vue';

import {saveShelf, deleteShelf, getShelf, getAllShelves, clearShelves} from "~/utils/indexedDB";

const shelves: any = ref([])

async function loadShelves(): Promise<any> {
  shelves.value = await getAllShelves();
}

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)

const size = ref(75)

const canvas = ref(null)

const drawGrid = () => {
  const ctx = canvas.value.getContext('2d')
  const {width, height} = canvas.value
  ctx.clearRect(0, 0, width, height)

  const gridSize = size.value * scale.value

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

const startPan = (event: any) => {
  if (event.button !== 1) return
  isPanning.value = true
  startX.value = event.clientX - translateX.value
  startY.value = event.clientY - translateY.value
  window.addEventListener('mousemove', pan)
  window.addEventListener('mouseup', stopPan)
}

const pan = (event: any) => {
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

const zoom = (e: any) => {
  const zoomIntensity = 0.1
  const newScale = Math.min(3, Math.max(0.5, scale.value - e.deltaY * zoomIntensity * 0.01))
  scale.value = newScale
  drawGrid()
}

const worldElementPos = ref({x: 450, y: 450})

const trackedElems = reactive([])

const screenX = ref(450)
const screenY = ref(450)

function updatePositions() {
  trackedElems.forEach((el, i) => {
    if (!el) return;


    const worldX = worldElementPos.value.x
    const worldY = worldElementPos.value.y

    screenX.value = worldX * scale.value + translateX.value
    screenY.value = worldY * scale.value + translateY.value

    el.style.transform = `translate(${screenX.value}px, ${screenY.value}px) scale(${scale.value})`
  })


}

const items = ref([
  {name: "Test", id: 0},
  {name: "Teest", id: 1},
  {name: "Teesst", id: 2}
],)

// in the future i can do it for v-fors
const setElems = (el: any) => {
  if (el) trackedElems.push(el);
};

const shelfComp = ref(null);

onMounted(() => {
  loadShelves();

  // defs for elems manually for now
  const shelfWrapper = shelfComp.value?.shelfWrapper;
  if (shelfWrapper) trackedElems.push(shelfWrapper);


  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})
</script>


<template>
  <div class="grid-container" ref="grid"
       @mousedown="startPan"
       @wheel.prevent="zoom">
    <canvas ref="canvas"></canvas>
    <!--    this used to say "time to reinvent grid" before i reinvented grid-->
    <Shelf ref="shelfComp" :items="items"></Shelf>
  </div>
</template>


<style scoped lang="scss">
// tbh i should use togglable classes so much more instead of inline styles
.grabbing {
  background-color: red !important;
  cursor: grabbing;
}

.grid-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #222;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


</style>
