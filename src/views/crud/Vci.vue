<template>
  <div class="scroll-y">
    <!--operate-->
    <div class="mr-3 rowSS">
      <el-button type="primary" @click="addBtnClick">new</el-button>
      <el-button type="primary" @click="multiDelBtnClick">delete</el-button>
      <!--条件search-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-3">
        <el-form-item label-width="0px" label="" prop="sn" label-position="left">
          <el-input v-model="searchForm.sn" class="w-150px" placeholder="Device No" />
        </el-form-item>
        <el-form-item label-width="0px" label="" prop="status" label-position="left">
          <el-select v-model="searchForm.status" clearable placeholder="state" class="w-120px">
            <el-option label="Not out of stock" :value="0" />
            <el-option label="out of stock" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="0px" label="" prop="createTime" label-position="left">
          <el-date-picker
            v-model="startEndArr"
            type="datetimerange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 250px"
            range-separator="-"
            start-placeholder="start date"
            end-placeholder="end date"
            @change="dateTimePacking"
          />
        </el-form-item>
      </el-form>
      <!--Search按钮-->
      <el-button type="primary" @click="searchBtnClick">search</el-button>
      <div class="ml-4">
        <ImportExportComp
          import-file-url="/integration-front/vci/importExcel"
          import-valid-url="/integration-front/vci/validExcel"
          export-file-url="/integration-front/vci/exportExcel"
          :get-search-data="getSearchData"
          @reloadList="selectPageReq"
        />
        <el-button type="primary" @click="downloadTemplate">down template to test</el-button>
      </div>
    </div>
    <!--格和分页-->
    <el-table
      id="resetElementDialog"
      ref="refuserTable"
      height="calc(100vh - 280px)"
      border
      :data="VcitableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" prop="sn" label="Device No" min-width="100" />
      <el-table-column align="center" prop="hardVersion" label="hardware version" min-width="100" />
      <el-table-column align="center" prop="createTime" label="time" width="150" />
      <el-table-column align="center" prop="status" label="state" min-width="100">
        <template #default="{ row }">
          <span v-if="row.status === 0">Not out of stock</span>
          <h4 v-if="row.status === 1" style="color: green">out of stock</h4>
        </template>
      </el-table-column>
      <!--clickoperate-->
      <el-table-column align="center" label="operate" width="120px">
        <template #default="{ row }">
          <div class="rowSS">
            <el-button text size="small" @click="tableEditClick(row)">Edit</el-button>
            <el-button text size="small" @click="tableDelClick(row)">delete</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block columnCC mt-2 mb-5">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <VciForm v-if="showFrom" ref="refVciForm" @hideComp="hideComp" @selectPageReq="selectPageReq" />
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import VciForm from './VciForm.vue'
//Obtain子组件实例
const refVciForm = ref(null)

/*2.格operate和Search*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let VcitableData = ref([])
let searchForm = reactive({
  id: '',
  sn: '',
  hardVersion: '',
  softVersion: '',
  createTime: '',
  status: '',
  remark: ''
})
onMounted(() => {
  selectPageReq()
})

const getSearchData = () => {
  const data = Object.assign(searchForm, {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}

const { totalPage, startEndArr } = useCommon()
let selectPageReq = () => {
  let reqConfig = {
    url: '/integration-front/vci/selectPage',
    method: 'get',
    data: getSearchData(),
    isParams: true,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    VcitableData.value = resData.data?.records
    totalPage.value = resData.data?.total
  })
}

import tablePageHook from '@/hooks/useTablePage'
let { pageNum, pageSize, handleCurrentChange, handleSizeChange } = tablePageHook(selectPageReq)
//时间packing
const dateTimePacking = (timeArr) => {
  if (timeArr && timeArr.length === 2) {
    searchForm.startTime = timeArr[0]
    searchForm.endTime = timeArr[1]
  } else {
    searchForm.startTime = ''
    searchForm.endTime = ''
  }
}

const searchBtnClick = () => {
  //此处要重置页数，也是常出的bug
  pageNum.value = 1
  selectPageReq()
}

//添加和修改
let showFrom = ref(false)
let addBtnClick = () => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal()
  })
}
let tableEditClick = (row) => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal(true, row)
  })
}

const hideComp = () => {
  showFrom.value = false
}

//delete
let { elMessage, elConfirm } = useElement()
let deleteByIdReq = (id) => {
  return axiosReq({
    url: '/integration-front/vci/deleteById',
    data: { id: id },
    isParams: true,
    method: 'delete',
    bfLoading: true
  })
}
let tableDelClick = async (row) => {
  await elConfirm('Sure', `Are you sure you want to delete【${row.sn}】？`)
  deleteByIdReq(row.id).then(() => {
    selectPageReq()
    elMessage(`【${row.sn}】successfully deleted`)
  })
}
const multiDelBtnClick = async () => {
  let rowDeleteIdArr = []
  let deleteNameTitle = ''
  rowDeleteIdArr = multipleSelection.value.map((mItem) => {
    deleteNameTitle = deleteNameTitle + mItem.sn + ','
    return mItem.id
  })
  if (rowDeleteIdArr.length === 0) {
    elMessage('Form options cannot be empty', 'warning')
    return
  }
  let stringLength = deleteNameTitle.length - 1
  await elConfirm('delete', `Are you sure you want to delete${deleteNameTitle.slice(0, stringLength)}`)
  const data = rowDeleteIdArr
  axiosReq({
    url: `/integration-front/vci/deleteBatchIds`,
    data,
    method: 'DELETE',
    bfLoading: true
  }).then(() => {
    elMessage('successfully deleted')
    selectPageReq()
  })
}

//download template
const downloadTemplate = () => {
  const link = document.createElement('a')
  link.href = 'https://github.jzfai.top/file/template/export-import-template.xlsx'
  link.setAttribute('download', `import-export-template.xls`)
  document.body.appendChild(link)
  link.click()
}
</script>

<style scoped lang="scss">
/*Details*/
.detail-container {
  flex-wrap: wrap;
}

.detail-container-item {
  min-width: 40%;
  margin-bottom: 20px;
}

.detailDialog-title {
  margin-bottom: 14px;
  font-weight: bold;
  font-size: 16px;
}
</style>
