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
        { title: '横向柱状图3', type: 'horizontal' }
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
          } else {
            this.initVerticalChart(index)
          }
        })
        // 图表初始化完成后触发父容器重排
        this.$nextTick(() => {
          this.updateScrollContainer()
        })
      })
    },
    
    updateScrollContainer() {
      // 触发滚动容器重排
      const container = this.$el.querySelector('.charts-scroll-container')
      if (container) {
        // 强制重排
        container.style.display = 'none'
        container.offsetHeight // 触发重排
        container.style.display = 'flex'
      }
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
        xAxis: {
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
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: #c41e3a #f5f5f5;
}

.charts-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.charts-scroll-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.charts-scroll-container::-webkit-scrollbar-thumb {
  background: #c41e3a;
  border-radius: 4px;
}

.charts-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #b01830;
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
  height: 400px;
}
</style>
