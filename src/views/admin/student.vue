<template>
  <div class="app-container">
    <el-form ref="form" :model="pageParam" label-width="80px" :inline="true">
      <el-form-item prop="dict" label="筛选">
        <el-cascader
          v-model="pageParam.dict"
          clearable
          placeholder="请选择筛选条件！"
          :options="treeOption"
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'name',
            children: 'children'}"
          @change="handleChangeClass"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="pageParam.query" clearable placeholder="请输入要查询的姓名" style="width: 300px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button style="margin-left: auto; float: right; margin-bottom: 0.5rem" type="primary" @click="onExport">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-loading="tableLoading"
        fixed
        prop="name"
        label="姓名"
        align="center"
        width="100"
      />
      <el-table-column
        prop="studentId"
        label="账号"
        align="center"
        width="150"
      />
      <el-table-column
        prop="sex"
        label="性别"
        align="center"
        width="100"
      >
        <template v-slot:default="{ row }">
          <el-tag v-if="row.sex" type="success">男</el-tag>
          <el-tag v-else type="warning">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"
        width="150"
      />
      <el-table-column
        prop="qq"
        label="QQ号"
        align="center"
        width="150"
      />
      <el-table-column
        prop="weChat"
        label="微信号"
        align="center"
        width="200"
      />
      <el-table-column
        prop="mail"
        label="邮箱"
        align="center"
        width="200"
      />
      <el-table-column
        prop="unitInfo"
        label="班级信息"
        align="center"
        width="300"
      />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="80"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.status === -1" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.status === 0">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        align="center"
        width="150"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.role === 'admin'" type="danger">系统管理员</el-tag>
          <el-tag v-else-if="row.role === 'user'" type="success">用户</el-tag>
          <el-tag v-else-if="row.role === 'clubAdmin'" type="warning">学生组织管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="300"
        align="center"
      >
        <template v-slot:default="{ row }">
          <el-button v-if="row.status !== 0" type="success" @click="onHandleUser(row.id, 0)">通过</el-button>
          <el-button v-if="row.status === 0" type="warning" @click="onHandleUser(row.id, 2)">禁用</el-button>
          <el-popconfirm
            style="margin-left: 1rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该用户吗？"
            @confirm="onRemove(row.id)"
          >
            <el-button slot="reference" type="danger">删除</el-button>
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
  </div>
</template>

<script>
import { getUserList, modifyUserStatus, removeUser } from '@/api/user'
import { getDictListByGrade } from '@/api/dict'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        dict: null,
        query: '',
        role: 'user'
      },
      tableData: [],
      total: 0,
      tableLoading: false,
      treeOption: []
    }
  },
  created() {
    this.onSelectGrade()
    this.getList(1)
  },
  methods: {
    getList(current = 1) {
      this.tableLoading = true
      this.pageParam.pageNumber = current
      getUserList(this.pageParam).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
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
      removeUser({ id: val }).then(res => {
        // 刷新页面
        this.getList(this.pageParam.pageNumber)
      })
    },
    onHandleUser(val, status) {
      modifyUserStatus({ id: val, status: status }).then(res => {
        this.getList(this.pageParam.pageNumber)
      })
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
          downloadElement.download = fileName + '学生列表.xlsx'
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

