<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix" style="width: 100%; text-align: center">
        <span>系统公告</span>
      </div>
      <el-table
        :data="systemNoticeList"
        border
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column
          label="序号"
          align="center"
          width="80"
        >
          <template v-slot:default="{row, $index}">
            <el-tag>{{ $index + 1 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="社团详情"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            公告标题
          </template>
          {{ showClubInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            公告时间
          </template>
          {{ showClubInfo.createdTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            公告内容
          </template>
          {{ showClubInfo.content }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog></div>
</template>

<script>
import { getClubDetail } from '@/api/club'
import { getSystemNoticeList } from '@/api/system'

export default {
  name: 'SystemNotice',
  data() {
    return {
      systemNoticeList: [],
      dialogVisible: false,
      innerVisible: false,
      showClubInfo: {},
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        query: '',
        kind: 'system_notice'
      }
    }
  },
  created() {
    this.getSystemNoticeList()
  },
  methods: {
    getSystemNoticeList() {
      getSystemNoticeList(this.queryParam).then(res => {
        this.systemNoticeList = res.data.records
      })
    },
    async handleClick(val) {
      this.showClubInfo = val
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
      this.showClubInfo = {}
    }
  }
}
</script>

<style scoped>

</style>
