<template>
  <div id="CustomUploadVms">
    <div class="mt-4">Custom template upload (make sure the data source field is selected)</div>

    <div class="mt-3 mb-1 rowSS">
      <div>Generate front-end templates (multiple templates are uploaded together, support drag and drop)</div>
      <el-button text type="danger" @click="downloadTmpFront">Click to download the template</el-button>
    </div>
    <MulUploadComp ref="refMulUploadComp" @uploadTheVmsTemp="uploadFrontTemp" />
    <div class="mt-3 mb-1 rowSS">
      <div>Generate backend template</div>
      <el-button text type="danger" @click="downloadTmpBack">Click to download the template</el-button>
    </div>
    <MulUploadComp ref="refMulUploadComp" @uploadTheVmsTemp="uploadBackTemp" />
    <div class="mt-3 mb-1">
      Customize the generated template (only provide data source capabilities, what is the imported template, what will be returned, and the slot field in the template will be filled after returning)）
    </div>
    <MulUploadComp ref="refMulUploadComp" @uploadTheVmsTemp="uploadFrontAndBackTemp" />
  </div>
</template>

<script setup>
import MulUploadComp from './MulUploadComp.vue'

let { proxy } = getCurrentInstance()
const uploadFrontTemp = async (uploadFileList) => {
  let formData = new FormData()
  uploadFileList.forEach((fItem) => {
    formData.append('file', fItem)
  })
  //Obtainparent中的jsondata
  let jsonData = await proxy.$parent.generatorSubData()
  formData.append('jsonData', JSON.stringify(jsonData))
  axiosReq({
    url: '/basis-func/generator/generatorFrontCustomTemp',
    data: formData,
    method: 'post',
    bfLoading: true,
    isUploadFile: true,
    isDownLoadFile: true
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}

/**
 *下载前端模版
 * @return
 * @author Brother Panda
 * @date 2022/6/26 18:33
 */
const downloadTmpFront = () => {
  const link = document.createElement('a')
  link.href = 'https://github.jzfai.top/file/velocity-template/front-vms.zip'
  link.setAttribute('download', `front-vms.zip`)
  document.body.appendChild(link)
  link.click()
}
/**
 *下载后端模版
 * @return
 * @author Brother Panda
 * @date 2022/6/26 18:33
 */
const downloadTmpBack = () => {
  const link = document.createElement('a')
  link.href = 'https://github.jzfai.top/file/velocity-template/back-vms.zip'
  link.setAttribute('download', `ack-vms.zip`)
  document.body.appendChild(link)
  link.click()
}

const uploadBackTemp = async (uploadFileList) => {
  let formData = new FormData()
  uploadFileList.forEach((fItem) => {
    formData.append('file', fItem)
  })
  //Obtainparent中的jsondata
  let jsonData = await proxy.$parent.generatorSubData()
  formData.append('jsonData', JSON.stringify(jsonData))
  axiosReq({
    url: '/basis-func/generator/generatorBackCustomTemp',
    data: formData,
    method: 'post',
    bfLoading: true,
    isUploadFile: true,
    isDownLoadFile: true
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}
const uploadFrontAndBackTemp = async (uploadFileList) => {
  let formData = new FormData()
  uploadFileList.forEach((fItem) => {
    formData.append('file', fItem)
  })
  //Obtainparent中的jsondata
  let jsonData = await proxy.$parent.generatorSubData()
  formData.append('jsonData', JSON.stringify(jsonData))
  axiosReq({
    url: '/basis-func/generator/generatorCustomTemp',
    data: formData,
    method: 'post',
    bfLoading: true,
    isUploadFile: true,
    isDownLoadFile: true
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}
</script>

<style scoped lang="scss"></style>
