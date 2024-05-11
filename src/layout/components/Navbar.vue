<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <span>
            {{ userName }}
          </span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a @click="toCenter">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </a>
          <a @click="modifyPassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>

      </el-dropdown>
    </div>

    <el-dialog
      title="个人信息"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        ref="updateForm"
        :model="userInfo"
        :rules="registerRules"
        class="register-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="studentId" label="学号">
          <el-input
            ref="studentId"
            v-model="userInfo.studentId"
            placeholder="请输入学号"
            name="studentId"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input
            ref="name"
            v-model="userInfo.name"
            placeholder="请输入姓名"
            name="name"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="userInfo.sex">
            <el-radio-button :label="true">男</el-radio-button>
            <el-radio-button :label="false">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="grade" label="年级" required>
          <el-select v-model="userInfo.grade" placeholder="请选择入学年级！" style="width: 80%" @change="onSelectGrade">
            <el-option
              v-for="item in gradeOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="classes" label="班级" required>
          <el-cascader
            v-model="userInfo.classes"
            placeholder="请选择班级信息！"
            :options="treeOption"
            :props="{
              value: 'id',
              label: 'name',
              children: 'children'}"
            style="width: 80%"
            @change="handleChangeClass"
          />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input
            ref="phone"
            v-model="userInfo.phone"
            placeholder="请输入手机号"
            name="phone"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="mail" label="邮箱">
          <el-input
            ref="mail"
            v-model="userInfo.mail"
            placeholder="请输入邮箱"
            name="mail"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="qq" label="QQ号">
          <el-input
            ref="qq"
            v-model="userInfo.qq"
            placeholder="请输入QQ号"
            name="qq"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="weChat" label="微信">
          <el-input
            ref="weChat"
            v-model="userInfo.weChat"
            placeholder="请输入微信号"
            name="weChat"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 80%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogModifyVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="modifyPasswordForm" :model="modifyPasswordForm" status-icon :rules="passwordRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="modifyPasswordForm.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="modifyPasswordForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认面膜" prop="confirmPassword">
          <el-input v-model="modifyPasswordForm.confirmPassword" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSavePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePassword, getInfo, updateInfo } from '@/api/user'
import { getDictList, getDictListByGrade } from '@/api/dict'
import store from '@/store'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入学号'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入最少六位密码！'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      // 正则校验
      if (value === '' || value === null) {
        callback(new Error('请输入手机号！'))
      } else if (value.length !== 11 || !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号！'))
      } else {
        callback()
      }
    }
    const validateMail = (rule, value, callback) => {
      // 正则校验
      if (value === '' || value === null) {
        callback(new Error('请输入邮箱！'))
      } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
        callback(new Error('请输入正确的邮箱！'))
      } else {
        callback()
      }
    }
    return {
      ...mapGetters([
        'sidebar',
        'avatar'
      ]),
      userName: '操作',
      dialogVisible: false,
      userInfo: {},
      treeOption: [],
      gradeOption: [],
      registerRules: {
        studentId: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        sex: [{ required: true, trigger: 'blur' }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        mail: [{ required: true, trigger: 'blur', validator: validateMail }]
      },
      dialogModifyVisible: false,
      modifyPasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  mounted() {
    this.userInfo = store.getters.name
    console.log(this.userInfo)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async toCenter() {
      console.log(name)
      await this.getUserInfo()
      await this.getGradeList()
      await this.onSelectGrade(this.userInfo.grade)
      this.dialogVisible = true
    },
    modifyPassword() {
      // this.$message.error('功能尚未实现，敬请期待')
      this.dialogModifyVisible = true
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogModifyVisible = false
    },
    getUserInfo() {
      getInfo().then(res => {
        this.userInfo = res.data
        console.log(this.userInfo)
        this.userInfo.classes = []
        if (this.userInfo.college) {
          this.userInfo.classes.push(this.userInfo.college)
        }
        if (this.userInfo.major) {
          this.userInfo.classes.push(this.userInfo.major)
        }
        if (this.userInfo.clazz) {
          this.userInfo.classes.push(this.userInfo.clazz)
        }
        console.log(this.userInfo)
      })
    },
    onSelectGrade(val) {
      getDictListByGrade({ gradeId: val }).then(res => {
        this.treeOption = res.data
      })
    },
    handleChangeClass(val) {
      if (val.length === 0 || val.length > 3) {
        this.$message.error('出现系统异常，请联系管理员！')
        return
      }
      this.userInfo.college = null
      this.userInfo.major = null
      this.userInfo.clazz = null
      this.userInfo.college = val[0]
      if (val.length >= 2) {
        this.userInfo.major = val[1]
      }
      if (val.length >= 3) {
        this.userInfo.clazz = val[2]
      }
    },
    async getGradeList() {
      getDictList({ 'isGrade': true }).then(res => {
        this.gradeOption = res.data
      })
    },
    handleSave() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.loading = true
          updateInfo(this.userInfo).then(() => {
            this.$message.success('保存成功')
            this.dialogVisible = false
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleSavePassword() {
      this.$refs.modifyPasswordForm.validate(valid => {
        if (valid) {
          this.loading = true
          changePassword(this.modifyPasswordForm).then(() => {
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.loading = false
            // 删除token
            this.$store.dispatch('user/resetToken').then(() => {
              // 跳转到登录页
              this.$router.push({ path: '/login' })
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
