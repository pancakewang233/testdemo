<template>
  <div class="echarts-module">
    <h3 class="module-title">ECharts 图表展示</h3>
    
    <!-- 图表横向滚动容器 -->
    <div class="charts-scroll-container">
      <div 
        v-for="(chart, index) in chartList" 
        :key="index" 
        class="chart-item"
      >
        <h4 class="chart-title">{{ chart.title }}</h4>
        <div :ref="'chart_' + index" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EChartsModule',
  data() {
    return {
      charts: {},
      chartList: [
        { title: '横向柱状图', type: 'horizontal' },
        { title: '倒置纵向柱状图', type: 'vertical' },
        { title: '横向柱状图2', type: 'horizontal' },
        { title: '倒置纵向柱状图2', type: 'vertical' },
        { title: '横向柱状图3', type: 'horizontal' },
        { title: '趋势折线图', type: 'trendLine' },
        { title: '双柱状图', type: 'doubleBar' },
        { title: '雷达图', type: 'radar' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    Object.values(this.charts).forEach(chart => chart && chart.dispose())
  },
  methods: {
    initCharts() {
      this.$nextTick(() => {
        this.chartList.forEach((chart, index) => {
          if (chart.type === 'horizontal') {
            this.initHorizontalChart(index)
          } else if (chart.type === 'trendLine') {
            this.initTrendLineChart(index)
          } else if (chart.type === 'doubleBar') {
            this.initDoubleBarChart(index)
          } else if (chart.type === 'radar') {
            this.initRadarChart(index)
          } else {
            this.initVerticalChart(index)
          }
        })
      })
    },
    
    // 横向柱状图
    initHorizontalChart(index) {
      const chartRef = this.$refs['chart_' + index]
      if (!chartRef || chartRef.length === 0) return
      const chart = echarts.init(chartRef[0])
      this.charts['chart' + index] = chart
      
      const option = {
        color: ['#c41e3a'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '30%',
          right: '15%',
          top: '5%',
          bottom: '5%',
          containLabel: true  
        },
        xAxis:    {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['党风廉政建设', '选人用人', '党内政治生活', '作风建设', '政治纪律', '群众满意度']
        },
        dataZoom: [{
          type: 'inside',
          orient: 'vertical',
          start: 0,
          end: 83 // 只显示5个（5/6≈83%）
        }, {
          type: 'slider',
          show: true,
          orient: 'vertical',
          left: '30%',
          start: 0,
          end: 83,
          height: '80%',
          width: 6,
          handleSize: '80%',
          handleStyle: {
            color: '#c41e3a',
            borderColor: '#c41e3a',
            borderWidth: 1,
            borderRadius: 2
          },
          fillerColor: 'transparent',
          borderColor: '#f5f5f5',
          backgroundColor: '#f5f5f5'
        }],
        series: [{
          name: '得分',
          type: 'bar',
          data: [92.5, 78.3, 82.5, 88.6, 91.2, 85.8],
          barWidth: '60%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0]
          }
        }]
      }
      chart.setOption(option)
    },
    
    // 倒置纵向柱状图 - 0坐标轴在最下面
    initVerticalChart(index) {
      const chartRef = this.$refs['chart_' + index]
      if (!chartRef || chartRef.length === 0) return
      const chart = echarts.init(chartRef[0])
      this.charts['chart' + index] = chart
      
      const option = {
        color: ['#c41e3a'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['党风廉政建设', '选人用人', '党内政治生活', '作风建设', '政治纪律', '群众满意度'],
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          // 不使用inverse，保持0坐标轴在最下面
          boundaryGap: [0, 0.01]
        },
        series: [{
          name: '得分',
          type: 'bar',
          data: [92.5, 78.3, 82.5, 88.6, 91.2, 85.8].reverse(), // 数据反转，实现倒置效果
          barWidth: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          }
        }]
      }
      chart.setOption(option)
    },
    
    initTrendLineChart(index) {
      const chartRef = this.$refs['chart_' + index]
      if (!chartRef || chartRef.length === 0) return
      const chart = echarts.init(chartRef[0])
      this.charts['chart' + index] = chart

      const option = {
        backgroundColor: 'transparent',
        grid: { top: 40, left: 80, right: 30, bottom: 80 },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(28,33,45,0.95)',
          borderWidth: 0,
          textStyle: { color: '#fff' }
        },
        legend: {
          bottom: 20,
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 30,
          textStyle: { color: '#666', fontSize: 14 },
          data: ['内容内容', '内容内容2', '内容内容3', '内容内容4', '内容内容5']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2020', '2021', '2022', '2023', '2024', '2025'],
          axisLine: { lineStyle: { color: '#BFBFBF' } },
          axisTick: { show: false },
          axisLabel: { color: '#666', fontSize: 14, margin: 14 }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#666', fontSize: 14, padding: [0, 12, 0, 0] },
          splitLine: { lineStyle: { type: 'dashed', color: '#CFCFCF', width: 1 } }
        },
        series: [
          { name: '内容内容', color: '#FF6A2A', rgb: '255,106,42', alpha: 0.10, data: [35, 58, 72, 50, 47, 63] },
          { name: '内容内容2', color: '#F5A623', rgb: '245,166,35', alpha: 0.12, data: [52, 68, 73, 88, 70, 70] },
          { name: '内容内容3', color: '#4091FF', rgb: '64,145,255',  alpha: 0.15, data: [20, 45, 61, 69, 61, 88] },
          { name: '内容内容4', color: '#45D69E', rgb: '69,214,158',  alpha: 0.12, data: [3,  27, 27, 38, 38, 44] },
          { name: '内容内容5', color: '#B14AD3', rgb: '177,74,211',  alpha: 0.10, data: [8,  20, 36, 28, 28, 32] }
        ].map(item => ({
          name: item.name,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: item.color },
          itemStyle: { color: item.color, borderColor: '#fff', borderWidth: 2 },
          areaStyle: { color: `rgba(${item.rgb},${item.alpha})` },
          label: {
            show: true,
            position: 'left',
            distance: 8,
            offset: [0, -6],
            fontSize: 12,
            fontWeight: 'bold',
            formatter: p => p.dataIndex === 0 ? p.seriesName : ''
          },
          data: item.data
        }))
      }

      chart.setOption(option)
    },

    // 双柱状图
    initDoubleBarChart(index) {
      const chartRef = this.$refs['chart_' + index]
      if (!chartRef || chartRef.length === 0) return
      const chart = echarts.init(chartRef[0])
      this.charts['chart' + index] = chart

      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: 10,
          data: ['系列A', '系列B']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['类别A', '类别B', '类别C', '类别D', '类别E', '类别F']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '系列A',
            type: 'bar',
            color: '#4091FF',
            barWidth: '35%',
            data: [65, 78, 52, 88, 70, 60]
          },
          {
            name: '系列B',
            type: 'bar',
            color: '#FF6A2A',
            barWidth: '35%',
            data: [45, 60, 72, 50, 65, 80]
          }
        ]
      }

      chart.setOption(option)
    },

    // 雷达图 — min 自适应数据下限，max 固定 100，放大数据间的视觉差异
    initRadarChart(index) {
      const chartRef = this.$refs['chart_' + index]
      if (!chartRef || chartRef.length === 0) return
      const chart = echarts.init(chartRef[0])
      this.charts['chart' + index] = chart

      const dims = ['攻击', '防御', '速度', '耐力', '技术', '策略']
      const raw = [
        { name: '系列A', color: '#4091FF', hexRgb: '64,145,255', data: [17, 17, 17, 17, 17, 17] },
        { name: '系列B', color: '#FF6A2A', hexRgb: '255,106,42', data: [18, 18, 18, 18, 18, 18] },
        { name: '系列C', color: '#B14AD3', hexRgb: '177,74,211', data: [19, 19, 19, 19, 19, 19] }
      ]

      const allValues = raw.flatMap(r => r.data)
      const MIN = Math.min(...allValues) - 1
      const MAX = 20

      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: 10,
          data: raw.map(r => r.name)
        },
        radar: {
          center: ['50%', '52%'],
          radius: '88%',
          splitNumber: 4,
          indicator: dims.map(name => ({ name, min: MIN, max: MAX })),
          axisName: { color: '#666', fontSize: 11, distance: 4 },
          splitArea: {
            areaStyle: { color: ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.04)'] }
          },
          splitLine: {
            lineStyle: { color: '#e0e0e0', type: 'dashed' }
          }
        },
        series: raw.map((item, si) => {
          const symbols = ['circle', 'diamond', 'triangle']
          return {
            name: item.name,
            type: 'radar',
            symbol: symbols[si],
            symbolSize: 10,
            lineStyle: { width: 3, color: item.color },
            itemStyle: { color: item.color },
            areaStyle: { color: `rgba(${item.hexRgb},0.25)` },
            label: {
              show: true,
              position: 'top',
              distance: 6,
              fontSize: 11,
              color: item.color
            },
            labelLayout: { hideOverlap: false },
            data: [{ value: item.data, name: item.name }]
          }
        })
      }

      chart.setOption(option)
    },

    handleResize() {
      Object.values(this.charts).forEach(chart => chart && chart.resize())
    }
  }
}
</script>

<style scoped>
.echarts-module {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.module-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.charts-scroll-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px 0;
}

.chart-item {
  flex: 0 0 auto;
  width: 400px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.chart-title {
  font-size: 14px;
  font-weight: bold;
  color: #666;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.chart-container {
  width: 100%;
  height: 420px;
}
</style>
