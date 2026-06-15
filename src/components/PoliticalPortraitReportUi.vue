<template>
  <div class="portrait-ui-module">
    <header class="app-topbar">
      <div class="brand-area">
        <i class="el-icon-s-flag"></i>
        <span>数字党建应用</span>
      </div>
      <nav class="top-nav">
        <button v-for="item in topNav" :key="item.text" :class="{ active: item.active }">
          <i :class="item.icon"></i>
          <span>{{ item.text }}</span>
        </button>
      </nav>
      <div class="user-area">
        <i class="el-icon-bell"></i>
        <span>消息</span>
        <span class="avatar"><i class="el-icon-user-solid"></i></span>
        <span>系统管理员</span>
      </div>
    </header>

    <div class="report-shell">
      <aside class="icon-rail">
        <button
          v-for="item in railItems"
          :key="item.key"
          :class="{ active: activeRail === item.key }"
          :title="item.title"
          @click="activeRail = item.key"
        >
          <i :class="item.icon"></i>
        </button>
      </aside>

      <main class="report-workspace">
        <div class="breadcrumb-row">
          <span><i class="el-icon-tickets"></i> 画像</span>
          <div class="action-group">
            <button><i class="el-icon-refresh"></i> 刷新</button>
            <button><i class="el-icon-download"></i> 导出</button>
            <button><i class="el-icon-printer"></i> 打印</button>
          </div>
        </div>

        <article class="report-page">
          <h1>深圳供电局 2025年政治生态评价画像</h1>

          <section class="report-section">
            <section-title title="政治生态总体情况" />
            <div class="subsection">
              <h3>基本情况</h3>
              <div class="two-column top-summary-grid">
                <div class="summary-card text-card">
                  <p>
                    深圳供电局2025年政治生态评价得分<span class="strong-red">95.308分</span>，同比上升<span class="strong-red">4.377分</span>，位于广东管制类单位平均水平之上。
                  </p>
                  <p>
                    本次评价采用“问卷调查：45% + 监督数据：45% + 经营业绩考核：10%-扣分”的方式开展，其中，问卷调查覆盖基层党组织和党员干部，重点围绕党内政治生活、纪律规矩、政治文化、选人用人和清正廉洁等方面进行综合分析。
                  </p>
                </div>
                <div class="radar-row">
                  <div ref="radarCurrent" class="chart radar-chart"></div>
                  <div ref="radarCompare" class="chart radar-chart"></div>
                </div>
              </div>
            </div>

            <div class="subsection">
              <h3>需重点关注的问题</h3>
              <div class="two-column">
                <div class="text-card">
                  <p>
                    深圳供电局发展现状、所在定位和2025年政治生态评价中，干部员工对党内政治生活、作风建设和廉洁约束的表达较稳定。突出政治标准、选人用人、永葆清正廉洁的政治本色等5个维度得分低于同类单位平均值。
                    <span class="link-text">更多</span>
                  </p>
                  <div class="problem-list">
                    <div v-for="item in focusProblems" :key="item"><span></span>{{ item }}<i class="el-icon-arrow-down"></i></div>
                  </div>
                </div>
                <div ref="mainTrend" class="chart line-chart"></div>
              </div>
            </div>

            <div class="subsection knowledge-block">
              <h3>扣分事项</h3>
              <div class="empty-state">
                <div class="check-badge"><i class="el-icon-check"></i></div>
                <span>很好！没有扣分</span>
              </div>
            </div>
          </section>

          <section class="report-section">
            <section-title title="各维度评价情况" />
            <dimension-block
              v-for="(dimension, index) in dimensions"
              :key="dimension.key"
              :dimension="dimension"
              :index="index"
            >
              <template v-slot:chart>
                <div :ref="'dimensionBar_' + index" class="chart horizontal-chart"></div>
              </template>
            </dimension-block>

            <div class="mini-analysis-grid">
              <mini-card
                v-for="(item, index) in miniCards"
                :key="item.title"
                :title="item.title"
                :text="item.text"
              >
                <div v-if="item.chart" :ref="'miniChart_' + index" class="chart mini-chart"></div>
              </mini-card>
            </div>
          </section>

          <section class="report-section">
            <dimension-block :dimension="cleanDimension" :index="dimensions.length">
              <template v-slot:chart>
                <div ref="cleanBar" class="chart horizontal-chart"></div>
              </template>
            </dimension-block>

            <div class="bottom-grid">
              <mini-card
                v-for="(item, index) in cleanMiniCards"
                :key="item.title"
                :title="item.title"
                :text="item.text"
              >
                <div v-if="item.chart" :ref="'cleanMiniChart_' + index" class="chart mini-chart"></div>
              </mini-card>
            </div>
          </section>
        </article>
      </main>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

const chartColors = ['#ff4b35', '#ff9a42', '#4c9cff', '#35c98d', '#c26adf']

const paragraph = '问卷调查显示，干部员工对深圳供电局严守党内政治生活认真“好”的占比较高，高于同类单位平均水平。需要在系统谋划、一查到底、以案促改等方面形成长效机制。'

export default {
  name: 'PoliticalPortraitReportUi',
  components: {
    SectionTitle: {
      functional: true,
      props: { title: String },
      render(h, ctx) {
        return h('div', { class: 'section-title' }, [
          h('span', { class: 'title-mark' }),
          h('span', ctx.props.title)
        ])
      }
    },
    DimensionBlock: {
      props: {
        dimension: { type: Object, required: true },
        index: { type: Number, required: true }
      },
      template: `
        <div class="dimension-block">
          <h3>{{ dimension.title }}</h3>
          <div class="two-column dimension-row">
            <div class="analysis-text-card">
              <div v-for="part in dimension.parts" :key="part.title" class="analysis-part">
                <h4><i class="el-icon-warning-outline"></i>{{ part.title }}</h4>
                <p>{{ part.text }}</p>
              </div>
              <div class="year-summary">{{ dimension.footer }}</div>
            </div>
            <slot name="chart"></slot>
          </div>
        </div>
      `
    },
    MiniCard: {
      props: {
        title: { type: String, required: true },
        text: { type: String, required: true }
      },
      template: `
        <div class="mini-card">
          <h4>{{ title }}</h4>
          <p>{{ text }}</p>
          <slot></slot>
        </div>
      `
    }
  },
  data() {
    return {
      activeRail: 'flag',
      charts: {},
      topNav: [
        { text: '首页', icon: 'el-icon-s-home', active: true },
        { text: '监督管理', icon: 'el-icon-s-grid' },
        { text: '任务管理', icon: 'el-icon-s-order' },
        { text: '资源库', icon: 'el-icon-folder-opened' },
        { text: '统计报表', icon: 'el-icon-s-data' },
        { text: '驾驶舱', icon: 'el-icon-monitor' }
      ],
      railItems: [
        { key: 'flag', title: '党建画像', icon: 'el-icon-s-flag' },
        { key: 'org', title: '组织管理', icon: 'el-icon-office-building' },
        { key: 'heart', title: '政治生活', icon: 'el-icon-s-opportunity' },
        { key: 'people', title: '选人用人', icon: 'el-icon-user-solid' },
        { key: 'trend', title: '趋势分析', icon: 'el-icon-s-marketing' },
        { key: 'doc', title: '报告管理', icon: 'el-icon-document' },
        { key: 'shield', title: '监督问责', icon: 'el-icon-lock' },
        { key: 'setting', title: '系统设置', icon: 'el-icon-setting' }
      ],
      focusProblems: [
        '党员先锋模范作用发挥需持续加强',
        '政治文化建设与作风建设融合不够',
        '干部员工诉求响应效率仍有提升空间',
        '选人用人满意度和透明度需进一步优化',
        '重点领域廉洁风险防控需持续压实'
      ],
      dimensions: [
        {
          key: 'life',
          title: '严肃党内政治生活',
          parts: [
            { title: '总体情况', text: paragraph },
            { title: '好的方面', text: '各项制度落实总体平稳，民主生活会、组织生活会和谈心谈话等制度执行较好，党员干部参与度和认可度较高。' },
            { title: '需改进的方面', text: '仍需进一步提升批评和自我批评质量，强化问题整改闭环，推动党内政治生活从“有形覆盖”向“有效覆盖”提升。' }
          ],
          footer: '2024年以来，党内政治生活规范度保持稳中有升。',
          values: [15, 23, 30, 48.2, 41.4]
        },
        {
          key: 'rule',
          title: '严明党的政治纪律和政治规矩',
          parts: [
            { title: '总体情况', text: '问卷调查显示，干部员工对深圳供电局严明党的政治纪律和政治规矩认可度较高，评价为好的占比持续提升。' },
            { title: '好的方面', text: '把纪律规矩教育贯穿日常监督、专项检查和警示教育全过程，党员干部纪律意识进一步增强。' },
            { title: '需改进的方面', text: '少数基层单位对纪律要求传导仍不够均衡，需继续加强压力传导和日常提醒。' }
          ],
          footer: '2024年以来，纪律规矩执行总体向好。',
          values: [15, 23, 30, 48.2, 41.4]
        },
        {
          key: 'culture',
          title: '发展积极健康的党内政治文化',
          parts: [
            { title: '总体情况', text: '问卷调查显示，干部员工对深圳供电局发展积极健康的党内政治文化认可为“好”的占比较高。' },
            { title: '好的方面', text: '理论学习、廉洁文化和先进典型宣传持续开展，崇廉尚实、担当作为的氛围不断浓厚。' },
            { title: '需改进的方面', text: '基层减负和形式主义治理仍需深化，部分员工对会议、材料、检查频次的获得感仍需提升。' }
          ],
          footer: '2024年，党内政治文化建设保持稳健推进。',
          values: [15, 23, 30, 48.2, 41.4]
        },
        {
          key: 'people',
          title: '突出政治标准选人用人',
          parts: [
            { title: '总体情况', text: '问卷调查显示，干部员工对深圳供电局突出政治标准选人用人认为“好”的占比稳定。' },
            { title: '好的方面', text: '干部选拔任用坚持政治标准、工作导向和群众公认，程序规范性较好。' },
            { title: '需改进的方面', text: '干部梯队培养、年轻干部发现储备和岗位交流机制仍需完善，选人用人的公开透明度可继续提升。' }
          ],
          footer: '2024年，选人用人满意度保持稳定。',
          values: [15, 23, 30, 48.2, 41.4]
        }
      ],
      miniCards: [
        { title: '干部选拔任用评价情况', text: '2024年一线调查研究反馈，深圳供电局干部选拔任用工作总体评价较好。' },
        { title: '对于干部选拔任用工作总体评价中“好”的占比', text: '', chart: 'bar' },
        { title: '近三年竞争性选拔情况', text: '2024年干部竞争性选拔更加规范，满意度保持平稳。' },
        { title: '对政治素质考察和组织把关评价中“好”的占比', text: '', chart: 'doubleBar' },
        { title: '新提拔任用干部干事创业评价情况', text: '2024年干部担当作为意识增强，干事创业氛围保持较好水平。' },
        { title: '对新提拔任用干部评价中“认真”度', text: '', chart: 'doubleBar' }
      ],
      cleanDimension: {
        key: 'clean',
        title: '永葆清正廉洁的政治本色',
        parts: [
          { title: '总体情况', text: '问卷调查显示，干部员工对深圳供电局永葆清正廉洁的政治本色认可为“好”的占比较高。' },
          { title: '好的方面', text: '廉洁教育、监督提醒、风险排查和专项整治协同推进，干部员工廉洁从业意识不断增强。' },
          { title: '需改进的方面', text: '重点领域和关键岗位廉洁风险防控仍需前移关口，监督成果运用和闭环整改需要进一步强化。' }
        ],
        footer: '2024年，清正廉洁建设持续巩固。',
        values: [15, 23, 30, 48.2, 41.4]
      },
      cleanMiniCards: [
        { title: '违纪案件数量总体趋势', text: '近5年深圳供电局相关线索平稳，重点领域监督持续加强。' },
        { title: '违纪案件数变化趋势', text: '', chart: 'line' },
        { title: '违法违纪数量变化趋势情况', text: '2024年违纪违法数量较往年稳中有降。' },
        { title: '违法违纪数量变化趋势', text: '', chart: 'lineOne' },
        { title: '检举控告件变化趋势情况', text: '2024年，共收到检举控告件，趋势相比有所下降。' },
        { title: '检举控告件数量变化趋势', text: '', chart: 'lineOne' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
      window.addEventListener('resize', this.handleResize)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.disposeCharts()
  },
  methods: {
    getRef(name) {
      const ref = this.$refs[name]
      return Array.isArray(ref) ? ref[0] : ref
    },
    initCharts() {
      this.disposeCharts()
      this.initRadar('radarCurrent', [82, 78, 86, 72, 88, 84])
      this.initYearCompareRadar('radarCompare')
      this.initTrend('mainTrend')
      this.dimensions.forEach((dimension, index) => {
        this.initHorizontalBar('dimensionBar_' + index, dimension.values, dimension.title)
      })
      this.initHorizontalBar('cleanBar', this.cleanDimension.values, this.cleanDimension.title)
      this.miniCards.forEach((item, index) => {
        if (item.chart) this.initMiniChart('miniChart_' + index, item.chart)
      })
      this.cleanMiniCards.forEach((item, index) => {
        if (item.chart) this.initMiniChart('cleanMiniChart_' + index, item.chart)
      })
    },
    initRadar(refName, values) {
      const el = this.getRef(refName)
      if (!el) return
      const chart = echarts.init(el)
      this.charts[refName] = chart
      chart.setOption({
        color: ['#ff6a45', '#5d9cff'],
        legend: { bottom: 0, itemWidth: 10, itemHeight: 7, textStyle: { color: '#777', fontSize: 10 }, data: ['内容内容', '内容内容2'] },
        radar: {
          center: ['50%', '46%'],
          radius: '58%',
          splitNumber: 5,
          indicator: ['内容内容', '内容内容', '内容内容', '内容内容', '内容内容', '内容内容'].map(name => ({ name, max: 100 })),
          axisName: { color: '#9b9b9b', fontSize: 10 },
          splitArea: { areaStyle: { color: ['rgba(255,105,68,.03)', 'rgba(255,105,68,.07)'] } },
          axisLine: { lineStyle: { color: '#ffd5c8' } },
          splitLine: { lineStyle: { color: '#ffd5c8' } }
        },
        series: [{
          type: 'radar',
          data: [
            { value: values, name: '内容内容', areaStyle: { color: 'rgba(255,106,69,.26)' }, lineStyle: { color: '#ff6a45' }, itemStyle: { color: '#ff6a45' } },
            { value: values.map(v => Math.max(48, v - 10)), name: '内容内容2', areaStyle: { color: 'rgba(93,156,255,.12)' }, lineStyle: { color: '#5d9cff' }, itemStyle: { color: '#5d9cff' } }
          ]
        }]
      })
    },
    initYearCompareRadar(refName) {
      const el = this.getRef(refName)
      if (!el) return
      const chart = echarts.init(el)
      this.charts[refName] = chart
      const indicators = [
        '党内政治生活',
        '政治纪律规矩',
        '政治文化',
        '选人用人',
        '廉洁建设',
        '责任落实'
      ]
      const yearSeries = [
        { name: '2023年', value: [73, 76, 71, 69, 75, 72], color: '#9bb8ff', area: 'rgba(93, 156, 255, .10)' },
        { name: '2024年', value: [78, 80, 76, 74, 81, 79], color: '#ffb15f', area: 'rgba(255, 154, 66, .13)' },
        { name: '2025年', value: [84, 86, 82, 79, 88, 85], color: '#ff5b35', area: 'rgba(255, 91, 53, .18)' }
      ]
      chart.setOption({
        color: yearSeries.map(item => item.color),
        title: {
          text: '近三年基本情况对比',
          left: 'center',
          top: 0,
          textStyle: { color: '#555', fontSize: 11, fontWeight: 600 }
        },
        tooltip: { trigger: 'item' },
        legend: {
          bottom: 0,
          itemWidth: 10,
          itemHeight: 7,
          textStyle: { color: '#777', fontSize: 10 },
          data: yearSeries.map(item => item.name)
        },
        radar: {
          center: ['50%', '50%'],
          radius: '54%',
          splitNumber: 5,
          indicator: indicators.map(name => ({ name, max: 100 })),
          axisName: { color: '#777', fontSize: 10 },
          splitArea: { areaStyle: { color: ['rgba(255,105,68,.03)', 'rgba(255,105,68,.07)'] } },
          axisLine: { lineStyle: { color: '#ffd5c8' } },
          splitLine: { lineStyle: { color: '#ffd5c8' } }
        },
        series: [{
          type: 'radar',
          symbolSize: 4,
          data: yearSeries.map(item => ({
            value: item.value,
            name: item.name,
            areaStyle: { color: item.area },
            lineStyle: { color: item.color, width: item.name === '2025年' ? 2.2 : 1.6 },
            itemStyle: { color: item.color }
          }))
        }]
      })
    },
    initTrend(refName) {
      const el = this.getRef(refName)
      if (!el) return
      const chart = echarts.init(el)
      this.charts[refName] = chart
      const years = ['2020', '2021', '2022', '2023', '2024', '2025']
      chart.setOption({
        color: chartColors,
        legend: { bottom: 6, itemWidth: 10, itemHeight: 6, textStyle: { fontSize: 10, color: '#777' } },
        grid: { top: 20, left: 40, right: 20, bottom: 42 },
        xAxis: { type: 'category', data: years, axisTick: { show: false }, axisLabel: { color: '#8a8a8a', fontSize: 10 }, axisLine: { lineStyle: { color: '#ddd' } } },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20, axisLabel: { color: '#8a8a8a', fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } } },
        series: [
          [35, 52, 60, 48, 46, 60],
          [48, 63, 70, 82, 68, 70],
          [20, 42, 58, 65, 60, 86],
          [3, 24, 28, 36, 37, 42],
          [8, 18, 34, 27, 29, 36]
        ].map((data, index) => ({
          name: '内容内容' + (index ? index + 1 : ''),
          type: 'line',
          smooth: true,
          symbolSize: 5,
          data,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.08 }
        }))
      })
    },
    initHorizontalBar(refName, values, title = '') {
      const el = this.getRef(refName)
      if (!el) return
      const chart = echarts.init(el)
      this.charts[refName] = chart
      const numericValues = values.map(value => Number(value)).filter(value => Number.isFinite(value))
      const maxValue = Math.max(0, ...numericValues)
      const axisStep = Math.max(5, Math.ceil(maxValue / 5 / 5) * 5)
      const axisMax = axisStep * 5
      chart.setOption({
        title: {
          text: title,
          top: 0,
          left: 'center',
          textStyle: { color: '#333', fontSize: 13, fontWeight: 700 }
        },
        grid: { top: 42, left: 72, right: 72, bottom: 24, containLabel: true },
        xAxis: {
          type: 'value',
          min: 0,
          max: axisMax,
          interval: axisStep,
          axisLabel: { formatter: '{value}%', color: '#8a8a8a', fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { type: 'dashed', color: '#d9d9d9' } }
        },
        yAxis: {
          type: 'category',
          data: ['内容内容', '内容内容', '内容内容', '内容内容', '内容内容'],
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { color: '#777', fontSize: 11 }
        },
        series: [{
          type: 'bar',
          data: values,
          barWidth: 11,
          barGap: '42%',
          barCategoryGap: '58%',
          label: { show: true, position: 'right', distance: 6, formatter: '{c}%', color: '#666', fontSize: 10 },
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(255, 77, 62, .16)' },
              { offset: 1, color: '#ff3b2f' }
            ])
          }
        }]
      })
    },
    initMiniChart(refName, type) {
      const el = this.getRef(refName)
      if (!el) return
      const chart = echarts.init(el)
      this.charts[refName] = chart
      const baseGrid = { top: 16, left: 38, right: 18, bottom: 34 }
      const axisStyle = {
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#ddd' } },
        axisLabel: { color: '#999', fontSize: 10 }
      }
      if (type === 'bar') {
        chart.setOption({
          grid: baseGrid,
          xAxis: { type: 'category', data: ['严肃党内\n政治生活', '纪律规矩\n建设', '选人用人\n情况'], ...axisStyle },
          yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } }, axisLabel: { color: '#999', fontSize: 10 } },
          series: [{ type: 'bar', barWidth: 10, data: [62, 44, 60], itemStyle: { color: '#ff3b2f', borderRadius: [6, 6, 0, 0] } }]
        })
        return
      }
      if (type === 'doubleBar') {
        chart.setOption({
          legend: { bottom: 0, itemWidth: 10, itemHeight: 6, textStyle: { fontSize: 10, color: '#999' } },
          grid: { top: 16, left: 38, right: 18, bottom: 44 },
          xAxis: { type: 'category', data: ['2020', '2021', '2022'], ...axisStyle },
          yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } }, axisLabel: { color: '#999', fontSize: 10 } },
          series: [
            { name: '内容内容', type: 'bar', barWidth: 7, barGap: '160%', barCategoryGap: '60%', data: [48, 52, 42], itemStyle: { color: '#ff3b2f', borderRadius: [5, 5, 0, 0] } },
            { name: '平均水平', type: 'bar', barWidth: 7, barGap: '160%', barCategoryGap: '60%', data: [52, 48, 44], itemStyle: { color: '#ff9b34', borderRadius: [5, 5, 0, 0] } }
          ]
        })
        return
      }
      chart.setOption({
        color: type === 'lineOne' ? ['#ff6537'] : chartColors,
        legend: type === 'lineOne' ? { show: false } : { bottom: 0, itemWidth: 10, itemHeight: 6, textStyle: { fontSize: 10, color: '#999' } },
        grid: { top: 14, left: 38, right: 18, bottom: type === 'lineOne' ? 28 : 42 },
        xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025'], ...axisStyle },
        yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } }, axisLabel: { color: '#999', fontSize: 10 } },
        series: (type === 'lineOne'
          ? [[34, 55, 68, 50, 49, 64]]
          : [[38, 54, 64, 50, 48, 64], [50, 62, 70, 82, 70, 72], [20, 42, 56, 68, 60, 86], [6, 22, 28, 35, 36, 43], [10, 18, 32, 26, 29, 36]]
        ).map((data, index) => ({
          name: '内容内容' + (index ? index + 1 : ''),
          type: 'line',
          smooth: true,
          symbolSize: 4,
          data,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.06 }
        }))
      })
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => chart && chart.resize())
    },
    disposeCharts() {
      Object.values(this.charts).forEach(chart => chart && chart.dispose())
      this.charts = {}
    }
  }
}
</script>

<style scoped>
.portrait-ui-module {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
}

.portrait-ui-module *,
.portrait-ui-module *::before,
.portrait-ui-module *::after {
  box-sizing: border-box;
}

.app-topbar {
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(218, 0, 0, .98), rgba(255, 49, 24, .96)),
    repeating-linear-gradient(90deg, transparent 0 28px, rgba(255,255,255,.08) 29px 30px);
  position: sticky;
  top: 0;
  z-index: 5;
  overflow: hidden;
}

.app-topbar::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .22;
  background:
    linear-gradient(110deg, transparent 0 8%, rgba(255,255,255,.55) 8.4% 8.7%, transparent 9% 38%, rgba(255,255,255,.4) 38.5% 38.9%, transparent 39.2%),
    repeating-linear-gradient(90deg, transparent 0 76px, rgba(255, 216, 128, .65) 78px, transparent 81px);
}

.brand-area,
.top-nav,
.user-area {
  position: relative;
  z-index: 1;
}

.brand-area {
  width: 170px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}

.brand-area i {
  font-size: 23px;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.top-nav button,
.user-area,
.action-group button,
.icon-rail button {
  border: 0;
  font-family: inherit;
}

.top-nav button {
  height: 34px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 3px;
  color: #fff;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
}

.top-nav button.active,
.top-nav button:hover {
  background: rgba(140, 0, 0, .28);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  white-space: nowrap;
}

.avatar {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #e72d20;
  background: #fff;
}

.report-shell {
  display: flex;
  min-height: calc(100vh - 54px);
}

.icon-rail {
  width: 48px;
  flex: 0 0 48px;
  padding-top: 22px;
  background: #fff;
  border-right: 1px solid #efefef;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  position: sticky;
  top: 54px;
  height: calc(100vh - 54px);
}

.icon-rail button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff3028;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 17px;
}

.icon-rail button.active,
.icon-rail button:hover {
  color: #fff;
  background: #ff3b30;
}

.report-workspace {
  flex: 1;
  min-width: 0;
  padding: 16px 24px 34px;
  overflow: hidden;
}

.breadcrumb-row {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 12px;
  color: #444;
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 4px;
}

.breadcrumb-row > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
}

.breadcrumb-row i {
  color: #ff3b30;
}

.action-group {
  display: flex;
  gap: 8px;
}

.action-group button {
  height: 27px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 2px;
  color: #fff;
  background: #ff3b30;
  cursor: pointer;
  font-size: 12px;
}

.action-group button i {
  color: #fff;
}

.report-page {
  max-width: 1190px;
  margin: 0 auto;
  padding: 0 0 22px;
  background: #fff;
  border: 1px solid #f0d8c7;
  border-radius: 4px;
}

.report-page h1 {
  margin: 0;
  padding: 22px 20px 12px;
  text-align: center;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: 0;
}

.report-section {
  margin: 0 18px 12px;
  padding: 0 0 12px;
  border: 1px solid #f2dbc7;
  border-radius: 4px;
}

.section-title {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  color: #ff3b30;
  font-size: 15px;
  font-weight: 700;
  border-bottom: 1px solid #f3ded0;
}

.title-mark,
.subsection h3::before,
.dimension-block h3::before,
.mini-card h4::before {
  content: "";
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: #ff5b2f;
  box-shadow: 0 0 0 3px rgba(255, 91, 47, .09);
}

.subsection,
.dimension-block {
  padding: 0 24px;
}

.subsection h3,
.dimension-block h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  margin: 8px 0 8px;
  color: #333;
  font-size: 13px;
  font-weight: 700;
}

.two-column {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, .92fr);
  gap: 22px;
  align-items: stretch;
}

.top-summary-grid {
  grid-template-columns: minmax(0, 1fr) minmax(420px, .95fr);
}

.text-card,
.summary-card {
  min-height: 146px;
  padding: 16px 18px;
  color: #555;
  line-height: 1.85;
  font-size: 13px;
  text-align: justify;
  background: #fffaf7;
  border: 1px solid #f5dfcf;
  border-radius: 4px;
}

.text-card p {
  margin: 0 0 10px;
}

.strong-red,
.link-text {
  color: #ff3b30;
  font-weight: 700;
}

.radar-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-height: 176px;
  padding: 4px 0;
}

.chart {
  width: 100%;
  min-width: 0;
}

.radar-chart {
  height: 172px;
}

.line-chart {
  height: 205px;
  border: 1px solid #f2e2d7;
  border-radius: 4px;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 10px;
}

.problem-list div {
  height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  color: #8b6a48;
  background: #fff0e8;
  border-radius: 3px;
  font-size: 12px;
}

.problem-list span {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: #ff7a1c;
}

.problem-list i {
  margin-left: auto;
  color: #ffa45f;
}

.knowledge-block {
  min-height: 140px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 112px;
  color: #777;
  font-size: 12px;
}

.check-badge {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ffb0a7, #ff716c);
  border: 6px solid #ffe2df;
  border-radius: 50%;
  font-size: 22px;
  box-shadow: 0 8px 20px rgba(255, 72, 62, .18);
}

::v-deep .dimension-block {
  padding: 0 44px 2px;
}

::v-deep .dimension-block h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  margin: 8px 0 6px;
  color: #333;
  font-size: 13px;
  font-weight: 700;
}

::v-deep .dimension-block h3::before {
  content: "";
  width: 3px;
  height: 14px;
  flex: 0 0 3px;
  border-radius: 2px;
  background: #ff5b2f;
  box-shadow: 0 0 0 3px rgba(255, 91, 47, .09);
}

::v-deep .dimension-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(372px, .82fr);
  gap: 28px;
  align-items: center;
  margin-bottom: 18px;
}

::v-deep .analysis-text-card {
  min-height: 236px;
  padding: 14px 20px 12px;
  background:
    radial-gradient(ellipse at 72% 72%, rgba(255, 219, 196, .64), transparent 44%),
    linear-gradient(180deg, #fff9f5 0%, #fff7f0 100%);
  border: 1px solid #f2d9c9;
  border-radius: 4px;
}

::v-deep .analysis-part {
  margin-bottom: 9px;
}

::v-deep .analysis-part h4 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 5px;
  color: #ff641f;
  font-size: 13px;
  line-height: 1.25;
}

::v-deep .analysis-part h4 i {
  color: #ff6b21;
  font-size: 14px;
}

::v-deep .analysis-part p,
::v-deep .year-summary,
::v-deep .mini-card p {
  margin: 0;
  color: #555;
  font-size: 12px;
  line-height: 1.72;
  text-align: justify;
}

::v-deep .year-summary {
  padding-top: 2px;
  color: #777;
}

::v-deep .horizontal-chart {
  height: 236px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border: 0;
}

::v-deep .horizontal-chart > div,
::v-deep .horizontal-chart canvas {
  max-width: 100% !important;
}

.mini-analysis-grid,
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 22px;
  padding: 0 44px 10px;
}

::v-deep .mini-card {
  min-height: 142px;
  padding: 12px 14px;
  background: #fafafa;
}

::v-deep .mini-card h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  color: #333;
  font-size: 12px;
  font-weight: 700;
}

::v-deep .mini-card h4::before {
  content: "";
  width: 3px;
  height: 12px;
  flex: 0 0 3px;
  border-radius: 2px;
  background: #ff5b2f;
  box-shadow: 0 0 0 3px rgba(255, 91, 47, .09);
}

::v-deep .mini-chart {
  height: 148px;
  min-width: 0;
  margin-top: -4px;
}

@media (max-width: 1180px) {
  .top-nav {
    overflow-x: auto;
    scrollbar-width: none;
  }
  .top-nav::-webkit-scrollbar {
    display: none;
  }
  .user-area {
    display: none;
  }
  .two-column,
  .top-summary-grid,
  .dimension-row {
    grid-template-columns: 1fr;
  }
  .radar-row {
    min-height: 190px;
  }
}

@media (max-width: 768px) {
  .app-topbar {
    padding: 0 10px;
  }
  .brand-area {
    width: auto;
    margin-right: 10px;
  }
  .brand-area span {
    display: none;
  }
  .icon-rail {
    display: none;
  }
  .report-workspace {
    padding: 12px 10px 24px;
  }
  .breadcrumb-row {
    height: auto;
    min-height: 42px;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
  .action-group {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .report-section {
    margin: 0 8px 12px;
  }
  .subsection,
  .dimension-block {
    padding: 0 12px;
  }
  .radar-row,
  .mini-analysis-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
    padding-left: 12px;
    padding-right: 12px;
  }
  ::v-deep .dimension-block {
    padding: 0 12px 2px;
  }
  ::v-deep .dimension-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
