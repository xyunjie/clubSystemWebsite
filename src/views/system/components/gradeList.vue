<template>
  <div>
    <div style="margin-left: auto; float: right; margin-bottom: 0.5rem">
      <el-button type="primary" @click="handlerAdd">
        新增
      </el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="编号"
        width="180"
        align="center"
      />
      <el-table-column
        prop="name"
        label="名称"
        width="180"
        align="center"
      />
      <el-table-column
        prop="description"
        label="描述"
        align="center"
      />
      <el-table-column
        label="操作"
        width="256"
        align="center"
      >
        <template v-slot:default="{ row }">
          <el-button type="primary" @click="handlerEdit(row)">编辑</el-button>
          <el-popconfirm
            style="margin-left: 0.6rem"
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="你确定要删除该年级吗？"
            @confirm="handlerRemove(row.id)"
          >
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增年级"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >

      <el-form ref="gradeForm" :model="gradeForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="年级名称" prop="name">
          <el-input v-model="gradeForm.name" placeholder="请输入年级名称" />
        </el-form-item>
        <el-form-item label="年级描述" prop="description">
          <el-input v-model="gradeForm.description" type="textarea" placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDictList, removeDict, saveDict } from '@/api/dict'

export default {
  name: 'GradeList',
  data() {
    return {
      tableData: [],
      pageParam: {
        parentId: '',
        isGrade: true
      },
      dialogVisible: false,
      gradeForm: {
        id: '',
        name: '',
        description: '',
        grade: '',
        parentId: '',
        isGrade: true
      },
      rules: {
        name: [
          { required: true, message: '请输入年级名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入年级描述', trigger: 'change' | 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getDictList(this.pageParam).then(response => {
        this.tableData = response.data
      })
    },
    handlerEdit(row) {
      this.gradeForm.id = row.id
      this.gradeForm.name = row.name
      this.gradeForm.description = row.description
      this.dialogVisible = true
    },
    handlerRemove(row) {
      removeDict({ id: row }).then(response => {
        this.getList()
      })
    },
    handlerAdd() {
      this.dialogVisible = true
    },
    handleClose() {
      this.gradeForm.id = ''
      this.gradeForm.name = ''
      this.gradeForm.description = ''
      this.dialogVisible = false
    },
    handlerSave() {
      this.$refs.gradeForm.validate(valid => {
        if (valid) {
          console.log(this.gradeForm)
          saveDict(this.gradeForm).then(response => {
            this.getList()
            this.dialogVisible = false
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

</style>
