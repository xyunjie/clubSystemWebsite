<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix" style="width: 100%; text-align: center">
        <span>热门活动</span>
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
          prop="title"
          label="活动名称"
          align="center"
          width="180"
        />
        <el-table-column
          prop="content"
          align="center"
          label="描述"
        />
        <el-table-column
          prop="clubName"
          align="center"
          label="举办组织"
        />
        <el-table-column
          prop="beginTime"
          align="center"
          label="开始时间"
        />
        <el-table-column
          prop="endTime"
          align="center"
          label="结束时间"
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
      title="活动详情"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="2" border>
        <template slot="extra">
          <el-button type="primary" size="small" @click="userJoin()">申请参加</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            活动标题
          </template>
          {{ showClubInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            活动举办组织
          </template>
          {{ showClubInfo.clubName }}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            活动描述
          </template>
          {{ showClubInfo.content }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            开始时间
          </template>
          {{ showClubInfo.beginTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结束时间
          </template>
          {{ showClubInfo.endTime }}
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
        <span>确定参加该活动吗？</span>
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
import { entryActivity, getHotActivity, modifyActivityUserEntry } from '@/api/activity'

export default {
  name: 'HotActivity',
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
      getHotActivity().then(res => {
        this.hotClubList = res.data
      })
    },
    async handleClick(val) {
      this.showClubInfo = val
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
      entryActivity({
        'id': this.showClubInfo.id
      }).then(() => {
        this.$message.success('报名成功，等待审核！')
      })
      this.handleClose()
    }
  }
}
</script>

<style scoped>

</style>
