<template>
  <div>
    <el-button v-longpress="setData">long press command</el-button>
    <p>{{ data }}</p>
  </div>
</template>

<script setup>
let data = ref("");
const setData = () => {
  data.value = "Execute a long press command";
};
</script>

<style lang="scss" scoped></style>
