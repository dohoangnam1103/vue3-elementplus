<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="50vw"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" class="pr-50px">
      <el-form-item label="brand name" prop="name" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.name" class="w-150px" placeholder="brand name" />
      </el-form-item>
      <el-form-item label="Brand image address" prop="image" :rules="formRules.isNotNull" label-position="left">
        <div class="rowSE">
          <img v-if="subForm.image" :src="subForm.image" class="w-120px heightPx-120 border_radius5" />
          <div :class="[subForm.image && 'ml-1']" class="rowSS">
            <el-button type="primary" @click="goUploadFile">
              <i class="el-icon-upload2" />
              upload
              <input
                id="uploadFile"
                ref="refSettingFile"
                type="file"
                ccept=".png, .jpg"
                style="display: none"
                @change="fileUploadSave"
              />
            </el-button>
            <div class="ml-1">{{ chooseFileName }}</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="brand 的Initials" prop="letter" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.letter" maxlength="1" class="w-150px" placeholder="brand 的Initials" />
      </el-form-item>
      <el-form-item label="sort" prop="seq" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.seq" class="w-150px" placeholder="sort" />
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
const emit = defineEmits(['selectPageReq', 'hideComp'])
/*2.modalnew和修改*/
//new
let subForm = reactive({
  id: '',
  name: '',
  image: '',
  letter: '',
  seq: ''
})
const refForm = ref(null)
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
const { formRules, elMessage } = useElement()

const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  delete data.id
  axiosReq({
    url: '/integration-front/brand/insert',
    data: data,
    method: 'post', //--c
    bfLoading: true
  }).then(() => {
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
    url: '/integration-front/brand/updateById',
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
const { dialogTitle, dialogVisible, chooseFileName } = useCommon()
let showModal = (isEdit, detailData) => {
  if (isEdit) {
    dialogTitle.value = `Edit【${detailData.name}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = '添加【brand】'
    dialogVisible.value = true
  }
}
//关闭弹框
let closeFormModal = () => {
  emit('hideComp')
}

/*4.upload文件相关*/
const refSettingFile = ref(null)
const goUploadFile = () => {
  refSettingFile.value.click()
}

const fileUploadSave = () => {
  const formData = new FormData()
  formData.append('file', refSettingFile.value.files[0])
  axiosReq({
    url: '/basis-func/upload/file',
    timeout: 30000,
    data: formData,
    method: 'post',
    bfLoading: true,
    isUploadFile: true
  })
    .then((resData) => {
      let { path } = resData.data
      // 存储文件name称
      const filename = refSettingFile.value.value
      chooseFileName.value = filename.slice(filename.lastIndexOf('\\') + 1)
      subForm.image = `${import.meta.env.VITE_APP_IMAGE_URL}/${path}`
      console.log('subForm', subForm)
      refSettingFile.value = ''
    })
    .catch(() => {
      chooseFileName.value = ''
      subForm.image = ''
      refSettingFile.value = ''
    })
}

//export给refs使用
defineExpose({
  showModal
})

//export属性到页面中使用
// let {levelList} = toRefs(state);
</script>

<style scoped lang="scss"></style>
