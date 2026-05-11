<template>
  <div class="upload-module">
    <el-card class="module-card" shadow="hover">
      <div slot="header" class="module-header">
        <span class="module-title">上传模块</span>
      </div>
      <div class="module-content">
        <el-button type="primary" @click="dialogVisible = true">
          打开上传弹窗
        </el-button>
      </div>
    </el-card>

    <el-dialog
      title="文件导入与上传"
      :visible.sync="dialogVisible"
      width="90%"
      :close-on-click-modal="false"
      @open="clearFiles"
      class="upload-dialog"
    >
      <div class="upload-container">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :on-progress="handleProgress"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :auto-upload="true"
          :show-file-list="false"
          accept=".doc,.docx"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传 doc/docx 文件，且不超过 10MB
          </div>
        </el-upload>

        <div v-if="fileList.length > 0" class="file-status-list">
          <div v-for="file in fileList" :key="file.uid" class="file-item">
            <div class="file-info">
              <i class="el-icon-document"></i>
              <span class="file-name" :title="file.name">{{ file.name }}</span>
              <span class="file-size">({{ (file.size / 1024).toFixed(2) }} KB)</span>
            </div>
            <div v-if="file.status === 'uploading'" class="file-progress">
              <el-progress :percentage="file.percentage" :stroke-width="4"></el-progress>
            </div>
            <div v-if="file.status === 'success'" class="file-result success">
              <i class="el-icon-circle-check"></i> 上传成功
            </div>
            <div v-if="file.status === 'fail'" class="file-result error">
              <i class="el-icon-circle-close"></i> 上传失败
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="clearFiles" v-if="fileList.length > 0">清空列表</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadModule',
  data() {
    return {
      dialogVisible: false,
      fileList: []
    };
  },
  methods: {
    // 文件状态改变时的钩子
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    // 上传文件之前的钩子
    beforeUpload(file) {
      const isDoc = file.name.endsWith('.doc') || file.name.endsWith('.docx');
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isDoc) {
        this.$message.error('只能上传 doc 或 docx 格式的文件！');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB！');
        return false;
      }
      return true;
    },
    // 文件上传时的钩子
    handleProgress(event, file, fileList) {
      this.fileList = [...fileList];
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      this.$message({
        message: `${file.name} 上传成功`,
        type: 'success'
      });
      this.fileList = [...fileList];
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error(`${file.name} 上传失败`);
      this.fileList = [...fileList];
    },
    // 清空文件列表
    clearFiles() {
      this.fileList = [];
    }
  }
};
</script>

<style scoped>
.upload-module {
  margin-top: 20px;
}

.module-card {
  width: 100%;
}

.module-title {
  font-size: 18px;
  font-weight: 600;
}

.module-content {
  padding: 20px;
  text-align: center;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.upload-demo {
  width: 100%;
}

/deep/ .el-upload-dragger {
  width: 100%;
}

.file-status-list {
  width: 100%;
  margin-top: 20px;
  max-height: 250px;
  overflow-y: auto;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
}

.file-item {
  padding: 10px;
  border-bottom: 1px solid #f2f6fc;
}

.file-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.file-name {
  flex: 1;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.file-progress {
  margin-top: 5px;
}

.file-result {
  font-size: 12px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.file-result.success {
  color: #67c23a;
}

.file-result.error {
  color: #f56c6c;
}

/* 移动端弹窗宽度优化 */
@media screen and (max-width: 768px) {
  /deep/ .el-dialog {
    width: 95% !important;
  }
}
</style>
