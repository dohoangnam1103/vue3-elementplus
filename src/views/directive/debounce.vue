<template>
  <div>
    <el-button v-debounce="getData(123)" type="primary">Anti-spam button</el-button>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";

const getData = (str) => {
  return function () {
    console.log(str);
    ElMessage({
      type: "success",
      message: "pulling data",
    });
  };
};
onUnmounted(() => {
  ElMessage.closeAll();
});
</script>

<style lang="scss" scoped></style>
