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
        prop="activityName"
        label="活动名称"
        align="center"
        width="180"
      />
      <el-table-column
        prop="user.name"
        label="报名人员"
        align="center"
      />
      <el-table-column
        prop="user.unitInfo"
        label="报名人员专业班级"
        align="center"
        width="380"
      />
      <el-table-column
        prop="beginTime"
        label="开始时间"
        align="center"
        width="180"
      />
      <el-table-column
        prop="endTime"
        label="结束时间"
        align="center"
        width="180"
      />
      <el-table-column
        prop="createdTime"
        label="报名时间"
        align="center"
        width="180"
      />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="120"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.status === 1">审核通过</el-tag>
          <el-tag v-else-if="row.status === 2" type="danger">审核未通过</el-tag>
          <el-tag v-else-if="row.status === 3">已结束</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="380"
        align="center"
      >
        <template v-slot:default="{ row }">
          <el-button v-if="row.status !== 1" type="success" @click="handleActivityUserClick(row, 1)">通过
          </el-button>
          <el-button v-if="row.status !== 2" type="warning" @click="handleActivityUserClick(row, 2)">驳回</el-button>
          <el-popconfirm
            style="margin-left: 0.7rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该人的报名吗？"
            @confirm="onRemove(row.id)"
          >
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDictListByGrade } from '@/api/dict'
import {
  getMyActivity,
  modifyActivityUserEntry,
  removeActivity, removeActivityUserEntry
} from '@/api/activity'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        id: null,
        kind: 'activity',
        query: '',
        isAdmin: false
      },
      activityUserListParam: {
        pageNumber: 1,
        pageSize: 10,
        activityId: null
      },
      getAdminClubParam: {
        pageNumber: 1,
        pageSize: 10,
        isAdmin: false
      },
      activityForm: {
        kind: 'activity'
      },
      tableData: [],
      total: 0,
      treeOption: [],
      dialogShowUserVisible: false,
      clubOption: [],
      activityUserList: [],
      dialogVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ],
        clubId: [
          { required: true, message: '请选择要公告的社团', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.onSelectGrade()
    this.getList(1)
  },
  methods: {
    getList(current = 1) {
      this.pageParam.pageNumber = current
      getMyActivity(this.pageParam).then(res => {
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
    onSelectGrade(val) {
      getDictListByGrade({ gradeId: val }).then(res => {
        this.treeOption = res.data
      })
    },
    handleActivityUserClick(val, status) {
      modifyActivityUserEntry({ id: val.id, status: status }).then(res => {
        console.log(res)
        this.getList()
      })
    },
    onRemove(val) {
      removeActivityUserEntry({ id: val.id }).then(() => {
        this.getList()
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogShowUserVisible = false
      this.selectUser = null
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

