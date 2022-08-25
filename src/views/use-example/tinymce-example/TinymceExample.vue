<template>
  <div class="scroll-y">
    <div class="mb-1">
      <el-button @click="setTinyContent">Set up text messages</el-button>
      <el-button @click="getTinyContent">Show text message</el-button>
      <el-button @click="clearTinyContent">empty content</el-button>
    </div>
    <Tinymce ref="refTinymce"  />
  </div>
</template>

<script setup>
import Tinymce from "@/components/Tinymce/index.vue";
/*tinymceoperate*/
const refTinymce = ref(null);
const setTinyContent = () => {
  if (refTinymce?.value) {
    refTinymce.value.setContent("The content");
  }
};
const { elMessage } = useElement();
const getTinyContent = () => {
  if (refTinymce?.value) {
    let content = refTinymce.value.getContent();
    elMessage(content);
  }
};
const clearTinyContent = () => {
  if (refTinymce?.value) {
    refTinymce.value.setContent("");
  }
};

</script>

<style scoped lang="scss"></style>
