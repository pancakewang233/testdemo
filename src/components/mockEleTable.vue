<template>
  <div class="table-wrap">
    <div class="table-head">
      <div class="table-title">一、监督数据（共 {{ tableData.length }} 条）</div>
    </div>
    <div class="table-body">
      <el-table
        height="100%"
        v-loading="isLoading"
        border
        :span-method="mergeCell"
        :data="tableData"
        ref="tableRef"  
      >
        <!-- ═══ 左固定列 ═══ -->
        <el-table-column type="index" label="序号" align="center" width="48" fixed="left" />
        <el-table-column prop="indicators" label="评价指标" align="center" width="100" fixed="left" />
        <el-table-column label="数据形式" align="center" width="80" fixed="left">
          <template slot-scope="{ row }">{{ row.dataFrom === 0 ? '定量评价' : '定性评价' }}</template>
        </el-table-column>

        <!-- ═══ 内容列 ═══ -->
        <el-table-column label="责任部门" align="center" width="80">
          <template slot-scope="{ row }">
            <div
              v-for="(deptVo, i) in row.deptVos" :key="i"
              class="dept-name-cell" :title="deptVo.deptName"
            >{{ deptVo.deptName }}</div>
          </template>
        </el-table-column>

        <el-table-column label="数据项" align="center" width="120">
          <template slot-scope="{ row }">
            <div v-for="(deptVo, di) in row.deptVos" :key="di" class="year-block">
              <div
                v-for="(yearItem, yi) in deptVo.scoreYearDTO" :key="yi"
                class="year-row"
                :class="isLastYearRow(row, di, yi) ? 'year-row--no-border' : ''"
              >{{ yearItem.scoreYear }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 动态单位列（每个 orgType 一组） -->
        <el-table-column
          v-for="(orgType, otIdx) in columnList" :key="'ot' + otIdx"
          align="center" :label="orgType.orgTypeName"
        >
          <el-table-column
            v-for="unit in orgType.evaluationUnitVOs" :key="unit.orgId"
            align="center" :label="unit.orgName"
          >
            <template slot-scope="{ row, $index }">
              <div v-for="(deptVo, di) in row.deptVos" :key="di">
                <div
                  v-for="(yearItem, yi) in deptVo.scoreYearDTO" :key="yi"
                  class="score-cell" :class="cellClass(row, di, yi, deptVo, unit)"
                >
                  <template v-if="row.isEdit">
                    <!-- 定性评价：下拉 -->  
                    <el-select
                      v-if="row.dataTypeSelf === 1"
                      v-model="yearItem[row.scoreMap[unit.orgId].qualKey]"
                      size="small"
                      @change="onQualChange(row, unit.orgId, yearItem)"
                    >
                      <el-option v-for="opt in row.scoreType" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                    <!-- 百分比 -->
                    <el-input v-else-if="row.dataTypeSelf === 4" type="number" v-model="yearItem[unit.orgId]" class="scope-inp">
                      <template slot="append">%</template>
                    </el-input>
                    <!-- 正整数 -->
                    <el-input v-else-if="row.dataTypeSelf === 3" v-positiveInteger type="number" v-model="yearItem[unit.orgId]" />
                    <!-- 定量数值 -->
                    <el-input v-else-if="row.dataTypeSelf === 2" type="number" v-model="yearItem[unit.orgId]" />
                    <!-- 文本 -->
                    <el-input v-else type="text" v-model="yearItem[unit.orgId]" />
                  </template>

                  <div v-else class="cell-text" :title="yearItem['_d' + unit.orgId]">{{
                    yearItem['_d' + unit.orgId]
                  }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- ═══ 右固定列 ═══ -->
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="{ row }">
            <el-button v-if="row.isEdit" type="text" @click="clickSave(row)">保存</el-button>
            <el-button
              v-else type="text"
              :disabled="row._disabled"
              :style="{ color: row._disabled ? 'grey' : '#ff7403' }"
              @click="clickEdit(row)"
            >编辑</el-button>
            <el-button
              type="text"
              :disabled="row.submitState === 0"
              :style="{ color: row.submitState === 0 ? 'grey' : '#ff7403' }"
              @click="clickReturn(row)"
            >退回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mockGetDataResult, mockGetDataResult2, mockScoreResult, mockScoreResult2 } from '../data/mockData.js';

export default {
  name: 'MockEleTable',
  components: {},

  props: {
    year: { type: String, required: true },
    submitTime: { type: String, required: false },
  },

  data() {
    return {
      scoreTypeOptions: [
        { value: 0, label: '好' },
        { value: 1, label: '较好' },
        { value: 2, label: '一般' },
        { value: 3, label: '差' },
      ],
      isLoading: false,
      tableData: [],
      columnList: [],
      editData: null,
    };
  },

  computed: {
    /** 预计算合并单元格的 span 数组 */
    spanArr() {
      const arr = [];
      if (!this.tableData.length) return arr;
      let groupStart = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          arr.push(1);
        } else if (
          item.indicators === this.tableData[index - 1].indicators &&
          item.dataFrom === this.tableData[index - 1].dataFrom
        ) {
          arr[groupStart] += 1;
          arr.push(0);
        } else {
          arr.push(1);
          groupStart = index;
        }
      });
      return arr;
    },

    /** 扁平化所有单位 */
    flatUnits() {
      const units = [];
      (this.columnList || []).forEach((orgType) => {
        (orgType.evaluationUnitVOs || []).forEach((unit) => {
          units.push(unit);
        });
      });
      return units;
    },
  },

  watch: {
    year() {
      this.getData();
    },
  },

  mounted() {
    this.getData();
  },

  methods: {

    // ═══════════════════ 模板辅助方法 ═══════════════════

    /** 判断 year-row 是否为数据块最后一行（不需要边框） */
    isLastYearRow(row, deptIdx, yearIdx) {
      const lastDept = row.deptVos.length - 1;
      const lastYear = row.deptVos[lastDept].scoreYearDTO.length - 1;
      return deptIdx === lastDept && yearIdx === lastYear;
    },

    /** 动态单元格的 class，替代原 getCellBorder 样式 + is-editing 状态 */
    cellClass(row, deptIdx, yearIdx, deptVo, unit) {
      const classes = [];
      if (row.isEdit) classes.push('cell-edit');
      // 最后一条 year 且非最后一个 deptVo → 底部分隔线
      const isLastYear = yearIdx === deptVo.scoreYearDTO.length - 1;
      if (isLastYear && deptIdx < row.deptVos.length - 1) {
        classes.push('cell-divider');
      }
      return classes;
    },

    // ═══════════════════ 数据加载 ═══════════════════

    getData() {
      this.columnList = mockGetDataResult2.orgTypeVOs;
      this.buildTableData();
    },

    /**
     * 核心：构建 tableData（纯数据操作，不做 $set）
     *
     * 关键优化：所有属性在赋值给 this.tableData 之前直接用普通对象赋值，
     * 只在最终一次赋值时触发 Vue 响应式转换，消除数千次 $set 开销。
     */
    buildTableData() {
      const src = JSON.parse(JSON.stringify(mockScoreResult2));
      const units = this.flatUnits;

      const rows = src.map((item) => {
        const row = { ...item };
        this.initRowMeta(row);
        this.populateRowColumns(row, units);
        return row;
      });

      this.tableData = rows;
      this.$nextTick(() => {
        this.$refs.tableRef && this.$refs.tableRef.doLayout();
      });
    },

    /** 初始化行元数据：提取 dataType，预计算 _disabled */
    initRowMeta(row) {
      row.isEdit = false;
      row.scoreMap = {};

      const deptVos = row.deptVos || [];
      row._disabled = !deptVos.length;

      let dataType = null;
      for (const deptVo of deptVos) {
        const yearItems = deptVo.scoreYearDTO || [];
        if (!yearItems.length) continue;
        const firstList = yearItems[0]?.indicatorScoreVOlist;
        if (!firstList?.length) continue;
        dataType = firstList[0].dataType;
        break;
      }

      row.dataTypeSelf = dataType;
      if (dataType === 1) {
        row.scoreType = this.scoreTypeOptions;
      }
    },

    /**
     * 填充行数据：为每个 yearItem 按列写入单元格值 + 预计算展示文本
     *
     * _k{orgId} — 定量值（rawData）
     * _q{orgId} — 定性值（orgScore）
     * _d{orgId} — 预计算的展示文本，模板直接取值无需调方法
     */
    populateRowColumns(row, units) {
      const dt = row.dataTypeSelf;

      (row.deptVos || []).forEach((deptVo) => {
        const yearDTOs = deptVo.scoreYearDTO;
        if (!yearDTOs?.length) return;

        yearDTOs.forEach((yearItem, yi) => {
          // 构建 orgId → entry 查找表（只保留首个匹配）
          const entryMap = {};
          (yearItem.indicatorScoreVOlist || []).forEach((entry) => {
            if (!(entry.orgId in entryMap)) {
              entryMap[entry.orgId] = entry;
            }
          });

          units.forEach((unit) => {
            const orgId = unit.orgId;
            const entry = entryMap[orgId];
            const raw = entry ? (entry.rawData != null ? entry.rawData : '') : '';

            yearItem[orgId] = raw;
            // 预计算展示文本
            yearItem['_d' + orgId] = dt === 4
              ? (raw ? raw + '%' : '')
              : raw || '';

            if (entry && entry.orgScore != null) {
              yearItem[orgId + orgId] = +entry.orgScore;
            }

            // 缓存 qualKey
            if (!row.scoreMap[orgId]) {
              row.scoreMap[orgId] = {
                qualKey: orgId + orgId,
              };
            }
          });
        });
      });
    },

    // ═══════════════════ 编辑 / 保存 ═══════════════════

    clickEdit(item) {
      if (this.editData) {
        this.saveData();
      }
      this.tableData.forEach((fi) => {
        if (fi.id !== item.id) fi.isEdit = false;
      });
      item.isEdit = true;
      this.editData = item;
    },

    clickSave(item) {
      this.tableData.forEach((fi) => {
        if (fi.id !== item.id) fi.isEdit = false;
      });
      item.isEdit = false;
      this.saveData();
    },

    saveData() {
      if (!this.editData) return;

      const row = this.editData;
      const dt = row.dataTypeSelf;
      const isQual = dt === 1;
      const isPercent = dt === 4;
      const scoreTypes = row.scoreType;
      const qualLabelCache = {};
      const units = this.flatUnits;

      // 1. 对所有列同步 _d{orgId}
      (row.deptVos || []).forEach((vos) => {
        (vos.scoreYearDTO || []).forEach((yearItem) => {
          units.forEach((unit) => {
            const orgId = unit.orgId;
            const val = yearItem[orgId];
            yearItem['_d' + orgId] = isPercent
              ? (val ? val + '%' : '')
              : (val || '');
          });
        });
      });

      // 2. 构建 params：遍历 flatUnits（与模板列一致），查 indicatorScoreVOlist 取元数据
      const params = [];
      (row.deptVos || []).forEach((vos) => {
        (vos.scoreYearDTO || []).forEach((yearItem) => {
          const metaMap = {};
          (yearItem.indicatorScoreVOlist || []).forEach((e) => {
            metaMap[e.orgId] = e;
          }); 

          units.forEach((unit) => {
            const orgId = unit.orgId;
            const qualKey = orgId + orgId;
            const orgVal = yearItem[orgId];
            const qualVal = yearItem[qualKey];
            const meta = metaMap[orgId];

            const rawData = isQual
              ? (qualLabelCache[qualVal] !== undefined
                  ? qualLabelCache[qualVal]
                  : (qualLabelCache[qualVal] = (scoreTypes || []).find((i) => i.value == qualVal)?.label))
              : orgVal;

            params.push({
              businessindId: row.id,
              orgId,
              id: meta?.id || '',
              orgName: meta?.orgName || '',
              orgScore: isQual
                ? qualVal
                : isPercent
                  ? (orgVal / 100).toFixed(16)
                  : orgVal,
              scoreYear: meta?.scoreYear || '',
              rawData,
              dataType: meta?.dataType || dt,
              indicatorSort: meta?.indicatorSort,
              indicatorName: meta?.indicatorName || '',
              detailId: yearItem.detailId,
            });
          });
        });
      });

      console.log('saveData called', params);
      this.$message.success('操作成功（Mock）');
      this.editData = null;
    },

    // ═══════════════════ 其他操作 ═══════════════════

    /** 定性评价下拉变化时，同步 label 到展示字段和预计算文本 */
    onQualChange(row, orgId, yearItem) {
      const map = row.scoreMap?.[orgId];
      if (!map) return;
      const qualKey = map.qualKey;
      const found = (row.scoreType || []).find((i) => i.value === yearItem[qualKey]);
      if (found) {
        yearItem[orgId] = found.label;
        yearItem['_d' + orgId] = found.label;
      }
    },

    clickReturn() {
      this.$message.info('退回操作（Mock）');
    },

    // ═══════════════════ 合并单元格 ═══════════════════

    /** span-method：直接查表，不再每次重算 */
    mergeCell({ rowIndex, columnIndex }) {
      // 第 1 列（评价指标）和第 2 列（数据形式）参与合并
      if (columnIndex !== 1 && columnIndex !== 2) return;

      const rowspan = this.spanArr[rowIndex];
      return {
        rowspan: rowspan > 0 ? rowspan : 0,
        colspan: rowspan > 0 ? 1 : 0,
      };
    },
  },
};
</script>

<style scoped>
/* ─── 容器 ─── */
.table-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.table-body {
  flex: 1;
  overflow: hidden;
}
.table-body >>> .el-table {
  width: 100%;
}
.table-body >>> .scope-inp .el-input__inner {
  padding: 0 6px;
}

/* ─── 标题栏 ─── */
.table-head {
  flex-shrink: 0;
  padding: 12px 0;
}
.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* ─── 部门名称列 ─── */
.dept-name-cell {
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #ddd;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
}
.dept-name-cell:first-child {
  border-top: 0;
}

/* ─── 数据项列（年份标签） ─── */
.year-block {
  margin-left: -15px;
  margin-right: -15px;
  border-left: 1px solid #ddd;
}
.year-row {
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #ddd;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.year-row:first-child {
  border-top: 0;
}
.year-row--no-border {
  border-bottom: 0;
}

/* ─── 动态数据列 ─── */
.score-cell {
  height: 40px;
  line-height: 40px;
  margin-left: -15px;
  margin-right: -15px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
}
.score-cell:first-child {
  border-top: 0;
}
/* 编辑模式：重置 margin */
.score-cell.cell-edit {
  margin-left: 0;
  margin-right: 0;
}
/* 分隔不同 deptVo 的底边线 */
.score-cell.cell-divider {
  border-bottom: 1px solid #ddd;
}

/* ─── 展示模式文本 ─── */
.cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 8px;
}

/* ─── Element 覆写 ─── */
>>> .el-input-group__append,
>>> .el-input-group__prepend {
  padding: 0 1px 0 0 !important;
}
>>> input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
>>> input::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}
>>> input[type="number"] {
  -moz-appearance: textfield;
}
</style>
