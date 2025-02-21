<script setup>
import { ref, onMounted } from "vue";
import { info } from "@tauri-apps/plugin-log";

// conf

const gridSize = ref(50);

// conf


const canvasElemRef = ref(null);

function test() {
  info("ya its rewind time");
  info(canvasElemRef.value);
  info("huh");

  const gridSize = ref(50);

  info((window.innerWidth/50).toString());
  info("a");
}

async function drawGrid(ctx, size) {
  for (let i = 0; i < window.innerWidth/size; i++) {
    ctx.moveTo(0, i * size);
    ctx.lineTo(window.innerWidth, i * size);

    ctx.moveTo(i * size, 0);
    ctx.lineTo(i * size, window.innerHeight);
  }
  ctx.strokeStyle = "white"
  ctx.stroke()
}

function onMouseDown(e) {
  if (e.button === 1) {
    info("midlle button my lord")
  }
}

function renderGrid() {
  const canvasElement = canvasElemRef.value;

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  const ctx = canvasElement.getContext("2d");

  drawGrid(ctx, gridSize.value);
}

function onMouseUp(e) {
  if (e.button === 1) {
    info("middle button ran away")
  }
}

onMounted(() => {
  renderGrid();
  info("ya its rewind time");
});
</script>

<template>
  <div @mousedown="onMouseDown" @mousemove="renderGrid" @mouseup="onMouseUp" class="the-wrapper">
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
