<script setup lang="ts">
const cellData = reactive({

})

const rows = ref(20);
const cols = ref(8);

const grid = computed(() => {
  new Array(rows.value * cols.value).fill(null);
})
</script>

<template>
<div class="theWrapper">
  a
  <div class="theGrid">
    <div v-for="(cell, index) in grid" :key="index" class="cell">a</div>
  </div>
</div>
</template>

<style scoped>

</style>