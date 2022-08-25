<template>
  <div class="colePermission">
    <div>Before testing, please make sure setting.js The permissionMode in the file is code mode</div>
    <div style="margin-bottom: 15px">Your codeArr: {{ codeArr }}</div>
    Switch roles:
    <div>
      <el-radio-group v-model="switchRoles">
        <el-radio-button label="[1]">show CodePage</el-radio-button>
        <el-radio-button label="[]">hide CodePage</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup>
//Obtainstore和router
const codeArr = computed(() => {
  return localStorage.getItem('codeArr')
})
// const emit = defineEmits(['change'])
const switchRoles = computed({
  get() {
    const jsonData = localStorage.getItem('codeArr')
    if (jsonData) {
      return JSON.parse(jsonData)
    } else {
      return '[]'
    }
  },
  set(val) {
    localStorage.setItem('codeArr', JSON.stringify(val))
    location.reload()
  }
})
</script>

<style scoped lang="scss"></style>
