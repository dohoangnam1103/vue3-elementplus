<template>
  <div class="scroll-y">
    <div>This is the parent component</div>
    <el-button @click="childMethod">childMethod</el-button>

    <!--v-model sync -->
    <Children ref="refChildren" v-model:childrenTitle="parentTitle" father-name="Vue3Template" @emitParent="emitParent">
      <!--default slot v-slot -->
      <template #default>
        <div>default slot</div>
      </template>
      <!--with nameslot// v-slot:header -->
      <template #header>
        <div>with nameslot</div>
      </template>
      <!--作用域slot  //v-slot:footer-->
      <template #footer="{ testProps }">
        <div>
          {{ testProps }}
        </div>
      </template>
    </Children>
  </div>
</template>

<script setup>
//script-setup vue官方说明
//https://v3.cn.vuejs.org/api/sfc-script-setup.html#使用组件
import Children from './Children.vue'

const refChildren = ref(null)

onMounted(() => {
  /*Obtain子元素方法*/
  console.log(refChildren.value)
})
const childMethod = () => {
  console.log(refChildren.value.childMethod())
  console.log(refChildren.value.childRef)
}
const emitParent = (data) => {
  console.log('得到子组件的information111', data)
}
const fartherMethod = () => {
  console.log('fartherMethod')
}
//provide
provide('title', 'provide and inject using')

//v-model sync
const parentTitle = ref('parentTitle')

watch(
  () => parentTitle.value,
  (oldValue, newValue) => {
    console.log('触发parent更新了', oldValue, newValue)
  },
  { immediate: true }
)

defineExpose({ fartherMethod })
</script>

<style scoped lang="scss"></style>
