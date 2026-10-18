<script setup>
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { init, use } from 'echarts/core'
  import { LineChart, BarChart } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    AriaComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  use([
    LineChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    AriaComponent,
    CanvasRenderer
  ])
  const props = defineProps({ rows: { type: Array, default: () => [] } })
  const element = ref()
  let chart
  let observer
  const option = computed(() => ({
    aria: { enabled: true, description: '虛構商家每日營收與訂單趨勢，可在資料表檢視數值。' },
    color: ['#409eff', '#a5b4fc'],
    tooltip: { trigger: 'axis', valueFormatter: (value) => Number(value).toLocaleString('zh-TW') },
    legend: {
      top: 0,
      right: 0,
      itemWidth: 14,
      textStyle: { color: '#64748b' }
    },
    grid: { top: 50, left: 60, right: 40, bottom: 35 },
    xAxis: {
      type: 'category',
      data: props.rows.map((row) => row.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8a938e' }
    },
    yAxis: [
      {
        type: 'value',
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#8a938e', formatter: (value) => `${value / 1000}k` }
      },
      { type: 'value', splitLine: { show: false }, axisLabel: { color: '#8a938e' } }
    ],
    series: [
      {
        name: '營收',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.07 },
        data: props.rows.map((row) => row.revenue)
      },
      {
        name: '訂單數',
        type: 'bar',
        yAxisIndex: 1,
        barMaxWidth: 14,
        itemStyle: { borderRadius: [3, 3, 0, 0] },
        data: props.rows.map((row) => row.orders)
      }
    ],
    animationDuration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400
  }))
  onMounted(() => {
    chart = init(element.value)
    chart.setOption(option.value)
    observer = new ResizeObserver(() => chart?.resize())
    observer.observe(element.value)
  })
  watch(option, (value) => chart?.setOption(value))
  onBeforeUnmount(() => {
    observer?.disconnect()
    chart?.dispose()
  })
</script>

<template>
  <div
    ref="element"
    class="sales-chart"
    role="img"
    aria-label="每日營收與訂單數趨勢圖，數值為虛構展示資料"
  />
</template>
