<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix" style="text-align: center">
      <span>关于我们</span>
    </div>
    <span>
      {{ systemInfo.about }}
    </span>
  </el-card>
</template>

<script>
import { getSystemInfo } from '@/api/system'

export default {
  name: 'About',
  data() {
    return {
      systemInfo: {}
    }
  },
  created() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      // TODO 获取系统信息
      getSystemInfo().then(res => {
        this.systemInfo = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
