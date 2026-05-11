<template>
  <div class="political-analysis-module">
    <header class="party-topbar">
      <div class="brand-area">
        <div class="party-emblem">☭</div>
        <div class="brand-title">数字党建应用</div>
      </div>
      <nav class="top-menu">
        <div v-for="item in topMenus" :key="item.name" class="top-menu-item" :class="{ active: item.active }">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </div>
      </nav>
      <div class="user-area">
        <span class="message"><i class="el-icon-message-solid"></i> 消息</span>
        <span class="avatar">👤</span>
        <span>孙一全</span>
        <span>xxxxxx党委｜书记</span>
        <i class="el-icon-caret-bottom"></i>
        <span>退出</span>
      </div>
    </header>

    <div class="workbench">
      <aside class="side-nav">
        <div class="collapse-btn"><i class="el-icon-s-fold"></i></div>
        <div class="side-tab">党员画像看板 <i class="el-icon-close"></i></div>
        <div class="side-icons">
          <i v-for="icon in sideIcons" :key="icon" :class="icon"></i>
        </div>
      </aside>

      <main class="dashboard-panel">
        <div class="breadcrumb">
          <i class="el-icon-s-home"></i>
          <span>/ 党建工作规划计划及党建工作责任制考核评价管理 / “两个作用”发挥智能分析 / 党员画像看板</span>
        </div>

        <section class="header-section section-cardless">
          <h1 class="header-title">政治生态智能分析平台</h1>
          <div class="section-divider"><span></span><b>总体洞察</b><span></span></div>
          <div class="year-selector">
            <span>年份：</span>
            <el-date-picker v-model="selectedYear" type="year" size="small" placeholder="2026" value-format="yyyy" class="year-select" />
          </div>
        </section>

        <section class="overview-section">
          <div class="overview-card score-card">
            <div class="card-header"><span class="card-tag"><i class="el-icon-document"></i> 总体平均分</span></div>
            <div class="score-content">
              <div class="score-main-wrap">
                <div class="main-score">92.60</div>
                <div class="score-info">
                  <div class="info-item"><span class="info-label">较上年</span><span class="info-value up">1.2 <i class="el-icon-top"></i></span></div>
                  <div class="info-item"><span class="info-label">参评单位</span><span class="info-value">27家</span></div>
                  <div class="info-item"><span class="info-label">高于平均分</span><span class="info-value">27家</span></div>
                </div>
              </div>
              <div class="liquid-chart" ref="liquidChart"></div>
            </div>
          </div>

          <div class="overview-card distribution-card">
            <div class="card-header"><span class="card-tag"><i class="el-icon-document"></i> 分数分布情况</span></div>
            <div class="distribution-content">
              <div class="distribution-chart" ref="distributionChart"></div>
              <div class="conclusion inline-conclusion"><span class="check-dot"><i class="el-icon-check"></i></span><span class="conclusion-tag">核心结论：</span><span>超八成单位得分在<span class="red-text">90</span>分以上</span></div>
            </div>
          </div>

          <div class="overview-card trend-card">
            <div class="card-header"><span class="card-tag"><i class="el-icon-document"></i> 总体趋势情况</span></div>
            <div class="trend-content">
              <div class="trend-chart" ref="trendChart"></div>
              <div class="conclusion inline-conclusion"><span class="check-dot"><i class="el-icon-check"></i></span><span class="conclusion-tag">核心结论：</span><span>连续三年稳步提升，增速平稳</span></div>
            </div>
          </div>
        </section>

        <section class="core-analysis-section">
          <div class="section-divider"><span></span><b>核心分析</b><span></span></div>
          <div class="analysis-grid">
            <div v-for="card in analysisCards" :key="card.key" class="analysis-card">
              <div class="card-header-bar">
                <span class="card-title"><i class="el-icon-document"></i>{{ card.title }}</span>
                <button class="detail-btn">查看详情</button>
              </div>
              <div class="chart-container" :ref="card.ref"></div>
              <div v-if="card.key === 'trend'" class="trend-tabs">
                <span class="tab-item active">各单位趋势</span>
                <span class="tab-item">各维度趋势</span>
                <span class="tab-item">各指标趋势</span>
              </div>
              <div class="conclusion-text">
                <div><span class="check-dot"><i class="el-icon-check"></i></span><span class="conclusion-tag">核心结论</span></div>
                <p>{{ card.conclusion }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="special-functions-section">
          <div class="section-divider"><span></span><b>专项功能</b><span></span></div>
          <div class="functions-grid">
            <div v-for="card in functionCards" :key="card.title" class="function-card">
              <div class="function-header"><i class="el-icon-document"></i><span>{{ card.title }}</span></div>
              <div class="function-items">
                <div v-for="item in card.items" :key="item.text" class="function-item">
                  <i :class="item.icon"></i><span>{{ item.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const red = '#ff3b30'
const orange = '#ff8a18'
const pink = '#e07aca'
const cyan = '#38c9e8'

export default {
  name: 'PoliticalAnalysisModule',
  data() {
    return {
      selectedYear: '2026',
      charts: {},
      topMenus: [
        { name: '首页', icon: 'el-icon-s-home', active: true },
        { name: '监管指标', icon: 'el-icon-menu' },
        { name: '任务管理', icon: 'el-icon-s-claim' },
        { name: '资源库', icon: 'el-icon-suitcase' },
        { name: '统计报表', icon: 'el-icon-s-data' },
        { name: '驾驶舱', icon: 'el-icon-odometer' }
      ],
      sideIcons: ['el-icon-s-flag', 'el-icon-s-custom', 'el-icon-user-solid', 'el-icon-reading', 'el-icon-caret-top', 'el-icon-chat-line-square', 'el-icon-monitor', 'el-icon-orange', 'el-icon-shield', 'el-icon-s-cooperation', 'el-icon-s-finance', 'el-icon-s-management'],
      analysisCards: [
        { key: 'unit', ref: 'unitChart', title: '看单位', conclusion: '直属机构+共享平台类单位政治生态评价得分相对较低，其中A单位（87.12）、B单位（86.52）和C单位（85.31）排名较低，需重点关注。' },
        { key: 'dimension', ref: 'dimensionChart', title: '看维度', conclusion: '政治生活、政治文化等2个维度为当前短板，主要原因为党员先锋模范作用发挥不明显、为员工减负落实不够到位、职工矛盾利益诉求化解不及时等方面。' },
        { key: 'indicator', ref: 'indicatorChart', title: '看指标', conclusion: '失分主要集中在调查问卷方面，员工对政治生态的总体满意率为92.6%，反映出在以下看上方面，广大员工对政治生态的认可度还有较大提升空间。' },
        { key: 'trend', ref: 'trendDetailChart', title: '看趋势', conclusion: '管制类单位持续领跑，市场竞争类单位呈逐年上升趋势，直属机构+共享平台类单位存在下滑趋势需持续关注。' }
      ],
      functionCards: [
        { title: '自助分析', items: [{ icon: 'el-icon-s-data', text: '图表分析' }, { icon: 'el-icon-share', text: '归因分析' }, { icon: 'el-icon-s-operation', text: '对比分析' }, { icon: 'el-icon-rank', text: '交叉分析' }] },
        { title: '查看报告', items: [{ icon: 'el-icon-document-copy', text: '年度态势报告' }, { icon: 'el-icon-s-marketing', text: '趋势分析报告' }, { icon: 'el-icon-office-building', text: '单位画像报告' }, { icon: 'el-icon-document-checked', text: '问卷分析报告' }] },
        { title: '进度监控', items: [{ icon: 'el-icon-setting', text: '下级各单位评价进度统计' }] }
      ]
    }
  },
  methods: {
    getChartEl(refName) {
      const ref = this.$refs[refName]
      return Array.isArray(ref) ? ref[0] : ref
    },
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
      const chart = echarts.init(this.getChartEl('liquidChart'))
      this.charts.liquid = chart
      chart.setOption({
        series: [{
          type: 'liquidFill',
          data: [0.65, 0.58],
          radius: '78%',
          center: ['50%', '50%'],
          amplitude: 7,
          color: ['rgba(255, 59, 48, 0.88)', 'rgba(255, 138, 24, 0.42)'],
          backgroundStyle: { color: 'rgba(255, 59, 48, 0.10)' },
          outline: { borderDistance: 5, itemStyle: { color: 'none', borderColor: 'rgba(255, 59, 48, .45)', borderWidth: 3, shadowBlur: 12, shadowColor: 'rgba(255, 59, 48, .34)' } },
          label: { formatter: '65%', fontSize: 22, fontWeight: 700, color: '#fff' }
        }]
      })
    },
    initDistributionChart() {
      const chart = echarts.init(this.getChartEl('distributionChart'))
      this.charts.distribution = chart
      chart.setOption({
        tooltip: { trigger: 'item' },
        graphic: [{ type: 'text', left: '29%', top: '22%', style: { text: '90-95分  12家单位', fill: '#4b5563', font: '18px sans-serif' } }, { type: 'text', left: '12%', top: '54%', style: { text: '90-95分  10家单位', fill: '#4b5563', font: '18px sans-serif' } }, { type: 'text', right: '16%', top: '57%', style: { text: '90以下  5家单位', fill: '#4b5563', font: '18px sans-serif' } }],
        series: [{
          type: 'pie', radius: ['46%', '72%'], center: ['50%', '68%'], startAngle: 180, endAngle: 360, label: { show: false }, labelLine: { show: false },
          data: [
            { value: 12, name: '90-95分', itemStyle: { color: red } },
            { value: 10, name: '90-95分', itemStyle: { color: orange } },
            { value: 5, name: '90以下', itemStyle: { color: '#ffbc55' } }
          ]
        }]
      })
    },
    initTrendChart() {
      const chart = echarts.init(this.getChartEl('trendChart'))
      this.charts.trend = chart
      chart.setOption({
        grid: { left: 58, right: 36, bottom: 32, top: 18 },
        xAxis: { type: 'category', data: ['2024年', '2025年', '2026年'], axisTick: { show: false }, axisLine: { lineStyle: { color: '#d9d9d9' } } },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20, axisLabel: { color: '#777' }, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } } },
        series: [{ type: 'line', data: [91.82, 90.53, 92.60], smooth: false, symbolSize: 7, itemStyle: { color: '#ff6868' }, lineStyle: { color: '#ff6868', width: 2 }, label: { show: true, position: 'top', color: '#666', fontWeight: 700, formatter: ({ value }) => Number(value).toFixed(2) }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 104, 104, .24)' }, { offset: 1, color: 'rgba(255, 104, 104, .02)' }]) } }]
      })
    },
    initUnitChart() {
      const chart = echarts.init(this.getChartEl('unitChart'))
      this.charts.unit = chart
      chart.setOption({
        grid: { left: 58, right: 26, bottom: 52, top: 26 },
        xAxis: { type: 'category', data: ['管制\n业务类', '市场\n竞争类', '直属机构+共享\n平台类'], axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#555', fontSize: 14, lineHeight: 20 } },
        yAxis: { type: 'value', min: 75, max: 100, interval: 5, axisLabel: { color: '#9aa3af' }, splitLine: { lineStyle: { type: 'dashed', color: '#ececec' } } },
        series: [{ type: 'bar', barWidth: 18, data: [96.20, 92.60, 90.20], label: { show: true, position: 'top', color: '#333', fontWeight: 700, formatter: ({ value }) => Number(value).toFixed(2) }, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ff2f1f' }, { offset: 1, color: 'rgba(255,47,31,.05)' }]) } }]
      })
    },
    initDimensionChart() {
      const chart = echarts.init(this.getChartEl('dimensionChart'))
      this.charts.dimension = chart
      chart.setOption({
        radar: { center: ['50%', '51%'], radius: '62%', splitNumber: 5, indicator: [{ name: '政治生活\n23.42', max: 30 }, { name: '纪律规矩\n23.42', max: 30 }, { name: '政治文化\n23.42', max: 30 }, { name: '选人用人\n17.72', max: 30 }, { name: '清正廉洁\n19.42', max: 30 }], axisName: { color: '#555', fontSize: 13, lineHeight: 18 }, splitArea: { areaStyle: { color: ['rgba(255,138,24,.03)', 'rgba(255,138,24,.08)'] } }, splitLine: { lineStyle: { color: '#f2d7bc' } }, axisLine: { lineStyle: { color: '#f2d7bc' } } },
        series: [{ type: 'radar', data: [{ value: [23.42, 23.42, 23.42, 17.72, 19.42], areaStyle: { color: 'rgba(255,138,24,.18)' }, lineStyle: { color: orange }, itemStyle: { color: orange } }] }]
      })
    },
    initIndicatorChart() {
      const chart = echarts.init(this.getChartEl('indicatorChart'))
      this.charts.indicator = chart
      chart.setOption({
        grid: { left: 54, right: 28, bottom: 42, top: 24 },
        xAxis: { type: 'category', data: ['问卷', '指标', '经营业绩', '扣分', '最终得分'], axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#666', fontSize: 13 } },
        yAxis: { type: 'value', min: 0, max: 100, interval: 50, axisLabel: { color: '#777' }, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } } },
        series: [{ type: 'bar', barWidth: 20, data: [{ value: 42.50, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ff3b30' }, { offset: 1, color: 'rgba(255,59,48,.05)' }]) } }, { value: 43.42, itemStyle: { color: pink } }, { value: 9.50, itemStyle: { color: '#ffb34d' } }, { value: 2.82, label: { formatter: '-2.82' }, itemStyle: { color: cyan } }, { value: 92.60, itemStyle: { color: '#ff6470' } }], label: { show: true, position: 'top', color: '#222', fontWeight: 700, formatter: ({ value }) => Number(value).toFixed(2) } }]
      })
    },
    initTrendDetailChart() {
      const chart = echarts.init(this.getChartEl('trendDetailChart'))
      this.charts.trendDetail = chart
      chart.setOption({
        grid: { left: 42, right: 92, bottom: 40, top: 24 },
        xAxis: { type: 'category', data: ['2024年', '2025年', '2026年'], axisTick: { show: false }, axisLine: { lineStyle: { color: '#ddd' } }, axisLabel: { color: '#666', fontSize: 14 } },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20, axisLabel: { color: '#777' }, splitLine: { lineStyle: { color: '#e5e5e5' } } },
        series: [{ name: '管制业务类', type: 'line', data: [31, 36, 49], itemStyle: { color: '#ff5b55' }, lineStyle: { color: '#ff5b55' }, label: { show: false } }, { name: '市场竞争类', type: 'line', data: [8, 22, 30], itemStyle: { color: '#ff8a18' }, lineStyle: { color: '#ff8a18' } }, { name: '直属机构+共享平台类', type: 'line', data: [24, 25, 13], itemStyle: { color: '#16b6d2' }, lineStyle: { color: '#16b6d2' } }],
        graphic: [{ type: 'text', right: 10, top: 84, style: { text: '管制业务类\n市场竞争类\n直属机构+共\n享平台类', fill: '#666', font: '13px sans-serif', lineHeight: 18 } }]
      })
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        if (chart && chart.resize) chart.resize()
      })
    }
  },
  mounted() {
    this.$nextTick(() => this.initCharts())
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
  --theme-red: #ff2f24;
  --deep-red: #c90408;
  --text-red: #e72f3a;
  width: 100%;
  min-width: 1800px;
  min-height: 1060px;
  background: #fff7ed;
  color: #333;
  overflow: hidden;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
}

.party-topbar {
  height: 64px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  gap: 34px;
  color: #fff;
  background: linear-gradient(90deg, rgba(236, 20, 20, .98), rgba(255, 45, 29, .94)), radial-gradient(circle at 60% 10%, rgba(255, 207, 78, .42), transparent 28%);
  position: relative;
  overflow: hidden;
}

.party-topbar::before,
.party-topbar::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(72deg, rgba(255,255,255,.08) 0 1px, transparent 1px 86px);
  opacity: .45;
}

.brand-area,
.top-menu,
.user-area { position: relative; z-index: 1; }

.brand-area { display: flex; align-items: center; gap: 14px; flex: 0 0 360px; }
.party-emblem { font-size: 38px; color: #ffe25c; filter: drop-shadow(0 2px 4px rgba(122,0,0,.35)); }
.brand-title { font-size: 25px; letter-spacing: 1px; font-weight: 600; }

.top-menu { display: flex; align-items: center; gap: 18px; flex: 1; height: 100%; }
.top-menu-item { height: 42px; padding: 0 20px; border-radius: 5px; display: flex; align-items: center; gap: 7px; font-size: 18px; white-space: nowrap; }
.top-menu-item i { font-size: 20px; }
.top-menu-item.active { background: rgba(150, 0, 0, .72); box-shadow: inset 0 -2px 0 rgba(255,255,255,.08); }

.user-area { display: flex; align-items: center; gap: 14px; font-size: 15px; white-space: nowrap; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: #fff; color: #222; }
.message i { color: #ffd15a; }

.workbench { display: flex; min-height: 996px; background: linear-gradient(180deg, #fff 0, #fff8ef 74%, #fff2de 100%); }
.side-nav { width: 80px; background: #fff; border-radius: 0 10px 0 0; box-shadow: 8px 0 18px rgba(173, 32, 19, .08); position: relative; flex-shrink: 0; }
.collapse-btn { position: absolute; left: 20px; top: 8px; color: #fff; font-size: 23px; transform: translateY(-64px); z-index: 3; }
.side-tab { position: absolute; top: 0; left: 80px; height: 38px; padding: 0 18px; border-radius: 8px 8px 0 0; background: rgba(194, 0, 0, .75); color: #fff; display: flex; align-items: center; gap: 18px; white-space: nowrap; }
.side-icons { padding-top: 60px; display: flex; flex-direction: column; align-items: center; gap: 19px; color: var(--theme-red); }
.side-icons i { font-size: 19px; }

.dashboard-panel { flex: 1; position: relative; padding: 0 20px 20px 20px; background: linear-gradient(180deg, rgba(255,255,255,.96) 0 45%, rgba(255,250,242,.9) 100%); }
.dashboard-panel::after { content: ""; position: absolute; right: 0; bottom: -8px; width: 540px; height: 180px; background: radial-gradient(ellipse at center, rgba(244, 142, 71, .20), transparent 65%); pointer-events: none; }
.breadcrumb { height: 40px; display: flex; justify-content: flex-end; align-items: center; gap: 8px; padding-right: 26px; color: #fff; font-size: 14px; background: linear-gradient(90deg, transparent, rgba(232, 25, 14, .95)); margin: 0 -20px; }
.breadcrumb i { font-size: 22px; }

.header-section { position: relative; padding: 14px 0 8px; text-align: center; }
.header-title { color: var(--text-red); font-size: 36px; line-height: 1.2; font-weight: 800; letter-spacing: 2px; margin: 0 0 10px; }
.section-divider { display: flex; justify-content: center; align-items: center; gap: 10px; color: #ff4d36; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
.section-divider span { width: 200px; height: 1px; background: linear-gradient(90deg, transparent, #ff4d36); }
.section-divider span:last-child { background: linear-gradient(90deg, #ff4d36, transparent); }
.section-divider b::before,
.section-divider b::after { content: ""; display: inline-block; width: 8px; height: 8px; margin: 0 12px 4px; border-radius: 50%; background: #ff4d36; }
.year-selector { position: absolute; right: 38px; top: 30px; display: flex; align-items: center; gap: 8px; color: #333; font-size: 15px; }
.year-select { width: 194px; }

.overview-section { display: grid; grid-template-columns: 410px 1fr 640px; gap: 24px; margin: 12px 24px 14px; }
.overview-card,
.analysis-card,
.function-card { background: rgba(255,255,255,.95); border-radius: 8px; box-shadow: 0 6px 18px rgba(82, 58, 36, .18); border: 1px solid rgba(255, 230, 213, .7); }
.overview-card { height: 226px; padding: 14px 18px 16px; }
.card-header { margin-bottom: 2px; }
.card-tag { color: var(--text-red); font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.card-tag i,
.card-title i,
.function-header i { color: #ff523f; font-size: 15px; }
.score-content { height: 160px; display: flex; align-items: center; justify-content: space-between; padding: 0 42px 0 18px; }
.score-main-wrap { display: flex; flex-direction: column; gap: 8px; }
.main-score { color: var(--text-red); font-size: 55px; font-weight: 800; letter-spacing: 2px; }
.score-info { display: grid; grid-template-columns: repeat(3, auto); gap: 26px; align-items: end; }
.info-item { display: flex; flex-direction: column; gap: 6px; font-size: 16px; color: #627083; }
.info-value { color: var(--text-red); font-weight: 800; }
.info-value.up { color: var(--text-red); }
.liquid-chart { width: 92px; height: 92px; }
.distribution-chart, .trend-chart { width: 100%; height: 162px; }
.inline-conclusion { height: 34px; display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: -2px; color: #777; font-size: 17px; }
.conclusion-tag { font-weight: 800; color: #555; }
.red-text { color: #ff2f24; }
.check-dot { width: 18px; height: 18px; border-radius: 50%; background: #f8d8b8; display: inline-flex; align-items: center; justify-content: center; color: #fff; margin-right: 4px; font-size: 12px; }

.core-analysis-section { margin: 2px 24px 0; }
.analysis-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin-top: 14px; }
.analysis-card { height: 478px; padding: 0 10px 14px; overflow: hidden; }
.card-header-bar { height: 43px; display: flex; align-items: center; justify-content: space-between; margin: 0 -10px; padding-left: 18px; padding-right: 12px; position: relative; }
.card-header-bar::before { content: ""; position: absolute; left: 0; top: 0; width: 132px; height: 43px; background: linear-gradient(105deg, #ff552f 0%, #ff6a4d 55%, rgba(255,106,77,.45) 56%, rgba(255,106,77,.45) 100%); clip-path: polygon(0 0, 100% 0, 86% 100%, 0 100%); }
.card-title { position: relative; z-index: 1; color: #fff; font-size: 19px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.card-title i { color: #fff; }
.detail-btn { position: relative; z-index: 1; border: 1px solid #ff5a49; color: #ff4a36; background: #fff; height: 26px; padding: 0 10px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.chart-container { width: 100%; height: 300px; }
.trend-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: -8px 4px 14px; }
.tab-item { height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 7px; background: #fff8ea; color: #8a7560; font-size: 13px; }
.tab-item.active { background: #ff8700; color: #fff; }
.conclusion-text { background: #f8f9fb; border-radius: 8px; min-height: 108px; padding: 9px 12px; color: #666; font-size: 16px; line-height: 1.35; }
.conclusion-text > div { display: flex; align-items: center; margin-bottom: 4px; }
.conclusion-text p { margin: 0; text-align: justify; }

.special-functions-section { margin: 12px 24px 0; }
.functions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 16px; }
.function-card { height: 94px; padding: 15px 16px 12px; }
.function-header { display: flex; align-items: center; gap: 10px; color: var(--text-red); font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.function-items { display: flex; align-items: center; gap: 20px; color: #555; font-size: 18px; }
.function-item { display: flex; align-items: center; gap: 6px; padding-right: 20px; border-right: 1px solid #eee1d4; }
.function-item:last-child { border-right: 0; }
.function-item i { color: #777; font-size: 20px; }

@media (max-width: 1400px) {
  .political-analysis-module { transform-origin: top left; }
}
</style>
