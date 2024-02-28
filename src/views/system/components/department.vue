<template>
  <div>
    <el-card style="width: 300px;">
      <div style="text-align: right">
        <el-button type="primary" size="mini" @click="addDeptDialog = true">新增</el-button>
      </div>
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
    </el-card>
    <el-dialog :visible.sync="addDeptDialog">
      <el-form inline label-width="80px">
        <el-form-item label="上级部门" style="width: 100%;">
          <el-cascader
            v-model="addDeptForm.parentDeptId"
            clearable
            placeholder="请选择筛选条件！"
            :options="data"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'children'
            }"
          />
        </el-form-item>
        <el-form-item label="名称" style="width: 100%;">
          <el-input v-model="addDeptForm.name" />
        </el-form-item>
        <el-form-item label="描述" style="width: 100%;">
          <el-input v-model="addDeptForm.desc" />
        </el-form-item>
      </el-form>
      <div style="margin-left: auto;">
        <el-button @click="addDeptDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDeptSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDictList, saveDict } from '@/api/dict'

export default {
  data() {
    return {
      data: [],
      addDeptDialog: false,
      addDeptForm: {
        parentDeptId: [],
        name: '',
        desc: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.loadPage()
  },
  methods: {
    handleAddDept() {
      this.addDeptDialog = true
      this.addDeptForm.parentDeptId = []
      this.addDeptForm.name = ''
      this.addDeptForm.desc = ''
    },
    loadPage() {
      getDictList({
        isGrade: false
      }).then(res => {
        this.data = res.data
      })
    },
    addDeptSubmit() {
      saveDict({
        parentId: this.addDeptForm.parentDeptId[this.addDeptForm.parentDeptId.length - 1],
        name: this.addDeptForm.name,
        isGrade: false,
        description: this.addDeptForm.desc
      }).then(res => {
        this.addDeptDialog = false
        this.loadPage()
      })
    }
  }
}
</script>

<style scoped>
</style>
