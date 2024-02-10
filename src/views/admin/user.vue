<template>
  <div class="app-container">
    <el-form ref="form" :model="pageParam" label-width="80px" :inline="true">
      <el-form-item prop="dict" label="筛选" required>
        <el-cascader
          v-model="pageParam.dict"
          placeholder="请选择筛选条件！"
          :options="treeOption"
          :props="{
            value: 'id',
            label: 'name',
            children: 'children'}"
          @change="handleChangeClass"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="pageParam.name" placeholder="请输入要查询的姓名" style="width: 300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="name"
        label="姓名"
        align="center"
      />
      <el-table-column
        prop="studentId"
        label="账号"
        align="center"
      />
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"
      />
      <el-table-column
        prop="qq"
        label="QQ号"
        align="center"
      />
      <el-table-column
        prop="weChat"
        label="微信号"
        align="center"
      />
      <el-table-column
        prop="mail"
        label="邮箱"
        align="center"
      />
      <el-table-column
        prop="classes"
        label="班级"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.status === -1" type="danger">待审核</el-tag>
          <el-tag v-else-if="row.status === 0">正常</el-tag>
          <el-tag v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        align="center"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.role === 'admin'" type="danger">系统管理员</el-tag>
          <el-tag v-else-if="row.role === 'user'" type="success">用户</el-tag>
          <el-tag v-else-if="row.role === 'clubAdmin'" type="warning">社团管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
      >
        <template>
          <el-button type="warning" icon="el-icon-star-off" circle />
          <el-button type="danger" icon="el-icon-delete" circle />
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
import { getUserList } from '@/api/user'
import { getDictListByGrade } from '@/api/dict'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        dict: '',
        query: ''
      },
      tableData: [],
      total: 0,
      treeOption: []
    }
  },
  created() {
    this.onSelectGrade()
    this.getList(1)
  },
  methods: {
    getList(current = 1) {
      this.pageParam.pageNumber = current
      getUserList(this.pageParam).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleCurrentChange(val) {
      this.getList(val)
    },
    handleChangeClass(val) {
      console.log(val)
    },
    onSelectGrade(val) {
      getDictListByGrade({ gradeId: val }).then(res => {
        this.treeOption = res.data
        console.log(this.treeOption)
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

