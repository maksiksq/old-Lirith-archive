<script setup>
import {ref, onMounted} from "vue";
import {info} from "@tauri-apps/plugin-log";

// conf

const scale = 1;

// conf

const translateX = ref(0)
const translateY = ref(0)
const iniX = ref(0);
const iniY = ref(0);
const isPanning = ref(false);

const canvasElemRef = ref(null);

function test() {
  info("ya its rewind time");
  info(canvasElemRef.value);
  info("huh");

  const gridSize = ref(50);

  info((window.innerWidth / 50).toString());
  info("a");
}

const resizeCanvas = () => {
  if (!canvasElemRef.value) return
  info(canvasElemRef.value.toString());
  canvasElemRef.value.width = window.innerWidth
  canvasElemRef.value.height = window.innerHeight
  drawGrid();
}

function drawGrid() {
  const canvasElement = canvasElemRef.value;
  const ctx = canvasElement.getContext("2d");
  ctx.clearRect(0, 0, width, height)
  const size = 50 * scale;

  // this is smart af, would never have come up with this myself
  const offsetX = translateX.value % size;
  const offsetY = translateY.value % size;

  const { width, height } = canvasElement;

  ctx.strokeStyle = "white"
  ctx.lineWidth = 1;

  ctx.beginPath();

  for (let x = offsetX; x < width; x += size) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    info(x)
  }
  for (let y = offsetY; y < height / size; y += size) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    info(y)
  }
  ctx.stroke()

}

function startPanning(e) {
  if (e.button !== 1) {
    return
  }
  isPanning.value = true;

  info("middle button my lord")

  iniX.value = e.clientX - translateX.value;
  iniY.value = e.clientY - translateY.value;
}

function pan() {
  if (isPanning.value === false) {return}

  translateX.value = translateX.value - iniX.value;
  translateY.value = translateY.value - iniY.value;
  drawGrid()
}

function onMouseUp(e) {
  if (e.button === 1) {
    info("middle button ran away")
  }
  isPanning.value = false;
}

onMounted(() => {
  resizeCanvas();
  info("ya its rewind time");
  window.addEventListener('resize', resizeCanvas);
});
</script>

<template>
  <div @mousedown="startPanning" @mousemove="pan" @mouseup="onMouseUp" class="the-wrapper">
    <canvas ref="canvasElemRef" class="the-canvas"></canvas>
    <button class="test-button" @click="test">test</button>
  </div>
</template>


<style scoped lang="scss">
.the-wrapper {
  width: 100vw;
  height: 100vh;
  background: #3c3c3c;

  .test-button {
    position: absolute;
    top: 500px;
    left: 500px;

    color: black;
  }
}
</style>
