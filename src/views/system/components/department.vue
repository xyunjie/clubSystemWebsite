<template>
  <div>
    <div style="display: flex; width: 100%;">
      <el-card style="width: 300px;">
        <div style="text-align: right">
          <el-button type="primary" size="mini" @click="addDeptDialog = true">新增</el-button>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
      </el-card>
      <el-card style="display: flex; flex-grow: 1; margin-left: 10px;">
        <template #header>
          <div style="font-weight: bold; font-size: 22px; display: block; width: 100%;">部门编辑</div>
        </template>
        <el-form label-width="100px" inline>
          <el-form-item label="上级部门" style="width: 100%">
            <el-cascader
              v-model="deptEdit.parentDeptId"
              clearable
              placeholder="请选择筛选条件！"
              :options="data"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'name',
                children: 'children',
              }"
            />
          </el-form-item>
          <el-form-item label="年级" style="width: 100%;">
            <el-select v-model="deptEdit.grade" placeholder="请选择年级">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="deptEdit.name" placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <div style="text-align: right;">
          <el-button size="medium" type="danger" @click="handlerDelete">删除</el-button>
          <el-button size="medium" type="primary" @click="handlerSave">保存</el-button>
        </div>
      </el-card>
    </div>

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
        <el-form-item label="年级" style="width: 100%;">
          <el-select v-model="addDeptForm.grade" placeholder="请选择年级">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
import { getDictList, removeDict, saveDict } from '@/api/dict'

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
      deptEdit: {
        parentDeptId: [],
        name: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      options: []
    }
  },
  created() {
    this.loadPage()
    this.getGradeOption()
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
    getGradeOption() {
      getDictList({
        isGrade: true
      }).then(res => {
        this.options = res.data
      })
    },
    addDeptSubmit() {
      saveDict({
        parentId: this.addDeptForm.parentDeptId[this.addDeptForm.parentDeptId.length - 1],
        name: this.addDeptForm.name,
        isGrade: false,
        grade: this.addDeptForm.grade,
        description: this.addDeptForm.desc
      }).then(res => {
        this.addDeptDialog = false
        this.loadPage()
      })
    },
    handleNodeClick(val, node) {
      console.log(val)
      this.deptEdit.name = val.name
      this.deptEdit.id = val.id
      this.deptEdit.grade = val.grade
      this.deptEdit.parentDeptId = this.getIdList(node).map(i => i.id)
    },
    getIdList(node) {
      const list = []
      list.unshift({
        id: node.data.id,
        name: node.data.name
      })
      while (node.data.parentId) {
        node = node.parent
        list.unshift({
          id: node.data.id,
          name: node.data.name
        })
      }
      list.pop()
      return list
    },
    handlerDelete() {
      removeDict({ id: this.deptEdit.id }).then(() => {
        this.loadPage()
        this.deptEdit = {
          parentDeptId: [],
          name: ''
        }
      })
    },
    handlerSave() {
      saveDict({
        id: this.deptEdit.id,
        parentId: this.deptEdit.parentDeptId[this.deptEdit.parentDeptId.length - 1],
        name: this.deptEdit.name,
        grade: this.deptEdit.grade,
        isGrade: false
      }).then(() => {
        this.loadPage()
        this.deptEdit = {
          parentDeptId: [],
          name: ''
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
