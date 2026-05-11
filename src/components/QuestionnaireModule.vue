<template>
  <div class="questionnaire-module">
    <el-card class="module-card" shadow="hover">
      <div slot="header" class="module-header">
        <span class="module-title">问卷模块</span>
      </div>

      <div class="module-content">
        <div class="debug-flag">问卷模块已渲染</div>
        <Radio />
      </div>
    </el-card>
  </div>
</template>

<script>
import Radio from './radio.vue';

export default {
  name: 'QuestionnaireModule',
  components: {
    Radio,
  },
};
</script>

<style scoped>
.questionnaire-module {
  margin-top: 20px;
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

.module-content {
  padding: 8px 0;
}

.debug-flag {
  padding: 8px 12px;
  margin: 0 0 8px;
  background: #eef5ff;
  color: #1677ff;
  border-radius: 8px;
  font-size: 12px;
}
</style>
