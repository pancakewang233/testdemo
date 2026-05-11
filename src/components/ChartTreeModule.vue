<template>
  <div class="chart-tree-module">
    <div class="left-panel">
      <div class="panel-title">指标选择</div>
      <el-tree
        ref="indicatorTree"
        :data="indicatorData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="['1', '2', '3']"
        :props="defaultProps"
        :check-on-click-node="true"
        @check="handleCheck"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="right-panel">
      <div class="panel-title">趋势分析</div>
      <div class="chart-wrapper">
        <div ref="mainChart" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ChartTreeModule',
  data() {
    return {
      indicatorData: [
        {
          id: '1',
          label: '政治生态',
          children: [
            { id: '1-1', label: '党风廉政建设' },
            { id: '1-2', label: '选人用人' },
            { id: '1-3', label: '党内政治生活' },
            { id: '1-4', label: '作风建设' },
            { id: '1-5', label: '政治纪律' },
          ]
        },
        {
          id: '2',
          label: '经营指标',
          children: [
            { id: '2-1', label: '营业收入' },
            { id: '2-2', label: '利润总额' },
            { id: '2-3', label: '资产负债率' },
            { id: '2-4', label: '净资产收益率' },
          ]
        },
        {
          id: '3',
          label: '服务指标',
          children: [
            { id: '3-1', label: '客户满意度' },
            { id: '3-2', label: '供电可靠率' },
            { id: '3-3', label: '电压合格率' },
            { id: '3-4', label: '投诉处理及时率' },
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedIndicators: [],
      mainChart: null
    }
  },
  methods: {
    handleCheck() {
      this.$nextTick(() => {
        const checkedNodes = this.$refs.indicatorTree.getCheckedNodes(true)
        this.selectedIndicators = checkedNodes.filter(node => !node.children)
        this.updateChart()
      })
    },
    handleNodeClick(data) {
      if (data.children && data.children.length > 0) return
      this.$refs.indicatorTree.setChecked(data.id, !this.$refs.indicatorTree.getNode(data.id).checked, true)
    },
    updateChart() {
      if (!this.mainChart) {
        this.mainChart = echarts.init(this.$refs.mainChart)
      }
  
      const years = ['2020', '2021', '2022', '2023', '2024', '2025']
      const series = this.selectedIndicators.map(item => ({
        name: item.label,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: this.getColorById(item.id)
        },
        data: this.generateMockData(item.id)
      }))

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.selectedIndicators.map(item => item.label),
          top: 10
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '8%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: years,
          name: '单位：年',
          nameLocation: 'end',
          nameGap: 30,
          nameTextStyle: {
            color: '#909399',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#909399'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#909399'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#E4E7ED'
            }
          }
        },
        series: series
      }
      this.mainChart.setOption(option, true)
    },
    generateMockData(id) {
      const baseValues = {
        '1-1': [85, 87, 89, 91, 93, 95],
        '1-2': [78, 80, 82, 85, 88, 90],
        '1-3': [82, 83, 85, 86, 88, 89],
        '1-4': [88, 89, 90, 91, 92, 93],
        '1-5': [90, 91, 92, 93, 94, 95],
        '2-1': [120, 135, 148, 162, 178, 195],
        '2-2': [15, 18, 22, 25, 28, 32],
        '2-3': [65, 63, 61, 59, 57, 55],
        '2-4': [8, 9, 10, 11, 12, 13],
        '3-1': [82, 84, 86, 88, 90, 92],
        '3-2': [99.5, 99.6, 99.7, 99.8, 99.85, 99.9],
        '3-3': [98, 98.5, 99, 99.2, 99.5, 99.8],
        '3-4': [85, 87, 90, 92, 94, 96],
      }
      return baseValues[id] || [70, 75, 80, 85, 90, 95]
    },
    getColorById(id, alpha = 1) {
      const colors = {
        '1-1': `rgba(196, 30, 58, ${alpha})`,
        '1-2': `rgba(245, 154, 35, ${alpha})`,
        '1-3': `rgba(56, 158, 13, ${alpha})`,
        '1-4': `rgba(24, 144, 255, ${alpha})`,
        '1-5': `rgba(114, 46, 209, ${alpha})`,
        '2-1': `rgba(235, 47, 150, ${alpha})`,
        '2-2': `rgba(250, 140, 22, ${alpha})`,
        '2-3': `rgba(82, 196, 26, ${alpha})`,
        '2-4': `rgba(19, 194, 194, ${alpha})`,
        '3-1': `rgba(47, 84, 235, ${alpha})`,
        '3-2': `rgba(114, 50, 219, ${alpha})`,
        '3-3': `rgba(235, 47, 150, ${alpha})`,
        '3-4': `rgba(250, 173, 20, ${alpha})`,
      }
      return colors[id] || `rgba(24, 144, 255, ${alpha})`
    },
    handleResize() {
      if (this.mainChart) {
        this.mainChart.resize()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mainChart = echarts.init(this.$refs.mainChart)
      this.updateChart()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.mainChart) {
      this.mainChart.dispose()
      this.mainChart = null
    }
  }
}
</script>

<style scoped>
.chart-tree-module {
  display: flex;
  height: 100%;
  background: #f5f7fa;
}

.left-panel {
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  padding: 20px;
  overflow-y: auto;
}

.right-panel {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.chart-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.chart-box {
  width: 100%;
  height: 500px;
}
</style>