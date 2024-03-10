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
    <div style="">
      <div style="float: right; margin-bottom: 0.5rem">
        <el-button style="" type="primary" @click="onAddClubWarning">新增</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="公告标题"
        align="center"
        width="180"
      />
      <el-table-column
        prop="content"
        label="公告内容"
        align="center"
      />
      <el-table-column
        prop="createdUser.name"
        label="公告发布者"
        align="center"
        width="150"
      />
      <el-table-column
        prop="createdTime"
        label="公告发布时间"
        align="center"
        width="180"
      />
      <el-table-column
        label="操作"
        align="center"
        width="120"
      >
        <template v-slot:default="{ row }">
          <el-popconfirm
            style="margin-left: 0.7rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该公告吗？"
            @confirm="onRemove(row.id)"
          >
            <el-button slot="reference" type="danger">删除公告</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      style="margin-top: 1rem; text-align: right"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="添加公告信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="noticeForm" :model="noticeForm" :rules="rules" label-width="180px" class="demo-ruleForm">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="noticeForm.title" placeholder="请输入公告标题" style="width: 80%" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="noticeForm.content" placeholder="请输入公告内容" type="textarea" style="width: 80%" />
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
  getActivityList,
  removeActivity, saveOrUpdateActivity
} from '@/api/activity'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        id: null,
        kind: 'system_notice',
        query: '',
        isAdmin: true
      },
      activityUserListParam: {
        pageNumber: 1,
        pageSize: 10,
        activityId: null
      },
      noticeForm: {
        title: '',
        content: '',
        clubId: '',
        kind: 'system_notice'
      },
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      },
      tableData: [],
      total: 0,
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
      getActivityList(this.pageParam).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    onSubmit() {
      this.getList(this.pageParam.pageNumber)
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
    handleClose() {
      this.dialogVisible = false
      this.selectUser = null
    },
    handleSave() {
      this.$refs['noticeForm'].validate((valid) => {
        if (valid) {
          saveOrUpdateActivity(this.noticeForm).then(res => {
            this.dialogVisible = false
            this.getList(this.pageParam.pageNumber)
          })
        } else {
          return false
        }
      })
    },
    onAddClubWarning() {
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

