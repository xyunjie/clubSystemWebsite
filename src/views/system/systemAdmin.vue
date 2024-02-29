<template>
  <el-card class="box-card" style="height: 100%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="关于我们" name="about">
        <div style="padding: 20px">
          {{ systemInfo.about }}
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统简介" name="introduction">
        <div style="padding: 20px">
          {{ systemInfo.introduction }}
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  name: 'SystemAdmin',
  data() {
    return {
      activeName: 'about',
      systemInfo: {
        about: '关于我们',
        introduction: '系统简介'
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>

</style>
