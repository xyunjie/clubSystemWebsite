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
        <el-button style="" type="primary" @click="onAddClubActivity">新增</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="clubName"
        label="社团名称"
        align="center"
        width="180"
      />
      <el-table-column
        prop="title"
        label="活动标题"
        align="center"
        width="180"
      />
      <el-table-column
        prop="content"
        label="活动内容"
        align="center"
        width="280"
      >
        <template v-slot:default="{ row }">
          <span>
            {{ row.content.length > 10 ? row.content.substring(0, 30) + '...' : row.content }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdUser.name"
        label="创建者"
        align="center"
        width="150"
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
        label="创建时间"
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
          <el-button type="success" @click="onShowActivityUser(row.id)">查看人员</el-button>
          <el-popconfirm
            style="margin-left: 0.7rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该活动吗？"
            @confirm="onRemove(row.id)"
          >
            <el-button slot="reference" type="danger">删除活动</el-button>
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
      title="添加社团公告"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="activityForm" :model="activityForm" :rules="rules" label-width="180px" class="demo-ruleForm">
        <el-form-item label="选择社团" prop="clubId">
          <el-select v-model="activityForm.clubId" placeholder="请选择活动社团" style="width: 80%">
            <el-option v-for="(item) in clubOption" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="activityForm.title" placeholder="请输入活动标题" style="width: 80%" />
        </el-form-item>
        <el-form-item label="活动描述" prop="content">
          <el-input v-model="activityForm.content" placeholder="请输入活动描述" type="textarea" style="width: 80%" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="activityForm.beginTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="activityForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保 存</el-button>
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="活动参与人员"
      :visible.sync="dialogShowUserVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-table
        :data="activityUserList"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="user.name"
          label="姓名"
          width="150"
          align="center"
        />
        <el-table-column
          prop="user.studentId"
          label="学号/账号"
          width="140"
          align="center"
        />
        <el-table-column
          prop="user.collegeName"
          label="学院"
          width="140"
          align="center"
        />
        <el-table-column
          prop="user.majorName"
          label="专业"
          width="140"
          align="center"
        />
        <el-table-column
          prop="clazzName"
          label="班级"
          width="180"
          align="center"
        />
        <el-table-column
          prop="user.sexName"
          label="性别"
          width="120"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="120"
          align="center"
        >
          <template v-slot:default="{row}">
            <el-tag v-if="row.status === 1" type="success">审核通过</el-tag>
            <el-tag v-if="row.status === 0" type="warning">待审核</el-tag>
            <el-tag v-if="row.status === 2" type="danger">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="报名时间"
          align="center"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDictListByGrade } from '@/api/dict'
import {
  getActivityList,
  getActivityUserList,
  modifyActivityStatus,
  removeActivity, saveOrUpdateActivity
} from '@/api/activity'
import { getMyClub } from '@/api/club'

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
      getActivityList(this.pageParam).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    onSubmit() {
      this.getList(this.pageParam.pageNumber)
    },
    onAddClubActivity() {
      this.dialogVisible = true
      this.onGetMyAdminClub()
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
    onRemove(val) {
      removeActivity({ id: val }).then(res => {
        // 刷新页面
        this.getList(this.pageParam.pageNumber)
      })
    },
    onGetMyAdminClub() {
      getMyClub(this.getAdminClubParam).then(res => {
        this.clubOption = res.data.records.map(item => {
          return {
            key: item.name,
            value: item.id
          }
        })
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
      this.dialogShowUserVisible = false
      this.selectUser = null
    },
    onShowActivityUser(val) {
      this.activityUserListParam.activityId = val
      getActivityUserList(this.activityUserListParam).then(res => {
        this.dialogShowUserVisible = true
        this.activityUserList = res.data.records
        console.log(res)
      })
    },
    handleSave() {
      this.$refs.activityForm.validate((valid) => {
        if (valid) {
          saveOrUpdateActivity(this.activityForm).then(res => {
            this.dialogVisible = false
            this.getList(this.pageParam.pageNumber)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

