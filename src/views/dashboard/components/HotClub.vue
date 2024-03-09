<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix" style="width: 100%; text-align: center">
        <span>热门社团</span>
        <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
      </div>
      <el-table
        :data="hotClubList"
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
        <template slot="extra">
          <el-button type="primary" size="small" @click="userJoin()">申请加入</el-button>
        </template>
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
      <el-dialog
        width="30%"
        title="确认！"
        :visible.sync="innerVisible"
        append-to-body
      >
        <span>确定申请加入该社团吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleUserJoin">确 定</el-button>
          <el-button @click="innerVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog></div>
</template>

<script>
import { getClubDetail, getHotClub, userJoinClub } from '@/api/club'
import store from '@/store'

export default {
  name: 'HotClub',
  data() {
    return {
      hotClubList: [],
      dialogVisible: false,
      innerVisible: false,
      showClubInfo: {}
    }
  },
  created() {
    this.getHotClubList()
  },
  methods: {
    getHotClubList() {
      getHotClub().then(res => {
        this.hotClubList = res.data
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
      this.innerVisible = false
    },
    userJoin() {
      this.innerVisible = true
    },
    handleUserJoin() {
      userJoinClub({
        'clubId': this.showClubInfo.id,
        'userId': store.getters.userId
      }).then(() => {
        this.$message.success('申请加入成功！')
        this.handleClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
