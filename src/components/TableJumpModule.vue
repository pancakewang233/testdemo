<template>
  <div class="table-jump-module">
    <!-- 列表视图 -->
    <div v-if="view === 'list'" class="list-view">
      <el-card shadow="hover">  
        <div slot="header">
          <span>单位列表 (点击单位名称跳转)</span>
        </div>
        <el-table :data="listData" border style="width: 100%" @cell-click="handleCellClick">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="orgName" label="单位名称" align="center" class-name="clickable-cell">
            <template slot-scope="scope">
              <span class="link-text">{{ scope.row.orgName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalScore" label="总分" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 详情视图 -->
    <div v-else class="detail-view">
      <el-card shadow="hover">
        <div slot="header" class="detail-header">
          <span>{{ selectedOrg.orgName }} - 评分明细</span>
          <el-button size="mini" type="primary" @click="view = 'list'">返回列表</el-button>
        </div>
        
        <el-table :data="detailTableData" border style="width: 100%" :row-class-name="tableRowClassName" :span-method="objectSpanMethod">
          <el-table-column prop="type" label="类型" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isTotal ? 'success' : 'info'" size="small">
                {{ scope.row.isTotal ? '合计' : '明细' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="itemName" label="考核项/单位" align="center"></el-table-column>
          <el-table-column prop="score" label="分数" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableJumpModule',
  data() {
    return {
      view: 'list', // list 或 detail
      selectedOrg: {},
      listData: [
        { id: '1', orgName: '技术研发部', totalScore: 95, updateTime: '2024-03-20' },
        { id: '2', orgName: '市场营销部', totalScore: 88, updateTime: '2024-03-21' },
        { id: '3', orgName: '人事行政部', totalScore: 92, updateTime: '2024-03-22' },
        { id: '4', orgName: '财务管理部', totalScore: 90, updateTime: '2024-03-23' },
      ],
      // 模拟的明细数据模板
      mockDetails: [
        { itemName: '关键指标完成度', score: 40, remark: '按进度完成' },
        { itemName: '团队协作表现', score: 25, remark: '配合良好' },
        { itemName: '创新能力评估', score: 20, remark: '有突破性进展' },
        { itemName: '日常规范执行', score: 10, remark: '无违规记录' },
      ]
    };
  },
  computed: {
    detailTableData() {
      if (!this.selectedOrg.id) return [];

      // 第一行是合计行
      const totalRow = {
        isTotal: true,
        type: '合计',
        itemName: `总分: ${this.selectedOrg.totalScore}`,
        score: this.selectedOrg.totalScore,
        remark: '所有明细汇总'
      };

      // 后面是明细行
      const detailRows = this.mockDetails.map(item => ({
        ...item,
        isTotal: false,
        type: '明细'
      }));

      return [totalRow, ...detailRows];
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 4,
          };
        } else if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    handleCellClick(row, column) {
      // 只有点击“单位名称”列才跳转
      if (column.property === 'orgName') {
        this.selectedOrg = row;
        this.view = 'detail';
      }
    },
    tableRowClassName({ row }) {
      if (row.isTotal) {
        return 'total-row';
      }
      return '';
    }
  }
};
</script>

<style scoped>
.table-jump-module {
  margin-top: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-text {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}

.clickable-cell {
  cursor: pointer;
}

/deep/ .total-row {
  background-color: #f5f7fa;
  font-weight: bold;
}

/deep/ .total-row td {
  color: #67c23a;
}
</style>
