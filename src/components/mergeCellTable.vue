<template>
  <div class="table-wrap">
    <div class="table-head">
      <div class="table-title-1">一、总体得分情况</div>
    </div>
    <div class="table">
      <el-table
        :span-method="spanMethod"
        style="width: 100%"
        height="100%"
        v-loading="isLoading"
        border
        :data="tableData"
        ref="tableRef"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column prop="startType" label="统计方式" align="center">
        </el-table-column>
        <el-table-column
          prop="dimensionName"
          label="统计维度"
          align="center"
          width="220"
        />
        <el-table-column prop="indexLader" label="统计说明" align="center" />
        <el-table-column prop="indexScore" label="指标分值" align="center">
          <template slot-scope="scope">{{
            scope.row.indexScore ? Number(scope.row.indexScore).toFixed(4) : ""
          }}</template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columnList"
          :key="index"
          align="center"
          :label="item.orgTypeName"
          :prop="item.orgId"
        >
          <template v-if="item.evaluationUnitVOs">
            <el-table-column
              v-for="(a, b) in item.evaluationUnitVOs"
              :key="b"
              align="center"
              :label="a.orgName"
              :prop="a.orgId"
            >
              <template slot-scope="scope">
                <span :title="scope.row[a.orgId]">{{
                  scope.row[a.orgId] ? Number(scope.row[a.orgId]).toFixed(4) : ""
                }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const MOCK_RESPONSE = {
  result: {
    orgTypeVOs: [
      {
        orgTypeName: "省公司",
        orgId: "province",
        evaluationUnitVOs: [
          { orgName: "A单位", orgId: "orgA" },
          { orgName: "B单位", orgId: "orgB" },
        ],
      },
      {
        orgTypeName: "地市公司",
        orgId: "city",
        evaluationUnitVOs: [
          { orgName: "C单位", orgId: "orgC" },
          { orgName: "D单位", orgId: "orgD" },
        ],
      },
    ],
    businessOutcomes: [
      {
        id: "row1",
        statType: 0,
        dimensionName: "综合评价",
        indexLader: "按综合评价结果统计",
        indexScore: 25,
        orgScoreVos: [
          { orgId: "orgA", totalScore: 24.5 },
          { orgId: "orgB", totalScore: 23.2 },
          { orgId: "orgC", totalScore: 22.1 },
          { orgId: "orgD", totalScore: 21.6 },
        ],
      },
      {
        id: "row2",
        statType: 0,
        dimensionName: "专项评价",
        indexLader: "按专项评价结果统计",
        indexScore: 25,
        orgScoreVos: [
          { orgId: "orgA", totalScore: 23.1 },
          { orgId: "orgB", totalScore: 22.7 },
          { orgId: "orgC", totalScore: 24.0 },
          { orgId: "orgD", totalScore: 23.6 },
        ],
      },
      {
        id: "row3",
        statType: 1,
        dimensionName: "组织建设",
        indexLader: "按组织建设维度统计",
        indexScore: 20,
        orgScoreVos: [
          { orgId: "orgA", totalScore: 18.2 },
          { orgId: "orgB", totalScore: 18.9 },
          { orgId: "orgC", totalScore: 17.8 },
          { orgId: "orgD", totalScore: 19.1 },
        ],
      },
      {
        id: "row4",
        statType: 1,
        dimensionName: "队伍建设",
        indexLader: "按队伍建设维度统计",
        indexScore: 15,
        orgScoreVos: [
          { orgId: "orgA", totalScore: 14.3 },
          { orgId: "orgB", totalScore: 13.9 },
          { orgId: "orgC", totalScore: 14.1 },
          { orgId: "orgD", totalScore: 14.7 },
        ],
      },
      {
        id: "row5",
        statType: 1,
        dimensionName: "作风建设",
        indexLader: "按作风建设维度统计",
        indexScore: 15,
        orgScoreVos: [
          { orgId: "orgA", totalScore: 13.8 },
          { orgId: "orgB", totalScore: 14.2 },
          { orgId: "orgC", totalScore: 13.5 },
          { orgId: "orgD", totalScore: 13.9 },
        ],
      },
      {
        id: "row6",
        statType: 2,
        dimensionName: "创新驱动",
        indexLader: "按创新驱动维度统计",
        indexScore: 15,
        orgScoreVos: [
          { orgId: "orgA", totalScore: 14.7 },
          { orgId: "orgB", totalScore: 14.1 },
          { orgId: "orgC", totalScore: 13.9 },
          { orgId: "orgD", totalScore: 14.3 },
        ],
      },
    ],
    orgTotalScoreVos: [
      { orgId: "orgA", totalScore: 108.6 },
      { orgId: "orgB", totalScore: 107.0 },
      { orgId: "orgC", totalScore: 105.4 },
      { orgId: "orgD", totalScore: 107.2 },
    ],
  },
};

export default {
  props: {
    year: { type: String, default: "2026" },
  },
  data() {
    return {
      isLoading: false,
      tableData: [],
      columnList: [],
    };
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
    getSpanArr(data) {
      this.cellList = [];
      // 循环遍历表体数据
      for (let i = 0; i < data.length; i++) {
        if (i == 0) {
          // 先设置第一项
          this.cellList.push(1); // 初为1，若下一项和此项相同，就往cellList数组中追加0
          this.count = 0; // 初始计数为0
        } else {
          // 判断当前项与上项的设备类别是否相同，因为是合并这一列的单元格
          if (
            data[i].statType != data[i - 1].statType ||
            data[i - 1].statType == 100
          ) {
            this.cellList.push(1); // 不等就往cellList数组中追加1
            this.count = i; // 将索引赋值为计数
          } else {
            // 如果相等
            this.cellList[this.count] += 1; // 增加计数
            this.cellList.push(0); // 相等就往cellList数组中追加0
          }
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row && row.isTotal) {
        // 合计行将“统计方式 + 统计维度 + 统计说明”三列合并显示
        if (columnIndex === 1 || columnIndex === 3) {
          return [1, 0];
        }
        if (columnIndex === 2) {
          return [1, 3];
        }
      }
      // 给第二列做单元格合并。0是第一列，1是第二列。
      if (columnIndex == 1 || columnIndex == 3) {
        const spans = this.calculateeSpans(this.tableData, `startType`);
        return spans[rowIndex];
      }
    },
    calculateeSpans(data, prop) {
      const spans = [];
      let pos = 0;
      while (pos < data.length) {
        if (data[pos][prop] == `合计`) {
          spans.push([1, 1]);
          pos++;
          continue;
        }

        let count = 1;
        const currentVal = data[pos][prop];
        while (
          pos + count < data.length &&
          data[pos + count][prop] === currentVal &&
          data[pos + count][prop] != 100
        ) {
          count++;
        }
        for (let i = 0; i < count; i++) {
          if (i === 0) {
              spans.push([count, 1]);
          } else {
            spans.push([0, 0]);
          }
        }
        pos += count;
      }
      return spans;
    },
    formatData(data = []) {
      let result = [];
      const sortObj = [];
      data.map((item) => {
        if (!sortObj.includes(item.id)) {
          sortObj.push(item.id);
        }
      });
      result = data
        .map((item) => {
          const index = sortObj.indexOf(item.id);
          item.sort = index;
          return item;
        })
        .sort((a, b) => a.sort - b.sort);
      return result;
    },
    getData() {
      this.isLoading = true;
      const res = JSON.parse(JSON.stringify(MOCK_RESPONSE));
      this.columnList = res.result?.orgTypeVOs || [];
      this.tableData = (res.result?.businessOutcomes || []).map((item) => {
        const startType =
          item.statType === 0
            ? "按评价方式统计"
            : item.statType === 100
            ? "合计"
            : "按评价维度统计";
        this.$set(item, "startType", startType);
        if (!item.orgScoreVos) {
          item.orgScoreVos = this.columnList.map((mi) => {
            const obj = { ...mi };
            obj.totalScore = 0;
            return obj;
          });
        } else {
          item.orgScoreVos?.forEach((mi) => {
            item[mi.orgId] = mi.totalScore;
          });
        }
        return item;
      });
      this.$nextTick(() => {
        this.$refs.tableRef && this.$refs.tableRef.doLayout();
      });
      if (this.tableData && this.tableData.length > 0) {
        this.getSpanArr(this.tableData);
      }
      if (
        res.result &&
        res.result.orgTotalScoreVos &&
        res.result.orgTotalScoreVos.length > 0
      ) {
        this.filterTable(this.tableData, res.result.orgTotalScoreVos);
        this.filterTableBottom(this.tableData, res.result.orgTotalScoreVos);
      }
      this.isLoading = false;
    },
    filterTable(data, data1) {
      const addRow = data.slice(0, 3);
      const minusRow = data[3];
      let total = {
        isTotal: true,
        statType: 100,
        indexScore: 100,
        startType: "",
        dimensionName: `合计`,
        indexLader: "",
      };
      data1.forEach((a) => {
        this.columnList.forEach((c) => {
          c.evaluationUnitVOs?.forEach((d) => {
            if (a.orgId == d.orgId) {
              total[d.orgId] = a.totalScore;
            }
          });
        });
      });
      // addRow.forEach((a) => {
      //   a.orgScoreVos?.forEach((b) => {
      //     this.columnList.forEach((c) => {
      //       c.evaluationUnitVOs.forEach((d) => {
      //         if (b.orgId == d.orgId) {
      //           const t = b.totalScore - 0 || 0;
      //           if (!total[d.orgId]) {
      //             total[d.orgId] = 0;
      //           }
      //           total[d.orgId] += t;
      //         }
      //       });
      //     });
      //   });
      // });
      //   minusRow.orgScoreVos?.forEach(b=>{
      //      total[b.orgId] = (total[b.orgId] - b.totalScore).toFixed(4)
      //   })
      this.tableData.splice(4, 0, total);
    },
    filterTableBottom(data, data1) {
      const addRow = data.slice(5, data.length - 1);
      const minusRow = data[data.length - 1];

      let total = {
        isTotal: true,
        statType: 100,
        indexScore: 100,
        startType: "",
        dimensionName: `合计`,
        indexLader: "",
      };
      data1.forEach((a) => {
        this.columnList.forEach((c) => {
          c.evaluationUnitVOs.forEach((d) => {
            if (a.orgId == d.orgId) {
              total[d.orgId] = a.totalScore;
            }
          });
        });
      });
      this.tableData.push(total);
    },
  },
};
</script>

<style scoped>
.table-wrap {
  height: 100%;
  width: 100%;
}
.table-wrap .table {
  width: 100%;
  display: flex;
  height: calc(100% - 76px);
}
</style>
