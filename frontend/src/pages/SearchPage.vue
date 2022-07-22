<template>
  <div>
    <div style="text-align: center">
      <div style="margin-top: 30px">
        <img alt="Vue logo" src="../assets/logo.png" style="height: 200px">
      </div>
    </div>

    <el-row>
      <el-col :span="12" :offset="6">
        <el-input placeholder="请输入内容" :clearable="true" v-model="words">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <div style="text-align: center; margin-top: 50px; font-size: 15px">
      <span>新闻来源：</span>
      <span><a href="https://world.gmw.cn/node_4661.htm" target="_blank" style="text-decoration: none">光明网</a></span>&nbsp;&nbsp;
      <span><a href="http://xinhuanet.com/worldpro/" target="_blank" style="text-decoration: none">新华网</a></span>&nbsp;&nbsp;
      <span><a href="https://www.chinanews.com.cn/world/" target="_blank" style="text-decoration: none">中国新闻网</a></span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'

export default {
  name: "SearchPage",
  data() {
    return {
      words: ''
    }
  },
  methods:{
    ...mapMutations(['SET_NEWS']),
    search() {
      if (this.words !== '') {
        axios.get(`${this.$baseUrl}/search?words=${this.words}`)
            .then(
                res => {
                  console.log(res.data)

                  this.SET_NEWS(res.data.data)

                  this.$router.push({
                    path: `/news-list/${this.words}/${Math.floor(Math.random() * 1000000)}`,
                  })
                },
                err => {
                  console.log(err)
                }
            )
      }
    }
  }
}
</script>

<style scoped>

</style>
