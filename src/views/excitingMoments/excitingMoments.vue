<template>
  <div style="width: 100%">
    <el-button type="primary" style="" @click="onAddExcitingMoments">添加精彩瞬间</el-button>
    <div class="card-container">
      <el-card v-for="item in resultData" :key="item.id" :body-style="{ padding: '0px' }" style="margin: 10px 10px 20px;">
        <img :src="item.url" class="image" style="width: 300px; height: 230px">
        <div style="padding: 14px;">
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="remove(item.id)">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="上传图片"
      :visible.sync="showVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-upload
        class="upload-demo"
        action=""
        :http-request="importFile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        multiple
        :limit="1"
        accept="application/image"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button slot="trigger" size="small" type="primary" :disabled="fileList.length >= 1">点击上传
        </el-button>
        <div slot="tip" class="el-upload__tip" style="font-size: 14px">
          推荐图片大小：750*500
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getExcitingMomentsList, removeExcitingMoments, saveExcitingMoments } from '@/api/exciting'
import store from '@/store'
import { uploadFile } from '@/api/public'

export default {
  data() {
    return {
      resultData: [],
      showVisible: false,
      fileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        id: store.getters.userId
      }
      getExcitingMomentsList(param).then(res => {
        this.resultData = res.data
      })
    },
    onAddExcitingMoments() {
      this.showVisible = true
    },
    remove(val) {
      const param = {
        id: val
      }
      removeExcitingMoments(param).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    onSave() {
      // 判空
      if (this.fileList.length === 0) {
        this.$message.warning('请上传附件')
      } else {
        // 提交
        const param = {
          id: store.getters.userId,
          url: this.fileList[0].url
        }
        saveExcitingMoments(param).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功')
            this.showVisible = false
            this.getList()
          } else {
            this.$message.error('上传失败')
          }
        })
      }
    },
    handleClose() {
      this.showVisible = false
    },
    importFile(val) {
      // 文件上传
      const form = new FormData()
      form.append('file', val.file)
      uploadFile(form).then(res => {
        this.fileList.push({ name: val.file.name, url: res.data })
      })
    },
    handleRemove() {
      // 删除
      this.fileList.splice(0)
    },
    handlePreview(file) {
      console.log(this.fileList)
    },
    handleExceed() {
      this.$message.warning(`只可以上传一个附件哦！`)
    },
    beforeUpload(file) {
      const size = file.size / 1024 / 1024
      if (size > 5) {
        this.$notify.warning({
          title: '警告',
          message: '大小必须小于5M'
        })
        return
      }
      this.filename = file.name
    }
  }
}
</script>

<style scoped>
.card-container {
  display: flex; /* 使用 Flexbox 布局 */
  flex-wrap: wrap; /* 当容器宽度不足时自动换行 */
}
</style>
