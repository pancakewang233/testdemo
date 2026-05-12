<template>
  <div class="app-container" :class="{ 'is-wide-layout': activeModule === 'NewModule', 'is-analysis-layout': activeModule === 'PoliticalAnalysisModule' }">
    <template v-if="activeModule === 'PoliticalAnalysisModule'">
      <header class="analysis-topbar">
        <div class="brand-area">
          <div class="party-emblem">★</div>
          <span class="brand-title">数字党建应用</span>
        </div>
        <nav class="main-nav">
          <div
            v-for="item in analysisNav"
            :key="item.name"
            class="main-nav-item"
            :class="{ active: item.active }"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </nav>
        <div class="topbar-user">
          <span class="notice"><i class="el-icon-bell"></i>消息</span>
          <span class="avatar">●</span>
          <span>孙一全</span>
          <span>xxxxxx党委</span>
          <span>书记</span>
          <i class="el-icon-caret-bottom"></i>
          <span>退出</span>
        </div>
      </header>

      <div class="analysis-tab-row">
        <div class="hamburger"><i class="el-icon-s-fold"></i></div>
        <div class="analysis-tab">党员画像看板 <span>×</span></div>
        <div class="breadcrumb-row">
          <i class="el-icon-s-home"></i> / 党建工作规划计划及党建工作责任制考核评价管理 / “两个作用”发挥智能分析 / 党员画像看板
        </div>
      </div>

      <div class="analysis-body">
        <aside class="side-rail">
          <i v-for="icon in sideRailIcons" :key="icon" :class="icon"></i>
        </aside>
        <main class="analysis-content">
          <PoliticalAnalysisModule />
        </main>
      </div>
    </template>

    <template v-else>
      <div class="module-select-bar">
        <el-select v-model="activeModule" placeholder="请选择模块" class="module-select">
          <el-option
            v-for="item in moduleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="active-module-wrap">
        <YY v-if="activeModule === 'YY'" />
        <UpdateModule v-if="activeModule === 'UpdateModule'" />
        <NewModule v-if="activeModule === 'NewModule'" />
        <QuestionnaireModule v-if="activeModule === 'QuestionnaireModule'" />
        <UploadModule v-if="activeModule === 'UploadModule'" />
        <MergeCellTable v-if="activeModule === 'MergeCellTable'" year="2026" />
        <TableJumpModule v-if="activeModule === 'TableJumpModule'" />
        <SelectCascadeModule v-if="activeModule === 'SelectCascadeModule'" />
        <DataReportModule v-if="activeModule === 'DataReportModule'" />
        <EChartsModule v-if="activeModule === 'EChartsModule'" />
        <ChartTreeModule v-if="activeModule === 'ChartTreeModule'" />
      </div>
    </template>
  </div>
</template>

<script>
import YY from "./pages/yy.vue";
import UpdateModule from "./components/UpdateModule.vue";
import NewModule from "./components/NewModule.vue";
import QuestionnaireModule from "./components/QuestionnaireModule.vue";
import UploadModule from "./components/UploadModule.vue";
import MergeCellTable from "./components/mergeCellTable.vue";
import TableJumpModule from "./components/TableJumpModule.vue";
import SelectCascadeModule from "./components/SelectCascadeModule.vue";
import DataReportModule from "./components/DataReportModule.vue";
import EChartsModule from "./components/EChartsModule.vue";
import ChartTreeModule from "./components/ChartTreeModule.vue";
import PoliticalAnalysisModule from "./components/PoliticalAnalysisModule.vue";
export default {
  name: 'App',
  components: {
    YY,
    UpdateModule,
    NewModule,
    QuestionnaireModule,
    UploadModule,
    MergeCellTable,
    TableJumpModule,
    SelectCascadeModule,
    DataReportModule,
    EChartsModule,
    ChartTreeModule,
    PoliticalAnalysisModule,
  },
  data() {
    return {
      activeModule: 'PoliticalAnalysisModule', // 默认显示政治生态智能分析看板
      moduleOptions: [
        { label: 'YY 模块', value: 'YY' },
        { label: '更新模块', value: 'UpdateModule' },
        { label: '新模块', value: 'NewModule' },
        { label: '问卷模块', value: 'QuestionnaireModule' },
        { label: '上传模块', value: 'UploadModule' },
        { label: '合并单元格表格', value: 'MergeCellTable' },
        { label: '表格跳转模块', value: 'TableJumpModule' },
        { label: '选择级联模块', value: 'SelectCascadeModule' },
        { label: '数据报告模块', value: 'DataReportModule' },
        { label: 'ECharts 模块', value: 'EChartsModule' },
        { label: '指标树图表模块', value: 'ChartTreeModule' },
        { label: '政治生态智能分析', value: 'PoliticalAnalysisModule' },
      ],

      analysisNav: [
        { name: '首页', icon: 'el-icon-s-home', active: true },
        { name: '监管指标', icon: 'el-icon-menu' },
        { name: '任务管理', icon: 'el-icon-s-claim' },
        { name: '资源库', icon: 'el-icon-suitcase' },
        { name: '统计报表', icon: 'el-icon-s-data' },
        { name: '驾驶舱', icon: 'el-icon-cpu' }
      ],
      sideRailIcons: [
        'el-icon-s-flag',
        'el-icon-s-custom',
        'el-icon-s-check',
        'el-icon-reading',
        'el-icon-s-opportunity',
        'el-icon-s-promotion',
        'el-icon-document-checked',
        'el-icon-monitor',
        'el-icon-s-help',
        'el-icon-medal',
        'el-icon-s-cooperation',
        'el-icon-money',
        'el-icon-office-building'
      ],
      route: '/',
      demoMenu: [
        { id: 'home', menuName: '首页', menuType: 'C', svgIcon: 'home' },
        { id: 'calc', menuName: '明细合计', menuType: 'C', svgIcon: 'calculator' },
        { id: 'report', menuName: '报表中心', menuType: 'C', svgIcon: 'chart' },
        { id: 'analysis', menuName: '分析中心', menuType: 'C', svgIcon: 'chart' },
        { id: 'monitor', menuName: '监控大屏', menuType: 'C', svgIcon: 'eye' },
        { id: 'orders', menuName: '订单管理', menuType: 'C', svgIcon: 'list' },
        { id: 'users', menuName: '用户管理', menuType: 'C', svgIcon: 'user' },
        { id: 'logs', menuName: '日志审计', menuType: 'C', svgIcon: 'lock' },
        { id: 'help', menuName: '帮助中心', menuType: 'C', svgIcon: 'question' },
        { id: 'about', menuName: '关于', menuType: 'C', svgIcon: 'info' },
        { id: 'm1', menuName: '模块一', menuType: 'C', svgIcon: 'chart' },
        { id: 'm2', menuName: '模块二', menuType: 'C', svgIcon: 'chart' },
        { id: 'm3', menuName: '模块三', menuType: 'C', svgIcon: 'chart' },
        { id: 'm4', menuName: '模块四', menuType: 'C', svgIcon: 'chart' },
        { id: 'm5', menuName: '模块五', menuType: 'C', svgIcon: 'chart' },
        { id: 'm6', menuName: '模块六', menuType: 'C', svgIcon: 'chart' },
        { id: 'm7', menuName: '模块七', menuType: 'C', svgIcon: 'chart' },
        { id: 'm8', menuName: '模块八', menuType: 'C', svgIcon: 'chart' },
        { id: 'm9', menuName: '模块九', menuType: 'C', svgIcon: 'chart' },
        { id: 'm10', menuName: '模块十', menuType: 'C', svgIcon: 'chart' },
        { id: 'm11', menuName: '模块十一', menuType: 'C', svgIcon: 'chart' },
        { id: 'm12', menuName: '模块十二', menuType: 'C', svgIcon: 'chart' }
      ]
    };
  },
  methods: {

  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止移动端整体滚动干扰 */
}

.module-select-bar {
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.module-select {
  width: 240px;
}

.app-container {
  height: 100%;
  /* max-width: 1200px; */
  margin: 0 auto;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.app-container.is-wide-layout {
  max-width: 1500px;
}

.active-module-wrap {
  flex: 1;
  overflow: auto;
  padding: 0 15px 15px;
}

.header-card {
  margin-bottom: 20px;
  text-align: center;
}

.header-card h1 {
  font-size: 24px;
  color: #303133;
  font-weight: 500;
  margin: 0;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modules-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.module-card {
  width: 100%;
  border: 1px solid #e4e7ed;
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.module-title {
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.topbar-wrap {
  background: #b8141c;
  border-radius: 8px;
  padding: 10px 8px;
}

.app-container.is-analysis-layout {
  width: 100vw;
  max-width: none;
  height: 100vh;
  overflow: hidden;
  background: #f7f0e7;
}

.analysis-topbar {
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 22px;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(226, 0, 11, .96), rgba(255, 44, 33, .94)),
    repeating-linear-gradient(72deg, rgba(255,255,255,.12) 0 1px, transparent 1px 86px);
  box-shadow: 0 4px 14px rgba(190, 0, 0, .22);
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 360px;
  min-width: 300px;
}

.party-emblem {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffed80;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(255, 240, 110, .9);
}

.brand-title {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 1px;
  white-space: nowrap;
}

.main-nav {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  gap: 18px;
  height: 100%;
}

.main-nav-item {
  height: 100%;
  min-width: 88px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 17px;
  border-radius: 4px;
  white-space: nowrap;
}

.main-nav-item i {
  font-size: 20px;
}

.main-nav-item.active {
  height: 42px;
  align-self: center;
  background: rgba(151, 0, 0, .78);
  font-weight: 700;
  box-shadow: inset 0 -2px 0 rgba(255,255,255,.14);
}

.topbar-user {
  width: 520px;
  min-width: 430px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  font-size: 14px;
  white-space: nowrap;
}

.notice i {
  margin-right: 4px;
  color: #ffd15d;
}

.avatar {
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 50%;
  color: #303133;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(255,255,255,.35);
}

.analysis-tab-row {
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(245, 29, 23, .98), rgba(239, 34, 25, .95)),
    repeating-linear-gradient(90deg, rgba(255,255,255,.12) 0 1px, transparent 1px 80px);
}

.hamburger {
  width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.analysis-tab {
  height: 40px;
  min-width: 176px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(186, 0, 0, .58);
  border-radius: 12px 12px 0 0;
  font-size: 15px;
}

.breadcrumb-row {
  flex: 1;
  padding-right: 22px;
  text-align: right;
  font-size: 14px;
  opacity: .98;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.analysis-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.side-rail {
  width: 80px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  padding-top: 22px;
  background: #fff;
  border-radius: 0 10px 0 0;
  box-shadow: 4px 0 12px rgba(207, 56, 43, .06);
}

.side-rail i {
  color: #ef2d36;
  font-size: 20px;
}

.analysis-content {
  flex: 1;
  min-width: 0;
  overflow: auto;
  background: #fff;
}

@media (max-width: 1360px) {
  .brand-area { width: 260px; min-width: 240px; }
  .brand-title { font-size: 20px; }
  .main-nav { gap: 6px; }
  .main-nav-item { min-width: 74px; padding: 0 8px; font-size: 15px; }
  .topbar-user { width: 360px; min-width: 320px; gap: 8px; }
}


/* 移动端适配 */
@media (max-width: 480px) {
  .app-container {
    padding: 15px;
    max-width: 100%;
  }

  .header-card h1 {
    font-size: 20px;
  }

  .modules-container {
    gap: 20px;
  }

  .module-title {
    font-size: 18px;
  }
}
</style>
