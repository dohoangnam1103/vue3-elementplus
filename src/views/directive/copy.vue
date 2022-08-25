<template>
  <div class="box">
    <el-input v-model="input" placeholder="Enter the value to paste"></el-input>
    <el-button v-copy="input" type="primary">Copy to clipboard</el-button>
  </div>
</template>

<script setup>
let input = ref("");
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .el-input {
    margin-right: 10px;
  }
}
</style>
