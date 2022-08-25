<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" class="pr-50px">
      <el-form-item label="Device No" prop="sn" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.sn" class="w-150px" placeholder="Device No" />
      </el-form-item>
      <el-form-item label="hardware version" prop="hardVersion" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.hardVersion" class="w-150px" placeholder="hardware version" />
      </el-form-item>
      <!--      <el-form-item label="软件(固件)版本" prop="softVersion" :rules="formRules.isNotNull" label-position="left">-->
      <!--        <el-input v-model="subForm.softVersion" class="w-150px" placeholder="软件(固件)版本" />-->
      <!--      </el-form-item>-->
      <el-form-item label="state：" prop="status" :rules="formRules.isNotNull" label-position="left">
        <el-select v-model="subForm.status" clearable placeholder="请选择" class="w-120px">
          <el-option label="Not out of stock" :value="0" />
          <el-option label="out of stock" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeFormModal">取 消</el-button>
        <el-button type="primary" @click="confirmBtnClick">Ok</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/*1.初始化引入和实例化*/
import { useCommon } from '@/hooks/global/useCommon'

const emit = defineEmits(['selectPageReq', 'hideComp'])

/*2.modalnew和修改*/
//new
const refForm = ref(null)
let subForm = reactive({
  id: '',
  sn: '',
  hardVersion: '',
  softVersion: '',
  createTime: '',
  status: '',
  remark: ''
})
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.id) {
        updateReq()
      } else {
        insertReq()
      }
    } else {
      return false
    }
  })
}
const { elMessage, formRules, elConfirm } = useElement()
const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  delete data.id
  axiosReq({
    url: '/integration-front/vci/insert',
    data: data,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    elMessage('Successfully saved')
    emit('selectPageReq')
    emit('hideComp')
  })
}
//修改
const reshowData = (row) => {
  Object.keys(row).forEach((fItem) => {
    Object.keys(subForm).forEach((sItem) => {
      if (fItem === sItem) {
        subForm[sItem] = row[sItem]
      }
    })
  })
}
let updateReq = () => {
  return axiosReq({
    url: '/integration-front/vci/updateById',
    data: subForm,
    method: 'put',
    bfLoading: true
  }).then(() => {
    elMessage('update completed')
    emit('selectPageReq')
    emit('hideComp')
  })
}

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = (isEdit, detailData) => {
  if (isEdit) {
    dialogTitle.value = `edit【${detailData.sn}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = 'Add【VCI】'
    dialogVisible.value = true
  }
}

let closeFormModal = () => {
  emit('hideComp')
}

defineExpose({
  showModal
})
//export属性到页面中使用
// let {levelList} = toRefs(state);
</script>

<style scoped lang="scss"></style>
