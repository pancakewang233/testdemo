<template>
  <div class="app-container" :class="{ 'is-wide-layout': activeModule === 'NewModule' || activeModule === 'MockEleTable' || activeModule === 'PoliticalPortraitReportUi' }">
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
      <PoliticalAnalysisModule v-if="activeModule === 'PoliticalAnalysisModule'" />
      <PortraitReportModule v-if="activeModule === 'PortraitReportModule'" />
      <PoliticalPortraitReportUi v-if="activeModule === 'PoliticalPortraitReportUi'" />
      <MockEleTable v-if="activeModule === 'MockEleTable'" year="2026" />
    </div>
  </div>
</template>

<script>
const YY = () => import("./pages/yy.vue");
const UpdateModule = () => import("./components/UpdateModule.vue");
const NewModule = () => import("./components/NewModule.vue");
const QuestionnaireModule = () => import("./components/QuestionnaireModule.vue");
const UploadModule = () => import("./components/UploadModule.vue");
const MergeCellTable = () => import("./components/mergeCellTable.vue");
const TableJumpModule = () => import("./components/TableJumpModule.vue");
const SelectCascadeModule = () => import("./components/SelectCascadeModule.vue");
const DataReportModule = () => import("./components/DataReportModule.vue");
const EChartsModule = () => import("./components/EChartsModule.vue");
const ChartTreeModule = () => import("./components/ChartTreeModule.vue");
const PoliticalAnalysisModule = () => import("./components/PoliticalAnalysisModule.vue");
const PortraitReportModule = () => import("./components/PortraitReportModule.vue");
const PoliticalPortraitReportUi = () => import("./components/PoliticalPortraitReportUi.vue");
const MockEleTable = () => import("./components/mockEleTable.vue");
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
    PortraitReportModule,
    PoliticalPortraitReportUi,
    MockEleTable,
  },
  data() {
    return {
      activeModule: 'MergeCellTable', // 默认显示合并单元格表格
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
        { label: '画像报告', value: 'PortraitReportModule' },
        { label: '画像报告UI美化版', value: 'PoliticalPortraitReportUi' },
        { label: '监督数据表格', value: 'MockEleTable' },
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

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
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
  min-height: 100vh;
  //max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.app-container.is-wide-layout {
  max-width: 1500px;
}

.active-module-wrap {
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
