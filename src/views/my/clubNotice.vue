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
    <div>
      <div style="float: right; margin-bottom: 0.5rem">
        <el-button style="" type="primary" @click="onAddClubNotice">新增</el-button>
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
        label="公告标题"
        align="center"
        width="180"
      />
      <el-table-column
        prop="content"
        label="公告内容"
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
        prop="top"
        label="是否置顶"
        align="center"
        width="150"
      >
        <template v-slot:default="{ row }">
          <el-tag>{{ row.top ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        align="center"
        width="200"
      >
        <template v-slot:default="{row}">
          <el-tag>{{ row.sort }}</el-tag>
        </template>
      </el-table-column>
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
        width="300"
        align="center"
      >
        <template v-slot:default="{ row }">
          <el-button type="primary" @click="onShowDetail(row)">查看</el-button>
          <el-popconfirm
            style="margin-left: 0.7rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该公告吗？"
            @confirm="onRemove(row.id)"
          >
            <el-button v-if="row.createdBy === userId" slot="reference" type="danger">删除公告</el-button>
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
      <el-form ref="noticeForm" :model="noticeForm" :rules="rules" label-width="180px" class="demo-ruleForm">
        <el-form-item label="选择社团" prop="clubId">
          <el-select v-model="noticeForm.clubId" placeholder="请选择要公告的社团/组织" style="width: 80%">
            <el-option v-for="(item) in clubOption" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
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
    <el-dialog
      title="公告详情"
      :visible.sync="dialogDetailVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="1" border direction="vertical" :label-style="{textAlign: 'center'}" :content-style="{textAlign: 'center'}">
        <el-descriptions-item>
          <template slot="label">
            公告标题
          </template>
          {{ showNoticeDetail.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            公告内容
          </template>
          {{ showNoticeDetail.content }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDictListByGrade } from '@/api/dict'
import { getActivityList, removeActivity, saveOrUpdateActivity } from '@/api/activity'
import { getMyClub } from '@/api/club'
import store from '@/store'

export default {
  data() {
    return {
      userId: store.getters.userId,
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        id: null,
        kind: 'notice',
        query: '',
        isAdmin: true
      },
      getAdminClubParam: {
        pageNumber: 1,
        pageSize: 10,
        isAdmin: false
      },
      tableData: [],
      total: 0,
      treeOption: [],
      dialogVisible: false,
      dialogDetailVisible: false,
      showNoticeDetail: {},
      selectUser: null,
      addClubAdminOption: [],
      clubOption: [],
      noticeForm: {},
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
        ]
      }
    }
  },
  created() {
    this.onSelectGrade()
    this.getList(1)
    console.log(this.userId)
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
    handleCurrentChange(val) {
      this.getList(val)
    },
    onShowDetail(val) {
      this.dialogDetailVisible = true
      this.showNoticeDetail = val
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
    onAddClubNotice() {
      this.dialogVisible = true
      this.onGetMyAdminClub()
    },
    handleClose() {
      this.dialogVisible = false
      this.selectUser = null
      this.dialogDetailVisible = false
    },
    handleSave() {
      this.$refs.noticeForm.validate((valid) => {
        if (valid) {
          saveOrUpdateActivity(this.noticeForm).then(res => {
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

