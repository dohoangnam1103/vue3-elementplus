<template>
  <el-table
    ref="refSearchTable"
    row-key="originField"
    class="search-table-config"
    :data="searchTableData"
    border
    @selection-change="handleSearchSelection"
  >
    <el-table-column prop="tableName" label="name" align="center" width="120">
      <template #default="{ row }">
        <el-input v-model="row.tableName" placeholder="tableName" />
      </template>
    </el-table-column>
    <el-table-column prop="originField" label=" field name" align="center" width="120">
      <template #default="{ row }">
        <el-input v-model="row.originField" placeholder=" field name" />
      </template>
    </el-table-column>
    <el-table-column prop="desc" label=" field describe" width="120">
      <template #default="{ row }">
        <el-input v-model="row.desc" placeholder=" field describe" />
      </template>
    </el-table-column>
    <el-table-column prop="componentType" align="center" label="component type" width="400">
      <template #default="{ row }">
        <el-radio-group v-model="row.componentType">
          <el-radio
            v-for="(item, index) in searchTableComponentTypeArr"
            :key="index"
            :label="item.label"
            @click="chooseRowHandle(row)"
          >
            {{ item.title }}
          </el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column prop="width" align="center" label="width" width="60">
      <template #default="{ row }">
        <el-input v-model="row.width" placeholder="控件的width" />
      </template>
    </el-table-column>
    <el-table-column prop="rule" align="center" label="Check rules" width="100">
      <template #default="{ row }">
        <el-radio-group v-model="row.rule">
          <el-radio v-for="(item, index) in ruleMapping" :key="index" :label="item.key">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="api" label="Additional configuration (select, cascader)" width="180">
      <template #default="{ row }">
        <div class="text-left">
          <el-input
            v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
            v-model="row.api"
            type="textarea"
            rows="2"
            placeholder="请求地址"
          />
          <el-input
            v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
            v-model="row.method"
            class="mt-4px w-100px"
            placeholder="请求方法"
          />
          <el-input
            v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
            v-model="row.labelKey"
            class="mt-4px w-100px"
            placeholder="label-key"
          />
          <el-input
            v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
            v-model="row.valueKey"
            class="mt-4px w-100px"
            placeholder="value-key"
          />
          <el-input
            v-if="['select', 'radio', 'checkbox', 'switch'].includes(row.componentType)"
            v-model="row.optionData"
            class="mt-4px"
            type="textarea"
            rows="2"
            placeholder="data枚举"
          />
          <!--cascaderApi  -->
          <el-input
            v-if="['cascaderApi'].includes(row.componentType)"
            v-model="row.children"
            class="mt-4px w-100px"
            placeholder="childrenKey"
          />
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="width" align="center" label="operate" width="50">
      <template #default="{ row, $index }">
        <el-button text @click="deleteSearchItem(row, $index)">delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import {
  changeDashToCase,
  changeTheFirstWordToCase,
  searchTableComponentTypeArr,
  componentTypeMapping,
  tbTypeMapping,
  ruleMapping,
  splitDescReturnDesc,
  splitDescReturnOptionData,
  splitTheOptionArr,
  changeDashToCaseAndFirstWord
} from './generatorUtis'
import commonUtil from '@/utils/commonUtil'
const setSearchTableData = (checkColumnArr) => {
  checkColumnArr.forEach((fItem) => {
    const hasKey = commonUtil.findArrObjByKey(searchTableData, 'columnName', fItem.columnName)
    if (!hasKey) {
      fItem.field = changeDashToCase(fItem.columnName) //_转驼峰
      fItem.fieldCase = changeDashToCaseAndFirstWord(fItem.columnName)
      fItem.originField = fItem.columnName
      fItem.tbName = fItem.columnName

      fItem.type = tbTypeMapping(fItem.dataType) //data库和java中的type做映射
      fItem.componentType = componentTypeMapping(fItem.dataType, fItem.columnComment, fItem.columnName) //data库和前端控件中的type做映射
      fItem.rule = 'isNotNull'
      fItem.value = 'value'
      fItem.label = 'label'
      fItem.children = 'children'
      fItem.width = 120

      fItem.desc = splitDescReturnDesc(fItem.columnComment)
      fItem.optionData = splitDescReturnOptionData(fItem.columnComment)
      //api
      fItem.api = ''
      fItem.method = 'get'
      fItem.labelKey = 'label'
      fItem.valueKey = 'value'
      searchTableData.push(fItem)
    }
  })
}
/*Search配置*/
let currentChooseRow = $ref({})
const chooseRowHandle = (row) => {
  currentChooseRow = row
}
let searchTableData = $ref([])
let searchSelection = $ref([])
const handleSearchSelection = (val) => {
  searchSelection = val
}
//delete和new
const deleteSearchItem = (row, index) => {
  searchTableData.splice(index, 1)
}
//实现格拖拽sort
//拖拽
import generatorHook from './hook/generatorHook'
generatorHook(searchTableData, 'search-table-config')

const getSearchTableData = () => {
  searchTableData.forEach((fItem) => {
    fItem.optionDataArr = splitTheOptionArr(fItem.optionData)
  })
  return searchTableData
}

defineExpose({ setSearchTableData, getSearchTableData })
</script>

<style scoped lang="scss"></style>
