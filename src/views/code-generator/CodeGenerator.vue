<template>
  <div class="CodeGenerator scroll-y pb-5">
    <div class="mt-2 mb-2">
      <el-alert
        title="A new generation of low-code generation platform that provides data source capabilities and automatically generates templates based on vue3-admin-plus and micro-service-plus according to database fields.
       It can be generated using default templates and custom templates. After testing, it can improve the development efficiency of enterprises by about 40%."
        type="warning"
      />
    </div>
    <!--Project and author information configuration-->
    <div class="mb-1">Project and author information configuration</div>
    <el-form ref="refForm" label-width="150px" :inline="true" :model="poaForm" :rules="formRules" class="pr-50px">
      <el-form-item label="author" prop="author" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="poaForm.author" placeholder="author" />
      </el-form-item>
      <el-form-item label="packageName" prop="packageName" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="poaForm.packageName" placeholder="packageName" />
      </el-form-item>
      <el-form-item label="serviceName" prop="serviceName" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="poaForm.serviceName" placeholder="serviceName" />
      </el-form-item>
      <el-form-item label="modalTitle" prop="modalTitle" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="poaForm.modalTitle" placeholder="modalTitle" />
      </el-form-item>
    </el-form>
    <!-- Front-end page parameter configuration-->
    <div class="mt-3 mb-1">Front-end page parameter configuration</div>
    <el-form ref="refCcForm" label-width="150px" :inline="true" :model="ccForm" :rules="formRules" class="pr-5">
      <el-form-item label="upFileApi" prop="upFileApi" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="ccForm.upFileApi" placeholder="upFileApi" />
      </el-form-item>
      <el-form-item label="isAdd" prop="isAdd" :rules="formRules.isNotNull" label-position="left">
        <el-switch v-model="ccForm.isAdd" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item label="isDelete" prop="isDelete" :rules="formRules.isNotNull" label-position="left">
        <el-switch v-model="ccForm.isDelete" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item label="isMulDelete" prop="isMulDelete" :rules="formRules.isNotNull" label-position="left">
        <el-switch v-model="ccForm.isMulDelete" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item label="isEdit" prop="isEdit" :rules="formRules.isNotNull" label-position="left">
        <el-switch v-model="ccForm.isEdit" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item label="isPagination" prop="isPagination" :rules="formRules.isNotNull" label-position="left">
        <el-switch v-model="ccForm.isPagination" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item label="isDetail" prop="isDetail" :rules="formRules.isNotNull" label-position="left">
        <el-switch v-model="ccForm.isDetail" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <!--      <el-form-item label="isTableMulChoose" prop="isTableMulChoose" :rules="formRules.isNotNull" label-position="left">-->
      <!--        <el-switch v-model="ccForm.isTableMulChoose" inline-prompt active-color="#13ce66" inactive-color="#ff4949" />-->
      <!--      </el-form-item>-->
    </el-form>
    <!-- Obtain库和information -->
    <div class="mb-1 mt-3">Get library and table information (if you want to use it, please provide your own data source interface first)</div>
    <div class="rowSS">
      <el-input v-model="dataBaseUrl" class="w-500px" placeholder="dataBaseUrl" />
      <el-button type="primary" @click="searchDataBase">Search</el-button>
    </div>
    <div class="mt-3 mb-1">Please select (multiple support)</div>
    <el-radio-group v-model="dbRadio" @click.stop>
      <el-radio v-for="(item, index) in dbData" :key="index" :label="item.tableName" @change="dbRadioClick(item)">
        {{ item.tableName }}({{ item.tableComment }})
      </el-radio>
    </el-radio-group>
    <div class="mt-3 mb-1">Chosen</div>
    <el-radio-group v-model="chooseDbRadio">
      <el-radio
        v-for="(item, index) in chooseDbArr"
        :key="index"
        :label="item.tableName"
        @click="dbChooseRadioClick(item)"
      >
        {{ item.tableName }}({{ item.tableComment }})
        <el-button text @click="deleteChooseRadio(index)">delete</el-button>
      </el-radio>
    </el-radio-group>
    <!-- information-->
    <div class="mb-1 mt-3">information</div>
    <div class="rowSS mt-1">
      <el-input v-model="dbTableUrl" class="w-500px" placeholder="dbTableUrl" />
      <el-input v-model="tbName" class="w-150px" placeholder="tbName" />
      <el-button :disabled="!tbName" type="primary" @click="searchDbTable">Search field </el-button>
    </div>

    <!--  多关系配置(用于多Search)  -->
    <div class="mt-3 mb-1">Multi-field relationship configuration</div>
    <div class="mb-1 rowSS">
      <el-input v-model="multiTableName" placeholder="Multiple entity class name" class="w-150px mr-2" />
      <el-input v-model="multiTableDesc" placeholder="Multiple related notes" class="w-150px" />
    </div>
    <div v-for="(item, index) in multiTableConfig" :key="index" class="rowSC">
      <div class="mr-1">{{ item.originTableName }}：</div>
      <el-radio-group v-model="item.orgAssociationKey">
        <el-radio
          v-for="(pkaItem, pkaIndex) in item.priKeyArr"
          :key="pkaIndex"
          :label="pkaItem"
          @click="pkaRadioClick(item, pkaItem)"
        >
          {{ pkaItem }}
        </el-radio>
      </el-radio-group>
      <ElSvgIcon class="ml-1" name="CircleClose" :size="14" style="cursor: pointer" @click="deleteMultiTable(index)" />
    </div>
    <!--  显示 field information（可多选） -->
    <div class="mb-1 mt-3 rowSS">
      <div> field （Click to select）</div>
      <el-button class="ml-1" type="primary" @click="checkAllColumn">select all</el-button>
    </div>
    <div class="mt-1">
      <el-button
        v-for="(item, index) in tbData"
        :key="index"
        type="success"
        text
        :label="item"
        @click="checkColumnClick(item)"
      >
        {{ item.columnName }}({{ item.columnComment }})
      </el-button>

      <!-- Chosen field -->
      <div class="mt-3 mb-1">
        <span>Chosen field </span>
        <el-button type="danger" class="ml-1" @click="clearAllColumn">empty</el-button>
      </div>
      <div class="rowSS flex-wrap">
        <div v-for="(item, index) in checkColumnArr" :key="index" class="rowSC mr-2 mt-1">
          <span style="color: #e6a23c">{{ item.columnName }}({{ item.columnComment }})</span>
          <ElSvgIcon name="CircleClose" :size="14" style="cursor: pointer" @click="deleteColumn(index)" />
        </div>
      </div>
      <div v-if="checkColumnArr.length" class="mt-2">
        <el-button type="primary" @click="generatorToSearch">生成到Search</el-button>
        <el-button type="primary" @click="generatorToTable">生成到格</el-button>
        <el-button type="primary" @click="generatorToForm">生成到单</el-button>
      </div>
    </div>

    <!--  Search配置  -->
    <div class="mt-3 mb-1">SearchConfiguration (support drag and drop sort)</div>
    <SearchTableConfig ref="refSearchTableConfig" />
    <!--  grid configuration  -->
    <div class="mt-3 mb-1">grid configuration</div>
    <ListTableConfig ref="refListTableConfig" />
    <!--  Submit from single configuration  -->
    <div class="mt-3 mb-1">Submit from single configuration</div>
    <FormTableConfig ref="refFormTableConfig" />

    <!-- Defined template generation-->
    <div class="mt-3 mb-1">Defined template generation</div>
    <div class="rowSS">
      <el-button type="success" @click="generatorFrontTempZip">Generate front-end template (element-plus)</el-button>
      <el-button type="success" @click="generatorBackTempZip">Generate a backend template (mybatis-plus supports many)</el-button>
      <el-button type="success" @click="generatorFrontBackTempZip">Generate front-end and back-end templates (element-plus mybatis-plus)</el-button>
    </div>
    <CustomUploadVms ref="refCustomUploadVms" />
  </div>
</template>

<script setup>
import {
  changeDashToCase,
  changeDashToCaseAndFirstWord,
  changeTheFirstWordToCase,
  removeTbOrT,
  tbTypeMapping
} from '@/views/code-generator/generatorUtis'
import CustomUploadVms from './CustomUploadVms.vue'

const { currentTime } = useCommon()
const { formRules, elMessage } = useElement()
import commonUtil from '@/utils/commonUtil'
/*Project and author information configuration*/
const poaForm = reactive({
  author: 'Brother Panda',
  packageName: 'top.kuanghua.integrationfront',
  serviceName: 'integration-front',
  dataTime: '',
  modalTitle: 'I am the title of the modal',
  isMultiTable: false
})
poaForm.dataTime = currentTime
/*Front-end page parameter configuration*/
const ccForm = reactive({
  upFileApi: '/basis-func/upload/file',
  isAdd: true,
  isDelete: true,
  isMulDelete: true,
  isEdit: true,
  isPagination: true,
  isDetail: true,
  isTableMulChoose: true
})
/*Obtain库和information*/
//库
let dataBaseUrl = $ref(
  'https://github.jzfai.top/micro-service-api/basis-func/dataBase/getAllDatabaseOrTable/micro-service-plus'
)
let dbRadio = $ref(null)
let chooseDbArr = $ref([])
let chooseDbRadio = $ref(null)
let dbData = $ref([])
const dbRadioClick = (item) => {
  if (chooseDbArr.length >= 3) {
    elMessage('Support up to 3 choices', 'warning')
    return
  }
  if (commonUtil.findArrObjByKey(chooseDbArr, 'tableName', item.tableName)) {
    elMessage(`${item.tableName} existed`, 'warning')
    return
  }
  chooseDbArr.push(item)
}

//保存tb的information
let currentTableInfo = $ref({})
const dbChooseRadioClick = (item) => {
  tbName = item.tableName
  tbData = []
  currentTableInfo = {
    tableName: changeDashToCase(removeTbOrT(item.tableName)),
    originTableName: item.tableName,
    tableDesc: item.tableComment,
    tableNameCase: changeTheFirstWordToCase(changeDashToCase(removeTbOrT(item.tableName))),
    uniKey: 'id'
  }
}
const deleteChooseRadio = (index) => {
  chooseDbArr.splice(index, 1)
  tbData = []
}
const searchDataBase = () => {
  let reqConfig = {
    baseURL: dataBaseUrl,
    method: 'get',
    isParams: true
  }
  axiosReq(reqConfig).then(({ data }) => {
    dbData = data
  })
}
//
let dbTableUrl = $ref(dataBaseUrl)
let tbName = $ref('')
let tbData = $ref([])
let multiTableConfig = $ref([])
const deleteMultiTable = (index) => {
  multiTableConfig.splice(index, 1)
}
const searchDbTable = () => {
  let reqConfig = {
    baseURL: `${dataBaseUrl}/${tbName}`,
    method: 'get',
    isParams: true
  }
  axiosReq(reqConfig).then(({ data }) => {
    //得到主键key
    let priKeyArr = []
    let priKeyItemArr = []
    data.forEach((fItem) => {
      if (fItem.columnKey) {
        priKeyArr.push(fItem.columnName)
        priKeyItemArr.push(fItem)
      }
    })
    //插入information
    const firstData = data[0]
    const priKeyArrFirst = priKeyArr[0]
    const priKeyArrLast = priKeyArr[priKeyArr.length - 1]
    const priKeyArrItemFirst = priKeyItemArr[0]
    const priKeyArrItemLast = priKeyItemArr[priKeyItemArr.length - 1]
    if (!commonUtil.findArrObjByKey(multiTableConfig, 'originTableName', firstData.tableName)) {
      let multiTableNameString = ''
      multiTableConfig.forEach((fItem) => {
        multiTableNameString += fItem.tableNameCase.substr(
          fItem.tableNameCase.length - 4,
          fItem.tableNameCase.length - 1
        )
      })
      multiTableName = multiTableNameString

      multiTableConfig.push({
        ...currentTableInfo,
        tableFieldArr: data.map((fItem) => {
          fItem.field = changeDashToCase(fItem.columnName) //_转驼峰
          fItem.desc = fItem.columnComment
          fItem.fieldCase = changeDashToCaseAndFirstWord(fItem.columnName) //_转驼峰
          fItem.originField = fItem.columnName
          fItem.tbName = fItem.columnName
          fItem.type = tbTypeMapping(fItem.dataType)
          return fItem
        }),
        uniKey: changeDashToCase(priKeyArrFirst),
        orgUniKey: priKeyArrFirst,
        uniKeyType: tbTypeMapping(priKeyArrItemFirst.dataType),
        priKeyArr,
        priKeyItemArr,
        orgAssociationKey: priKeyArrLast,
        associationKey: changeDashToCase(priKeyArrLast),
        associationKeyCase: changeTheFirstWordToCase(changeDashToCase(priKeyArrLast)),
        associationKeyType: tbTypeMapping(priKeyArrItemLast.dataType)
      })
    }

    tbData = data
  })
}
//多关系配置
let multiTableName = $ref(null)
let multiTableDesc = $ref('Annotation for multiple entity classes')
const pkaRadioClick = (item, pkaItem) => {
  item.associationKey = changeDashToCase(pkaItem)
}
//select all
const checkAllColumn = () => {
  checkColumnArr = JSON.parse(JSON.stringify(tbData))
}
const clearAllColumn = () => {
  checkColumnArr = []
}

const checkColumnClick = (cItem) => {
  if (!commonUtil.findArrObjByKey(checkColumnArr, 'columnName', cItem.columnName)) {
    checkColumnArr.push(cItem)
  }
}
const deleteColumn = (dIndex) => {
  checkColumnArr.splice(dIndex, 1)
}
let checkColumnArr = $ref([])
/*显示 field information（可多选）*/
//Search
import SearchTableConfig from './SearchTableConfig.vue'
const refSearchTableConfig = $ref(null)
const generatorToSearch = () => {
  refSearchTableConfig.setSearchTableData(checkColumnArr)
}
//table
import ListTableConfig from './ListTableConfig.vue'
const refListTableConfig = $ref(null)
const generatorToTable = () => {
  refListTableConfig.setListTableData(checkColumnArr)
}
//Form
import FormTableConfig from './FormTableConfig.vue'
const refFormTableConfig = $ref(null)
const generatorToForm = () => {
  refFormTableConfig.setFormTableData(checkColumnArr)
}

//生成模板
const generatorSubData = () => {
  return new Promise((resolve) => {
    const searchTableConfig = refSearchTableConfig.getSearchTableData()
    const searchTableGroup = commonUtil.arrGroupByKey(searchTableConfig, 'tableName')
    const listTableConfig = refListTableConfig.getListTableData()
    const listTableGroup = commonUtil.arrGroupByKey(searchTableConfig, 'tableName')
    const formTableConfig = refFormTableConfig.getFormTableData()
    const formTableGroup = commonUtil.arrGroupByKey(searchTableConfig, 'tableName')

    //多data处理
    multiTableConfig.forEach((fItem) => {
      fItem.tableQueryArr = searchTableGroup[fItem.originTableName]
      fItem.tableShowArr = listTableGroup[fItem.originTableName]
      fItem.tableFormArr = formTableGroup[fItem.originTableName]
    })

    if (multiTableConfig.length > 1) {
      poaForm.isMultiTable = true
    }

    //取multiTableConfig第一项
    const multiTableFistItem = multiTableConfig[0]
    //设置dbTableConfig
    let dbTableConfig = {
      multiTableName,
      multiTableNameCase: changeTheFirstWordToCase(multiTableName),
      multiTableDesc: multiTableDesc,
      ...multiTableFistItem
    }
    let reqApiPre = ''
    if (poaForm.isMultiTable) {
      reqApiPre = `/${poaForm.serviceName}/${dbTableConfig.multiTableName}`
    } else {
      reqApiPre = `/${poaForm.serviceName}/${dbTableConfig.tableName}`
    }

    ccForm.isTableMulChoose = false
    if (multiTableConfig.length > 1) {
      ccForm.isTableMulChoose = true
    }

    let generatorData = {
      projectOrAuthor: {
        ...poaForm
      },
      commonConfig: {
        ...ccForm
      },
      multiTableConfig,
      dbTableConfig,
      apiConfig: {
        queryApi: `${reqApiPre}/selectPage`,
        queryApiType: 'get',
        insertApi: `${reqApiPre}/insert`,
        insertApiType: 'post',
        updateApi: `${reqApiPre}/updateById`,
        updateApiType: 'update',
        deleteApi: `${reqApiPre}/deleteById`,
        deleteApiType: 'delete',
        deleteMultiApi: `${reqApiPre}/deleteBatchIds`,
        deleteMultiApiType: 'delete',
        detailApi: `${reqApiPre}/selectById`,
        detailApiType: 'get'
      },
      queryConfig: searchTableConfig,
      tableConfig: listTableConfig,
      formConfig: formTableConfig
    }
    resolve(generatorData)
  })
}

/**
 * 生成前端模版
 * @return
 * @author Brother Panda
 * @date 2022/6/26 14:40
 */
const generatorFrontTempZip = async () => {
  let generatorData = await generatorSubData()
  let reqConfig = {
    url: '/basis-func/generator/generatorFrontTempZip',
    method: 'post',
    isDownLoadFile: true,
    data: generatorData
  }
  axiosReq(reqConfig).then((res) => {
    //得到主键key
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}

/**
 * 生成前端模版
 * @return
 * @author Brother Panda
 * @date 2022/6/26 14:40
 */
const generatorBackTempZip = async () => {
  let generatorData = await generatorSubData()
  let reqConfig = {
    url: '/basis-func/generator/generatorBackTempZip',
    method: 'post',
    isDownLoadFile: true,
    data: generatorData
  }
  axiosReq(reqConfig).then((res) => {
    //得到主键key
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}

/**
 * 生成前后的模版
 * @return
 * @author Brother Panda
 * @date 2022/6/26 14:40
 */
const generatorFrontBackTempZip = async () => {
  let generatorData = await generatorSubData()
  let reqConfig = {
    url: '/basis-func/generator/generatorFrontBackTempZip',
    method: 'post',
    isDownLoadFile: true,
    data: generatorData
  }
  axiosReq(reqConfig).then((res) => {
    //得到主键key
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}

defineExpose({ generatorSubData })
</script>

<style scoped lang="scss"></style>
