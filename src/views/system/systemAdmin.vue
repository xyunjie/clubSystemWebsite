<template>
  <el-card class="box-card" style="height: 100%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="轮播图" name="carousel">轮播图</el-tab-pane>
      <el-tab-pane label="关于我们" name="about">关于我们</el-tab-pane>
      <el-tab-pane label="系统简介" name="introduction">系统简介</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  name: 'SystemAdmin',
  data() {
    return {
      activeName: 'carousel'
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
