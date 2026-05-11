<template>
  <div class="line-table-wrap">
    <div class="table-top-bar">
      <span class="table-top-left">填报单位: XXXX (系统自动生成)</span>
      <span class="table-top-right">填报时间: XXXX年XX月XX日 (系统自动生成)</span>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 0;"
      class="multi-header-table"
    >
      <!-- 第一列：斜线表头（项目/年份） -->
      <el-table-column
        prop="yearLabel"
        width="80"
        align="center"
        :render-header="renderSlantHeader"
      />

      <!-- 结构计划（多列） -->
      <el-table-column label="结构计划" align="center">
        <el-table-column prop="totalDemand" label="年度总录需求(人)" width="90" align="center" />
        <el-table-column prop="partyMemberCount" label="2025年 1-12月发展党员数(人)" width="120" align="center" min-width="100" />
        <el-table-column prop="eduFemale" label="女(人)" width="72" align="center" />
        <el-table-column prop="eduAge35" label="35岁及以下(人)" width="72" align="center" />
        <el-table-column prop="eduUniversity" label="大学学历(人)" width="72" align="center" />
        <el-table-column prop="eduBachelor" label="本科学历(人)" width="72" align="center" />
        <el-table-column prop="eduPostgraduate" label="研究生及以上学历(人)" width="72" align="center" />
        <el-table-column prop="eduWorker" label="产业工人(人)" width="72" align="center" />
        <el-table-column prop="eduTech" label="专业技术人员(人)" width="72" align="center" />
        <el-table-column prop="talentPlan" label="省级及以上人才引进和培养支持计划入选人员(人)" width="100" align="center" min-width="100" />
        <el-table-column prop="highSkill" label="高技能人才(人)" width="90" align="center" />
        <el-table-column prop="fewPartyDemand" label="无(少)党员(党员人数&lt;1)的组织发展需求(人)" width="120" align="center" min-width="100" />
        <el-table-column prop="emergingBiz" label="新兴业务领域(人)" width="90" align="center" />
        <el-table-column prop="intlBiz" label="国际业务领域(人)" width="90" align="center" />
        <el-table-column prop="orgDemand" label="满足党组织设置要求的发展需求(人)" width="130" align="center" min-width="100" />
      </el-table-column>

      <!-- 其他需要说明的情况 -->
      <el-table-column label="其他需要说明的情况" align="center">
        <el-table-column prop="remark1" label="《各级党组织可根据上级党组织发展党员需求填报要求新增或调整结构计划项目》xxxx: 2, xxxx: 3, ..." width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="remark2" label="对本党组织需要上级支持发展党员工作的其他情况进行说明" width="140" align="center" show-overflow-tooltip />
        <el-table-column label="操作列" width="80" align="center" fixed="right">
          <template slot-scope="{ $index }">
            <el-button type="text" size="small" @click="onEdit($index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "SlantTableHeader",
  data() {
    return {
      tableData: [
        {
          yearLabel: "2026年度",
          totalDemand: "",
          partyMemberCount: "",
          eduFemale: "",
          eduAge35: "",
          eduUniversity: "",
          eduBachelor: "",
          eduPostgraduate: "",
          eduWorker: "",
          eduTech: "",
          talentPlan: "",
          highSkill: "",
          fewPartyDemand: "",
          emergingBiz: "",
          intlBiz: "",
          orgDemand: "",
          remark1: "",
          remark2: "",
        },
      ],
    };
  },
  methods: {
    renderSlantHeader(h) {
      return h(
        "div",
        {
          class: "slant-header-inner",
          style: {
            position: "relative",
            width: "100%",
            height: "48px",
            overflow: "hidden",
          },
        },
        [
          h("div", { class: "slant-line" }),
          h("div", { class: "slant-text-left", style: { position: "absolute", bottom: "2px", left: "6px", fontSize: "12px", color: "#303133" } }, "项目"),
          h("div", { class: "slant-text-right", style: { position: "absolute", top: "2px", right: "6px", fontSize: "12px", color: "#303133" } }, "年份"),
        ]
      );
    },
    onEdit(index) {
      this.$message.info("编辑第 " + (index + 1) + " 行");
    },
  },
};
</script>

<style scoped>
.line-table-wrap {
  margin-top: 20px;
}

.table-top-bar {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 0;
}

/* 多级表头样式 */
.multi-header-table ::v-deep .el-table__header-wrapper th {
  padding: 8px 0;
  text-align: center;
  vertical-align: middle;
}

/* 第一行第一列表头（斜线格）不压缩、不裁剪 */
.multi-header-table ::v-deep .el-table__header-wrapper thead tr:first-child th:first-child .cell {
  padding: 0;
  display: block;
  overflow: visible;
}

.multi-header-table ::v-deep .el-table .cell {
  padding: 8px;
  text-align: center;
}

/* 斜线表头：render-header 渲染的节点在表头内，需用 ::v-deep 穿透 */
.multi-header-table ::v-deep .slant-header-inner {
  position: relative;
  display: block;
  min-height: 48px;
}

.multi-header-table ::v-deep .slant-line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 140%;
  background: #bfbfbf;
  transform: translate(-50%, -50%) rotate(-45deg);
  z-index: 1;
}

.multi-header-table ::v-deep .slant-text-left,
.multi-header-table ::v-deep .slant-text-right {
  z-index: 2;
}
</style>
