<template>
  <div class="political-analysis-module">
    <section class="header-section section-cardless">
      <h1 class="header-title">政治生态智能分析平台</h1>
      <div class="year-selector">
        <span>年份：</span>
        <el-date-picker v-model="selectedYear" type="year" size="small" placeholder="2026" value-format="yyyy" class="year-select" />
      </div>
    </section>

    <div class="analysis-scroll-content">
      <div class="section-divider"><span></span><b>总体洞察</b><span></span></div>
      <section class="overview-section">
        <div class="overview-card score-card">
          <div class="card-header"><span class="card-tag"><i class="el-icon-document"></i> 总体平均分</span></div>
          <div class="score-content">
            <div class="score-main-wrap">
              <div class="main-score">{{ chartData.score.average }}</div>
            </div>
            <div class="liquid-chart" ref="liquidChart"></div>
            <div class="score-info">
              <div class="info-item"><span class="info-label">较上年</span><span class="info-value up">{{ chartData.score.compareLastYear }} <i class="el-icon-top"></i></span></div>
              <div class="info-item"><span class="info-label">参评单位</span><span class="info-value">{{ chartData.score.evaluatedUnits }}</span></div>
              <div class="info-item"><span class="info-label">高于平均分</span><span class="info-value">{{ chartData.score.aboveAverage }}</span></div>
            </div>
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

const DEFAULT_CHART_DATA = {
  score: {
    average: '92.60',
    liquid: [0.65, 0.58],
    liquidLabel: '65%',
    compareLastYear: '1.2',
    evaluatedUnits: '27家',
    aboveAverage: '27家'
  },
  distribution: {
    total: 27,
    ranges: [
      { value: 12, name: '95分以上' },
      { value: 10, name: '90-95分' },
      { value: 5, name: '90分以下' }
    ]
  },
  overallTrend: {
    years: ['2024年', '2025年', '2026年'],
    values: [91.82, 90.53, 92.60]
  },
  unit: {
    categories: ['管制\n业务类', '市场\n竞争类', '直属机构+共享\n平台类'],
    values: [96.20, 92.60, 90.20]
  },
  dimension: {
    indicators: [
      { name: '政治生活', value: 23.42, max: 30 },
      { name: '纪律规矩', value: 23.42, max: 30 },
      { name: '政治文化', value: 23.42, max: 30 },
      { name: '选人用人', value: 17.72, max: 30 },
      { name: '清正廉洁', value: 19.42, max: 30 }
    ]
  },
  indicator: {
    categories: ['问卷', '指标', '经营业绩', '扣分', '最终得分'],
    values: [42.50, 43.42, 9.50, -2.82, 92.60]
  },
  trendDetail: {
    years: ['2024年', '2025年', '2026年'],
    series: [
      { name: '管制业务类', data: [31, 36, 49], color: '#ff5b55' },
      { name: '市场竞争类', data: [8, 22, 30], color: '#ff8a18' },
      { name: '直属机构+共享平台类', data: [24, 25, 13], color: '#16b6d2' }
    ]
  }
}

const cloneChartData = (data = DEFAULT_CHART_DATA) => JSON.parse(JSON.stringify(data))

const getYearOffset = year => (Number(year) || 2026) - 2026
const clampScore = value => Math.max(0, Math.min(100, Number(value.toFixed(2))))
const buildYearChartData = year => {
  const offset = getYearOffset(year)
  const data = cloneChartData()
  const average = clampScore(92.60 + offset * 0.72)
  const liquidRatio = Number((average / 100).toFixed(2))
  const highScoreUnits = Math.max(8, 12 + offset)
  const midScoreUnits = Math.max(6, 10 - offset)
  const lowScoreUnits = Math.max(1, data.distribution.total - highScoreUnits - midScoreUnits)
  const yearNumber = Number(year) || 2026

  data.score.average = average.toFixed(2)
  data.score.liquid = [liquidRatio, Math.max(0.1, Number((liquidRatio - 0.07).toFixed(2)))]
  data.score.liquidLabel = `${Math.round(liquidRatio * 100)}%`
  data.score.compareLastYear = `${offset >= 0 ? (1.2 + offset * 0.3).toFixed(1) : (1.2 + offset * 0.2).toFixed(1)}`
  data.score.evaluatedUnits = `${data.distribution.total}家`
  data.score.aboveAverage = `${Math.max(0, highScoreUnits + midScoreUnits)}家`
  data.distribution.ranges = [
    { value: highScoreUnits, name: '95分以上' },
    { value: midScoreUnits, name: '90-95分' },
    { value: lowScoreUnits, name: '90分以下' }
  ]
  data.overallTrend.years = [`${yearNumber - 2}年`, `${yearNumber - 1}年`, `${yearNumber}年`]
  data.overallTrend.values = [average - 0.78, average - 2.07, average].map(clampScore)
  data.unit.values = [96.20 + offset * 0.45, 92.60 + offset * 0.68, 90.20 + offset * 0.38].map(clampScore)
  data.dimension.indicators = data.dimension.indicators.map((item, index) => ({
    ...item,
    value: clampScore(item.value + offset * [0.32, 0.24, 0.28, 0.18, 0.22][index])
  }))
  data.indicator.values = [42.50 + offset * 0.28, 43.42 + offset * 0.22, 9.50 + offset * 0.12, -2.82 + offset * 0.08, average].map(value => Number(value.toFixed(2)))
  data.trendDetail.years = data.overallTrend.years
  data.trendDetail.series = data.trendDetail.series.map((item, index) => ({
    ...item,
    data: item.data.map((value, valueIndex) => clampScore(value + offset * [2.2, 1.6, 1.1][index] + valueIndex * offset * 0.35))
  }))

  return data
}

export default {
  name: 'PoliticalAnalysisModule',
  data() {
    return {
      selectedYear: '2026',
      charts: {},
      chartData: cloneChartData(),
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
    async loadChartData(year = this.selectedYear) {
      const apiData = await this.fetchChartData(year)
      this.chartData = this.mergeChartData(apiData)
    },
    fetchChartData(year = this.selectedYear) {
      // 后续接入真实后端时，只需要在这里按 year 请求接口并返回同结构数据。
      return Promise.resolve(buildYearChartData(year))
    },
    mergeChartData(apiData = {}) {
      const merged = cloneChartData()
      Object.keys(apiData).forEach(key => {
        merged[key] = Array.isArray(apiData[key]) || typeof apiData[key] !== 'object' || apiData[key] === null
          ? apiData[key]
          : { ...merged[key], ...apiData[key] }
      })
      return merged
    },
    async refreshCharts(year = this.selectedYear) {
      await this.loadChartData(year)
      this.$nextTick(() => this.initCharts())
    },
    disposeCharts() {
      Object.values(this.charts).forEach(chart => {
        if (chart) chart.dispose()
      })
      this.charts = {}
    },
    initCharts() {
      this.disposeCharts()
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
          data: this.chartData.score.liquid,
          radius: '78%',
          center: ['50%', '50%'],
          amplitude: 7,
          color: ['rgba(255, 59, 48, 0.88)', 'rgba(255, 138, 24, 0.42)'],
          backgroundStyle: { color: 'rgba(255, 59, 48, 0.10)' },
          outline: { show: false },
          label: { formatter: this.chartData.score.liquidLabel, fontSize: 22, fontWeight: 700, color: '#fff' }
        }]
      })
    },
    initDistributionChart() {
      const chart = echarts.init(this.getChartEl('distributionChart'))
      this.charts.distribution = chart
      const colors = [red, orange, '#ffc34d']
      const ranges = this.chartData.distribution.ranges.map((item, index) => ({
        ...item,
        itemStyle: { color: colors[index] || orange }
      }))
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: ({ name, value }) => `${name}：${value}家单位`
        },
        series: [
          {
            type: 'pie',
            silent: true,
            z: 1,
            radius: ['50%', '80%'],
            center: ['50%', '74%'],
            startAngle: 180,
            endAngle: 360,
            label: { show: false },
            labelLine: { show: false },
            data: [{ value: this.chartData.distribution.total, itemStyle: { color: '#fff1e3' } }]
          },
          {
            type: 'pie',
            z: 2,
            radius: ['50%', '80%'],
            center: ['50%', '74%'],
            startAngle: 180,
            endAngle: 360,
            minAngle: 8,
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 3,
              borderRadius: 8
            },
            label: {
              show: true,
              color: '#4b5563',
              fontSize: 16,
              lineHeight: 20,
              formatter: ({ name, value }) => `${name}  {unitCount|${value}}家单位`,
              rich: {
                unitCount: {
                  color: '#4b5563',
                  fontSize: 16,
                  fontWeight: 800
                }
              }
            },
            labelLine: {
              show: true,
              length: 8,
              length2: 16,
              smooth: false,
              lineStyle: { color: '#d7a37a', width: 1.5 }
            },
            labelLayout(params) {
              const width = chart.getWidth()
              const height = chart.getHeight()
              const positions = {
                '95分以上': { x: width * 0.17, y: height * 0.32, align: 'left' },
                '90-95分': { x: width * 0.45, y: 8, align: 'left' },
                '90分以下': { x: width * 0.73, y: height * 0.52, align: 'left' }
              }
              return positions[params.name] || {}
            },
            emphasis: { scale: false },
            data: ranges
          }
        ]
      })
    },
    initTrendChart() {
      const chart = echarts.init(this.getChartEl('trendChart'))
      this.charts.trend = chart
      chart.setOption({
        grid: { left: 58, right: 36, bottom: 32, top: 18 },
        xAxis: { type: 'category', data: this.chartData.overallTrend.years, axisTick: { show: false }, axisLine: { lineStyle: { color: '#d9d9d9' } } },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20, axisLabel: { color: '#777' }, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } } },
        series: [{ type: 'line', data: this.chartData.overallTrend.values, smooth: false, symbolSize: 7, itemStyle: { color: '#ff6868' }, lineStyle: { color: '#ff6868', width: 2 }, label: { show: true, position: 'top', color: '#666', fontWeight: 700, formatter: ({ value }) => Number(value).toFixed(2) }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 104, 104, .24)' }, { offset: 1, color: 'rgba(255, 104, 104, .02)' }]) } }]
      })
    },
    initUnitChart() {
      const chart = echarts.init(this.getChartEl('unitChart'))
      this.charts.unit = chart
      chart.setOption({
        grid: { left: 58, right: 26, bottom: 52, top: 26 },
        xAxis: { type: 'category', data: this.chartData.unit.categories, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { interval: 0, hideOverlap: false, color: '#555', fontSize: 14, lineHeight: 20 } },
        yAxis: { type: 'value', min: 75, max: 100, interval: 5, axisLabel: { color: '#9aa3af' }, splitLine: { lineStyle: { type: 'dashed', color: '#ececec' } } },
        series: [{ type: 'bar', barWidth: 18, data: this.chartData.unit.values, label: { show: true, position: 'top', color: '#333', fontWeight: 700, formatter: ({ value }) => Number(value).toFixed(2) }, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ff2f1f' }, { offset: 1, color: 'rgba(255,47,31,.05)' }]) } }]
      })
    },
    initDimensionChart() {
      const chart = echarts.init(this.getChartEl('dimensionChart'))
      this.charts.dimension = chart
      chart.setOption({
        radar: { center: ['50%', '51%'], radius: '62%', splitNumber: 5, indicator: this.chartData.dimension.indicators.map(item => ({ name: `${item.name}\n${Number(item.value).toFixed(2)}`, max: item.max })), axisName: { color: '#555', fontSize: 13, lineHeight: 18 }, splitArea: { areaStyle: { color: ['rgba(255,138,24,.03)', 'rgba(255,138,24,.08)'] } }, splitLine: { lineStyle: { color: '#f2d7bc' } }, axisLine: { lineStyle: { color: '#f2d7bc' } } },
        series: [{ type: 'radar', data: [{ value: this.chartData.dimension.indicators.map(item => item.value), areaStyle: { color: 'rgba(255,138,24,.18)' }, lineStyle: { color: orange }, itemStyle: { color: orange } }] }]
      })
    },
    initIndicatorChart() {
      const chart = echarts.init(this.getChartEl('indicatorChart'))
      this.charts.indicator = chart
      chart.setOption({
        grid: { left: 54, right: 28, bottom: 42, top: 24 },
        xAxis: { type: 'category', data: this.chartData.indicator.categories, axisTick: { show: false }, axisLine: { show: true, onZero: true, lineStyle: { color: '#d9d9d9' } }, axisLabel: { color: '#666', fontSize: 13 } },
        yAxis: { type: 'value', min: -10, max: 100, interval: 20, axisLabel: { color: '#777' }, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } } },
        series: [{ type: 'bar', barWidth: 20, data: this.chartData.indicator.values.map((value, index) => ({ value, label: value < 0 ? { position: 'bottom' } : undefined, itemStyle: { color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ff3b30' }, { offset: 1, color: 'rgba(255,59,48,.05)' }]), pink, '#ffb34d', cyan, '#ff6470'][index] } })), label: { show: true, position: 'top', color: '#222', fontWeight: 700, formatter: ({ value }) => Number(value).toFixed(2) } }]
      })
    },
    initTrendDetailChart() {
      const chart = echarts.init(this.getChartEl('trendDetailChart'))
      this.charts.trendDetail = chart
      chart.setOption({
        color: this.chartData.trendDetail.series.map(item => item.color),
        legend: {
          right: 0,
          top: 42,
          orient: 'vertical',
          itemWidth: 14,
          itemHeight: 6,
          itemGap: 8,
          textStyle: { color: '#666', fontSize: 11, lineHeight: 14 },
          formatter(name) {
            return name === '直属机构+共享平台类' ? '直属机构+\n共享平台类' : name
          },
          data: this.chartData.trendDetail.series.map(item => item.name)
        },
        grid: { left: 42, right: 86, bottom: 40, top: 24 },
        xAxis: { type: 'category', data: this.chartData.trendDetail.years, axisTick: { show: false }, axisLine: { lineStyle: { color: '#ddd' } }, axisLabel: { color: '#666', fontSize: 14 } },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20, axisLabel: { color: '#777' }, splitLine: { lineStyle: { color: '#e5e5e5' } } },
        series: this.chartData.trendDetail.series.map((item, index) => ({
          name: item.name,
          type: 'line',
          data: item.data,
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: { color: item.color },
          lineStyle: { color: item.color, width: 2, type: 'solid' },
          label: index === 0 ? { show: false } : undefined
        }))
      })
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        if (chart && chart.resize) chart.resize()
      })
    }
  },
  watch: {
    selectedYear(year) {
      this.refreshCharts(year)
    }
  },
  mounted() {
    this.refreshCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.disposeCharts()
  }
}
</script>

<style scoped>
.political-analysis-module {
  --theme-red: #ff2f24;
  --text-red: #e72f3a;
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: 16px 24px 22px;
  color: #333;
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(ellipse at 82% 100%, rgba(244, 142, 71, .22), transparent 30%),
    radial-gradient(ellipse at 22% 40%, rgba(255, 224, 188, .18), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,.98) 0 45%, rgba(255,250,242,.97) 100%);
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
}

.political-analysis-module::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 190px;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 12% 100%, rgba(249, 191, 125, .24) 0 20%, transparent 42%),
    radial-gradient(ellipse at 82% 100%, rgba(238, 132, 79, .22) 0 22%, transparent 45%),
    linear-gradient(180deg, transparent, rgba(255, 238, 216, .76));
}

.political-analysis-module *,
.political-analysis-module *::before,
.political-analysis-module *::after { box-sizing: border-box; }

.header-section { position: relative; flex: 0 0 auto; padding: 0 0 10px; text-align: center; }
.analysis-scroll-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 0 2px 2px; scrollbar-width: none; -ms-overflow-style: none; }
.analysis-scroll-content::-webkit-scrollbar { display: none; width: 0; height: 0; }
.header-title { color: var(--text-red); font-size: 36px; line-height: 1.2; font-weight: 800; letter-spacing: 2px; margin: 0 0 12px; }
.section-divider { display: flex; justify-content: center; align-items: center; gap: 10px; color: #ff4d36; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
.section-divider span { width: min(200px, 22vw); height: 1px; background: linear-gradient(90deg, transparent, #ff4d36); }
.section-divider span:last-child { background: linear-gradient(90deg, #ff4d36, transparent); }
.section-divider b::before,
.section-divider b::after { content: ""; display: inline-block; width: 8px; height: 8px; margin: 0 12px 4px; border-radius: 50%; background: #ff4d36; }
.year-selector { position: absolute; right: 14px; top: 30px; display: flex; align-items: center; gap: 8px; color: #333; font-size: 15px; }
.year-select { width: 194px; }

.overview-section { display: grid; grid-template-columns: calc((100% - 72px) / 4) minmax(0, 1fr) minmax(0, 1fr); gap: 24px; margin: 12px 0 14px; }
.overview-card,
.analysis-card,
.function-card { min-width: 0; background: rgba(255,255,255,.97); border-radius: 8px; box-shadow: 0 6px 18px rgba(82, 58, 36, .18); border: 1px solid rgba(255, 230, 213, .7); backdrop-filter: blur(1px); }
.overview-card { height: 226px; padding: 14px 18px 16px; }
.card-header { height: 28px; margin-bottom: 2px; }
.card-tag { color: var(--text-red); font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.card-tag i,
.card-title i,
.function-header i { color: #ff523f; font-size: 15px; }
.score-content { height: 160px; display: grid; grid-template-columns: minmax(0, 1fr) 112px; grid-template-rows: 1fr auto; column-gap: 18px; row-gap: 6px; align-items: center; padding: 2px 18px 0; }
.score-main-wrap { min-width: 0; align-self: end; }
.main-score { color: var(--text-red); font-size: 55px; line-height: 1; font-weight: 800; letter-spacing: 2px; white-space: nowrap; }
.score-info { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: end; }
.info-item { display: flex; flex-direction: column; gap: 6px; min-width: 0; font-size: 16px; color: #627083; }
.info-value { color: var(--text-red); font-weight: 800; }
.info-value.up { color: var(--text-red); }
.liquid-chart { width: 96px; height: 96px; justify-self: end; align-self: center; }
.distribution-content,
.trend-content { height: 166px; display: flex; flex-direction: column; justify-content: space-between; }
.distribution-chart,
.trend-chart { width: 100%; height: 132px; flex: 1 1 auto; }
.inline-conclusion { height: 32px; display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 0; color: #777; font-size: 17px; }
.conclusion-tag { font-weight: 800; color: #555; }
.red-text { color: #ff2f24; }
.check-dot { width: 18px; height: 18px; border-radius: 50%; background: #f8d8b8; display: inline-flex; align-items: center; justify-content: center; color: #fff; margin-right: 4px; font-size: 12px; }

.core-analysis-section { margin: 2px 0 0; }
.analysis-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin-top: 14px; }
.analysis-card { height: 478px; padding: 0 10px 14px; overflow: hidden; }
.card-header-bar { height: 36px; display: flex; align-items: center; justify-content: space-between; margin: 0 -10px; padding-left: 18px; padding-right: 12px; position: relative; overflow: hidden; }
.card-header-bar::before { content: ""; position: absolute; left: 0; top: 0; width: 146px; height: 36px; background: linear-gradient(100deg, #ff4a2f 0%, #ff7058 58%, rgba(255, 169, 165, .72) 82%, rgba(255, 169, 165, 0) 100%); clip-path: polygon(0 0, 100% 0, 86% 100%, 0 100%); }
.card-title { position: relative; z-index: 1; color: #fff; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.card-title i { color: #fff; }
.detail-btn { position: relative; z-index: 1; border: 1px solid #ff5a49; color: #ff4a36; background: #fff; height: 24px; padding: 0 10px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.chart-container { width: 100%; min-width: 0; height: 300px; }
.trend-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: -8px 4px 14px; }
.tab-item { height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 7px; background: #fff8ea; color: #8a7560; font-size: 13px; }
.tab-item.active { background: #ff8700; color: #fff; }
.conclusion-text { background: #f8f9fb; border-radius: 8px; min-height: 108px; padding: 9px 12px; color: #666; font-size: 16px; line-height: 1.35; }
.conclusion-text > div { display: flex; align-items: center; margin-bottom: 4px; }
.conclusion-text p { margin: 0; text-align: justify; }

.special-functions-section { margin: 12px 0 0; }
.functions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 16px; }
.function-card { min-height: 94px; height: auto; padding: 15px 16px 12px; overflow: hidden; }
.function-header { display: flex; align-items: center; gap: 10px; color: var(--text-red); font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.function-items { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 0; min-width: 0; color: #555; font-size: 16px; }
.function-item { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; margin-right: 16px; padding-right: 16px; border-right: 1px solid #eee1d4; line-height: 1.25; white-space: normal; overflow-wrap: anywhere; }
.function-item:last-child { margin-right: 0; padding-right: 0; border-right: 0; }
.function-item i { flex-shrink: 0; color: #777; font-size: 19px; }
.function-item span { min-width: 0; }

@media (max-width: 1280px) {
  .overview-section { grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); }
  .analysis-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .functions-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
}

@media (max-width: 900px) {
  .political-analysis-module { padding: 14px; }
  .header-title { font-size: 28px; }
  .section-divider span { width: 90px; }
  .year-selector { position: static; justify-content: center; margin-top: 10px; }
  .score-content { height: auto; min-height: 160px; padding-top: 10px; }
  .overview-card { height: auto; min-height: 226px; }
  .analysis-grid { grid-template-columns: 1fr; }
}
</style>
