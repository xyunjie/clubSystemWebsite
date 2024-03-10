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
    <!--    <div>-->
    <!--      <div style="margin-left: auto; float: right; margin-bottom: 0.5rem">-->
    <!--        <el-button style="" type="primary" @click="onAddClub">新增</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-loading="tableLoading"
        fixed
        prop="clubName"
        label="社团名称"
        align="center"
        width="150"
      />
      <el-table-column
        prop="sex"
        label="性别"
        align="center"
      >
        <template v-slot:default="{row}">
          <el-tag v-if="row.sex">{{ '男' }}</el-tag>
          <el-tag v-else>{{ '女' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
      />
      <el-table-column
        prop="phone"
        label="联系电话"
        align="center"
        width="150"
      />
      <el-table-column
        prop="unitInfo"
        label="专业班级"
        align="center"
      />
      <el-table-column
        prop="status"
        label="加入状态"
        align="center"
        width="150"
      >
        <template v-slot="{ row }">
          <el-tag v-if="row.clubStatus === -1" type="success">社团部长</el-tag>
          <el-tag v-if="row.clubStatus === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.clubStatus === 1">审核通过</el-tag>
          <el-tag v-else-if="row.clubStatus === 2" type="danger">审核未通过</el-tag>
          <el-tag v-else-if="row.clubStatus === 3" type="warning">修改信息待审核</el-tag>
          <el-tag v-else-if="row.clubStatus === 4" type="danger">已封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="申请加入时间"
        align="center"
        width="180"
      />
      <el-table-column
        label="操作"
        fixed="right"
        width="450"
        align="center"
      >
        <template v-slot:default="{ row }">
          <el-button v-if="row.clubStatus === 0" type="success" @click="onHandleUserJoinClub(row, 1)">通过</el-button>
          <el-button v-if="row.clubStatus === 0" type="warning" @click="onHandleUserJoinClub(row,2)">驳回</el-button>
          <el-popconfirm
            v-if="row.clubStatus !== -1"
            style="margin-left: 0.6rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该成员吗？？"
            @confirm="onRemove(row.id)"
          >
            <el-button slot="reference" type="danger">
              {{ '删除' }}
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
            <el-select v-model="form.createdBy" clearable filterable placeholder="请选择社长" style="width: 100%" :disabled="true">
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
  </div>
</template>

<script>
import { getDictListByGrade } from '@/api/dict'
import {
  getMyClubUser, handleUserJoinClub,
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
        isAdmin: true
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
      balanceDetailList: [],
      balanceDetailVisible: false,
      showUserTotal: 0,
      userList: []
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
      getMyClubUser(this.pageParam).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    onHandleUserJoinClub(val, status) {
      handleUserJoinClub({ id: val.id, status: status }).then(res => {
        this.$message.success('操作成功')
        this.getShowUserList(this.showClubInfoPage.pageNumber)
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
      removeClubUser({ clubId: this.showClubInfoPage.clubId, userId: val }).then(() => {
        this.getShowUserList(this.showClubInfoPage.pageNumber)
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
    onDownloadTemplate(e) {
      // 组织默认行为
      e.preventDefault()
      console.log('下载模板')
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

