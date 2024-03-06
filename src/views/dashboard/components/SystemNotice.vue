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
          prop="name"
          label="名称"
          align="center"
          width="180"
        />
        <el-table-column
          prop="description"
          align="center"
          label="描述"
        />
        <el-table-column
          prop="balance"
          align="center"
          label="所需社费"
        >
          <template v-slot:default="{row}">
            <el-tag>{{ row.money }}元</el-tag>
          </template>
        </el-table-column>
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
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            社团名称
          </template>
          {{ showClubInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            社长
          </template>
          {{ showClubInfo.createdName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所需社费
          </template>
          {{ showClubInfo.money }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            社团描述
          </template>
          {{ showClubInfo.description }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建时间
          </template>
          {{ showClubInfo.createdTime }}
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
        query: ''
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
      console.log(val)
      await getClubDetail({ id: val.id }).then(res => {
        this.showClubInfo = res.data
      })
      console.log(this.showClubInfo)
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
