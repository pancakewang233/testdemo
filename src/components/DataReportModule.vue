<template>
  <div class="data-report-container">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <div class="header-left">
        <div class="party-logo">
          <span class="logo-icon">☭</span>
        </div>
        <span class="header-title">党建数据平台</span>
      </div>
      <div class="header-right">
        <span class="user-name">管理员</span>
        <span class="logout-btn">退出</span>
      </div>
    </div>

    <div class="main-layout">
      <!-- 左侧导航栏 -->
      <div class="left-sidebar">
        <div class="menu-item active">
          <span class="menu-icon">�</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">📈</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">📋</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">⚙️</span>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="content-area">
        <!-- 报告标题 -->
        <div class="report-title-section">
          <h1 class="main-title">2025年度政治生态评价报告</h1>
          <div class="title-divider"></div>
        </div>

        <!-- 第一部分：政治生态总体情况 -->
        <div class="section">
          <div class="section-title-bar">
            <span class="section-num">一、</span>
            <span class="section-title-text">政治生态总体情况</span>
          </div>
          <div class="section-content">
            <p class="section-desc">
              2025年，XX市政治生态总体评价得分为<span class="highlight">85.6分</span>，较上年提升<span class="highlight">3.2分</span>，
              政治生态持续向好发展。从六个维度评价来看，"党风廉政建设"得分最高（92.5分），
              "选人用人"得分最低（78.3分），反映出在干部选拔任用方面仍需加强。
            </p>
            
            <div class="radar-chart-box">
              <div ref="radarChart" class="radar-chart"></div>
            </div>

            <p class="section-desc">
              从评价结果看，XX市政治生态呈现"<span class="highlight">总体良好、局部短板</span>"的特点。
              在党风廉政建设、作风建设等方面表现突出，但在选人用人规范性和党内政治生活严肃性方面仍存在不足，
              需要持续改进提升。
            </p>
          </div>
        </div>

        <!-- 第二部分：主要问题分析 -->
        <div class="section">
          <div class="section-title-bar">
            <span class="section-num">二、</span>
            <span class="section-title-text">主要问题分析</span>
          </div>
          <div class="section-content">
            
            <!-- 问题1 -->
            <div class="problem-block">
              <div class="problem-title">
                <span class="problem-num">2.1</span>
                <span class="problem-name">选人用人方面</span>
              </div>
              <div class="problem-layout">
                <div class="problem-left">
                  <p>干部选拔任用程序不够规范，个别单位存在"带病提拔"现象。</p>
                  <p>民主推荐和考察环节流于形式，群众参与度不高。</p>
                  <div class="problem-data">
                    <span>规范性问题数：<strong class="warning">12件</strong></span>
                    <span>群众满意度：<strong>78.3%</strong></span>
                  </div>
                </div>
                <div class="problem-right">
                  <div ref="barChart1" class="chart-box"></div>
                </div>
              </div>
            </div>

            <!-- 问题2 -->
            <div class="problem-block">
              <div class="problem-title">
                <span class="problem-num">2.2</span>
                <span class="problem-name">党内政治生活方面</span>
              </div>
              <div class="problem-layout">
                <div class="problem-left">
                  <p>部分基层党组织"三会一课"制度执行不严格，组织生活质量不高。</p>
                  <p>民主生活会和组织生活会批评与自我批评不够深入。</p>
                  <div class="problem-data">
                    <span>制度执行率：<strong>82.5%</strong></span>
                    <span>质量问题数：<strong class="warning">8件</strong></span>
                  </div>
                </div>
                <div class="problem-right">
                  <div ref="barChart2" class="chart-box"></div>
                </div>
              </div>
            </div>

            <!-- 问题3 -->
            <div class="problem-block">
              <div class="problem-title">
                <span class="problem-num">2.3</span>
                <span class="problem-name">作风建设方面</span>
              </div>
              <div class="problem-layout">
                <div class="problem-left">
                  <p>形式主义、官僚主义问题仍有发生，基层减负效果有待巩固。</p>
                  <p>个别干部存在不作为、慢作为现象。</p>
                  <div class="problem-data">
                    <span>作风问题数：<strong class="warning">23件</strong></span>
                    <span>处理人数：<strong>15人</strong></span>
                  </div>
                </div>
                <div class="problem-right">
                  <div ref="pieChart" class="chart-box"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三部分：整改措施及成效 -->
        <div class="section">
          <div class="section-title-bar">
            <span class="section-num">三、</span>
            <span class="section-title-text">整改措施及成效</span>
          </div>
          <div class="section-content">
            <div class="measures-list">
              <div class="measure-item">
                <div class="measure-icon">✓</div>
                <div class="measure-content">
                  <div class="measure-title">完善选人用人机制</div>
                  <div class="measure-desc">建立干部选拔任用全程纪实制度，实行"凡提四必"，防止"带病提拔"。全年开展选人用人专项检查3次。</div>
                  <div class="measure-result">整改成效：规范性问题下降45%</div>
                </div>
              </div>

              <div class="measure-item">
                <div class="measure-icon">✓</div>
                <div class="measure-content">
                  <div class="measure-title">严肃党内政治生活</div>
                  <div class="measure-desc">制定《提高组织生活质量十条措施》，建立组织生活观察员制度，开展组织生活示范观摩活动12场次。</div>
                  <div class="measure-result">整改成效：制度执行率提升至95%</div>
                </div>
              </div>

              <div class="measure-item">
                <div class="measure-icon">✓</div>
                <div class="measure-content">
                  <div class="measure-title">深化作风建设</div>
                  <div class="measure-desc">持续开展"四风"问题专项整治，建立基层减负长效机制，精简文件会议30%以上，督查检查考核事项减少40%。</div>
                  <div class="measure-result">整改成效：作风问题下降38%</div>
                </div>
              </div>
            </div>

            <div class="trend-chart-box">
              <div ref="lineChart" class="trend-chart"></div>
            </div>
          </div>
        </div>

        <!-- 第四部分：下一步工作计划 -->
        <div class="section">
          <div class="section-title-bar">
            <span class="section-num">四、</span>
            <span class="section-title-text">下一步工作计划</span>
          </div>
          <div class="section-content">
            <div class="plan-list">
              <div class="plan-item">
                <div class="plan-dot"></div>
                <div class="plan-content">
                  <div class="plan-title">持续深化政治建设</div>
                  <div class="plan-desc">把党的政治建设摆在首位，强化政治监督，确保党中央决策部署落地见效。加强对"一把手"和领导班子的监督，推动全面从严治党向纵深发展。</div>
                </div>
              </div>

              <div class="plan-item">
                <div class="plan-dot"></div>
                <div class="plan-content">
                  <div class="plan-title">健全长效机制</div>
                  <div class="plan-desc">完善政治生态评价指标体系，建立常态化评价机制。强化评价结果运用，将评价结果与干部选拔任用、评先评优挂钩。</div>
                </div>
              </div>

              <div class="plan-item">
                <div class="plan-dot"></div>
                <div class="plan-content">
                  <div class="plan-title">强化问题整改</div>
                  <div class="plan-desc">建立问题整改台账，实行销号管理。对整改不力的单位和个人严肃问责，确保问题整改到位，推动政治生态持续向好。</div>
                </div>
              </div>
            </div>

            <div class="forecast-chart-box">
              <div ref="forecastChart" class="forecast-chart"></div>
            </div>
          </div>
        </div>

        <!-- 底部数据统计 -->
        <div class="summary-section">
          <div class="summary-title">评价数据统计</div>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">85.6</div>
              <div class="summary-label">总体得分</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">+3.2</div>
              <div class="summary-label">较上年提升</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">3</div>
              <div class="summary-label">全市排名</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">92.5</div>
              <div class="summary-label">最高单项分</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">43</div>
              <div class="summary-label">发现问题数</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">38</div>
              <div class="summary-label">已整改数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'DataReportModule',
  data() {
    return {
      charts: {}
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
      this.initRadarChart()
      this.initBarChart1()
      this.initBarChart2()
      this.initPieChart()
      this.initLineChart()
      this.initForecastChart()
    },
    
    // 雷达图
    initRadarChart() {
      if (!this.$refs.radarChart) return
      const chart = echarts.init(this.$refs.radarChart)
      this.charts.radar = chart
      
      const option = {
        color: ['#c41e3a'],
        tooltip: {
          trigger: 'item'
        },
        radar: {
          indicator: [
            { name: '党风廉政建设', max: 100 },
            { name: '选人用人', max: 100 },
            { name: '党内政治生活', max: 100 },
            { name: '作风建设', max: 100 },
            { name: '政治纪律', max: 100 },
            { name: '群众满意度', max: 100 }
          ],
          radius: '65%',
          center: ['50%', '50%'],
          axisName: {
            color: '#333',
            fontSize: 12
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(196, 30, 58, 0.02)', 'rgba(196, 30, 58, 0.05)', 
                      'rgba(196, 30, 58, 0.08)', 'rgba(196, 30, 58, 0.11)']
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(196, 30, 58, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(196, 30, 58, 0.3)'
            }
          }
        },
        series: [{
          type: 'radar',
          data: [{
            value: [92.5, 78.3, 82.5, 88.6, 91.2, 85.8],
            name: '2025年评价',
            areaStyle: {
              color: 'rgba(196, 30, 58, 0.3)'
            },
            lineStyle: {
              color: '#c41e3a',
              width: 2
            },
            itemStyle: {
              color: '#c41e3a'
            }
          }]
        }]
      }
      chart.setOption(option)
    },
    
    // 柱状图1
    initBarChart1() {
      if (!this.$refs.barChart1) return
      const chart = echarts.init(this.$refs.barChart1)
      this.charts.bar1 = chart
      
      const option = {
        color: ['#c41e3a'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['程序不规范', '考察不深入', '群众参与度低', '档案不完整'],
          axisLabel: {
            fontSize: 10,
            rotate: 20
          }
        },
        yAxis: {
          type: 'value',
          name: '问题数'
        },
        series: [{
          type: 'bar',
          data: [5, 4, 2, 1],
          barWidth: '50%',
          itemStyle: {
            borderRadius: [3, 3, 0, 0]
          }
        }]
      }
      chart.setOption(option)
    },
    
    // 柱状图2
    initBarChart2() {
      if (!this.$refs.barChart2) return
      const chart = echarts.init(this.$refs.barChart2)
      this.charts.bar2 = chart
      
      const option = {
        color: ['#ff6b6b'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['三会一课', '组织生活会', '民主评议', '主题党日'],
          axisLabel: {
            fontSize: 10,
            rotate: 20
          }
        },
        yAxis: {
          type: 'value',
          name: '问题数'
        },
        series: [{
          type: 'bar',
          data: [3, 2, 2, 1],
          barWidth: '50%',
          itemStyle: {
            borderRadius: [3, 3, 0, 0]
          }
        }]
      }
      chart.setOption(option)
    },
    
    // 饼图
    initPieChart() {
      if (!this.$refs.pieChart) return
      const chart = echarts.init(this.$refs.pieChart)
      this.charts.pie = chart
      
      const option = {
        color: ['#c41e3a', '#ff6b6b', '#ffa07a', '#ffd4d4'],
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}件 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'center',
          textStyle: {
            fontSize: 10
          }
        },
        series: [{
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          data: [
            { value: 10, name: '形式主义' },
            { value: 7, name: '官僚主义' },
            { value: 4, name: '不作为' },
            { value: 2, name: '其他' }
          ]
        }]
      }
      chart.setOption(option)
    },
    
    // 折线图
    initLineChart() {
      if (!this.$refs.lineChart) return
      const chart = echarts.init(this.$refs.lineChart)
      this.charts.line = chart
      
      const option = {
        color: ['#c41e3a', '#52c41a'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['发现问题数', '整改完成数'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLabel: {
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '发现问题数',
            type: 'line',
            data: [8, 6, 5, 4, 3, 4, 3, 2, 3, 2, 2, 1],
            smooth: true,
            lineStyle: { width: 2 },
            areaStyle: {
              color: 'rgba(196, 30, 58, 0.1)'
            }
          },
          {
            name: '整改完成数',
            type: 'line',
            data: [2, 4, 5, 5, 6, 5, 6, 7, 6, 7, 7, 8],
            smooth: true,
            lineStyle: { width: 2 }
          }
        ]
      }
      chart.setOption(option)
    },
    
    // 预测图
    initForecastChart() {
      if (!this.$refs.forecastChart) return
      const chart = echarts.init(this.$refs.forecastChart)
      this.charts.forecast = chart
      
      const option = {
        color: ['#c41e3a', '#ff9f7f'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['2025年实际', '2026年目标'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['总体评价', '党风廉政', '选人用人', '政治生活', '作风建设', '政治纪律'],
          axisLabel: {
            fontSize: 10,
            rotate: 20
          }
        },
        yAxis: {
          type: 'value',
          name: '得分',
          max: 100
        },
        series: [
          {
            name: '2025年实际',
            type: 'bar',
            data: [85.6, 92.5, 78.3, 82.5, 88.6, 91.2],
            barWidth: '30%',
            itemStyle: {
              borderRadius: [3, 3, 0, 0]
            }
          },
          {
            name: '2026年目标',
            type: 'bar',
            data: [88, 94, 85, 88, 92, 93],
            barWidth: '30%',
            itemStyle: {
              borderRadius: [3, 3, 0, 0],
              opacity: 0.7
            }
          }
        ]
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
.data-report-container {
  min-height: 100vh;
  background: #f0f2f5;
}

/* 顶部导航栏 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 50px;
  background: #c41e3a;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.party-logo {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-size: 20px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}

.logout-btn {
  cursor: pointer;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

/* 主布局 */
.main-layout {
  display: flex;
  min-height: calc(100vh - 50px);
}

/* 左侧导航栏 */
.left-sidebar {
  width: 50px;
  background: #c41e3a;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.menu-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover,
.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
}

.menu-icon {
  font-size: 20px;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 报告标题 */
.report-title-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #c41e3a;
  margin-bottom: 10px;
}

.title-divider {
  width: 100px;
  height: 3px;
  background: #c41e3a;
  margin: 0 auto;
}

/* 内容区块 */
.section {
  background: white;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

.section-title-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: #fff5f5;
  border-left: 4px solid #c41e3a;
}

.section-num {
  font-size: 16px;
  font-weight: bold;
  color: #c41e3a;
}

.section-title-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-content {
  padding: 20px;
}

.section-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 15px;
  text-indent: 2em;
}

.highlight {
  color: #c41e3a;
  font-weight: bold;
}

/* 雷达图 */
.radar-chart-box {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.radar-chart {
  width: 400px;
  height: 320px;
}

/* 问题区块 */
.problem-block {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px dashed #e8e8e8;
}

.problem-block:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.problem-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.problem-num {
  width: 36px;
  height: 36px;
  background: #c41e3a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.problem-name {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.problem-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.problem-left {
  flex: 1.5;
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.problem-left p {
  margin-bottom: 10px;
}

.problem-data {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  padding: 10px;
  background: #fafafa;
  border-radius: 4px;
}

.problem-data span {
  font-size: 13px;
}

.warning {
  color: #c41e3a;
}

.problem-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-box {
  width: 100%;
  height: 180px;
}

/* 整改措施 */
.measures-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.measure-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 4px;
}

.measure-icon {
  width: 28px;
  height: 28px;
  background: #c41e3a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.measure-content {
  flex: 1;
}

.measure-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.measure-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.measure-result {
  font-size: 13px;
  color: #52c41a;
  font-weight: bold;
}

.trend-chart-box {
  margin-top: 20px;
}

.trend-chart {
  width: 100%;
  height: 250px;
}

/* 工作计划 */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.plan-item {
  display: flex;
  gap: 12px;
  padding: 15px;
  background: #fafafa;
  border-radius: 4px;
}

.plan-dot {
  width: 12px;
  height: 12px;
  background: #c41e3a;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.plan-content {
  flex: 1;
}

.plan-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.plan-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.forecast-chart-box {
  margin-top: 20px;
}

.forecast-chart {
  width: 100%;
  height: 280px;
}

/* 底部统计 */
.summary-section {
  background: #c41e3a;
  border-radius: 4px;
  padding: 25px;
  color: white;
}

.summary-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.summary-item {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.summary-value {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 5px;
}

.summary-label {
  font-size: 12px;
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 1200px) {
  .problem-layout {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .radar-chart {
    width: 100%;
    height: 280px;
  }
}
</style>
