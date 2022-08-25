<template>
  <div class="scroll-y">
    <div className="mb-1">line chart</div>
    <div className="rowSS">
      <!-- <div id="echartsContainerLineF" style="width: 550px; height: 400px"></div> -->
      <div id="echartsContainerLineS" style="width: 550px; height: 400px"></div>
    </div>
    <div className="mb-1">Histogram</div>
    <div className="rowSS">
      <div id="echartsContainerBarF" style="width: 550px; height: 400px"></div>
      <div id="echartsContainerBarS" style="width: 550px; height: 400px"></div>
    </div>

    <div className="mb-1">Pie chart</div>
    <div className="rowSS">
      <div id="echartsContainerPieF" style="width: 550px; height: 400px"></div>
      <div id="echartsContainerPieS" style="width: 550px; height: 400px"></div>
    </div>
  </div>
</template>
<script setup>
//echarts 例子地址 https://echarts.apache.org/examples/zh/index.html#chart-type-line
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
let echartsInstanceF = ref(null)
const initEchartsF = () => {
  echartsInstanceF.value = echarts.init(document.getElementById('echartsContainerLineF'))
  let option = {
    title: {
      text: 'Distribution of electricity consumption in a day',
      subtext: 'pure fiction'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '00:00',
        '01:15',
        '02:30',
        '03:45',
        '05:00',
        '06:15',
        '07:30',
        '08:45',
        '10:00',
        '11:15',
        '12:30',
        '13:45',
        '15:00',
        '16:15',
        '17:30',
        '18:45',
        '20:00',
        '21:15',
        '22:30',
        '23:45'
      ]
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} W'
      },
      axisPointer: {
        snap: true
      }
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: 6,
          color: 'green'
        },
        {
          gt: 6,
          lte: 8,
          color: 'red'
        },
        {
          gt: 8,
          lte: 14,
          color: 'green'
        },
        {
          gt: 14,
          lte: 17,
          color: 'red'
        },
        {
          gt: 17,
          color: 'green'
        }
      ]
    },
    series: [
      {
        name: 'energy used',
        type: 'line',
        smooth: true,
        data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)'
          },
          data: [
            [
              {
                name: 'morning peak',
                xAxis: '07:30'
              },
              {
                xAxis: '10:00'
              }
            ],
            [
              {
                name: 'evening peak',
                xAxis: '17:30'
              },
              {
                xAxis: '21:15'
              }
            ]
          ]
        }
      }
    ]
  }
  echartsInstanceF.value.setOption(option)
}
let echartsInstanceS = ref(null)
const initEchartsS = () => {
  echartsInstanceS.value = echarts.init(document.getElementById('echartsContainerLineS'))
  let option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }
    ]
  }
  echartsInstanceS.value.setOption(option)
}

/*柱状图*/
let echartsBarF = ref(null)
const initBarF = () => {
  echartsBarF.value = echarts.init(document.getElementById('echartsContainerBarF'))
  let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  }
  echartsBarF.value.setOption(option)
}
let echartsBarS = ref(null)
const initBarS = () => {
  echartsBarS.value = echarts.init(document.getElementById('echartsContainerBarS'))
  let option = {
    title: {
      text: 'Evaporation and precipitation in an area',
      subtext: 'pure fiction'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Evaporation', 'Precipitation']
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        markPoint: {
          data: [
            { type: 'max', name: 'maximum' },
            { type: 'min', name: 'minimum' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'average value' }]
        }
      },
      {
        name: 'Precipitation',
        type: 'bar',
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        markPoint: {
          data: [
            { name: 'year highest', value: 182.2, xAxis: 7, yAxis: 183 },
            { name: 'year minimum', value: 2.3, xAxis: 11, yAxis: 3 }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'average value' }]
        }
      }
    ]
  }
  echartsBarS.value.setOption(option)
}

/*饼图*/
let echartsPieF = ref(null)
const initPieF = () => {
  echartsPieF.value = echarts.init(document.getElementById('echartsContainerPieF'))
  let option = {
    title: {
      text: 'User access source of a site',
      subtext: 'pure fiction',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'access source',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'search engine' },
          { value: 735, name: 'direct interview' },
          { value: 580, name: 'email marketing' },
          { value: 484, name: 'affiliate advertising' },
          { value: 300, name: 'video ad' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  echartsPieF.value.setOption(option)
}
let echartsPieS = ref(null)
const initPieS = () => {
  echartsPieS.value = echarts.init(document.getElementById('echartsContainerPieS'))
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'access source',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'search engine' },
          { value: 735, name: 'direct interview' },
          { value: 580, name: 'email marketing' },
          { value: 484, name: 'affiliate advertising' },
          { value: 300, name: 'video ad' }
        ]
      }
    ]
  }
  echartsPieS.value.setOption(option)
}
onMounted(() => {
  initEchartsF()
  initEchartsS()
  initBarF()
  initBarS()
  initPieF()
  initPieS()
})
</script>

<style scoped lang="scss"></style>
