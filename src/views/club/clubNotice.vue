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
    <div style="" v-if="false">
      <div style="float: right; margin-bottom: 0.5rem">
        <el-button style="" type="primary" @click="onAddClubAdmin">新增</el-button>
        <el-button style="" type="primary" @click="onExport">导出</el-button>
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
          <el-button v-if="row.status !== 1" type="success" @click="onHandleUser(row.id, 1)">通过</el-button>
          <el-button v-if="row.status === 1  || row.status === 0" type="warning" @click="onHandleUser(row.id, 2)">驳回</el-button>
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
      title="添加社团管理员"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-select v-model="selectUser" filterable placeholder="请选择" style="width: 100%">
        <el-option
          v-for="item in addClubAdminOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveAddClubAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, modifyUserRole, removeUser } from '@/api/user'
import { getDictListByGrade } from '@/api/dict'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { getActivityList, modifyActivityStatus, removeActivity } from '@/api/activity'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        id: null,
        kind: 'notice',
        query: ''
      },
      tableData: [],
      total: 0,
      treeOption: [],
      dialogVisible: false,
      selectUser: null,
      addClubAdminOption: []
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
    onHandleUser(val, status) {
      console.log(val, status)
      modifyActivityStatus({ id: val, status: status }).then(res => {
        this.getList(this.pageParam.pageNumber)
      })
    },
    onAddClubAdmin() {
      this.dialogVisible = true
      getUserList({ pageNumber: 1, pageSize: 10000, role: 'user' }).then(res => {
        this.addClubAdminOption = res.data.records
      })
      console.log(this.addClubAdminOption)
    },
    handleClose() {
      this.dialogVisible = false
      this.selectUser = null
    },
    onCloseRole(val, role) {
      modifyUserRole({ id: val, role: role }).then(res => {
        this.getList(this.pageParam.pageNumber)
        this.$message.success(`${role !== 'user' ? '设为' : '取消'}社团管理员成功`)
      })
    },
    saveAddClubAdmin() {
      // 添加
      modifyUserRole({ id: this.selectUser, role: 'clubAdmin' }).then(res => {
        this.getList(this.pageParam.pageNumber)
        this.$message.success(`'设为社团管理员成功`)
      })
      this.getList(this.pageParam.pageNumber)
      this.dialogVisible = false
      this.selectUser = null
    },
    onExport() {
      const token = getToken()
      this.tableLoading = true
      axios({
        url: process.env.VUE_APP_BASE_API + 'api/user/export',
        method: 'post',
        data: this.pageParam,
        responseType: 'blob',
        headers: { token: token }
      })
        .then((res) => {
          // 处理返回的文件流
          const blob = new Blob([res.data], { type: res.data.type })
          // 获取fileName,截取content-disposition的filename；按=分割，取最后一个
          const fileName = new Date().toLocaleDateString()
          const downloadElement = document.createElement('a')
          // 创建下载的链接
          const href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          // 下载后文件名
          downloadElement.download = fileName + '社团管理员.xlsx'
          document.body.appendChild(downloadElement)
          // 点击下载
          downloadElement.click()
          // 下载完成移除元素
          document.body.removeChild(downloadElement)
          // 释放blob
          window.URL.revokeObjectURL(href)
          this.$message.success('导出成功!')
          this.tableLoading = false
        })
        .catch(error => {
          // 请求失败处理
          console.log(error)
          this.$message.error('导出失败!')
          this.tableLoading = false
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

