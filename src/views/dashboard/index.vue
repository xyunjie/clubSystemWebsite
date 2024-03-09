<template>
  <div>
    <el-row :gutter="20" style="height: 500px">
      <el-col :span="16">
        <HotClub />
      </el-col>
      <el-col :span="8">
        <About />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <HotActivity />
      </el-col>
      <el-col :span="8">
        <SystemNotice />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    HotClub: () => import('@/views/dashboard/components/HotClub.vue'),
    About: () => import('@/views/dashboard/components/About.vue'),
    HotActivity: () => import('@/views/dashboard/components/HotActivity.vue'),
    SystemNotice: () => import('@/views/dashboard/components/SystemNotice.vue')
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
