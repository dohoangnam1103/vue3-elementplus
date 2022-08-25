<template>
  <div class="scroll-y">
    <!--operate-->
    <div class="mr-3 rowSS">
      <el-button type="primary" @click="addBtnClick">
        <el-icon style="vertical-align: middle">
          <FolderAdd />
        </el-icon>
        <span style="vertical-align: middle">Increase</span>
      </el-button>
      <el-button type="primary" @click="multiDelBtnClick">
        <el-icon style="vertical-align: middle">
          <Delete />
        </el-icon>
        <span style="vertical-align: middle">delete</span>
      </el-button>
      <!--条件search-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-2">
        <el-form-item label-width="0px" label="" prop="username" label-position="left">
          <!--  --c -->
          <el-input v-model="searchForm.name" class="w-150px" placeholder="brand name" />
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
      <el-button type="primary" @click="searchBtnClick">Search</el-button>
    </div>
    <!--格和分页-->
    <el-table
      id="resetElementDialog"
      ref="refuserTable"
      :height="`calc(100vh - ${settings.delWindowHeight})`"
      border
      :data="usertableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column align="center" prop="name" label="brand name" min-width="100" />
      <el-table-column align="center" prop="image" label="Brand image address" min-width="100">
        <template #default="{ row }">
          <img :src="row.image" class="w-120px heightPx-120" style="border-radius: 10px" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="letter" label="Initials" width="80" />
      <el-table-column align="center" prop="seq" label="sort" width="80" />
      <el-table-column align="center" prop="createTime" label="creation time" width="140" />
      <el-table-column align="center" prop="updateTime" label="update time" width="140" />
      <!--clickoperate-->
      <el-table-column fixed="right" align="center" label="operate" width="180">
        <template #default="{ row }">
          <el-button text size="small" @click="tableEditClick(row)">Edit</el-button>
          <el-button text size="small" @click="tableDetailClick(row)">Details</el-button>
          <el-button text size="small" @click="tableDelClick(row)">delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block columnCC mt-2">
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
    <!--Details-->
    <el-dialog v-model="detailDialog" :title="dialogTitle" width="500px" :close-on-click-modal="false">
      <div class="detail-container rowBC">
        <div class="detail-container-item">brand name：{{ detailData.name }}</div>
      </div>
      <div class="detail-container rowBC">
        <div class="detail-container-item">brand Initials：{{ detailData.letter }}</div>
      </div>
      <div class="detail-container rowBC">
        <div class="detail-container-item">sort：{{ detailData.seq }}</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialog = false">Ok</el-button>
        </span>
      </template>
    </el-dialog>
    <CRUDForm v-if="showFrom" ref="refCRUDForm" @hideComp="hideComp" @selectPageReq="selectPageReq" />
  </div>
</template>
<script>
export default {
  name: 'Brand'
}
</script>
<script setup>
import { Delete, FolderAdd } from '@element-plus/icons-vue'
/*1.初始化引入和实例化*/
import settings from '@/settings'
import CRUDForm from './CRUDForm.vue'
onActivated(() => {
  console.log('onActivated')
})
onDeactivated(() => {
  console.log('onDeactivated')
})
/*2.格operate和Search*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let usertableData = ref([])
let searchForm = reactive({
  id: '',
  name: '',
  image: '',
  letter: '',
  seq: ''
})
onMounted(() => {
  selectPageReq()
})

let { startEndArr, totalPage } = useCommon()
let selectPageReq = () => {
  const data = Object.assign(searchForm, {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  let reqConfig = {
    url: '/integration-front/brand/selectPage',
    method: 'get',
    data,
    isParams: true
  }
  axiosReq(reqConfig).then((resData) => {
    usertableData.value = resData.data?.records
    totalPage = resData.data?.total
  })
}
import tablePageHook from '@/hooks/useTablePage'
let { pageNum, pageSize, handleCurrentChange, handleSizeChange } = tablePageHook(selectPageReq)
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
//delete相关
let { elMessage, elConfirm } = useElement()
const refuserTable = ref(null)
const multiDelBtnClick = () => {
  let rowDeleteIdArr = []
  let deleteNameTitle = ''
  rowDeleteIdArr = multipleSelection.value.map((mItem) => {
    deleteNameTitle = deleteNameTitle + mItem.name + ','
    return mItem.id
  })
  if (rowDeleteIdArr.length === 0) {
    elMessage('Form options cannot be empty', 'warning')
    return
  }
  let stringLength = deleteNameTitle.length - 1
  elConfirm('delete', `Are you sure you want to delete【${deleteNameTitle.slice(0, stringLength)}】`)
    .then(() => {
      const data = rowDeleteIdArr
      axiosReq({
        url: `/integration-front/brand/deleteBatchIds`,
        data,
        method: 'DELETE',
        bfLoading: true
      }).then((res) => {
        elMessage('successfully deleted')
        selectPageReq()
      })
    })
    .catch(() => {})
}
let deleteByIdReq = (id) => {
  return axiosReq({
    url: '/integration-front/brand/deleteById',
    data: { id: id },
    isParams: true,
    method: 'delete',
    bfLoading: true
  })
}
let tableDelClick = (row) => {
  elConfirm('Sure', `Are you sure you want to delete【${row.name}】？`)
    .then(() => {
      deleteByIdReq(row.id).then(() => {
        selectPageReq()
        elMessage(`【${row.name}】successfully deleted`)
      })
    })
    .catch(() => {})
}
//添加和修改
let showFrom = ref(false)
const refCRUDForm = ref(null)
let addBtnClick = () => {
  showFrom.value = true
  nextTick(() => {
    refCRUDForm.value.showModal()
  })
}
onMounted(() => {
  console.log('import', import.meta.env.VITE_APP_IMAGE_URL)
})
const hideComp = () => {
  showFrom.value = false
}
let tableEditClick = (row) => {
  getDetailByIdReq(row.id).then((resData) => {
    showFrom.value = true
    nextTick(() => {
      refCRUDForm.value.showModal(true, resData.data)
    })
  })
}
/*3.Detailsmodal*/
let detailData = ref({})
let { dialogTitle, detailDialog } = useElement()
let tableDetailClick = (row) => {
  dialogTitle.value = `Details【${row.name}】`
  getDetailByIdReq(row.id).then((resData) => {
    detailData.value = resData.data
    detailDialog.value = true
  })
}
let getDetailByIdReq = (id) => {
  return axiosReq({
    url: '/integration-front/brand/selectById',
    data: { id }, //--c
    isParams: true,
    method: 'get'
  })
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
