<template>
  <div class="portrait-report-module">
    <div class="report-header">
      <h1 class="report-title">深圳供电局 2025年政治生态评价画像</h1>
      <div class="header-actions">
        <el-button v-throttle:3000="handleDownload" type="primary" size="small" icon="el-icon-download">下载报告</el-button>
        <el-button v-throttle:3000="handleTestThrottle" size="small" icon="el-icon-s-check">测试节流</el-button>
        <el-button size="small" icon="el-icon-share">分享</el-button>
      </div>
    </div>

    <div class="report-body">
      <div class="left-sidebar">
        <div class="nav-menu">  
            <div
            v-for="item in navItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeNav === item.key }"
            @click="activeNav = item.key"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="score-overview-section">
          <div class="score-card main-score-card">
            <div class="score-header">
              <span class="score-tag">总体得分</span>
              <span class="score-year">2025年度</span>
            </div>
            <div class="score-body">
              <div class="big-score">92.60</div>
              <div class="score-rank">排名第 3 位</div>
              <div class="score-trend-row">
                <span class="trend-item">
                  <span class="trend-label">较上年</span>
                  <span class="trend-value up">+1.2 <i class="el-icon-top"></i></span>
                </span>
                <span class="trend-item">
                  <span class="trend-label">较行业平均</span>
                  <span class="trend-value up">+2.3 <i class="el-icon-top"></i></span>
                </span>
              </div>
            </div>
            <div class="score-footer">
              <div class="dimension-tags">
                <span class="dim-tag">政治生活 23.42</span>
                <span class="dim-tag">纪律规矩 23.42</span>
                <span class="dim-tag">政治文化 23.42</span>
                <span class="dim-tag">选人用人 17.72</span>
                <span class="dim-tag">清正廉洁 19.42</span>
              </div>
            </div>
          </div>

          <div class="score-card radar-card">
            <div class="card-title">五维雷达图</div>
            <div class="radar-chart" ref="radarChart"></div>
          </div>

          <div class="score-card trend-mini-card">
            <div class="card-title">历年趋势</div>
            <div class="trend-mini-chart" ref="trendMiniChart"></div>
          </div>
        </div>

        <div class="section-divider">
          <span></span><b>维度画像分析</b><span></span>
        </div>

        <div class="dimension-analysis-section">
          <div
            v-for="dim in dimensionList"
            :key="dim.key"
            class="dimension-card"
          >
            <div class="dim-header">
              <div class="dim-title-row">
                <span class="dim-icon" :style="{ background: dim.color }"><i :class="dim.icon"></i></span>
                <span class="dim-title">{{ dim.title }}</span>
                <span class="dim-score" :style="{ color: dim.color }">{{ dim.score }}分</span>
              </div>
              <div class="dim-rank">排名 {{ dim.rank }} / 27</div>
            </div>

            <div class="dim-body">
              <div class="indicator-bars">
                <div
                  v-for="ind in dim.indicators"
                  :key="ind.name"
                  class="indicator-bar-item"
                >
                  <div class="ind-label">{{ ind.name }}</div>
                  <div class="ind-bar-wrap">
                    <div class="ind-bar-track">
                      <div
                        class="ind-bar-fill"
                        :style="{ width: ind.percent + '%', background: dim.color }"
                      ></div>
                    </div>
                    <span class="ind-value">{{ ind.value }}</span>
                  </div>
                </div>
              </div>

              <div class="dim-conclusion">
                <div class="conclusion-label"><i class="el-icon-info"></i> 核心结论</div>
                <p class="conclusion-text">{{ dim.conclusion }}</p>
              </div>
            </div>

            <div class="dim-chart-wrap">
              <div class="dim-chart" :ref="dim.chartRef"></div>
            </div>
          </div>
        </div>

        <div class="section-divider">
          <span></span><b>指标明细分析</b><span></span>
        </div>

        <div class="indicator-detail-section">
          <div class="indicator-table-card">
            <div class="table-header">
              <span class="table-title">指标得分明细</span>
              <div class="table-filters">
                <el-radio-group v-model="indicatorFilter" size="small">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="high">优势指标</el-radio-button>
                  <el-radio-button label="low">短板指标</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <el-table :data="filteredIndicators" stripe style="width: 100%">
              <el-table-column prop="name" label="指标名称" min-width="180" />
              <el-table-column prop="dimension" label="所属维度" width="120" />
              <el-table-column prop="score" label="得分" width="100">
                <template slot-scope="scope">
                  <span :class="scope.row.score >= 90 ? 'score-high' : scope.row.score >= 80 ? 'score-mid' : 'score-low'">
                    {{ scope.row.score }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="权重" width="80" />
              <el-table-column prop="fullScore" label="满分" width="80" />
              <el-table-column prop="rank" label="排名" width="80" />
              <el-table-column prop="trend" label="趋势" width="100">
                <template slot-scope="scope">
                  <span :class="scope.row.trend > 0 ? 'trend-up' : scope.row.trend < 0 ? 'trend-down' : 'trend-flat'">
                    {{ scope.row.trend > 0 ? '↑' : scope.row.trend < 0 ? '↓' : '—' }} {{ Math.abs(scope.row.trend) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="得分率" min-width="180">
                <template slot-scope="scope">
                  <div class="table-bar-track">
                    <div
                      class="table-bar-fill"
                      :class="scope.row.rate >= 90 ? 'is-high' : scope.row.rate >= 80 ? 'is-mid' : 'is-low'"
                      :style="{ width: scope.row.rate + '%' }"
                    ></div>
                  </div>
                  <span class="table-rate-text">{{ scope.row.rate }}%</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="section-divider">
          <span></span><b>横向对比分析</b><span></span>
        </div>

        <div class="compare-section">
          <div class="compare-card">
            <div class="card-title">与同类型单位对比</div>
            <div class="compare-chart" ref="compareChart"></div>
          </div>
          <div class="compare-card">
            <div class="card-title">与标杆单位差距分析</div>
            <div class="gap-chart" ref="gapChart"></div>
          </div>
        </div>

        <div class="section-divider">
          <span></span><b>改进建议</b><span></span>
        </div>

        <div class="suggestion-section">
          <div class="suggestion-card">
            <div class="suggestion-header">
              <i class="el-icon-s-claim"></i>
              <span>针对性改进建议</span>
            </div>
            <div class="suggestion-list">
              <div
                v-for="(item, index) in suggestions"
                :key="index"
                class="suggestion-item"
              >
                <div class="suggestion-index">{{ index + 1 }}</div>
                <div class="suggestion-content">
                  <div class="suggestion-title">{{ item.title }}</div>
                  <div class="suggestion-desc">{{ item.desc }}</div>
                  <div class="suggestion-tags">
                    <span class="sg-tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

const colors = {
  red: '#ff3b30',
  orange: '#ff8a18',
  pink: '#e07aca',
  cyan: '#38c9e8',
  blue: '#4a7dff',
  green: '#2f9a61',
  purple: '#8e6de8',
  yellow: '#f5a623'
}

export default {
  name: 'PortraitReportModule',
  data() {
    return {
      activeNav: 'overview',
      navItems: [
        { key: 'overview', label: '总体画像', icon: 'el-icon-s-data' },
        { key: 'dimension', label: '维度分析', icon: 'el-icon-s-grid' },
        { key: 'indicator', label: '指标明细', icon: 'el-icon-s-order' },
        { key: 'compare', label: '横向对比', icon: 'el-icon-s-marketing' },
        { key: 'suggestion', label: '改进建议', icon: 'el-icon-s-claim' }
      ],
      indicatorFilter: 'all',
      indicators: [
        { name: '党内政治生活规范性', dimension: '政治生活', score: 94.5, weight: 15, fullScore: 30, rank: 5, trend: 2.1, rate: 94.5 },
        { name: '党员先锋模范作用发挥', dimension: '政治生活', score: 88.2, weight: 15, fullScore: 30, rank: 12, trend: -1.5, rate: 88.2 },
        { name: '政治纪律执行情况', dimension: '纪律规矩', score: 96.3, weight: 15, fullScore: 30, rank: 3, trend: 3.2, rate: 96.3 },
        { name: '组织纪律执行情况', dimension: '纪律规矩', score: 91.8, weight: 15, fullScore: 30, rank: 8, trend: 0.8, rate: 91.8 },
        { name: '政治文化氛围营造', dimension: '政治文化', score: 89.5, weight: 15, fullScore: 30, rank: 15, trend: -0.5, rate: 89.5 },
        { name: '为员工减负落实情况', dimension: '政治文化', score: 85.2, weight: 15, fullScore: 30, rank: 18, trend: -2.3, rate: 85.2 },
        { name: '选人用人满意度', dimension: '选人用人', score: 87.6, weight: 10, fullScore: 20, rank: 14, trend: 1.2, rate: 87.6 },
        { name: '干部队伍建设', dimension: '选人用人', score: 92.1, weight: 10, fullScore: 20, rank: 6, trend: 2.5, rate: 92.1 },
        { name: '廉洁风险防控', dimension: '清正廉洁', score: 95.8, weight: 10, fullScore: 20, rank: 4, trend: 1.8, rate: 95.8 },
        { name: '信访举报情况', dimension: '清正廉洁', score: 90.3, weight: 10, fullScore: 20, rank: 9, trend: -0.8, rate: 90.3 }
      ],
      dimensionList: [
        {
          key: 'political_life',
          title: '政治生活',
          icon: 'el-icon-s-flag',
          color: colors.red,
          score: 23.42,
          rank: 5,
          indicators: [
            { name: '规范性', value: 94.5, percent: 94.5 },
            { name: '先锋模范作用', value: 88.2, percent: 88.2 }
          ],
          conclusion: '党内政治生活规范性较好，但党员先锋模范作用发挥仍有提升空间，建议加强党员教育管理。',
          chartRef: 'dimChart1'
        },
        {
          key: 'discipline',
          title: '纪律规矩',
          icon: 'el-icon-lock',
          color: colors.orange,
          score: 23.42,
          rank: 3,
          indicators: [
            { name: '政治纪律', value: 96.3, percent: 96.3 },
            { name: '组织纪律', value: 91.8, percent: 91.8 }
          ],
          conclusion: '纪律规矩执行情况整体优秀，政治纪律排名靠前，需持续保持高压态势。',
          chartRef: 'dimChart2'
        },
        {
          key: 'political_culture',
          title: '政治文化',
          icon: 'el-icon-s-opportunity',
          color: colors.pink,
          score: 23.42,
          rank: 8,
          indicators: [
            { name: '文化氛围', value: 89.5, percent: 89.5 },
            { name: '减负落实', value: 85.2, percent: 85.2 }
          ],
          conclusion: '政治文化氛围营造尚可，为员工减负落实不够到位是主要短板，需重点整改。',
          chartRef: 'dimChart3'
        },
        {
          key: 'personnel',
          title: '选人用人',
          icon: 'el-icon-s-custom',
          color: colors.cyan,
          score: 17.72,
          rank: 12,
          indicators: [
            { name: '满意度', value: 87.6, percent: 87.6 },
            { name: '队伍建设', value: 92.1, percent: 92.1 }
          ],
          conclusion: '干部队伍建设成效显著，但选人用人满意度仍有提升空间，建议优化选拔机制。',
          chartRef: 'dimChart4'
        },
        {
          key: 'integrity',
          title: '清正廉洁',
          icon: 'el-icon-s-check',
          color: colors.green,
          score: 19.42,
          rank: 6,
          indicators: [
            { name: '风险防控', value: 95.8, percent: 95.8 },
            { name: '信访举报', value: 90.3, percent: 90.3 }
          ],
          conclusion: '廉洁风险防控成效突出，信访举报控制良好，整体廉洁状况健康。',
          chartRef: 'dimChart5'
        }
      ],
      suggestions: [
        {
          title: '加强党员先锋模范作用发挥',
          desc: '针对党员先锋模范作用发挥不明显的短板，建议建立党员先锋指数评价体系，将作用发挥情况纳入绩效考核。',
          tags: ['政治生活', '党员管理', '绩效考核']
        },
        {
          title: '落实为员工减负措施',
          desc: '针对为员工减负落实不到位的问题，建议开展专项调研，梳理形式主义问题清单，建立减负长效机制。',
          tags: ['政治文化', '减负', '形式主义']
        },
        {
          title: '优化选人用人机制',
          desc: '提升选人用人满意度，建议扩大民主推荐范围，完善干部选拔任用程序，加强选人用人监督。',
          tags: ['选人用人', '干部管理', '民主监督']
        },
        {
          title: '持续强化廉洁风险防控',
          desc: '保持廉洁风险防控良好态势，建议深化廉洁风险排查，完善防控措施，加强重点领域监督。',
          tags: ['清正廉洁', '风险防控', '重点领域']
        }
      ]
    }
  },
  computed: {
    filteredIndicators() {
      if (this.indicatorFilter === 'high') {
        return this.indicators.filter(item => item.score >= 90)
      }
      if (this.indicatorFilter === 'low') {
        return this.indicators.filter(item => item.score < 90)
      }
      return this.indicators
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initRadarChart()
      this.initTrendMiniChart()
      this.initDimCharts()
      this.initCompareChart()
      this.initGapChart()
    })
  },
  beforeDestroy() {
    Object.values(this.charts || {}).forEach(chart => chart && chart.dispose())
  },
  methods: {
    initRadarChart() {
      const chart = echarts.init(this.$refs.radarChart)
      this.charts = this.charts || {}
      this.charts.radar = chart

      const option = {
        radar: {
          indicator: [
            { name: '政治生活', max: 30 },
            { name: '纪律规矩', max: 30 },
            { name: '政治文化', max: 30 },
            { name: '选人用人', max: 30 },
            { name: '清正廉洁', max: 30 }
          ],
          radius: '65%',
          axisName: { color: '#5b6782', fontSize: 12 },
          splitArea: {
            areaStyle: {
              color: ['rgba(255,255,255,0.9)', 'rgba(245,247,250,0.9)', 'rgba(235,238,245,0.9)']
            }
          },
          axisLine: { lineStyle: { color: 'rgba(112,129,164,0.2)' } },
          splitLine: { lineStyle: { color: 'rgba(112,129,164,0.15)' } }
        },
        series: [{
          type: 'radar',
          data: [{
            value: [23.42, 23.42, 23.42, 17.72, 19.42],
            name: '本单位',
            areaStyle: { color: 'rgba(74,125,255,0.2)' },
            lineStyle: { color: colors.blue, width: 2 },
            itemStyle: { color: colors.blue }
          }, {
            value: [25, 24, 22, 18, 20],
            name: '行业平均',
            areaStyle: { color: 'rgba(47,154,97,0.15)' },
            lineStyle: { color: colors.green, width: 2, type: 'dashed' },
            itemStyle: { color: colors.green }
          }]
        }],
        legend: {
          bottom: 0,
          data: ['本单位', '行业平均'],
          textStyle: { color: '#5b6782', fontSize: 12 }
        }
      }
      chart.setOption(option)
    },
    initTrendMiniChart() {
      const chart = echarts.init(this.$refs.trendMiniChart)
      this.charts.trendMini = chart

      const option = {
        grid: { top: 20, right: 20, bottom: 30, left: 40 },
        xAxis: {
          type: 'category',
          data: ['2022', '2023', '2024', '2025'],
          axisLine: { lineStyle: { color: 'rgba(112,129,164,0.2)' } },
          axisLabel: { color: '#5b6782', fontSize: 11 }
        },
        yAxis: {
          type: 'value',
          min: 85,
          max: 100,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(112,129,164,0.1)' } },
          axisLabel: { color: '#5b6782', fontSize: 11 }
        },
        series: [{
          data: [89.5, 90.2, 91.4, 92.6],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: colors.blue, width: 3 },
          itemStyle: { color: colors.blue, borderWidth: 2, borderColor: '#fff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(74,125,255,0.25)' },
                { offset: 1, color: 'rgba(74,125,255,0.02)' }
              ]
            }
          }
        }]
      }
      chart.setOption(option)
    },
    initDimCharts() {
      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r},${g},${b},${alpha})`
      }

      this.dimensionList.forEach((dim) => {
        const ref = this.$refs[dim.chartRef]
        if (!ref || !ref[0]) return
        const chart = echarts.init(ref[0])
        this.charts[dim.chartRef] = chart

        const option = {
          grid: { top: 10, right: 10, bottom: 20, left: 10 },
          xAxis: { show: false, max: 100 },
          yAxis: {
            type: 'category',
            data: dim.indicators.map(i => i.name).reverse(),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#5b6782', fontSize: 11 }
          },
          series: [{
            type: 'bar',
            data: dim.indicators.map(i => i.value).reverse(),
            barWidth: 24,
            label: {
              show: true,
              position: 'right',
              formatter: function(params) { return params.value.toFixed(2); },
              color: '#364461',
              fontSize: 12,
              fontWeight: 'bold'
            },
            itemStyle: {
              borderRadius: [0, 4, 4, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: hexToRgba(dim.color, 0.25) },
                { offset: 1, color: dim.color }
              ])
            }
          }]
        }
        chart.setOption(option)
      })
    },
    initCompareChart() {
      const chart = echarts.init(this.$refs.compareChart)
      this.charts.compare = chart

      const option = {
        grid: { top: 30, right: 30, bottom: 40, left: 60 },
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['本单位', '同类型平均', '标杆单位'],
          bottom: 0,
          textStyle: { color: '#5b6782', fontSize: 12 }
        },
        xAxis: {
          type: 'category',
          data: ['政治生活', '纪律规矩', '政治文化', '选人用人', '清正廉洁'],
          axisLine: { lineStyle: { color: 'rgba(112,129,164,0.2)' } },
          axisLabel: { color: '#5b6782', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          max: 30,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(112,129,164,0.1)' } },
          axisLabel: { color: '#5b6782', fontSize: 11 }
        },
        series: [
          {
            name: '本单位',
            type: 'bar',
            data: [23.42, 23.42, 23.42, 17.72, 19.42],
            itemStyle: { color: colors.blue, borderRadius: [4, 4, 0, 0] },
            barWidth: 20
          },
          {
            name: '同类型平均',
            type: 'bar',
            data: [22.1, 22.5, 21.8, 17.2, 18.9],
            itemStyle: { color: colors.orange, borderRadius: [4, 4, 0, 0] },
            barWidth: 20
          },
          {
            name: '标杆单位',
            type: 'bar',
            data: [25.8, 25.2, 24.5, 19.5, 21.2],
            itemStyle: { color: colors.green, borderRadius: [4, 4, 0, 0] },
            barWidth: 20
          }
        ]
      }
      chart.setOption(option)
    },
    initGapChart() {
      const chart = echarts.init(this.$refs.gapChart)
      this.charts.gap = chart

      const option = {
        grid: { top: 20, right: 30, bottom: 30, left: 80 },
        xAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(112,129,164,0.1)' } },
          axisLabel: { color: '#5b6782', fontSize: 11 }
        },
        yAxis: {
          type: 'category',
          data: ['清正廉洁', '选人用人', '政治文化', '纪律规矩', '政治生活'],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#364461', fontSize: 12 }
        },
        series: [{
          type: 'bar',
          data: [
            { value: 1.8, itemStyle: { color: colors.green } },
            { value: 1.8, itemStyle: { color: colors.green } },
            { value: 1.1, itemStyle: { color: colors.orange } },
            { value: 1.8, itemStyle: { color: colors.green } },
            { value: 2.4, itemStyle: { color: colors.red } }
          ],
          barWidth: 18,
          label: {
            show: true,
            position: 'right',
            formatter: '+{c}',
            color: '#364461',
            fontSize: 12
          }
        }]
      }
      chart.setOption(option)
    },
    handleDownload() {
      this.$message.success('报告下载中，请稍候...')
    },
    handleTestThrottle() {
      this.$message.info('节流测试通过！')
    }
  }
}
</script>

<style scoped>
.portrait-report-module {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8ecf1;
}

.report-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a2742;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.report-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-sidebar {
  width: 180px;
  background: #fff;
  border-right: 1px solid #e8ecf1;
  padding: 16px 0;
  flex-shrink: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: #5b6782;
  font-size: 14px;
}

.nav-item i {
  margin-right: 10px;
  font-size: 16px;
}

.nav-item:hover {
  background: #f0f4f9;
  color: #4a7dff;
}

.nav-item.active {
  background: #eef3ff;
  color: #4a7dff;
  font-weight: 600;
  border-right: 3px solid #4a7dff;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.score-overview-section {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.score-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.main-score-card {
  display: flex;
  flex-direction: column;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.score-tag {
  font-size: 14px;
  color: #4a7dff;
  font-weight: 600;
  background: #eef3ff;
  padding: 4px 12px;
  border-radius: 20px;
}

.score-year {
  font-size: 13px;
  color: #8c96a8;
}

.score-body {
  flex: 1;
  text-align: center;
  padding: 10px 0;
}

.big-score {
  font-size: 56px;
  font-weight: 800;
  color: #1a2742;
  line-height: 1;
  letter-spacing: -2px;
}

.score-rank {
  font-size: 15px;
  color: #5b6782;
  margin-top: 8px;
  font-weight: 500;
}

.score-trend-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.trend-label {
  font-size: 12px;
  color: #8c96a8;
}

.trend-value {
  font-size: 16px;
  font-weight: 700;
}

.trend-value.up {
  color: #d84b4b;
}

.trend-value.down {
  color: #2f9a61;
}

.score-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.dimension-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dim-tag {
  font-size: 12px;
  color: #5b6782;
  background: #f5f7fa;
  padding: 4px 10px;
  border-radius: 12px;
}

.radar-card, .trend-mini-card {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2742;
  margin-bottom: 12px;
}

.radar-chart, .trend-mini-chart {
  flex: 1;
  min-height: 200px;
}

.section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;
  color: #1a2742;
  font-size: 16px;
}

.section-divider span {
  flex: 1;
  height: 1px;
  background: #e8ecf1;
}

.dimension-analysis-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dimension-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  display: grid;
  grid-template-columns: 1fr 1fr 280px;
  gap: 20px;
  align-items: start;
}

.dim-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.dim-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dim-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.dim-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a2742;
}

.dim-score {
  font-size: 20px;
  font-weight: 800;
}

.dim-rank {
  font-size: 14px;
  color: #8c96a8;
}

.dim-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.indicator-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.indicator-bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ind-label {
  font-size: 13px;
  color: #5b6782;
}

.ind-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ind-bar-track {
  flex: 1;
  height: 10px;
  background: #f0f2f5;
  border-radius: 5px;
  overflow: hidden;
}

.ind-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
}

.ind-value {
  font-size: 14px;
  font-weight: 700;
  color: #1a2742;
  min-width: 40px;
  text-align: right;
}

.dim-conclusion {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 14px;
}

.conclusion-label {
  font-size: 13px;
  font-weight: 600;
  color: #4a7dff;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.conclusion-text {
  font-size: 13px;
  color: #5b6782;
  line-height: 1.6;
  margin: 0;
}

.dim-chart-wrap {
  height: 180px;
}

.dim-chart {
  width: 100%;
  height: 100%;
}

.indicator-detail-section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a2742;
}

.score-high { color: #2f9a61; font-weight: 700; }
.score-mid { color: #f5a623; font-weight: 700; }
.score-low { color: #ff3b30; font-weight: 700; }

.trend-up { color: #d84b4b; }
.trend-down { color: #2f9a61; }
.trend-flat { color: #8c96a8; }

.table-bar-track {
  width: 100%;
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.table-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.table-bar-fill.is-high { background: #2f9a61; }
.table-bar-fill.is-mid { background: #f5a623; }
.table-bar-fill.is-low { background: #ff3b30; }

.table-rate-text {
  font-size: 12px;
  color: #5b6782;
}

.compare-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.compare-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.compare-chart, .gap-chart {
  height: 280px;
}

.suggestion-section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1a2742;
  margin-bottom: 20px;
}

.suggestion-header i {
  font-size: 20px;
  color: #4a7dff;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background: #eef3ff;
}

.suggestion-index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4a7dff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2742;
  margin-bottom: 6px;
}

.suggestion-desc {
  font-size: 13px;
  color: #5b6782;
  line-height: 1.6;
  margin-bottom: 10px;
}

.suggestion-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sg-tag {
  font-size: 12px;
  color: #4a7dff;
  background: #eef3ff;
  padding: 3px 10px;
  border-radius: 10px;
}

@media (max-width: 1200px) {
  .score-overview-section {
    grid-template-columns: 1fr 1fr;
  }
  .dimension-card {
    grid-template-columns: 1fr 1fr;
  }
  .dim-chart-wrap {
    grid-column: 1 / -1;
  }
  .compare-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .left-sidebar {
    display: none;
  }
  .score-overview-section {
    grid-template-columns: 1fr;
  }
  .dimension-card {
    grid-template-columns: 1fr;
  }
}
</style>
