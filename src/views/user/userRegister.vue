<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>
      <el-form-item prop="studentId" label="学号">
        <el-input
          ref="studentId"
          v-model="registerForm.studentId"
          placeholder="请输入学号"
          name="studentId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input
          ref="name"
          v-model="registerForm.name"
          placeholder="请输入姓名"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="grade" label="年级" required>
        <el-select v-model="registerForm.grade" placeholder="请选择入学年级！" @change="onSelectGrade">
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
          v-model="registerForm.classes"
          placeholder="请选择班级信息！"
          :options="treeOption"
          :props="{
            value: 'id',
            label: 'name',
            children: 'children'}"
          @change="handleChangeClass"
        />
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="mail" label="邮箱">
        <el-input
          ref="mail"
          v-model="registerForm.mail"
          placeholder="请输入邮箱"
          name="mail"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="qq" label="QQ号">
        <el-input
          ref="qq"
          v-model="registerForm.qq"
          placeholder="请输入QQ号"
          name="qq"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="weChat" label="微信">
        <el-input
          ref="weChat"
          v-model="registerForm.weChat"
          placeholder="请输入手机号"
          name="weChat"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-button type="text" @click="onReturnLogin">返回登录</el-button>
        </el-col>
      </el-row>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >
        注册账号
      </el-button>
    </el-form>
    <div style="height: 200px"></div>
  </div>
</template>

<script>

import { getDictList, getDictListByGrade } from '@/api/dict'
import { userRegister } from '@/api/user'

export default {
  name: 'Register',
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
      registerForm: {
        studentId: '',
        password: '',
        college: '',
        major: '',
        clazz: '',
        classes: '',
        grade: '',
        phone: '',
        mail: '',
        qq: '',
        name: '',
        weChat: ''
      },
      registerRules: {
        studentId: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        mail: [{ required: true, trigger: 'blur', validator: validateMail }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      gradeOption: [],
      treeOption: []
    }
  },
  created() {
    this.getGradeList()
  },
  methods: {
    onReturnLogin() {
      this.$router.push({ path: '/login' })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getGradeList() {
      getDictList({ 'isGrade': true }).then(res => {
        this.gradeOption = res.data
      })
    },
    onSelectGrade(val) {
      getDictListByGrade({ gradeId: val }).then(res => {
        this.treeOption = res.data
        console.log(this.treeOption)
      })
    },
    handleChangeClass(val) {
      if (val.length === 0 || val.length > 3) {
        this.$message.error('出现系统异常，请联系管理员！')
        return
      }
      this.registerForm.college = val[0]
      if (val.length >= 2) {
        this.registerForm.major = val[1]
      }
      if (val.length >= 3) {
        this.registerForm.clazz = val[2]
      }
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 实现注册逻辑
          console.log(this.registerForm)
          userRegister(this.registerForm).then(res => {
            this.loading = false
            this.$message.success('注册成功，请耐心等待审核！')
            this.$router.push('/login')
          }).catch(() => {
            this.loading = false
            this.$message.error('注册失败，请稍后再试！')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input .el-select {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-select {
    display: inline-block;
    height: 47px;
    width: 85%;
  }

  .el-cascader {
    display: inline-block;
    height: 47px;
    width: 85%;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    color: #454545;
  }

  .el-form-item__label {
    color: #fff;
    margin-left: 0.8rem;
    margin-top: 0.2rem;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 600px;
    max-width: 100%;
    padding: 120px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
