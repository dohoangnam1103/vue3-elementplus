<template>
  <div>
    <div>ref1:{{ ref1 }},ref2:{{ ref2 }}</div>
    <el-button @click="hookExample">Execute the hook method</el-button>
  </div>
</template>

<script setup>
import testHooks from '@/hooks/useTest'
const { ref1, ref2, hooksFunc } = testHooks()
const hookExample = () => {
  hooksFunc()
}

const refTest = ref('111')
console.log(`Obtain到hookexport的data${ref2}`)
console.log(`Obtain到hookexport的data${ref1}`)
</script>

<style scoped lang="scss"></style>
