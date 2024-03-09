<template>
  <div class="app-container">
    <el-form ref="form" :model="pageParam" label-width="80px" :inline="true" style="text-align: center">
      <el-form-item label="查询">
        <el-input v-model="pageParam.query" clearable placeholder="请输入关键字查询！" style="width: 300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-loading="tableLoading"
        fixed
        prop="name"
        label="社团名称"
        align="center"
        width="150"
      />
      <el-table-column
        prop="description"
        label="社团介绍"
        align="center"
        width="500"
      />
      <el-table-column
        prop="createdUser.name"
        label="社团创建者"
        align="center"
        width="150"
      />
      <el-table-column
        prop="money"
        label="所需社费"
        align="center"
        width="100"
      >
        <template v-slot:default="{ row }">
          <el-tag type="success">
            {{ row.money }} 元
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="加入状态"
        align="center"
        width="150"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.joinStatus === -1" type="success">社团部长</el-tag>
          <el-tag v-if="row.joinStatus === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.joinStatus === 1">审核通过</el-tag>
          <el-tag v-else-if="row.joinStatus === 2" type="danger">审核未通过</el-tag>
          <el-tag v-else-if="row.joinStatus === 3" type="warning">修改信息待审核</el-tag>
          <el-tag v-else-if="row.joinStatus === 4" type="danger">已封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="社团创建时间"
        align="center"
        width="180"
      />
      <el-table-column
        prop="memberCount"
        label="社团总人数"
        align="center"
        width="150"
      />
      <el-table-column
        prop="balance"
        label="剩余资金"
        align="center"
        width="150"
      >
        <template v-slot:default="{ row }">
          <el-tag type="success">
            {{ row.balance }} 元
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="appendix"
        label="附件信息"
        align="center"
        width="200"
      >
        <template v-slot:default="{ row }">
          <el-button
            :disabled="row.appendix === null ||row.appendix === ''"
            type="primary"
            @click="onDownload(row.appendix)"
          >点击下载
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="450"
        align="center"
      >
        <template v-slot:default="{ row }">
          <el-button v-if="row.joinStatus === 1 || row.joinStatus === -1" type="primary" @click="onShowClubUserInfo(row)">查看成员</el-button>
          <el-button v-if="row.joinStatus === 1 || row.joinStatus === -1" type="primary" @click="onClubBalanceDetail(row)">资产详情</el-button>
          <el-popconfirm
            style="margin-left: 0.6rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            :title="row.joinStatus === -1 ? '你确定要解散该社团吗？？' : '你确定要退出该社团吗？？'"
            @confirm="onRemove(row.id)"
          >
            <el-button slot="reference" type="danger">
              {{ row.joinStatus === -1 ? '解散' : '退出' }}
            </el-button>
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
      title="添加社团"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="社团名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入社团名称！" maxlength="50" />
          </el-form-item>
          <el-form-item label="社团介绍" prop="description">
            <el-input v-model="form.description" type="textarea" placeholder="请输入社团介绍内容！" maxlength="200" />
          </el-form-item>
          <el-form-item label="社长" prop="createdBy">
            <el-select v-model="form.createdBy" clearable filterable placeholder="请选择社长" style="width: 100%">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所需社费" prop="money">
            <el-input-number v-model="form.money" :min="0" :max="200" label="所需社费" @change="handleChange" />
          </el-form-item>
          <el-form-item label="辅助材料">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="importFile"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              multiple
              :limit="1"
              accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button slot="trigger" size="small" type="primary" :disabled="fileList.length >= 1">点击上传
              </el-button>
              <el-button type="text" style="margin-left: 0.8rem" @click="onDownloadTemplate">下载模板</el-button>
              <div slot="tip" class="el-upload__tip" style="font-size: 14px">
                只能上传
                <span style="color: red">WORD / PDF</span>
                格式文件，且不超过
                <span style="color: red">
                  5MB
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onSaveClub">添 加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="showClubTitle"
      :visible.sync="showClubUserDialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        :data="showClubUserList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
          align="center"
        />
        <el-table-column
          prop="sex"
          label="性别"
          width="180"
          align="center"
        >
          <template v-slot:default="{ row }">
            <el-tag type="primary">{{ row.sex ? '男' : '女' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="unitInfo"
          label="班级信息"
          align="center"
        />
        <el-table-column
          prop="clubStatus"
          label="加入状态"
          align="center"
        >
          <template v-slot:default="{ row }">
            <el-tag v-if="row.clubStatus === -1" type="success">社团部长</el-tag>
            <el-tag v-if="row.clubStatus === 0" type="warning">申请中</el-tag>
            <el-tag v-if="row.clubStatus === 1" type="primary">社员</el-tag>
            <el-tag v-if="row.clubStatus === 2" type="danger">拒绝</el-tag>
            <el-tag v-if="row.clubStatus === 3" type="danger">退出</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template v-slot:default="{ row }">
            <el-button type="danger" icon="el-icon-delete" circle @click="onRemoveClubUser(row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="showUserTotal"
        style="margin-top: 1rem; text-align: right"
        @current-change="handleCurrentChangeShowClubUser"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="资产详情"
      :visible.sync="balanceDetailVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        :data="balanceDetailList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="userName"
          label="成员"
          width="180"
          align="center"
        />
        <el-table-column
          prop="amount"
          label="交易金额"
          width="180"
          align="center"
        >
          <template v-slot:default="{ row }">
            <el-tag v-if="row.amount < 0" type="danger"> {{ row.amount }}元 </el-tag>
            <el-tag v-else type="primary"> {{ row.amount }}元 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          label="余额"
          align="center"
        >
          <template v-slot:default="{ row }">
            <el-tag v-if="row.amount < 100" type="danger"> {{ row.balance }}元 </el-tag>
            <el-tag v-else type="primary"> {{ row.balance }}元 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        />
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="showUserTotal"
        style="margin-top: 1rem; text-align: right"
        @current-change="handleCurrentChangeBalanceDetail"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getClubUser, getUserList } from '@/api/user'
import { getDictListByGrade } from '@/api/dict'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import {
  getClubBalance,
  getMyClub,
  modifyClubStatus,
  removeClub,
  removeClubUser,
  saveOrUpdateClub
} from '@/api/club'
import { uploadFile } from '@/api/public'

export default {
  data() {
    return {
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        dict: null,
        query: '',
        role: 'user',
        isAdmin: false
      },
      form: {
        name: '',
        description: '',
        money: 10,
        createdBy: null
      },
      tableData: [],
      total: 0,
      tableLoading: false,
      treeOption: [],
      dialogVisible: false,
      fileList: [],
      showClubUserList: [],
      showClubUserDialogVisible: false,
      showClubTitle: '人员详情',
      showClubInfoPage: {
        pageNumber: 1,
        pageSize: 10,
        query: '',
        clubId: null
      },
      balancePage: {
        pageNumber: 1,
        pageSize: 10,
        query: '',
        clubId: null
      },
      balanceDetailList: [],
      balanceDetailVisible: false,
      showUserTotal: 0,
      userList: [],
      rules: {
        name: [
          { required: true, message: '请输入社团名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入社团介绍', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入所需社费金额', trigger: 'blur' }
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
      this.tableLoading = true
      this.pageParam.pageNumber = current
      getMyClub(this.pageParam).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    onSubmit() {
      this.tableData = []
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
    onRemove(val) {
      removeClub({ id: val }).then(res => {
        // 刷新页面
        this.getList(this.pageParam.pageNumber)
      })
    },
    onHandleClub(val, status) {
      modifyClubStatus({ id: val, status: status }).then(res => {
        this.getList(this.pageParam.pageNumber)
      })
    },
    onAddClub() {
      this.dialogVisible = true
      getUserList({ pageNumber: 1, pageSize: 10000, role: 'user' }).then(res => {
        this.userList = res.data.records
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.showClubUserDialogVisible = false
      this.balanceDetailVisible = false
    },
    onSaveClub() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          // 开启全屏遮罩
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255,255,255,0.8)'
          })
          //  模拟异步请求
          if (this.fileList.length > 0) {
            this.form.appendix = this.fileList[0].url
          }
          saveOrUpdateClub(this.form).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
            }
            loading.close()
            this.getList(this.pageParam.pageNumber)
            this.dialogVisible = false
          }).catch(() => {
            loading.close()
          })
        } else {
          return false
        }
      })
    },
    handleChange(val) {
      this.form.money = val
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
    async getShowUserList(current = 1) {
      this.showClubInfoPage.pageNumber = current
      const res = await getClubUser(this.showClubInfoPage)
      this.showClubUserList = res.data.records
      this.showUserTotal = res.data.total
    },
    async getBalanceDetailList(current = 1) {
      this.balancePage.pageNumber = current
      getClubBalance(this.balancePage).then(res => {
        this.balanceDetailList = res.data.records
        this.balanceDetailVisible = true
      })
    },
    async onShowClubUserInfo(val) {
      this.showClubTitle = val.name + '的成员列表'
      this.showClubInfoPage.clubId = val.id
      await this.getShowUserList()
      this.showClubUserDialogVisible = true
    },
    handleCurrentChangeShowClubUser(val) {
      this.getShowUserList(val)
    },
    onClubBalanceDetail(val) {
      this.balancePage.clubId = val.id
      this.getBalanceDetailList()
    },
    handleCurrentChangeBalanceDetail(val) {
      this.getBalanceDetailList(val)
    },
    onModifyClub(val) {
      console.log(val)
    },
    beforeUpload(file) {
      if (!/\.(doc|docx|pdf)$/.test(file.name)) {
        this.$notify.error({
          title: '错误',
          message: '只能上传word或pdf文件'
        })
        this.fileList = []
        return false
      } else {
        const size = file.size / 1024 / 1024
        if (size > 5) {
          this.$notify.warning({
            title: '警告',
            message: '大小必须小于5M'
          })
          return
        }
      }
      this.filename = file.name
    },
    onRemoveClubUser(val) {
      removeClubUser({ clubId: this.showClubInfoPage.clubId, userId: val }).then(() => {
        this.getShowUserList(this.showClubInfoPage.pageNumber)
      })
    },
    onDownloadTemplate(e) {
      // 组织默认行为
      e.preventDefault()
      console.log('下载模板')
    },
    onDownload(val) {
      if (val === null || val === undefined || val === '') {
        return
      }
      axios({
        url: val,
        method: 'post'
      }).then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        // 获取文件名
        const fileName = val.substring(val.lastIndexOf('/') + 1)
        link.setAttribute('download', fileName) // 设置文件名
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      }).catch(error => {
        // 请求失败处理
        console.log(error)
        this.$message.error('下载失败!')
        this.tableLoading = false
      })
    },
    onExport() {
      const token = getToken()
      this.tableLoading = true
      axios({
        url: process.env.VUE_APP_BASE_API + 'api/club/export',
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
          downloadElement.download = fileName + '社团列表.xlsx'
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

