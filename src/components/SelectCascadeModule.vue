<template>
  <div class="select-cascade-module">
    <h3>表格一</h3>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="选择状态" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.selected" placeholder="请选择" @change="handleSelectChange(scope.row)">
            <el-option label="选项1" value="option1"></el-option>
            <el-option label="选项2" value="option2"></el-option>
            <el-option label="选项3" value="option3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="级联选择" min-width="200">
        <template slot-scope="scope">
          <el-cascader
            v-if="scope.row.selected"
            v-model="scope.row.cascadeValue"
            :options="getCascadeOptions(scope.row.selected)"
            :props="cascadeProps"
            placeholder="请选择"
            multiple
          ></el-cascader>
          <span v-else class="no-selection">请先选择状态</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope"> 
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <h3 style="margin-top: 30px;">表格二</h3>
    <el-table :data="tableData2" style="width: 100%" border>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="选择状态" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.selected" placeholder="请选择" @change="handleSelectChange2(scope.row)">
            <el-option label="选项1" value="option1"></el-option>
            <el-option label="选项2" value="option2"></el-option>
            <el-option label="选项3" value="option3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="级联选择" min-width="200">
        <template slot-scope="scope">
          <el-cascader
            v-if="scope.row.selected"
            v-model="scope.row.cascadeValue"
            :options="getCascadeOptions(scope.row.selected)"
            :props="cascadeProps"
            placeholder="请选择"
            multiple
          ></el-cascader>
          <span v-else class="no-selection">请先选择状态</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit2(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete2(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer">
      <el-button type="primary" @click="addRow">表格一添加行</el-button>
      <el-button type="primary" @click="addRow2">表格二添加行</el-button>
      <el-button type="info" @click="dialogVisible = true">选择规则</el-button>
      <el-button type="success" @click="handleSubmit">提交</el-button>
    </div>
    
    <!-- 选择规则弹窗 -->
      <el-dialog
      title="选择规则"
      v-model="dialogVisible"
      width="500px"  
    >
      <div class="rule-content">  
        <h4>选择规则说明：</h4>
        <ul>
          <li v-for="(rule, index) in rules" :key="index">
            {{ index + 1 }}. {{ rule }}
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SelectCascadeModule',
  data() {
    return {
      tableData: [
        {
          id: 1,
          selected: '',
          cascadeValue: []
        },
        {
          id: 2,
          selected: '',
          cascadeValue: []
        }
      ],
      tableData2: [
        {
          id: 1,
          selected: '',
          cascadeValue: []
        },
        {
          id: 2,
          selected: '',
          cascadeValue: []
        }
      ],
      dialogVisible: false,
      rules: [
        '选择状态后，级联选择器会显示对应的选项',
        '级联选择器支持多选功能，可选择多个选项',
        '切换选择状态时，级联选择器的选中值会自动清空',
        '两个表格的功能相同，但数据相互独立',
        '点击提交按钮会提交两个表格的数据'
      ],
      cascadeProps: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children',
        multiple: true
      }
    }
  },
  methods: {
    getCascadeOptions(selected) {
        console.log("--------what here option 000 --------", selected)
      const options = {
        option1: [
          {
            value: 'option1-level1-1',
            label: '选项1-一级选项1',
            children: [
              {
                value: 'option1-level2-1',
                label: '选项1-二级选项1-1',
                children: [
                  {
                    value: 'option1-level3-1',
                    label: '选项1-三级选项1-1-1'
                  },
                  {
                    value: 'option1-level3-2',
                    label: '选项1-三级选项1-1-2'
                  }
                ]
              }
            ]
          }
        ],
        option2: [
          {
            value: 'option2-level1-1',
            label: '选项2-一级选项1',
            children: [
              {
                value: 'option2-level2-1',
                label: '选项2-二级选项1-1',
                children: [
                  {
                    value: 'option2-level3-1',
                    label: '选项2-三级选项1-1-1'
                  }
                ]
              },
              {
                value: 'option2-level2-2',
                label: '选项2-二级选项1-2',
                children: [
                  {
                    value: 'option2-level3-2',
                    label: '选项2-三级选项1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        option3: [
          {
            value: 'option3-level1-1',
            label: '选项3-一级选项1',
            children: [
              {
                value: 'option3-level2-1',
                label: '选项3-二级选项1-1',
                children: [
                  {
                    value: 'option3-level3-1',
                    label: '选项3-三级选项1-1-1'
                  },
                  {
                    value: 'option3-level3-2',
                    label: '选项3-三级选项1-1-2'
                  }
                ]
              },
              {
                value: 'option3-level2-2',
                label: '选项3-二级选项1-2',
                children: [
                  {
                    value: 'option3-level3-3',
                    label: '选项3-三级选项1-2-1'
                  }
                ]
              },
              {
                value: 'option3-level2-3',
                label: '选项3-二级选项1-3',
                children: [
                  {
                    value: 'option3-level3-4',
                    label: '选项3-三级选项1-3-1'
                  }
                ]
              }
            ]
          }
        ]
      }
      return options[selected] || []
    },
    addRow() {
      this.tableData.push({
        id: Date.now(),
        selected: '',
        cascadeValue: []
      })
    },
    addRow2() {
      this.tableData2.push({
        id: Date.now(),
        selected: '',
        cascadeValue: []
      })
    },
    handleSelectChange(row) {
      row.cascadeValue = []
    },
    handleSelectChange2(row) {
      row.cascadeValue = []
    },
    handleEdit(row) {
      console.log('编辑行:', row)
    },
    handleEdit2(row) {
      console.log('编辑行2:', row)
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    handleDelete2(index) {
      this.tableData2.splice(index, 1)
    },
    handleSubmit() {
      console.log('提交数据:', { table1: this.tableData, table2: this.tableData2 })
      this.$message.success('提交成功')
    }
  }
}
</script>

<style scoped>
.select-cascade-module {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.table-footer {
  margin-top: 20px;
  text-align: right;
}

.no-selection {
  color: #909399;
  font-size: 14px;
}
</style>