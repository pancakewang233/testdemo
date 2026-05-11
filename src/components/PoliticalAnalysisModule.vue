<template>
  <div class="political-analysis-module">
    <!-- 头部 -->
    <div class="header-section">
      <div class="header-title">政治生态智能分析平台</div>
      <div class="header-subtitle">● 总体洞察 ●</div>
      <div class="year-selector">
        <span>年份：</span>
        <el-select v-model="selectedYear" size="small" class="year-select">
          <el-option label="2026" value="2026" />
          <el-option label="2025" value="2025" />
          <el-option label="2024" value="2024" />
        </el-select>
      </div>
    </div>

    <!-- 总体洞察 -->
    <div class="overview-section">
      <div class="overview-card">
        <div class="card-header">
          <span class="card-tag">总体平均分</span>
        </div>
        <div class="score-content">
          <div class="main-score">92.60</div>
          <div class="score-info">
            <div class="info-item">
              <span class="info-label">较上年</span>
              <span class="info-value up">1.2 ↑</span>
            </div>
            <div class="info-item">
              <span class="info-label">参评单位</span>
              <span class="info-value">27家</span>
            </div>
            <div class="info-item">
              <span class="info-label">高于平均分</span>
              <span class="info-value">27家</span>
            </div>
          </div>
          <div class="liquid-chart" ref="liquidChart"></div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-header">
          <span class="card-tag">分数分布情况</span>
        </div>
        <div class="distribution-content">
          <div class="distribution-chart" ref="distributionChart"></div>
          <div class="distribution-legend">
            <div class="legend-item">
              <span class="legend-color high"></span>
              <span>90-95分 12家单位</span>
            </div>
            <div class="legend-item">
              <span class="legend-color medium"></span>
              <span>90-95分 10家单位</span>
            </div>
            <div class="legend-item">
              <span class="legend-color low"></span>
              <span>90以下 5家单位</span>
            </div>
          </div>
          <div class="conclusion">
            <span class="conclusion-tag">核心结论：</span>
            <span>超八成单位得分在90分以上</span>
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-header">
          <span class="card-tag">总体趋势情况</span>
        </div>
        <div class="trend-content">
          <div class="trend-chart" ref="trendChart"></div>
          <div class="conclusion">
            <span class="conclusion-tag">核心结论：</span>
            <span>连续三年稳步提升，增速平稳</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心分析 -->
    <div class="core-analysis-section">
      <div class="section-title">● 核心分析 ●</div>
      <div class="analysis-grid">
        <!-- 看单位 -->
        <div class="analysis-card">
          <div class="card-header-bar">
            <span class="card-title">
              <span class="title-icon red"></span>
              看单位
            </span>
            <el-button type="text" size="mini" class="detail-btn">查看详情</el-button>
          </div>
          <div class="chart-container" ref="unitChart"></div>
          <div class="conclusion-text">
            <span class="conclusion-tag">核心结论</span>
            <p>直属机构+共享平台类单位政治生态评价得分相对领先，其中A单位（97.1）、B单位（96.52）和C单位（96.31）排名较稳，需重点关注。</p>
          </div>
        </div>

        <!-- 看维度 -->
        <div class="analysis-card">
          <div class="card-header-bar">
            <span class="card-title">
              <span class="title-icon orange"></span>
              看维度
            </span>
            <el-button type="text" size="mini" class="detail-btn">查看详情</el-button>
          </div>
          <div class="chart-container" ref="dimensionChart"></div>
          <div class="conclusion-text">
            <span class="conclusion-tag">核心结论</span>
            <p>政治生活、政治文化等2个维度为当前短板，主要原因为党员先锋模范作用发挥不明显，为员工减负落实不够到位、职工矛盾利益诉求化解不及时等方面。</p>
          </div>
        </div>

        <!-- 看指标 -->
        <div class="analysis-card">
          <div class="card-header-bar">
            <span class="card-title">
              <span class="title-icon yellow"></span>
              看指标
            </span>
            <el-button type="text" size="mini" class="detail-btn">查看详情</el-button>
          </div>
          <div class="chart-container" ref="indicatorChart"></div>
          <div class="conclusion-text">
            <span class="conclusion-tag">核心结论</span>
            <p>失分主要集中在调查问卷方面，员工对政治生态的总体满意率为92.6%。反映出在以下看上方面，广大员工对政治生态的认可度还有较大提升空间。</p>
          </div>
        </div>

        <!-- 看趋势 -->
        <div class="analysis-card">
          <div class="card-header-bar">
            <span class="card-title">
              <span class="title-icon green"></span>
              看趋势
            </span>
            <el-button type="text" size="mini" class="detail-btn">查看详情</el-button>
          </div>
          <div class="chart-container" ref="trendDetailChart"></div>
          <div class="trend-tabs">
            <span class="tab-item active">看单位趋势</span>
            <span class="tab-item">看维度趋势</span>
            <span class="tab-item">看指标趋势</span>
          </div>
          <div class="conclusion-text">
            <span class="conclusion-tag">核心结论</span>
            <p>管制类单位持续领跑，市场竞争类单位呈逐年上升趋势，直属机构+共享平台类单位存在下滑趋势需持续关注。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 专项功能 -->
    <div class="special-functions-section">
      <div class="section-title">● 专项功能 ●</div>
      <div class="functions-grid">
        <div class="function-card">
          <div class="function-header">
            <span class="function-icon red"></span>
            <span class="function-title">自助分析</span>
          </div>
          <div class="function-items">
            <div class="function-item">
              <i class="el-icon-s-data"></i>
              <span>图表分析</span>
            </div>
            <div class="function-item">
              <i class="el-icon-s-marketing"></i>
              <span>归因分析</span>
            </div>
            <div class="function-item">
              <i class="el-icon-s-check"></i>
              <span>对比分析</span>
            </div>
            <div class="function-item">
              <i class="el-icon-s-grid"></i>
              <span>交叉分析</span>
            </div>
          </div>
        </div>

        <div class="function-card">
          <div class="function-header">
            <span class="function-icon orange"></span>
            <span class="function-title">查看报告</span>
          </div>
          <div class="function-items">
            <div class="function-item">
              <i class="el-icon-document"></i>
              <span>年度态势报告</span>
            </div>
            <div class="function-item">
              <i class="el-icon-trend-charts"></i>
              <span>趋势分析报告</span>
            </div>
            <div class="function-item">
              <i class="el-icon-office-building"></i>
              <span>单位画像报告</span>
            </div>
            <div class="function-item">
              <i class="el-icon-question"></i>
              <span>问卷分析报告</span>
            </div>
          </div>
        </div>

        <div class="function-card">
          <div class="function-header">
            <span class="function-icon blue"></span>
            <span class="function-title">进度监控</span>
          </div>
          <div class="function-items">
            <div class="function-item">
              <i class="el-icon-s-order"></i>
              <span>下级各单位评价进度统计</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-liquidfill'

export default {
  name: 'PoliticalAnalysisModule',
  data() {
    return {
      selectedYear: '2026',
      charts: {}
    }
  },
  methods: {
    initCharts() {
      this.initLiquidChart()
      this.initDistributionChart()
      this.initTrendChart()
      this.initUnitChart()
      this.initDimensionChart()
      this.initIndicatorChart()
      this.initTrendDetailChart()
    },
    initLiquidChart() {
      const chart = echarts.init(this.$refs.liquidChart)
      this.charts.liquid = chart
      
      const option = {
        series: [{
          type: 'liquidFill',
          data: [0.65],
          radius: '80%',
          center: ['50%', '50%'],
          color: ['#e74c3c'],
          backgroundStyle: {
            color: 'rgba(231, 76, 60, 0.1)'
          },
          outline: {
            show: true,
            borderDistance: 5,
            itemStyle: {
              color: 'none',
              borderColor: '#e74c3c',
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: 'rgba(231, 76, 60, 0.3)'
            }
          },
          label: {
            show: true,
            formatter: '65%',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#e74c3c'
          }
        }]
      }
      chart.setOption(option)
    },
    initDistributionChart() {
      const chart = echarts.init(this.$refs.distributionChart)
      this.charts.distribution = chart
      
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '70%'],
          startAngle: 180,
          endAngle: 360,
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: [
            { value: 12, name: '90-95分', itemStyle: { color: '#e74c3c' } },
            { value: 10, name: '85-90分', itemStyle: { color: '#f39c12' } },
            { value: 5, name: '85以下', itemStyle: { color: '#27ae60' } }
          ]
        }]
      }
      chart.setOption(option)
    },
    initTrendChart() {
      const chart = echarts.init(this.$refs.trendChart)
      this.charts.trend = chart
      
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['2024年', '2025年', '2026年'],
          axisLine: { lineStyle: { color: '#909399' } }
        },
        yAxis: {
          type: 'value',
          min: 80,
          max: 100,
          axisLine: { lineStyle: { color: '#909399' } },
          splitLine: { lineStyle: { color: '#E4E7ED' } }
        },
        series: [{
          type: 'line',
          smooth: true,
          data: [91.82, 90.53, 92.60],
          itemStyle: { color: '#e74c3c' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(231, 76, 60, 0.3)' },
              { offset: 1, color: 'rgba(231, 76, 60, 0.05)' }
            ])
          }
        }]
      }
      chart.setOption(option)
    },
    initUnitChart() {
      const chart = echarts.init(this.$refs.unitChart)
      this.charts.unit = chart
      
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['管制业务类', '市场竞争类', '直属机构+共享平台类'],
          axisLine: { lineStyle: { color: '#909399' } },
          axisLabel: { interval: 0, rotate: 0 }
        },
        yAxis: {
          type: 'value',
          min: 85,
          max: 100,
          axisLine: { lineStyle: { color: '#909399' } },
          splitLine: { lineStyle: { color: '#E4E7ED' } }
        },
        series: [{
          type: 'bar',
          barWidth: '30%',
          data: [
            { value: 96.20, itemStyle: { color: '#e74c3c' } },
            { value: 92.60, itemStyle: { color: '#e67e22' } },
            { value: 90.20, itemStyle: { color: '#f39c12' } }
          ],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        }]
      }
      chart.setOption(option)
    },
    initDimensionChart() {
      const chart = echarts.init(this.$refs.dimensionChart)
      this.charts.dimension = chart
      
      const option = {
        tooltip: { trigger: 'item' },
        radar: {
          indicator: [
            { name: '政治生活', max: 30 },
            { name: '纪律规矩', max: 30 },
            { name: '政治文化', max: 30 },
            { name: '选人用人', max: 30 },
            { name: '清正廉洁', max: 30 }
          ],
          radius: '65%',
          axisName: { color: '#666' }
        },
        series: [{
          type: 'radar',
          data: [{
            value: [23.42, 23.42, 23.42, 17.72, 19.42],
            name: '维度得分',
            areaStyle: { color: 'rgba(231, 76, 60, 0.2)' },
            lineStyle: { color: '#e74c3c' },
            itemStyle: { color: '#e74c3c' }
          }]
        }]
      }
      chart.setOption(option)
    },
    initIndicatorChart() {
      const chart = echarts.init(this.$refs.indicatorChart)
      this.charts.indicator = chart
      
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['问卷', '指标', '经营业绩', '扣分', '最终得分'],
          axisLine: { lineStyle: { color: '#909399' } }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLine: { lineStyle: { color: '#909399' } },
          splitLine: { lineStyle: { color: '#E4E7ED' } }
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          data: [
            { value: 42.50, itemStyle: { color: '#e74c3c' } },
            { value: 43.42, itemStyle: { color: '#e67e22' } },
            { value: 9.50, itemStyle: { color: '#f39c12' } },
            { value: -2.82, itemStyle: { color: '#9b59b6' } },
            { value: 92.60, itemStyle: { color: '#e74c3c' } }
          ],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        }]
      }
      chart.setOption(option)
    },
    initTrendDetailChart() {
      const chart = echarts.init(this.$refs.trendDetailChart)
      this.charts.trendDetail = chart
      
      const option = {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['管制业务类', '市场竞争类', '直属机构+共享平台类'],
          top: 5,
          textStyle: { fontSize: 10 }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['2024年', '2025年', '2026年'],
          axisLine: { lineStyle: { color: '#909399' } }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#909399' } },
          splitLine: { lineStyle: { color: '#E4E7ED' } }
        },
        series: [
          {
            name: '管制业务类',
            type: 'line',
            smooth: true,
            data: [45, 48, 52],
            itemStyle: { color: '#e74c3c' }
          },
          {
            name: '市场竞争类',
            type: 'line',
            smooth: true,
            data: [30, 35, 42],
            itemStyle: { color: '#f39c12' }
          },
          {
            name: '直属机构+共享平台类',
            type: 'line',
            smooth: true,
            data: [25, 28, 26],
            itemStyle: { color: '#27ae60' }
          }
        ]
      }
      chart.setOption(option)
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        if (chart && chart.resize) chart.resize()
      })
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
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.dispose()
    })
  }
}
</script>

<style scoped>
.political-analysis-module {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 头部样式 */
.header-section {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  color: #c41e3a;
  margin-bottom: 8px;
}

.header-subtitle {
  font-size: 16px;
  color: #999;
  margin-bottom: 10px;
}

.year-selector {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.year-select {
  width: 100px;
  margin-left: 8px;
}

/* 总体洞察 */
.overview-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.overview-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 12px;
}

.card-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #fff0f0;
  color: #c41e3a;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  border-left: 3px solid #c41e3a;
}

/* 总体平均分 */
.score-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-score {
  font-size: 36px;
  font-weight: bold;
  color: #c41e3a;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.info-label {
  color: #999;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.info-value.up {
  color: #67c23a;
}

.liquid-chart {
  width: 100px;
  height: 100px;
}

/* 分数分布 */
.distribution-content {
  text-align: center;
}

.distribution-chart {
  width: 100%;
  height: 150px;
}

.distribution-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 8px 0;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-color.high { background: #e74c3c; }
.legend-color.medium { background: #f39c12; }
.legend-color.low { background: #27ae60; }

/* 总体趋势 */
.trend-content {
  text-align: center;
}

.trend-chart {
  width: 100%;
  height: 150px;
}

/* 核心结论 */
.conclusion {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.conclusion-tag {
  color: #c41e3a;
  font-weight: 600;
}

/* 核心分析 */
.core-analysis-section {
  margin-bottom: 20px;
}

.section-title {
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-bottom: 16px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.analysis-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.card-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
}

.title-icon.red { background: #e74c3c; }
.title-icon.orange { background: #e67e22; }
.title-icon.yellow { background: #f39c12; }
.title-icon.green { background: #27ae60; }

.detail-btn {
  color: #c41e3a;
}

.chart-container {
  width: 100%;
  height: 200px;
}

.conclusion-text {
  margin-top: 12px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.conclusion-text .conclusion-tag {
  display: inline-block;
  margin-bottom: 4px;
}

/* 趋势标签 */
.trend-tabs {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.tab-item {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.tab-item.active {
  background: #c41e3a;
  color: #fff;
}

/* 专项功能 */
.special-functions-section {
  margin-bottom: 20px;
}

.functions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.function-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.function-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.function-icon {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
}

.function-icon.red { background: #e74c3c; }
.function-icon.orange { background: #e67e22; }
.function-icon.blue { background: #3498db; }

.function-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.function-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.function-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.function-item:hover {
  background: #f5f5f5;
}

.function-item i {
  font-size: 18px;
  color: #c41e3a;
}

.function-item span {
  font-size: 13px;
  color: #666;
}

/* 进度监控特殊处理 */
.function-card:last-child .function-items {
  grid-template-columns: 1fr;
}
</style>