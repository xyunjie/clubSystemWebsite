<template>
  <div class="app-container">
    <div style="text-align: center">
      <el-form ref="form" :model="pageParam" label-width="80px" :inline="true">
        <el-form-item label="">
          <el-input v-model="pageParam.query" clearable placeholder="请输入关键字搜索" style="width: 300px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="clubName"
        label="警告社团"
        align="center"
        width="180"
      />
      <el-table-column
        prop="title"
        label="警告标题"
        align="center"
        width="180"
      />
      <el-table-column
        prop="content"
        label="警告内容"
        align="center"
      />
      <el-table-column
        prop="createdUser.name"
        label="警告者"
        align="center"
        width="150"
      />
      <el-table-column
        prop="createdTime"
        label="警告时间"
        align="center"
        width="180"
      />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      style="margin-top: 1rem; text-align: right"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="添加警告信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="warningForm" :model="warningForm" :rules="rules" label-width="180px" class="demo-ruleForm">
        <el-form-item label="警告社团/组织" prop="clubId">
          <el-select v-model="warningForm.clubId" placeholder="请选择要警告的社团/组织" style="width: 80%">
            <el-option v-for="(item) in clubOption" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="警告标题" prop="title">
          <el-input v-model="warningForm.title" placeholder="请输入警告标题" style="width: 80%" />
        </el-form-item>
        <el-form-item label="警告内容" prop="content">
          <el-input v-model="warningForm.content" placeholder="请输入警告内容" type="textarea" style="width: 80%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保 存</el-button>
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getActivityUserList, getClubWarning,
  modifyActivityStatus,
  removeActivity, saveOrUpdateActivity
} from '@/api/activity'
import { getAllClub } from '@/api/club'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        id: null,
        kind: 'warning',
        query: '',
        isAdmin: false
      },
      activityUserListParam: {
        pageNumber: 1,
        pageSize: 10,
        activityId: null
      },
      warningForm: {
        title: '',
        content: '',
        clubId: '',
        kind: 'warning'
      },
      rules: {
        title: [
          { required: true, message: '请输入警告标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入警告内容', trigger: 'blur' }
        ],
        clubId: [
          { required: true, message: '请选择要警告的社团', trigger: 'blur' }
        ]
      },
      tableData: [],
      total: 0,
      clubOption: [],
      activityUserList: [],
      dialogVisible: false
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    getList(current = 1) {
      this.pageParam.pageNumber = current
      getClubWarning(this.pageParam).then(res => {
        console.log(res)
        this.tableData = res.data
        this.total = res.data.length
      })
    },
    onSubmit() {
      this.getList(this.pageParam.pageNumber)
    },
    onCancel() {
      this.pageParam.dict = []
      this.pageParam.query = ''
    },
    handleCurrentChange(val) {
      this.getList(val)
    },
    handleChangeClass(val) {
      console.log(val, this.pageParam)
    },
    onRemove(val) {
      removeActivity({ id: val }).then(res => {
        // 刷新页面
        this.getList(this.pageParam.pageNumber)
      })
    },
    onHandleUser(val, status) {
      console.log(val, status)
      modifyActivityStatus({ id: val, status: status }).then(res => {
        this.getList(this.pageParam.pageNumber)
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.selectUser = null
    },
    onShowActivityUser(val) {
      this.activityUserListParam.activityId = val
      getActivityUserList(this.activityUserListParam).then(res => {
        this.dialogVisible = true
        this.activityUserList = res.data.records
        console.log(res)
      })
    },
    handleSave() {
      this.$refs['warningForm'].validate((valid) => {
        if (valid) {
          saveOrUpdateActivity(this.warningForm).then(res => {
            this.dialogVisible = false
            this.getList(this.pageParam.pageNumber)
          })
        } else {
          return false
        }
      })
    },
    onAddClubWarning() {
      getAllClub().then(res => {
        this.clubOption = res.data
      })
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

