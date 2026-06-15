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
          accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.txt,.zip,.rar"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            支持 doc/docx/pdf/xls/xlsx/ppt/pptx/jpg/png/gif/mp4/mp3/txt/zip/rar 等格式，单个文件不超过 50MB
          </div>
        </el-upload>

        <div v-if="fileList.length > 0" class="file-status-list">
          <div v-for="file in fileList" :key="file.uid" class="file-item">
            <div class="file-info">
              <i :class="fileIcon(file)"></i>
              <span class="file-name" :title="file.name">{{ file.name }}</span>
              <span class="file-size">({{ formatFileSize(file.size) }})</span>
              <el-button
                v-if="canPreview(file)"
                type="text"
                size="mini"    
                class="preview-btn"
                @click="previewFile(file)"
              >
                <i class="el-icon-view"></i> 预览
              </el-button>
            </div>
            <div v-if="file.status === 'uploading'" class="file-progress">
              <el-progress :percentage="Math.round(file.percentage)" :stroke-width="4"></el-progress>
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
      const validTypes = [
        '.doc', '.docx', '.pdf', '.xls', '.xlsx',
        '.ppt', '.pptx', '.jpg', '.jpeg', '.png',
        '.gif', '.mp4', '.mp3', '.txt', '.zip', '.rar'
      ];
      const isValidType = validTypes.some(ext => file.name.toLowerCase().endsWith(ext));
      const isLt50M = file.size / 1024 / 1024 < 50;

      if (!isValidType) {
        this.$message.error('不支持的文件格式！');
        return false;
      }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB！');
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
    },
    // 获取文件图标
    fileIcon(file) {
      const name = file.name.toLowerCase();
      if (name.endsWith('.doc') || name.endsWith('.docx')) return 'el-icon-document';
      if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'el-icon-s-data';
      if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'el-icon-data-board';
      if (name.endsWith('.pdf')) return 'el-icon-reading';
      if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) return 'el-icon-picture';
      if (name.endsWith('.mp4')) return 'el-icon-video-camera';
      if (name.endsWith('.mp3')) return 'el-icon-headset';
      if (name.endsWith('.txt')) return 'el-icon-tickets';
      if (name.endsWith('.zip') || name.endsWith('.rar')) return 'el-icon-folder-opened';
      return 'el-icon-document';
    },
    // 格式化文件大小
    formatFileSize(size) {
      if (size < 1024) return size + ' B';
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
      return (size / 1024 / 1024).toFixed(2) + ' MB';
    },
    // 判断是否可预览
    canPreview(file) {
      const name = file.name.toLowerCase();
      return name.endsWith('.pdf') ||
             name.endsWith('.jpg') || name.endsWith('.jpeg') ||
             name.endsWith('.png') || name.endsWith('.gif') ||
             name.endsWith('.mp4') || name.endsWith('.mp3') ||
             name.endsWith('.txt') ||
             name.endsWith('.doc') || name.endsWith('.docx') ||
             name.endsWith('.xls') || name.endsWith('.xlsx') ||
             name.endsWith('.ppt') || name.endsWith('.pptx') ||
             name.endsWith('.zip') || name.endsWith('.rar');  
    },
    // 预览文件
    previewFile(file) {
      const name = file.name.toLowerCase();
      const url = file.url || URL.createObjectURL(file.raw);

      // 浏览器原生支持的格式
      if (name.endsWith('.pdf') || name.endsWith('.jpg') || name.endsWith('.jpeg') ||
          name.endsWith('.png') || name.endsWith('.gif') || name.endsWith('.txt')) {
        window.open(url, '_blank');
        return;
      }

      // 视频/音频格式
      if (name.endsWith('.mp4') || name.endsWith('.mp3')) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>${file.name}</title></head>
              <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#000;">
                <${name.endsWith('.mp4') ? 'video' : 'audio'} controls autoplay style="max-width:100%;max-height:100%;">
                  <source src="${url}" type="${name.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg'}">
                  您的浏览器不支持播放该文件
                </${name.endsWith('.mp4') ? 'video' : 'audio'}>
              </body>
            </html>
          `);
        }
        return;
      }

      // Office 文档 / 压缩包：使用 KKFileView 预览
      const BASE_URL = 'http://localhost:8080';
      const formData = new FormData();
      formData.append('file', file.raw);
      
      fetch(`${BASE_URL}/api/preview/upload`, {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 200 && data.data && data.data.previewUrl) {
            window.open(data.data.previewUrl, '_blank');
          } else {
            this.$message.error('获取预览链接失败');
          }
        })
        .catch(err => {
          this.$message.error('预览服务异常');
          console.error(err);
        });
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

.preview-btn {
  margin-left: 8px;
  color: #409eff;
}

.preview-btn:hover {
  color: #66b1ff;
}

/* 移动端弹窗宽度优化 */
@media screen and (max-width: 768px) {
  /deep/ .el-dialog {
    width: 95% !important;
  }
}
</style>
