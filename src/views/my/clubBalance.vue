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
      <div style="margin-left: auto; float: right; margin-bottom: 0.5rem">
        <el-button style="" type="primary" @click="onAddClubBalance">新增</el-button>
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
        prop="userName"
        label="创建者"
        align="center"
        width="180"
      />
      <el-table-column
        prop="amount"
        label="交易金额"
        align="center"
      >
        <template v-slot:default="{row}">
          <el-tag v-if="row.amount < 0" type="danger"> {{ row.amount }} 元 </el-tag>
          <el-tag v-else type="success"> {{ row.amount }} 元 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="balance"
        label="交易后余额"
        align="center"
      >
        <template v-slot:default="{row}">
          <el-tag type=""> {{ row.balance }} 元 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
      />
      <el-table-column
        prop="createdTime"
        label="创建时间"
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
      title="添加社团财务明细"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="balanceForm" :model="balanceForm" :rules="rules" label-width="180px" class="demo-ruleForm">
        <el-form-item label="社团" prop="clubId">
          <el-select v-model="balanceForm.clubId" placeholder="请选择要添加的社团/组织" style="width: 80%">
            <el-option v-for="(item) in clubOption" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="balanceForm.amount" :min="-100" :max="100" label="描述文字" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="balanceForm.remark" placeholder="请输入备注" type="textarea" style="width: 80%" />
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
import { getClubBalanceList, getMyClub, saveClubBalance } from '@/api/club'

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
      getAdminClubParam: {
        pageNumber: 1,
        pageSize: 10,
        isAdmin: false
      },
      activityUserListParam: {
        pageNumber: 1,
        pageSize: 10,
        activityId: null
      },
      balanceForm: {
        clubId: '',
        amount: 0,
        remark: ''
      },
      rules: {
        clubId: [
          { required: true, message: '请选择要添加的社团', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' | 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' | 'change' }
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
      getClubBalanceList(this.pageParam).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    onAddClubBalance() {
      this.dialogVisible = true
      this.onGetMyAdminClub()
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
    handleClose() {
      this.dialogVisible = false
      this.selectUser = null
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
    handleSave() {
      this.$refs['balanceForm'].validate((valid) => {
        if (valid) {
          saveClubBalance(this.balanceForm).then(res => {
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

