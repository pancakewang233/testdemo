<template>
  <div class="trend-module">
    <div v-if="currentView === 'overview'" class="overview-page">
      <div class="page-header">
        <div class="header-spacer"></div>
        <h1 class="page-title">南方电网公司{{ selectedYear }}年所属各单位政治生态总体态势</h1>
        <el-date-picker
          v-model="selectedYear"
          type="year"
          size="medium"
          class="year-select"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年度"
          :clearable="false"
          :editable="false"
          :picker-options="yearPickerOptions"
        >
          <el-option
            v-for="item in yearOptions"
            :key="item"
            :label="item + '年度'"
            :value="item"
          />
        </el-date-picker>
      </div>

      <div class="card-grid" :class="{ 'is-few-cards': currentYearCards.length <= 2 }">
        <section
          v-for="(card, index) in currentYearCards"
          :key="card.key"
          class="trend-card"
          :class="themeClasses[index % 3]"
        >
          <div class="card-top">
            <h2 class="card-title">{{ card.title }}</h2>
            <button class="detail-button" type="button" @click="openAnalysis(card)">
              查看详情
            </button>
          </div>

          <div class="score-row">
            <div>
              <div class="score-label">平均分</div>
              <div class="score-value">{{ formatFixed(card.averageScore, 1) }}</div>
            </div>
            <div class="score-trend" :class="card.yearOnYear >= 0 ? 'is-up' : 'is-down'">
              <span class="trend-icon">{{ card.yearOnYear >= 0 ? "▲" : "▼" }}</span>
              <span>{{ card.yearOnYear >= 0 ? "较上年+" : "较上年" }}{{ formatFixed(card.yearOnYear, 1) }}</span>
            </div>
          </div>

          <div class="metric-row">
            <div
              v-for="metric in card.metrics"
              :key="metric.label"
              class="metric-pill"
            >
              <span class="metric-label">{{ metric.label }}</span>
              <span class="metric-value-wrap">
                <span class="metric-value">{{ splitMetricValue(metric.value).number }}</span>
                <span class="metric-unit">{{ splitMetricValue(metric.value).unit }}</span>
              </span>
            </div>
          </div>

          <div class="conclusion-block">
            <div class="conclusion-label">结论建议</div>
            <div
              class="conclusion-space"
              :class="{ 'is-marquee-enabled': enableConclusionMarquee }"
              :title="card.conclusion"
            >
              <span class="conclusion-marquee">{{ card.conclusion }}</span>
            </div>
          </div>

          <div class="list-head">
            <span class="rank-col">排名</span>
            <span class="unit-col">单位</span>
            <span class="bar-col">得分</span>
            <span class="score-col">分数</span>
          </div>

          <div class="unit-scroll">
            <div
              v-for="item in card.units"
              :key="item.name"
              class="unit-row"
            >
              <div class="rank-col rank-value">
                <span class="rank-number">{{ item.rank }}</span>
                <span class="rank-indicator">
                <span
                  v-if="item.rankTrend < 0"
                  class="rank-arrow is-down"
                >↓</span>
                <span
                  v-else-if="item.rankTrend > 0"
                  class="rank-arrow is-up"
                >↑</span>
                </span>
              </div>
              <div class="unit-col unit-name" :title="item.name">{{ item.name }}</div>
              <div class="bar-col">
                <div class="score-bar-track">
                  <div
                    class="score-bar-fill"
                    :class="item.score >= card.averageScore ? 'is-above' : 'is-below'"
                    :style="{ width: barWidth(item.score) }"
                  ></div>
                </div>
              </div>
              <div class="score-col score-number">
                <span>{{ formatFixed(item.score, 2) }}</span>
                <span
                  v-if="item.scoreTrend < 0"
                  class="score-arrow is-down"
                >▼</span>
                <span
                  v-else-if="item.scoreTrend > 0"
                  class="score-arrow is-up"
                >▲</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="analysis-page">
      <div class="analysis-header">
        <button class="back-button" type="button" @click="currentView = 'overview'">
          返回总览
        </button>
        <div>
          <div class="analysis-title">智能分析</div>
          <div class="analysis-subtitle">
            {{ activeCard ? activeCard.title : "" }} · {{ selectedYear }}年度
          </div>
        </div>
      </div>

      <div class="analysis-placeholder">
        <div class="placeholder-tag">内容预留</div>
        <h3>智能分析界面</h3>
        <p>这里先完成跳转入口与页面承接，后续可继续补充智能分析内容。</p>
      </div>
    </div>
  </div>
</template>

<script>
const baseUnits = [
  { name: "南网超高压公司", score: 99.75 },
  { name: "广东电网公司", score: 98.25 },
  { name: "广西电网公司", score: 97.18 },
  { name: "云南电网公司", score: 96.14 },
  { name: "贵州电网公司", score: 95.25 },
  { name: "海南电网公司", score: 94.21 },
  { name: "深圳供电局", score: 93.88 },
  { name: "广州供电局", score: 92.66 },
  { name: "南网储能公司", score: 91.83 },
  { name: "鼎元资产公司", score: 90.74 },
  { name: "南网科研院", score: 89.96 },
  { name: "南网能源院", score: 88.62 },
];

const unitScoreAdjustments = {
  control: {
    "2025": [0.12, -0.18, 0.22, -0.26, 0.08, 0.31, -0.44, 0.16, 1.04, -0.12, -0.58, 0.79],
    "2024": [-0.24, 0.15, -0.08, 0.28, -0.31, -0.05, 0.12, 0.41, 0.52, 0.18, 0.37, 0.06],
    "2023": [0.18, -0.09, 0.11, -0.02, 0.26, -0.24, 0.35, 0.08, -0.14, 0.44, 0.21, 0.63],
  },
  market: {
    "2025": [-0.05, 0.22, -0.12, 0.14, -0.08, 0.27, -0.33, 0.19, 1.38, -0.04, 0.76, 1.25],
    "2024": [0.16, -0.11, 0.28, -0.24, 0.12, -0.19, 0.23, 0.07, 0.46, 0.38, -0.22, 1.02],
    "2023": [0.08, 0.05, -0.18, 0.33, -0.29, 0.14, 0.41, -0.12, 0.02, 0.57, 0.18, 0.84],
  },
  platform: {
    "2025": [-0.12, -0.16, 0.18, -0.09, 0.12, -0.22, 0.35, 0.08, 1.05, 0.27, -0.31, 1.18],
    "2024": [-0.18, 0.12, -0.05, 0.24, -0.14, 0.31, -0.27, 0.17, 0.66, -0.08, 0.44, 0.52],
    "2023": [0.05, -0.22, 0.26, -0.31, 0.18, -0.07, 0.29, 0.11, -0.13, 0.34, 0.62, 1.04],
  },
};

function createUnits(offset, adjustments = []) {
  return baseUnits
    .map((item, index) => ({
      name: item.name,
      score: Number((item.score + offset + (adjustments[index] || 0)).toFixed(2)),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

function getPreviousYear(year) {
  return String(Number(year) - 1);
}

function toSafeNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function formatFixedValue(value, digits = 0, fallback = 0) {
  return toSafeNumber(value, fallback).toFixed(digits);
}

function buildUnitMap(units = []) {
  return units.reduce((acc, item) => {
    if (!item || !item.name) {
      return acc;
    }

    acc[item.name] = item;
    return acc;
  }, {});
}

function attachUnitTrends(units = [], previousUnits = []) {
  const safeUnits = Array.isArray(units) ? units.filter(Boolean) : [];
  const previousUnitMap = buildUnitMap(Array.isArray(previousUnits) ? previousUnits : []);

  return safeUnits.map((item, index) => {
    const safeRank = toSafeNumber(item.rank, index + 1);
    const safeScore = toSafeNumber(item.score);
    const previousItem = previousUnitMap[item.name];

    if (!previousItem) {
      return {
        ...item,
        rank: safeRank,
        score: safeScore,
        rankTrend: 0,
        scoreTrend: 0,
      };
    }

    return {
      ...item,
      rank: safeRank,
      score: safeScore,
      rankTrend: toSafeNumber(previousItem.rank) - safeRank,
      scoreTrend: Number((safeScore - toSafeNumber(previousItem.score)).toFixed(2)),
    };
  });
}

function normalizeCardData(card = {}, previousCard = {}) {
  return {
    averageScore: toSafeNumber(card.averageScore),
    yearOnYear: toSafeNumber(card.yearOnYear),
    metrics: Array.isArray(card.metrics) ? card.metrics.filter(Boolean) : [],
    conclusion: card.conclusion || "",
    units: attachUnitTrends(card.units, previousCard.units),
  };
}

const cardBaseConfig = [
  {
    key: "control",
    title: "管制类单位",
  },
  {
    key: "market",
    title: "竞争类单位",
  },
  {
    key: "platform",
    title: "共享平台类单位",
  },
];

const yearCardDataMap = {
  "2025": {
    control: {
      averageScore: 92.1,
      yearOnYear: 0.8,
      metrics: [
        { label: "低于平均分", value: "3家" },
        { label: "同比退步", value: "2家" },
        { label: "最大分差", value: "3.5" },
      ],
      conclusion: "整体稳步提升，重点关注边缘波动单位，持续压实主体责任与过程管控。",
      units: createUnits(0, unitScoreAdjustments.control["2025"]),
    },
    market: {
      averageScore: 91.6,
      yearOnYear: 0.8,
      metrics: [
        { label: "低于平均分", value: "3家" },
        { label: "同比退步", value: "2家" },
        { label: "最大分差", value: "3.5" },
      ],
      conclusion: "竞争类单位分化有所收敛，建议加强短板指标整改，稳定头部单位带动作用。",
      units: createUnits(-0.45, unitScoreAdjustments.market["2025"]),
    },
    platform: {
      averageScore: 92.4,
      yearOnYear: 0.8,
      metrics: [
        { label: "低于平均分", value: "3家" },
        { label: "同比退步", value: "2家" },
        { label: "最大分差", value: "3.5" },
      ],
      conclusion: "共享平台类单位整体基础较好，建议围绕协同效率和服务支撑能力继续优化。",
      units: createUnits(0.35, unitScoreAdjustments.platform["2025"]),
    },
  },
  "2024": {
    control: {
      averageScore: 91.4,
      yearOnYear: 0.5,
      metrics: [
        { label: "低于平均分", value: "4家" },
        { label: "同比退步", value: "3家" },
        { label: "最大分差", value: "4.1" },
      ],
      conclusion: "总体保持平稳，但尾部单位波动加大，建议聚焦薄弱环节开展专项提升。",
      units: createUnits(-0.65, unitScoreAdjustments.control["2024"]),
    },
    market: {
      averageScore: 90.9,
      yearOnYear: 0.3,
      metrics: [
        { label: "低于平均分", value: "4家" },
        { label: "同比退步", value: "2家" },
        { label: "最大分差", value: "4.3" },
      ],
      conclusion: "竞争压力传导较明显，建议强化过程督导和复盘机制，防止指标继续下探。",
      units: createUnits(-1.1, unitScoreAdjustments.market["2024"]),
    },
    platform: {
      averageScore: 91.7,
      yearOnYear: 0.6,
      metrics: [
        { label: "低于平均分", value: "3家" },
        { label: "同比退步", value: "2家" },
        { label: "最大分差", value: "3.8" },
      ],
      conclusion: "平台类单位运行韧性较强，建议进一步统一标准口径，提升横向协同水平。",
      units: createUnits(-0.25, unitScoreAdjustments.platform["2024"]),
    },
  },
  "2023": {
    control: {
      averageScore: 90.8,
      yearOnYear: -0.2,
      metrics: [
        { label: "低于平均分", value: "5家" },
        { label: "同比退步", value: "4家" },
        { label: "最大分差", value: "4.8" },
      ],
      conclusion: "整体承压较为明显，建议优先整治退步单位，稳住基础分与关键评价项。",
      units: createUnits(-1.2, unitScoreAdjustments.control["2023"]),
    },
    market: {
      averageScore: 90.2,
      yearOnYear: -0.1,
      metrics: [
        { label: "低于平均分", value: "5家" },
        { label: "同比退步", value: "3家" },
        { label: "最大分差", value: "4.9" },
      ],
      conclusion: "竞争类单位分差扩大，建议加强重点单位跟踪辅导，尽快缩小梯队差距。",
      units: createUnits(-1.55, unitScoreAdjustments.market["2023"]),
    },
    platform: {
      averageScore: 90.9,
      yearOnYear: 0.2,
      metrics: [
        { label: "低于平均分", value: "4家" },
        { label: "同比退步", value: "3家" },
        { label: "最大分差", value: "4.2" },
      ],
      conclusion: "共享平台类单位表现相对稳定，建议围绕支撑保障链路继续夯实基础能力。",
      units: createUnits(-0.95, unitScoreAdjustments.platform["2023"]),
    },
  },
};

export default {
  name: "NewModule",
  data() {
    return {
      selectedYear: "2025",
      yearOptions: ["2025", "2024", "2023"],
      currentView: "overview",
      activeCardKey: null,
      enableConclusionMarquee: false,
      themeClasses: ["theme-control", "theme-market", "theme-platform"],
    };
  },
  computed: {
    yearPickerOptions() {
      return {
        disabledDate: (date) => {
          const year = String(date.getFullYear());
          return !Array.isArray(this.yearOptions) || !this.yearOptions.includes(year);
        },
      };
    },
    currentYearCards() {
      const fallbackYear = Array.isArray(this.yearOptions) ? this.yearOptions[0] : null;
      const currentYearData =
        yearCardDataMap[this.selectedYear] || yearCardDataMap[fallbackYear] || {};
      const previousYearData = yearCardDataMap[getPreviousYear(this.selectedYear)] || {};

      return cardBaseConfig.map((item) => ({
        ...item,
        ...normalizeCardData(
          currentYearData[item.key],
          previousYearData[item.key]
        ),
      }));
    },
    activeCard() {
      return this.currentYearCards.find((item) => item.key === this.activeCardKey) || null;
    },
  },
  methods: {
    openAnalysis(card) {
      if (!card || !card.key) {
        return;
      }

      this.activeCardKey = card.key;
      this.currentView = "analysis";
    },
    formatFixed(value, digits = 0) {
      return formatFixedValue(value, digits);
    },
    splitMetricValue(value) {
      const text = String(value || "");
      const match = text.match(/^(-?\d+(?:\.\d+)?)(.*)$/);

      if (!match) {
        return {
          number: text,
          unit: "",
        };
      }

      return {
        number: match[1],
        unit: match[2],
      };
    },
    barWidth(score) {
      const width = Math.max(18, Math.min(100, toSafeNumber(score)));
      return width + "%";
    },
  },
};
</script>

<style scoped>
.trend-module {
  height: 100%;
  padding: 22px 6px 32px;
  color: #1f2a44;
}

.overview-page {
  height: 100%;
}

.page-header {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) 132px;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  padding: 0 4px;
}

.header-spacer {
  width: 132px;
  height: 1px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 700;
  color: #18233d;
  text-align: center;
}

.year-select {
  width: 132px;
  flex-shrink: 0;
  justify-self: end;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
}

.card-grid > .trend-card {
  margin: 9px;
  flex: 0 0 calc((100% - 54px) / 3);
  width: calc((100% - 54px) / 3);
}

.card-grid.is-few-cards {
  justify-content: space-between;
}

.card-grid.is-few-cards .trend-card {
  flex: 0 0 calc((100% - 54px) / 3);
  width: calc((100% - 54px) / 3);
}

.trend-card {
  flex: 0 0 calc((100% - 54px) / 3);
  width: calc((100% - 54px) / 3);
  position: relative;
  padding: 28px 24px 22px;
  border-radius: 26px;
  border: 1px solid rgba(133, 154, 191, 0.28);
  box-shadow:
    0 20px 42px rgba(79, 104, 146, 0.16),
    0 0 0 1px rgba(255, 255, 255, 0.72) inset;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  overflow: hidden;
}

.trend-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.92), transparent 42%),
    -webkit-linear-gradient(top, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.84));
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.92), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.84));
  pointer-events: none;
}

.trend-card > * {
  position: relative;
  z-index: 1;
}

.theme-control {
  background: -webkit-linear-gradient(top, #e7f1ff 0%, #f7fbff 100%);
  background: linear-gradient(180deg, #e7f1ff 0%, #f7fbff 100%);
  border-color: rgba(114, 150, 214, 0.38);
}

.theme-market {
  background: -webkit-linear-gradient(top, #fff1de 0%, #fffaf3 100%);
  background: linear-gradient(180deg, #fff1de 0%, #fffaf3 100%);
  border-color: rgba(212, 168, 110, 0.38);
}

.theme-platform {
  background: -webkit-linear-gradient(top, #e8eef9 0%, #f8fbff 100%);
  background: linear-gradient(180deg, #e8eef9 0%, #f8fbff 100%);
  border-color: rgba(130, 151, 188, 0.38);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.card-top > * + * {
  margin-left: 12px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2740;
}

.detail-button {
  min-width: 104px;
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.theme-control .detail-button {
  color: #2457c6;
  background: #dfeafe;
  box-shadow: inset 0 0 0 1px rgba(36, 87, 198, 0.08);
}

.theme-market .detail-button {
  color: #b47a40;
  background: #f4e3d2;
  box-shadow: inset 0 0 0 1px rgba(180, 122, 64, 0.08);
}

.theme-platform .detail-button {
  color: #556f97;
  background: #dde7f5;
  box-shadow: inset 0 0 0 1px rgba(85, 111, 151, 0.08);
}

.detail-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(80, 104, 148, 0.16);
}

.score-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.score-row > * + * {
  margin-left: 12px;
}

.score-label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #5b6782;
}

.score-value {
  font-size: 42px;
  line-height: 1;
  font-weight: 700;
  color: #15213b;
  letter-spacing: -1px;
}

.score-trend {
  display: inline-flex;
  align-items: center;
  padding-bottom: 6px;
  font-size: 17px;
  font-weight: 700;
}

.score-trend > * + * {
  margin-left: 4px;
}

.score-trend.is-up {
  color: #d84b4b;
}

.score-trend.is-down {
  color: #2f9a61;
}

.trend-icon {
  font-size: 20px;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 18px;
}

.metric-row > * + * {
  margin-left: 10px;
}

.metric-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.78);
  color: #33415f;
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
}

.metric-label {
  font-weight: 400;
}

.metric-value-wrap {
  display: inline-flex;
  align-items: baseline;
}

.metric-value {
  font-weight: 700;
  margin: 0 4px;
}

.metric-unit {
  font-weight: 400;
}

.conclusion-block {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  padding: 12px 14px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.52);
}

.conclusion-block > * + * {
  margin-left: 12px;
}

.conclusion-label {
  flex: 0 0 auto;
  margin-bottom: 0;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 700;
  color: #5b6782;
}

.conclusion-space {
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.35);
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.conclusion-marquee {
  display: inline-block;
  flex: 0 0 auto;
  font-size: 14px;
  line-height: 24px;
  color: #5d6c89;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conclusion-space.is-marquee-enabled .conclusion-marquee {
  max-width: none;
  overflow: visible;
  text-overflow: clip;
  padding-left: 100%;
  animation: conclusion-marquee 18s linear infinite;
}

@keyframes conclusion-marquee {
  0%,
  12% {
    transform: translateX(0);
  }

  88%,
  100% {
    transform: translateX(-100%);
  }
}

.list-head,
.unit-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1.3fr) minmax(0, 1fr) 68px;
  align-items: center;
}

.list-head > * + *,
.unit-row > * + * {
  margin-left: 12px;
}

.list-head {
  padding: 10px 6px 12px 2px;
  border-top: 1px solid rgba(112, 129, 164, 0.18);
  font-size: 14px;
  font-weight: 700;
  color: #2f3d5f;
  text-align: center;
}

.unit-scroll {
  max-height: 364px;
  padding-right: 6px;
  overflow-y: auto;
}

.unit-scroll::-webkit-scrollbar {
  width: 6px;
}

.unit-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(116, 135, 168, 0.35);
}

.unit-row {
  min-height: 38px;
  padding: 8px 6px 8px 2px;
  font-size: 14px;
  color: #364461;
}

.rank-col,
.score-col {
  text-align: center;
}

.rank-value {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #1a2742;
}

.rank-value > * + * {
  margin-left: 6px;
}

.rank-number {
  width: 20px;
  text-align: right;
}

.rank-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  flex: 0 0 18px;
}

.rank-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
  transform: scaleX(1.24);
}

.rank-arrow.is-down {
  color: #2f9a61;
}

.rank-arrow.is-up {
  color: #d84b4b;
}

.unit-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.score-bar-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(114, 129, 159, 0.16);
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 999px;
}

.score-bar-fill.is-above {
  background: -webkit-linear-gradient(left, #8ab0ff 0%, #6e94eb 100%);
  background: linear-gradient(90deg, #8ab0ff 0%, #6e94eb 100%);
}

.score-bar-fill.is-below {
  background: -webkit-linear-gradient(left, #f0a3a3 0%, #e57c7c 100%);
  background: linear-gradient(90deg, #f0a3a3 0%, #e57c7c 100%);
}

.score-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #5c6a86;
}

.score-number > * + * {
  margin-left: 4px;
}

.score-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
}

.score-arrow.is-down {
  color: #2f9a61;
}

.score-arrow.is-up {
  color: #d84b4b;
}

.analysis-page {
  min-height: calc(100vh - 140px);
  padding: 12px 6px;
}

.analysis-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.analysis-header > * + * {
  margin-left: 18px;
}

.back-button {
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  background: #dce8fb;
  color: #2756bb;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.analysis-title {
  font-size: 28px;
  font-weight: 700;
  color: #18233d;
}

.analysis-subtitle {
  margin-top: 6px;
  font-size: 14px;
  color: #61708f;
}

.analysis-placeholder {
  padding: 36px 32px;
  border-radius: 24px;
  background: -webkit-linear-gradient(top, #edf4ff 0%, #ffffff 100%);
  background: linear-gradient(180deg, #edf4ff 0%, #ffffff 100%);
  box-shadow: 0 18px 40px rgba(79, 104, 146, 0.12);
}

.analysis-placeholder h3 {
  margin: 16px 0 10px;
  font-size: 24px;
  color: #1b2741;
}

.analysis-placeholder p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #5f6f8f;
}

.placeholder-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(76, 119, 211, 0.12);
  color: #3d62b3;
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 1180px) {
  .trend-card {
    flex-basis: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .trend-module {
    padding: 14px 0 22px;
  }

  .page-header {
    grid-template-columns: 1fr;
    margin-bottom: 20px;
  }

  .header-spacer {
    display: none;
  }

  .page-title {
    font-size: 22px;
    text-align: left;
  }

  .year-select {
    justify-self: start;
  }

  .trend-card {
    padding: 22px 16px 18px;
  }

  .card-top,
  .score-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-row {
    grid-template-columns: 1fr;
  }

  .list-head,
  .unit-row {
    grid-template-columns: 52px minmax(0, 1.15fr) minmax(0, 0.9fr) 58px;
  }

  .list-head > * + *,
  .unit-row > * + * {
    margin-left: 8px;
  }
}

/* Flex gap fallback for older Chromium-based kernels (e.g. some Sogou builds) */
@supports not (gap: 1px) {
  .card-grid > .trend-card {
    margin: 9px;
    flex: 0 0 calc((100% - 54px) / 3);
    width: calc((100% - 54px) / 3);
  }

  .card-top > * + *,
  .score-row > * + *,
  .conclusion-block > * + *,
  .rank-value > * + *,
  .score-number > * + * {
    margin-left: 12px;
  }

  @media (max-width: 1180px) {
    .card-grid > .trend-card {
      flex-basis: calc(100% - 18px);
      width: calc(100% - 18px);
    }
  }
}

/* Backdrop filter fallback to keep card appearance stable */
@supports not ((backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px))) {
  .trend-card {
    box-shadow:
      0 16px 34px rgba(79, 104, 146, 0.14),
      0 0 0 1px rgba(255, 255, 255, 0.68) inset;
  }

  .trend-card::before {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.88));
  }
}
</style>
