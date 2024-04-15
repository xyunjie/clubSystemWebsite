<template>
  <el-card class="box-card" style="height: 100%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="关于我们" name="about">
        <el-form ref="systemInfoForm" :model="systemInfo" :rules="systemRules" class="demo-ruleForm">
          <el-form-item>
            <el-form-item label="" prop="desc">
              <el-input v-model="systemInfo.about" type="textarea" placeholder="请输入关于我们！" :autosize="{ minRows: 15, maxRows: 40}" />
            </el-form-item>
            <el-button type="primary" @click="submitForm('systemRules')" style="margin-top: 1rem">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
<!--      <el-tab-pane label="系统简介" name="introduction">-->
<!--        <el-form ref="systemInfoForm" :model="systemInfo" :rules="systemRules" class="demo-ruleForm">-->
<!--          <el-form-item>-->
<!--            <el-form-item label="" prop="desc">-->
<!--              <el-input v-model="systemInfo.introduction" type="textarea" placeholder="请输入系统简介！" :autosize="{ minRows: 15, maxRows: 40}" />-->
<!--            </el-form-item>-->
<!--            <el-button type="primary" style="margin-top: 1rem" @click="submitForm('systemRules')">保 存</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </el-card>
</template>
<script>
import {getSystemInfo, saveSystemInfo} from '@/api/system'

export default {
  name: 'SystemAdmin',
  data() {
    return {
      activeName: 'about',
      systemInfo: {
        about: '关于我们',
        introduction: '系统简介'
      },
      systemRules: {
        about: [
          { required: true, message: '请输入关于我们', trigger: 'blur' },
          { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入系统简介', trigger: 'blur' },
          { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getSystemInfo()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getSystemInfo() {
      getSystemInfo().then(res => {
        this.systemInfo = res.data
      })
    },
    submitForm() {
      this.$refs['systemInfoForm'].validate(valid => {
        if (valid) {
          saveSystemInfo(this.systemInfo).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.getSystemInfo()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
