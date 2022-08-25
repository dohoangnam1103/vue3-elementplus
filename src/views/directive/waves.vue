<template>
  <div>
    <el-button v-waves type="primary">Effect click</el-button>
    <div v-waves class="box"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.box {
  width: 100px;
  height: 100px;
  margin-top: 10px;
  background-color: pink;
}
</style>
