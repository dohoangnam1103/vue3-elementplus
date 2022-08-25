<template>
  <div class="scroll-y">
    <div>mock usage example (used in dev environment)</div>
    <el-button type="primary" @click="listReq">Click to send mock request</el-button>
  </div>
</template>

<script setup>
// mock address https://blog.csdn.net/weixin_42067720/article/details/115579817
// import '@/mock/index.js'
import axios from 'axios'
const listReq = () => {
  axios.get('/getMapInfo').then((res) => {
    if (res.data) {
      console.log(res.data)
      alert(res.data.title)
    }
  })
}
</script>

<style scoped lang="scss"></style>
