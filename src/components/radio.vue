<template>
  <div class="q-checkbox">
    <div class="q-title">多选题</div>
    <van-checkbox-group v-model="checkedIds">
      <div v-for="opt in questionFramaVo" :key="opt.id" class="opt-row">
        <van-checkbox
          :name="opt.key"
          shape="square"
          icon-size="18px"
          :disabled="isOptionDisabled(opt)"
          @change="(checked) => onItemChange(opt, checked)"
        >
          <div class="opt-main">
            <span class="opt-key">{{ opt.key }}</span>
            <span class="opt-text">{{ opt.option }}</span>
            <span v-if="opt.isExclu === 1" class="tag tag-exclu">互斥</span>
            <span v-if="opt.custonize === 1" class="tag tag-custom">自定义</span>
          </div>
        </van-checkbox>

        <van-field
          v-if="opt.custonize === 1"
          v-model="customTextById[opt.id]"
          class="opt-field"
          placeholder="请输入..."
          :disabled="!checkedIdsSet.has(opt.id)"
          rows="1"
          autosize
        />
      </div>
    </van-checkbox-group>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Field } from 'vant';

export default {
  // 组件名保留为 radio，避免外部引用断开
  name: 'radio',
  components: {
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup,
    'van-field': Field,
  },
  data() {
    return {
      // van-checkbox-group 的值：选中的 option id 列表
      checkedIds: ['A', 'B'],
      // 最近一次变更的选项 id（用于互斥时保留哪个互斥项）
      lastToggleId: null,
      // custonize=1 的输入内容
      customTextById: {},
      // 题目选项数据
      questionFramaVo: [
        {
          id: '7A1414100D8B4EE2B7990562306FB543',
          num: 0,
          key: 'A',
          revealKey: 'A',
          option: '存在忽视政治生活、政治生活平淡化庸俗化随意化倾向',
          content: null,
          title: '存在忽视政治生活、政治生活平淡化庸俗化随意化倾向',
          custonize: 0,
          quesIds: null,
          questionIds: null,
          isExclu: 0,
          questionDtoas: null,
          questionId: null,
          questionName: null,
        },
        {
          id: '7FACC0445F674D558EC95082529C3D0A',
          num: 1,
          key: 'B',
          revealKey: 'B',
          option: '党组织凝聚力和战斗力还不强',
          content: null,
          title: '党组织凝聚力和战斗力还不强',
          custonize: 0,
          quesIds: null,
          questionIds: null,
          isExclu: 0,
          questionDtoas: null,
          questionId: null,
          questionName: null,
        },
        {
          id: 'BF1C2303C5EC48FFBACFF175A3725EC9',
          num: 2,
          key: 'C',
          revealKey: 'C',
          option: '存在见风使舵、怕得罪人的人和事',
          content: null,
          title: '存在见风使舵、怕得罪人的人和事',
          custonize: 0,
          quesIds: null,
          questionIds: null,
          isExclu: 0,
          questionDtoas: null,
          questionId: null,
          questionName: null,
        },
        {
          id: '946885324846457690F38EBDD6B54AD0',
          num: 3,
          key: 'D',
          revealKey: 'D',
          option: '党员领导干部以上率下带头严肃党内政治生活不够',
          content: null,
          title: '党员领导干部以上率下带头严肃党内政治生活不够',
          custonize: 0,
          quesIds: null,
          questionIds: null,
          isExclu: 1,
          questionDtoas: null,
          questionId: null,
          questionName: null,
        },
        {
          id: 'B8A7E06719FD4135B8E05B25EDCD4DD9',
          num: 4,
          key: 'E',
          revealKey: 'E',
          option: '不存在上述问题',
          content: null,
          title: '不存在上述问题',
          custonize: 0,
          quesIds: null,
          questionIds: null,
          isExclu: 1,
          questionDtoas: null,
          questionId: null,
          questionName: null,
        },
        {
          id: '3503562769D8492093A448F89B896BE5',
          num: 5,
          key: 'F',
          revealKey: 'F',
          option: '其他需反映的问题和意见',
          content: null,
          title: '其他需反映的问题和意见',
          custonize: 1,
          quesIds: null,
          questionIds: null,
          isExclu: 0,
          questionDtoas: null,
          questionId: null,
          questionName: null,
        },
      ],
    };
  },
  computed: {
    checkedIdsSet() {
      return new Set(this.checkedIds);
    },
    customizeIdSet() {
      return new Set(this.questionFramaVo.filter((x) => x.custonize === 1).map((x) => x.id));
    },
    excluIdSet() {
      return new Set(this.questionFramaVo.filter((x) => x.isExclu === 1).map((x) => x.id));
    },
  },
  watch: {
    // v-model 变化时兜底应用规则
    checkedIds: {
      handler(newVal, oldVal) {
        // 找出新增的项作为 lastToggleId，确保互斥逻辑能正确识别“新选中的”是哪一个
        const added = newVal.filter((id) => !oldVal.includes(id));
        if (added.length > 0) {
          this.lastToggleId = added[0];
        }
        this.applyExcluRule();
      },
      deep: true,
    },
  },
  methods: {
    // onItemChange(opt, checked) {
    //   // 这里的 lastToggleId 仍然保留，作为 watch 的补充
    //   this.lastToggleId = opt.id;

    //   // 如果是取消互斥项，需要立即恢复可多选
    //   if (!checked && opt.isExclu === 1) {
    //     this.applyExcluRule();
    //   }
    // },
    applyExcluRule() {  
      // 要求：
      // - isExclu=0：正常多选
      // - isExclu=1：只能选中“该项”及 custonize=1 的数据
      //
      // 实现：
      // - 只要当前选中集合中存在任意互斥项，则：
      //   - 互斥项只允许保留一个：优先保留 lastToggleId（如果它是互斥且仍被选中）
      //   - 再保留所有已选中的 custonize=1 项

      const selected = new Set(this.checkedIds);
      const selectedExcluIds = this.questionFramaVo
        .filter((x) => x.isExclu === 1 && selected.has(x.id))
        .map((x) => x.id);

      if (selectedExcluIds.length === 0) return;

      let keepExcluId = selectedExcluIds[0];
      if (
        this.lastToggleId &&
        this.excluIdSet.has(this.lastToggleId) &&
        selected.has(this.lastToggleId)
      ) {
        keepExcluId = this.lastToggleId;
      }

      const next = new Set();
      next.add(keepExcluId);
      for (const id of selected) {
        if (this.customizeIdSet.has(id)) next.add(id);
      }

      const nextArr = Array.from(next);
      // 避免重复触发 watch 的死循环：仅当内容变更时再赋值
      if (nextArr.length !== this.checkedIds.length || nextArr.some((id) => !selected.has(id))) {
        this.checkedIds = nextArr;
      }
    },
    isOptionDisabled(opt) {
      // 检查当前选中的项中是否有互斥项
      const selectedExcluId = this.checkedIds.find(id => this.excluIdSet.has(id));
      
      if (selectedExcluId) {
        // 如果有选中的互斥项，且当前选项不是该选中的互斥项，也不是自定义项，则禁用
        // (这意味着其他互斥项、以及所有普通项都会被禁用)
        return opt.id !== selectedExcluId && opt.custonize !== 1;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.q-checkbox {
  padding: 12px;
}

.q-title {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.opt-row {
  padding: 10px 0;
  border-bottom: 1px solid #f2f3f5;
}

.opt-main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.4;
}

.opt-key {
  min-width: 18px;
  font-weight: 600;
  color: #323233;
}

.opt-text {
  flex: 1;
  color: #323233;
  font-size: 14px;
}

.tag {
  flex: none;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
  line-height: 16px;
}

.tag-exclu {
  background: #fff7e8;
  color: #fa8c16;
}

.tag-custom {
  background: #eef5ff;
  color: #1677ff;
}

.opt-field {
  margin-top: 8px;
}
</style>