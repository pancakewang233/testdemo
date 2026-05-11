<template>
  <div class="update-module">
    <el-card class="module-card" shadow="hover">
      <div slot="header" class="module-header">
        <span class="module-title">更新模块</span>
      </div>
      <div class="module-content">
        <el-button :type="updating ? 'info' : 'primary'" @click="startUpdate" :disabled="updating">
          {{ updating ? '正在更新中...' : '点击更新' }}
        </el-button>
        <div v-if="updating || progress === 100" class="progress-container">
          <el-progress :percentage="progress" :color="progress < 100 ? '#909399' : '#dd2c34'"></el-progress>
          <p v-if="progress === 100">更新完成！</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UpdateModule',
  data() {
    return {
      updating: false,
      progress: 0,
      progressStatus: null, // success, exception, warning
      timer: null
    };
  },
  methods: {
    startUpdate() {
      this.updating = true;
      this.progress = 0;
      this.progressStatus = null;

      this.timer = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 10;
        } else {
          clearInterval(this.timer);
          this.progressStatus = 'success';
          this.updating = false; // 更新完成后按钮可再次点击
        }
      }, 300); // 每300毫秒增加10%进度
    },
    resetUpdate() {
      clearInterval(this.timer);
      this.updating = false;
      this.progress = 0;
      this.progressStatus = null;
    }
  },
  beforeDestroy() {
    this.resetUpdate();
  }
};
</script>

<style scoped>
.update-module {
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
  padding: 20px;
  text-align: center;
}

.progress-container {
  margin-top: 20px;
}

.progress-container p {
  margin-top: 10px;
  font-size: 14px;
  color: #67c23a;
}
</style>
