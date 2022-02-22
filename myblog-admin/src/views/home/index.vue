<template>
  <div>
    <!-- 统计数据 -->
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <el-icon color="#40c9c6"><View /></el-icon>
          </div>
          <div class="card-desc">
            <div class="card-title">访问量</div>
            <div class="card-count">{{ viewsCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <el-icon color="#34bfa3">
              <avatar />
            </el-icon>
          </div>
          <div class="card-desc">
            <div class="card-title">用户量</div>
            <div class="card-count">{{ userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <el-icon color="#f4516c"><document /></el-icon>
          </div>
          <div class="card-desc">
            <div class="card-title">文章量</div>
            <div class="card-count">{{ articleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <el-icon color="#36a3f7"><chat-dot-square /></el-icon>
          </div>
          <div class="card-desc">
            <div class="card-title">留言量</div>
            <div class="card-count">{{ messageCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 一周访问量展示 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">一周访问量</div>
      <div style="height: 350px">
        <v-chart :option="viewCount" v-loading="loading" />
      </div>
    </el-card>
    <!-- 文章贡献统计 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">文章贡献统计</div>
      <div v-loading="loading">
        <!-- <calendar-heatmap :end-date="new Date()" :values="articleStatisticsList" /> -->
      </div>
    </el-card>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 文章浏览量排行 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">文章浏览量排行</div>
          <div style="height: 350px">
            <v-chart :option="ariticleRank" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
      <!-- 分类数据统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章分类统计</div>
          <div style="height: 350px">
            <v-chart :option="category" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 用户地域分布 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">用户地域分布</div>
          <div style="height: 350px; padding-bottom: 30px" v-loading="loading">
            <div class="area-wrapper">
              <el-radio-group v-model="type" @change="changeType">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </div>
            <v-chart :option="userAreaMap" />
          </div>
        </el-card>
      </el-col>
      <!-- 文章标签统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章标签统计</div>
          <div style="height: 350px">
            <v-chart :option="tag" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import '@/assets/js/china'
import { defineComponent, ref, onMounted } from 'vue'
import { getHomeData, getUserAreaData } from '@/api/home'
export default defineComponent({
  setup() {
    onMounted(() => {
      listUserArea()
      getData()
    })
    const loading = ref(true)
    const viewsCount = ref(0)
    const userCount = ref(0)
    const articleCount = ref(0)
    const messageCount = ref(0)

    const articleStatisticsList = ref([])
    const viewCount = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      color: ['#3888fa'],
      legend: {
        data: ['访问量']
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        data: ['2022-02-05', '2022-02-06', '2022-02-07', '2022-02-08', '2022-02-09', '2022-02-10'],
        axisLine: {
          lineStyle: {
            // 设置x轴颜色
            color: '#666'
          }
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            // 设置y轴颜色
            color: '#048CCE'
          }
        }
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          data: [3, 50, 63, 23, 80, 111],
          smooth: true
        }
      ]
    })
    const ariticleRank = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      color: ['#58AFFF'],
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        data: []
      },
      yAxis: {},
      series: [
        {
          name: ['浏览量'],
          type: 'bar',
          data: []
        }
      ]
    })
    interface CategoryOrTag {
      color: string[]
      legend: any
      tooltip: any
      series: any
    }
    const category = ref<CategoryOrTag>({
      color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E'],
      legend: {
        data: [],
        bottom: 'bottom'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '文章分类',
          type: 'pie',
          roseType: 'radius',
          data: []
        }
      ]
    })

    const tag = ref<CategoryOrTag>({
      color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E'],
      legend: {
        data: [],
        bottom: 'bottom'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '文章标签',
          type: 'pie',
          roseType: 'radius',
          data: []
        }
      ]
    })

    const getData = () => {
      getHomeData().then((res) => {
        viewsCount.value = res.data.data.viewsCount
        messageCount.value = res.data.data.messageCount
        userCount.value = res.data.data.userCount
        articleCount.value = res.data.data.articleCount
        articleStatisticsList.value = res.data.data.articleStatisticsList
        if (res.data.data.uniqueViewDTOList != null) {
          res.data.data.uniqueViewDTOList.forEach((item: any) => {
            viewCount.value.xAxis.data.push(item.day as never)
            viewCount.value.series[0].data.push(item.viewsCount as never)
          })
        }
        if (res.data.data.categoryDTOList != null) {
          res.data.data.categoryDTOList.forEach((item: any) => {
            category.value.series[0].data.push({
              value: item.articleCount,
              name: item.categoryName
            })
            category.value.legend.data.push(item.categoryName)
          })
        }
        if (res.data.data.articleRankDTOList != null) {
          res.data.data.articleRankDTOList.forEach((item: any) => {
            ariticleRank.value.series[0].data.push(item.viewsCount as never)
            ariticleRank.value.xAxis.data.push(item.articleTitle as never)
          })
        }
        if (res.data.data.tagDTOList != null) {
          res.data.data.tagDTOList.forEach((item: any) => {
            tag.value.series[0].data.push({
              value: item.articleCount,
              name: item.tagName
            })
          })
        }
        loading.value = false
      })
    }

    const type = ref(1)
    const userAreaMap = ref({
      tooltip: {
        formatter: function (e: any) {
          var value = e.value ? e.value : 0
          return e.seriesName + '<br />' + e.name + '：' + value
        }
      },
      visualMap: {
        min: 0,
        max: 1000,
        right: 26,
        bottom: 40,
        showLabel: !0,
        pieces: [
          {
            gt: 100,
            label: '100人以上',
            color: '#ED5351'
          },
          {
            gte: 51,
            lte: 100,
            label: '51-100人',
            color: '#59D9A5'
          },
          {
            gte: 21,
            lte: 50,
            label: '21-50人',
            color: '#F6C021'
          },
          {
            label: '1-20人',
            gt: 0,
            lte: 20,
            color: '#6DCAEC'
          }
        ],
        show: !0
      },
      geo: {
        map: 'china',
        zoom: 1.2,
        layoutCenter: ['50%', '50%'], //地图中心在屏幕中的位置
        itemStyle: {
          normal: {
            borderColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            areaColor: '#F5DEB3',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderWidth: 0
          }
        }
      },
      series: [
        {
          name: '用户人数',
          type: 'map',
          geoIndex: 0,
          data: [
            { name: '台湾', value: 2 },
            { name: '山东', value: 25 },
            { name: '福建', value: 41 },
            { name: '河南', value: 37 },
            { name: '河北', value: 9 },
            { name: '重庆', value: 19 },
            { name: '湖北', value: 34 },
            { name: '湖南', value: 49 },
            { name: '海南', value: 2 },
            { name: '江西', value: 16 },
            { name: '天津', value: 11 },
            { name: '陕西', value: 18 },
            { name: '贵州', value: 13 },
            { name: '吉林', value: 3 },
            { name: '上海', value: 29 },
            { name: '香港', value: 7 },
            { name: '甘肃', value: 1 },
            { name: '山西', value: 14 },
            { name: '宁夏', value: 3 },
            { name: '四川', value: 56 },
            { name: '广西', value: 23 },
            { name: '浙江', value: 53 },
            { name: '云南', value: 1 },
            { name: '辽宁', value: 12 },
            { name: '广东', value: 96 },
            { name: '青海', value: 1 }
          ],
          areaColor: '#0FB8F0'
        }
      ]
    })
    const changeType = (val: number) => {
      type.value = val
      listUserArea()
    }
    const listUserArea = () => {
      getUserAreaData(type.value).then((res) => {
        userAreaMap.value.series[0].data = res.data.data
      })
    }
    return {
      viewsCount,
      userCount,
      articleCount,
      messageCount,
      articleStatisticsList,
      loading,
      category,
      ariticleRank,
      type,
      viewCount,
      userAreaMap,
      tag,
      changeType
    }
  }
})
</script>

<style scoped>
.card-icon-container {
  display: inline-block;
  font-size: 3rem;
}
.area-wrapper {
  display: flex;
  justify-content: center;
}
.card-desc {
  font-weight: bold;
  float: right;
}
.card-title {
  margin-top: 0.3rem;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1rem;
}
.card-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}
.echarts {
  width: 100%;
  height: 100%;
}
.e-title {
  font-size: 13px;
  color: #202a34;
  font-weight: 700;
}
</style>
