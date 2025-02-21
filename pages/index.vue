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

async function drawGrid() {
  const canvasElement = canvasElemRef.value;
  const ctx = canvasElement.getContext("2d");
  const size = 50 * scale;

  // this is smart af, would never have come up with this myself
  const offsetX = translateX.value % size;
  const offsetY = translateY.value % size;

  const { width, height } = canvasElement;

  for (let x = offsetX; x < width; x += size) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = offsetY; y < height / size; y += size) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.strokeStyle = "white"
  ctx.lineWidth = 1;
  ctx.stroke()
}

function startPanning(e) {
  if (!e.button === 1) {
    return
  }
  isPanning.value = true;

  info("middle button my lord")

  iniX.value = e.clientX - translateX.value;
  iniY.value = e.clientY - translateY.value;
}

function renderGrid() {
  const canvasElement = canvasElemRef.value;

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  drawGrid();
  if (isPanning.value) {
    pan()
  }
}

function pan() {
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
  renderGrid();
  info("ya its rewind time");
});
</script>

<template>
  <div @mousedown="startPanning" @mousemove="renderGrid" @mouseup="onMouseUp" class="the-wrapper">
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
