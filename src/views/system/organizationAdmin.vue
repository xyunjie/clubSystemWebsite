<template>
  <el-card class="box-card" style="height: 100%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="年级" name="grade">
        <GradeList />
      </el-tab-pane>
      <el-tab-pane label="组织架构" name="organization">组织架构</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  name: 'OrganizationAdmin',
  components: {
    GradeList: () => import('@/views/system/components/gradeList.vue')
  },
  data() {
    return {
      activeName: 'grade'
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
