<template>
  <div>
    <div ref="main" style="height: 300px"></div>
  </div>
</template>

<script>
import axios from "axios"
import * as echarts from 'echarts'

export default {
  name: "EChart",
  props: {
    words: {
      default: ''
    }
  },
  myChart: null,
  option: null,
  mounted() {
    axios.get(`${this.$baseUrl}/analyze?words=${this.words}`)
        .then(
            res => {
              this.option = {
                color: ['#FFBF00'],
                title: {
                  text: '近一周的时间热度分析图',
                  x: 'center'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#6a7985'
                    }
                  }
                },
                grid: {
                  left: '3%',
                  right: '8%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    boundaryGap: false,
                    data: res.data.data.days
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: '热度',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                      width: 0
                    },
                    showSymbol: false,
                    label: {
                      show: true,
                      position: 'top'
                    },
                    areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: 'rgb(255, 191, 0)'
                        },
                        {
                          offset: 1,
                          color: 'rgb(224, 62, 76)'
                        }
                      ])
                    },
                    emphasis: {
                      focus: 'series'
                    },
                    data: res.data.data.counts
                  }
                ]
              };

              this.$nextTick(() => {
                if(!this.myChart) {
                  this.myChart = echarts.init(this.$refs.main);
                  window.addEventListener('resize',  () => {
                    this.myChart.resize();
                  });
                }
                this.myChart.setOption(this.option, true);
              });
            },
            err => {
              console.log(err)
            }
        )
  }
}
</script>

<style scoped>

</style>
