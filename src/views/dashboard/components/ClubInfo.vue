<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="item in excitingResultData" :key="item.id">
            <el-image
              style="width: 100%; height: 100%"
              :src="item.url"
              fit="fill"
            />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item>
            <template slot="label">
              学生组织名称
            </template>
            {{ clubInfo.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              学生组织部长
            </template>
            {{ clubInfo.createdName }}
          </el-descriptions-item>
          <el-descriptions-item :span="2">
            <template slot="label">
              学生组织描述
            </template>
            {{ clubInfo.description }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              加入所需费用
            </template>
            {{ clubInfo.money }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              创建时间
            </template>
            {{ clubInfo.createdTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="12">
        <el-table
          :data="activityResultData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="title"
            label="活动标题"
            align="center"
            width="180"
          />
          <el-table-column
            prop="content"
            label="活动内容"
            align="center"
            width="280"
          >
            <template v-slot:default="{ row }">
              <span>
                {{ row.content.length > 10 ? row.content.substring(0, 30) + '...' : row.content }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdUser.name"
            label="举办人"
            align="center"
            width="150"
          />
          <el-table-column
            prop="beginTime"
            label="开始时间"
            align="center"
            width="180"
          />
          <el-table-column
            prop="endTime"
            label="结束时间"
            align="center"
            width="180"
          />
          <el-table-column
            prop="createdTime"
            label="创建时间"
            align="center"
            width="180"
          />
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="activityTotal"
          style="margin-top: 1rem; text-align: right"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getByClubIdExcitingMomentsList } from '@/api/exciting'
import { getClubDetail } from '@/api/club'
import { getActivityList } from '@/api/activity'

export default {
  name: 'ClubInfo',
  components: {
  },
  props: ['clubId'],
  data() {
    return {
      excitingResultData: [],
      activityResultData: [],
      activityTotal: 0,
      clubInfo: {},
      pageParam: {
        pageNumber: 1,
        pageSize: 10,
        id: null,
        kind: 'activity',
        query: '',
        isAdmin: false
      }
    }
  },
  watch: {
    clubId(newValue, oldValue) {
      if (newValue === undefined) {
        return
      }
      this.getExciting()
      this.getClubInfo()
      this.getActivityList()
    }
  },
  methods: {
    getExciting() {
      getByClubIdExcitingMomentsList({ id: this.clubId }).then(res => {
        this.excitingResultData = res.data
      })
    },
    getClubInfo() {
      getClubDetail({ id: this.clubId }).then(res => {
        this.clubInfo = res.data
      })
    },
    getActivityList(current = 1) {
      this.pageParam.id = this.clubId
      this.pageParam.pageNumber = current
      getActivityList(this.pageParam).then(res => {
        this.activityResultData = res.data.records
        this.activityTotal = res.data.total
      })
    },
    handleCurrentChange(val) {
      this.getActivityList(val)
    }
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
