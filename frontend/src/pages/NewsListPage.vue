<template>
  <div>
    <div style="text-align: center">
      <div style="margin-top: 10px">
        <img alt="Vue logo" src="../assets/logo.png" style="height: 100px">
      </div>
    </div>

    <el-row>
      <el-col :span="12" :offset="6">
        <el-input placeholder="请输入内容" :clearable="true" v-model="words">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>

      <el-col :span="12" :offset="6">
        <div class="content" style="text-align: right; margin-top: 10px">
          <span style="cursor:pointer" @click="change">{{ order }}</span>&nbsp;&nbsp;
          <span style="cursor:pointer" @click="showChart = true">时间热度分析</span>
        </div>
        <div v-if="showChart">
          <EChart :words="words"/>
        </div>
      </el-col>

      <el-col :span="12" :offset="6" v-for="item in newsList.slice((currentPage - 1) * 10, Math.min(newsList.length, currentPage * 10))" :key="item._id">
        <div style="margin-left: 5px">
          <div style="font-weight: normal; margin: 30px 0 10px 0">
            <a :href="item._source.url" target="_blank" style="text-decoration: none; font-size: 20px">
              {{ item._source.title }}
            </a>
          </div>

          <div class="content">{{ item._source.abstract }}</div>
          <div class="content" style="margin-top: 5px">
            <span>{{ item._source.time }}</span>&nbsp;
            <span>{{ item._source.origin }}</span>
          </div>
        </div>
      </el-col>

      <el-col :span="12" :offset="6" style="margin-top: 20px; margin-bottom: 20px">
        <div style="text-align: center">
          <el-pagination
              layout="prev, pager, next" :current-page.sync="currentPage"
              :total="newsList.length">
          </el-pagination>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import {mapMutations, mapGetters} from 'vuex'
import EChart from "@/components/EChart";

export default {
  name: "NewsListPage",
  components: {EChart},
  data() {
    return {
      words: this.$route.params['words'],
      newsList: this.getNews(),
      currentPage: 1,
      showChart: false,
      order: '按时间排序'
    }
  },
  methods:{
    ...mapMutations(['SET_NEWS']),
    ...mapGetters(['getNews']),
    search() {
      if (this.words !== '') {
        this.showChart = false
        axios.get(`${this.$baseUrl}/search?words=${this.words}`)
            .then(
                res => {
                  console.log(res.data)

                  this.SET_NEWS(res.data.data)

                  this.$router.replace({
                    path: `/news-list/${this.words}/${Math.floor(Math.random() * 1000000)}`,
                  })

                  this.newsList = this.getNews()
                },
                err => {
                  console.log(err)
                }
            )
      }
    },
    setWords() {
      this.words = this.$route.params['words']
    },
    change() {
      if (this.order === '按时间排序') {
        let arr = this.newsList.slice()
        arr.sort((a, b) => {
          const format = 'YYYY-MM-DD HH:mm'
          console.log(a._source.time)
          const before = moment(a._source.time, format).isBefore(moment(b._source.time, format))
          if (before) {
            return 1
          } else {
            return -1
          }
        })
        this.newsList = arr
        this.order = '按相关性排序'
      } else {
        let arr = this.newsList.slice()
        arr.sort((a, b) => {
          return b._score - a._score
        })
        this.newsList = arr
        this.order = '按时间排序'
      }
    }
  },
  created() {
    window.addEventListener('popstate', this.setWords, false)
  },
  destroyed() {
    window.removeEventListener('popstate', this.setWords, false)
  }
}
</script>

<style scoped>
.content {
  font-size: 15px;
  line-height: 22px;
}
</style>
