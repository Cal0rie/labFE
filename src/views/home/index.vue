<template>
  <div class="home">
    <div class="bag">
      <div class="header">
        <span class="date">{{ str }} &nbsp; {{ days }}</span>
        <span class="title" @click="goTwo"></span>
        <span class="buttonAdmin">
          <span @click="goIndex">管理后台</span>
        </span>
      </div>
      <div class="index-content">
        <div class="left">
          <div class="left-content">
            <div class="public-title">
              <img src="../../assets/home/icon.png" alt="" />
              <span>当前风险人员数据</span>
            </div>
            <div class="left-gir">
              <div>
                <span>在观风险人员：</span>
                <span>{{ streetData.streetRiskTotal }} <i>人</i></span>
              </div>
              <div>
                <span>今日新增：</span>
                <span>{{ streetData.todayAdd }} <i>人</i></span>
              </div>
            </div>
            <div class="left-kay-place">
              <div class="left-kay">
                <!-- <el-tooltip placement="top">
                  <div slot="content">
                    其中<br />
                    密接
                    <span style="color: #dac850">{{
                      streetData.concentrated
                    }}</span>
                    人<br />
                    次密接
                    <span style="color: #dac850">{{
                      streetData.concentrated
                    }}</span>
                    人<br />
                    不具备
                    <span style="color: #dac850">{{
                      streetData.concentrated
                    }}</span>
                    人
                  </div>
                  <div class="parent">
                    <div>当前集中观察人</div>
                    <div>{{ streetData.concentrated }} <span>人</span></div>
                  </div>
                </el-tooltip> -->
                <!--
                <el-tooltip placement="top">
                  <div slot="content">
                    其中<br />
                    密接
                    <span style="color: #dac850">{{
                      streetData.concentrated
                    }}</span>
                    人<br />
                    次密接
                    <span style="color: #dac850">{{
                      streetData.concentrated
                    }}</span>
                    人
                  </div>
                </el-tooltip> -->
                <div class="parent">
                  <div>当前集中观察人</div>
                  <div>{{ streetData.concentrated }} <span>人</span></div>
                </div>
                <div class="parent">
                  <div>今日新增集中观察</div>
                  <div>{{ streetData.todayConcentrated }} <span>人</span></div>
                </div>
              </div>
              <div class="left-kay leftKeyTop">
                <div class="parent">
                  <div>当前居家观察</div>
                  <div>{{ streetData.home }} <span>人</span></div>
                </div>
                <div class="parent">
                  <div>今日新增居家观察</div>
                  <div>{{ streetData.todayHome }} <span>人</span></div>
                </div>
              </div>
              <div class="left-kay leftKeyTop">
                <div class="parent">
                  <div>当前健康监测</div>
                  <div>{{ streetData.monitoring }} <span>人</span></div>
                </div>
                <div class="parent">
                  <div>今日新增健康监测</div>
                  <div>{{ streetData.todayMonitoring }} <span>人</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="left-content">
            <div class="public-title">
              <img src="../../assets/home/icon.png" alt="" />
              <span>昨日重点点位核查统计</span>
            </div>
            <div class="c-place" ref="zddwhctj"></div>
          </div>
          <div class="left-content">
            <div class="public-title">
              <img src="../../assets/home/icon.png" alt="" />
              <span>历史风险人员管控类型统计<b>(2022年1月1日-至今)</b></span>
            </div>
            <div class="c-place" ref="fxgklxtj"></div>
          </div>
        </div>
        <div class="center">
          <div class="center-top" ref="mapChart"></div>
          <div class="center-bottom">
            <div class="public-title">
              <img src="../../assets/home/icon.png" alt="" />
              <!-- <span>近10日派单数量趋势</span> -->
              <!-- <span>近10日居家观察人员趋势</span> -->
              <span>{{ pdlqsTitle }}</span>
            </div>
            <div class="c-place" ref="pdlqs"></div>
          </div>
        </div>
        <div class="right">
          <div class="right-top">
            <div class="public-title">
              <img src="../../assets/home/icon.png" alt="" />
              <span>最新管控政策</span>
            </div>
            <vue-seamless-scroll
              class="rightTopContent"
              :data="[noticeData, '', '', '', '', '']"
              :class-option="classOption"
            >
              <div id="rightTopContent" v-html="noticeData"></div>
            </vue-seamless-scroll>
          </div>
          <div class="right-bottom" ref="table_wrap">
            <div class="public-title">
              <img src="../../assets/home/icon.png" alt="" />
              <span>各村居当前风险人员统计</span>
            </div>
            <div class="table-place-title">
              <span>村居名称</span>
              <span>集中观察</span>
              <span>居家观察</span>
              <span>健康监测</span>
              <span>总数</span>
            </div>
            <vue-seamless-scroll
              class="table-body"
              :data="tableData"
              :class-option="classOption"
            >
              <div
                class="table-line"
                v-for="(item, index) in tableData"
                :key="index"
              >
                <span>{{ item.province }}</span>
                <span>{{ item.concentrated }}</span>
                <span>{{ item.home }}</span>
                <span>{{ item.monitoring }}</span>
                <span>{{ item.streetRiskTotal }}</span>
              </div>
            </vue-seamless-scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { streetRisk, mapRisk, dispatchTrend, village, notice } from '@/api/home/index'
import { off, on } from '@/plugins/tools'
import { getRouters } from '@/api/menu'
import vueSeamlessScroll from "vue-seamless-scroll";
import Vue from 'vue';
Vue.use(vueSeamlessScroll)

export default {
  name: "Index",
  beforeRouteLeave(to, from, next) {
    clearInterval(this.changePdlqs);
    this.changePdlqs = null;
    off(window, 'resize', this.resize);
    next();
  },
  data() {
    return {
      streetData: {},
      startAuto: null,
      tableAuto: null,
      zddwhctj: null,
      fxgklxtj: null,
      pdlqs: null,
      changePdlqs: null, // pdlqs定时器
      pdlqsTitle: '近10日居家观察人员趋势',
      mapChart: null,
      noticeData: null,
      timeout: 100,
      scrollTopUp:  1,
      str: '',
      days: '',
      tableData: []
    };
  },
  created () {
  },
  mounted () {
    this.getCurrentDate();
    setInterval(() => {
      this.getCurrentDate();
    }, 1000)
    this.getData();
    this.getData2();
    this.getData3();
    this.getTable();
    this.getNotice();
    on(window, 'resize', this.resize);
  },
  computed: {
    classOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        autoPlay: true, //
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  methods: {
    resize () {
      this.zddwhctj.resize();
      this.fxgklxtj.resize();
      this.pdlqs.resize();
      this.mapChart.resize();
    },
    getNotice() {
      notice('13').then(response => {
        if (response.code !== 200) return this.$message.error('请求失败');
        this.noticeData = response.data.noticeContent;
      });
    },
    getTable() {
      village().then(response => {
        if (response.code !== 200) return this.$message.error('请求失败');
        this.tableData = response.data
      });
    },
    // 获取当前时间 + 日期
    getCurrentDate() {
      const myDate = new Date()
      const year = myDate.getFullYear() // 年
      const month = myDate.getMonth() + 1 // 月
      const day = myDate.getDate() // 日
      const strHours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours() // 获取小时,如果小于10,前面补个0
      const strMinutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes() // 获取分,如果小于10,前面补个0
      const strSeconds = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds() // 获取秒,如果小于10,前面补个0
      let days = myDate.getDay()
      switch (days) {
        case 1:
          days = '星期一'
          break
        case 2:
          days = '星期二'
          break
        case 3:
          days = '星期三'
          break
        case 4:
          days = '星期四'
          break
        case 5:
          days = '星期五'
          break
        case 6:
          days = '星期六'
          break
        case 0:
          days = '星期日'
          break
      }
      this.str = year + '-' + month + '-' + day + '  ' + strHours + ':' + strMinutes + ':' + strSeconds
      this.days = days
    },
    // 切换管理端
    goIndex () {
      this.$router.push({ path: '/filecenter' });
    },
    // 切换首页
    goTwo () {
      this.$router.push({ path: '/home'})
    },
    getData() {
      mapRisk().then(res =>{
        if (res.code !== 200) return this.$message.error('请求失败');
        this.mapChart = echarts.init(this.$refs.mapChart);
        // 地图
        this.mapChart.showLoading();
        const geoJson = require('./map.json')
        this.$nextTick(()=> {
          echarts.registerMap('china', geoJson);
          this.mapChart.hideLoading();
          var data = res.data;
          data.filter(val => {
            val.name = val.province;
            val.value = val.streetRiskTotal;
          })
          let optionMap = {
            title: {
              top: 20,
              text: '',
              subtext: '',
              x: 'center',
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item',
              padding: 0,
              formatter: (params) => {
                if (params.data) {
                  let data = params.data
                  let str;
                  str = `
                <div style="color: #CACCCC;font-size: 14px;background: #0A2C64;border: 2px solid #188EBA;font-weight: bold;padding: 10px;opacity: 0.7;line-height: 25px;border-radius: 5px">
                    <div style="color: #188EBA;font-size: 18px;">${data.name}</div>
                    <div >风险人员总数：<span style="color:#C75752">${data.historyTotal || 0}</span> 人</div>
                    <div >集中观察人数：<span style="color:#C75752">${data.historyConcentrated || 0}</span> 人</div>
                    <div >居家观察人数：<span style="color:#C75752">${data.historyHome || 0}</span> 人</div>
                    <div >健康监测人数：<span style="color:#C75752">${data.historyMonitoring || 0}</span> 人</div>
                </div>`;

                  return str;
                } else {
                  let str;
                  str = `
                <div style="color: #CACCCC;font-size: 14px;background: #0A2C64;border: 2px solid #188EBA;font-weight: bold;padding: 10px;opacity: 0.7;line-height: 25px;border-radius: 5px">
                    <div style="color: #188EBA;font-size: 18px;">${params.name}</div>
                    <div >风险人员总数：<span style="color:#C75752">暂无数据</span></div>
                    <div >集中观察人数：<span style="color:#C75752">暂无数据</span></div>
                    <div >居家观察人数：<span style="color:#C75752">暂无数据</span></div>
                    <div >健康监测人数：<span style="color:#C75752">暂无数据</span></div>
                </div>`;

                  return str;
                }

              },
            },
            visualMap: {
              show: false,
              min: 0,
              max: 50,
              left: 'left',
              top: 'bottom',
              text: ['高', '低'], // 文本，默认为数值文本
              calculable: true,
              seriesIndex: [0],
              inRange: {
                  color: ['#5A9DBF', '#ffd768', '#E4393c']
              }
            },
            geo: {
              map: 'china',
              show: true,
              roam: true,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false,
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#5A9DBF',
                  borderColor: 'rgba(255,255,255,0.5)',//线
                  borderWidth: '1.5',
                  shadowColor: '#8DB0C7',//外发光
                  shadowBlur: 10 // 光范围
                },
                emphasis: {
                  // areaColor: '#83D3FF',//悬浮区背景
                  areaColor: 'rgba(0, 255, 0)',//悬浮区背景
                  shadowColor: '#3EEEFF',//外发光
                  shadowBlur: 10 // 光范围
                }
              }
            },
            series: [
              {
                type: 'map',
                map: 'china',
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                showLegendSymbol: false, // 存在legend时显示
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      color: '#2bf666'
                    }
                  }
                },
                roam: true,
                itemStyle: {
                  normal: {
                    areaColor: '#2B91B7',
                    borderColor: '#FFFFFF',
                  },
                  emphasis: {
                    areaColor: '#2B91B7'
                  }
                },
                animation: false,
                data: data
              },
            ]
          };
          this.mapChart.setOption(optionMap);
          var indexYip = 0; //播放所在下标
          var index = 0;
          var time = 2000;
          function timing() {
            // 取消高亮指定的数据图形
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: index -1,
            });
            // 高亮指定的数据图形
            chart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: index,
            });
            index ++;
            //判断长度是否大于城市的长度，大于重新播放
            if (index > data.length) {
              chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0
              });
              index = 0;
            }
          }
          var chart = echarts.init(this.$refs.mapChart);
          var showTip = setInterval(function () {
            chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: indexYip,
            });
            indexYip++;
            if (indexYip > data.length) {
              indexYip = 0;
            }
          }, time);
          var timer = setInterval(function () {
            //调用定时播放代码
            timing()
          }, time);
          chart.on('mouseover', function (params) {
            // 取消下标
            clearInterval(showTip);
            chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: params.dataIndex,
            });
            //取消定时
            clearInterval(timer);
            //取消高亮
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
            });
            //高亮鼠标移入的位置
            chart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: params.dataIndex,
            });
           });
          chart.on('mouseout', function (params) {
            showTip && clearInterval(showTip);
            showTip = setInterval(function () {
              chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: indexYip,
              });
              indexYip++;
              if (indexYip > data.length) {
                indexYip = 0;
              }
            }, time);
            //取消定时
            clearInterval(timer);
            //取消高亮
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: params.dataIndex,
            });
            //重新开始定时播放
            timer = setInterval(function () {
              //调用定时播放代码
              timing()
            }, time);
          });
        })
        // 重点点位核查统计
        let color = ['#E990DE', '#D64CE6', '#4CE6D9', '#A6E64C', '#F1D564', '#E6A431', '#C74C37'];
        // let echartData = [
        //   {
        //     name: "吉林",
        //     value: "3720"
        //   },
        //   {
        //     name: "北京",
        //     value: "2920"
        //   },
        //   {
        //     name: "河南",
        //     value: "2200"
        //   },
        //   {
        //     name: "广东",
        //     value: "1420"
        //   },
        //   {
        //     name: "河北",
        //     value: "3200"
        //   },
        //   {
        //     name: "江苏",
        //     value: "2420"
        //   },
        //   {
        //     name: "其他",
        //     value: "2200"
        //   },
        // ];
        let echartData = [];
        res.data.filter((val, index) => {
          if (index <= 6) {
            // echartData.push({name: val.province, value: val.streetRiskTotal})
            echartData.push({name: val.province, value: val.yesterdayAdd})
          }
        })
        function shuffle(arr) {
          let i = arr.length;
          while (i) {
            let j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
          }
          return arr;
        }
        let formatNumber = function (num) {
          let reg = /(?=(\B)(\d{3})+$)/g;
          return num.toString().replace(reg, ',');
        }
        let option = {
          color: color,
          tooltip: {
            show: false,
            trigger: 'item'
          },
          title: [{
            text: '',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  fontWeight: 'normal',
                  color: '#000',
                  padding: [10, 0]
                },
                val: {
                  fontSize: 32,
                  fontWeight: 'bolder',
                  color: '#000',
                }
              }
            }
          }, {
            text: '人',
            top: 20,
            left: 20,
            textStyle: {
              fontSize: 14,
              color: '#666666',
              fontWeight: 400
            },
            show: false
          }],
          series: [{
            type: 'pie',
            roseType: 'radius',
            radius: ['10%', '75%'],
            center: ['50%', '55%'],
            data: shuffle(echartData),
            hoverAnimation: true,
            itemStyle: {
              normal: {
                // borderColor: bgColor,
                borderWidth: 2
              }
            },
            labelLine: {
              normal: {
                length: 5,
                length2: 20,
                lineStyle: {
                  // color: '#e6e6e6'
                }
              }
            },
            label: {
              normal: {
                formatter: params => {
                  return (
                      '{name|' + params.name + '}{value|' +
                      formatNumber(params.value) + '人' + '}'
                  );
                },
                padding: [0 , 0, -10, 0],
                rich: {
                  icon: {
                    fontSize: 14,
                  },
                  name: {
                    fontSize: 14,
                    padding: [10, 0, 0, 10],
                  },
                  value: {
                    fontSize: 14,
                    fontWeight: 'bolder',
                    padding: [10, 0, 0, 10],
                  }
                }
              }
            },
          },
          {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            radius: ['10%', '75%'],
            center: ['50%', '55%'],
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() * .55,
                  r: Math.min(api.getWidth(), api.getHeight()) / 4 * 0.12,
                },
                style: {
                  stroke: "#02BBFF",
                  fill: "transparent",
                  lineWidth: 2
                },
                silent: true
              };
            },
            data: [0]
          },
          ]
        };
        this.zddwhctj = echarts.init(this.$refs.zddwhctj);
        this.zddwhctj.setOption(option);
      })
    },
    getData2() {
      streetRisk().then(response => {
        if (response.code !== 200) return this.$message.error('请求失败');
        this.streetData = response.data;
        let data = response.data.riskTypeList;
        // let data = [
        //   {name: "无症状",percent: "0.02%",value: 1},
        //   {name: "居家观察",percent: "44.09%",value: 2140},
        //   {name: "确诊",percent: "0.08%",value: 4},
        //   {name: "集中观察",percent: "14.74%",value: 867},
        //   {name: "健康监测",percent: "41.07%",value: 2559},
        // ];
        if(data.length>0){
          let obj1 = data.splice(2,1);
          let obj2 = data.pop();
          data.push(obj1[0]);
          data.push(obj2);
        }
        // 风险人员管控类型统计
        let option = {
          legend: { show: false },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['0%', '70%'],
              center: ['50%', '55%'],
              avoidLabelOverlap: true,
              itemStyle: { borderColor: '#fff', borderWidth: 0 },
              color: [
                '#A6E64C', // 无症状
                '#1F93CB', // 居家
                '#EFBB61', // 集中
                '#D64CE6', // 确诊
                '#ED6E6E', // 监测
              ],
              label: {
                // alignTo: 'labelLine', // ! 文字对齐方式
                formatter: function (e) {
                  let {
                    data: { value, name, percent },
                  } = e;
                  return `{icon|●}{a|${name}}\n{b|${value}人 ${percent}}`;
                  // return `{icon|●}{a|${name}}\n{b|${value}人 ${percent}}\n{b|其中密接${value}人}\n{b|次密接${value}人}`;
                  // return `{icon|●}{a|${name}}\n{b|${value}人}\n{c|${percent}}`;
                },
                minMargin: 5,
                lineHeight: 15,
                rich: {
                  a: { fontSize: 14, align: 'center',  padding: [0, 0, 0, 8] },
                  b: { fontSize: 14, align: 'center',  padding: [8, 15, 15, 8] },
                  c: { fontSize: 14, align: 'center',  padding: [8, 15, 15, 8] },
                },
              },
              data
            }
          ],
        };
        this.fxgklxtj = echarts.init(this.$refs.fxgklxtj);
        this.fxgklxtj.setOption(option);
      });
    },
    getData3() {
      dispatchTrend().then(response => {
        if (response.code !== 200) return this.$message.error('请求失败');
        let xAxisData = response.data.dateList;
        let numData = [1496, 1453, 1393, 1334, 1077, 752, 381, 311, 287, 288];
        // let numData = response.data.numList;
        let numConcentratedList = response.data.numConcentratedList;
        let growthRate = response.data.growthRateList;
        let option = {
          // backgroundColor: '#000',
          // title: {
          //   show: false,
          //   text: '',
          //   left: '5%',
          //   top: '5%',
          //   textStyle: {
          //     color: '#fff',
          //     fontSize: '18px',
          //   },
          // },
          title: [
          {
            show: true,
            text: '人',
            textStyle: {
              color: '#fff',
              fontSize: 14  ,
            },
            padding: 0,
            top: 5,
            left: '2.4%'
          },
          // {
          //   show: true,
          //   text: '%',
          //   textStyle: {
          //     color: '#fff',
          //     fontSize: 14  ,
          //   },
          //   padding: 0,
          //   top: 5,
          //   right: '4%'
          // }
        ],
          tooltip: {
            trigger: 'axis',
            padding: 0,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: ''        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params) => {
              let str;
              str = `<div style="padding: 0;">
            <div style="color: #CACCCC;font-size: 14px;border-radius:5px;background: #0A2C64;border: 1px solid #188EBA;padding: 10px;opacity: 0.7;">
                <div>${params[0].name}</div>
                <div >人数：${params[0].value} 人</div>
            </div>
          </div>`;
                // <div >增长率：${params[1].value} %</div>
              return str;
            },
          },
          // legend: [
          //   {
          //     selectedMode: false,
          //     show: true,
          //     //data，就是取得每个series里面的name属性。
          //     orient: 'horizontal',
          //     icon: '', //图例形状
          //     padding: 0,
          //     top: 5,
          //     itemWidth: 24, //小圆点宽度
          //     itemHeight: 10, // 小圆点高度
          //     itemGap: 40, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
          //     textStyle: {
          //       fontSize: 14,
          //       color: '#CACCCC',
          //     },
          //   },
          // ],
          grid: {
            top: '20%',
            left: '2%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: xAxisData,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#446996',
                  width: 1,
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                margin: 10,
                color: '#E3E5E6',
                textStyle: {
                  fontSize: 14,
                },
              },
            },
          ],
          yAxis: [
            {
              axisLabel: {
                formatter: '{value}',
                color: '#E3E5E6',
                textStyle: {
                  fontSize: 14,
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  width: 2,
                  color: '#184D9A',
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
                lineStyle: {
                  type: 'dashed',
                  // 使用深浅的间隔色
                  color: '#184D9A',
                },
              },
            }
            // {
            //   type: 'value',
            //   max: 100,
            //   min: -100,
            //   splitLine: {
            //     show: false,
            //   },
            //   axisTick: {
            //     show: false,
            //   },
            //   axisLine: {
            //     show: true,
            //     lineStyle: {
            //       color: '#446996'
            //     }
            //   },
            //   axisLabel: {
            //     show: true,
            //     color: "#E3E5E5",
            //     fontSize: 14,
            //   }
            // }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth: '15px', //柱条的宽度，不设时自适应。
              data: numData,
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#70EAD5', //  0%  处的颜色
                      },
                      {
                        offset: 1,
                        color: '#19A57C', //  100%  处的颜色
                      },
                    ],
                    global: false, //  缺省为  false
                  },
                  barBorderRadius: [30, 30, 30, 30],
                  shadowColor: 'rgba(0,160,221,1)',
                  shadowBlur: 2,
                },
              },
              label: {
                normal: {
                  show: false,
                  lineHeight: 20,
                  width: 80,
                  height: 20,
                  borderRadius: 200,
                  position: ['-0', '-20'],
                  color: '#fff',
                },
              },
            },
            {
              // name: '增长率',
              type: 'line',
              yAxisIndex: 0,
              data: numData,
              showAllSymbol: true,
              symbol: 'circle',
              symbolSize: 5,
              lineStyle: {
                normal: {
                  color: '#FFD060',
                },
              },
              label: {
                show: false,
                position: 'top',
                textStyle: {
                  color: '#FFD060',
                },
              },
              itemStyle: {
                color: '#FFD060',
                borderColor: '#FFD060',
                borderWidth: 2,
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(145, 118, 215,0)',
                        },
                        {
                          offset: 1,
                          color: 'rgba(145, 118, 215,0)',
                        },
                      ],
                      false
                  ),
                },
              },
            }
            // {
            //   name: '增长率',
            //   type: 'line',
            //   yAxisIndex: 1,
            //   data: growthRate,
            //   showAllSymbol: true,
            //   symbol: 'circle',
            //   symbolSize: 5,
            //   lineStyle: {
            //     normal: {
            //       color: '#FFD060',
            //     },
            //   },
            //   label: {
            //     show: false,
            //     position: 'top',
            //     textStyle: {
            //       color: '#FFD060',
            //     },
            //   },
            //   itemStyle: {
            //     color: '#FFD060',
            //     borderColor: '#FFD060',
            //     borderWidth: 2,
            //   },
            //   areaStyle: {
            //     normal: {
            //       color: new echarts.graphic.LinearGradient(
            //           0,
            //           0,
            //           0,
            //           1,
            //           [
            //             {
            //               offset: 0,
            //               color: 'rgba(145, 118, 215,0)',
            //             },
            //             {
            //               offset: 1,
            //               color: 'rgba(145, 118, 215,0)',
            //             },
            //           ],
            //           false
            //       ),
            //     },
            //   },
            // }
          ]
        };
        let option2 = {
          title: [
          {
            show: true,
            text: '人',
            textStyle: {
              color: '#fff',
              fontSize: 14  ,
            },
            padding: 0,
            top: 5,
            left: '2.4%'
          }
        ],
        legend: {
          selectedMode:false,
          show: true,
          //data，就是取得每个series里面的name属性。
          orient: 'horizontal',
          icon: '', //图例形状
          padding: 0,
           top: 5,
            right: 20,
          itemWidth: 24, //小圆点宽度
          itemHeight: 10, // 小圆点高度
          itemGap: 60, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
          textStyle: {
            fontSize: 14,
            color: '#CACCCC',
          },
          data: [ '密接','次密接', '集中隔离']
        },
          tooltip: {
            trigger: 'axis',
            padding: 0,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: ''        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params) => {
              let str;
              str = `<div style="padding: 0;">
                      <div style="color: #CACCCC;font-size: 14px;border-radius:5px;background: #0A2C64;border: 1px solid #188EBA;padding: 10px;opacity: 0.7;">
                          <div>${params[0].name}</div>
                          <div >密接：${params[0].value} 人</div>
                          <div >次密接：${params[1].value} 人</div>
                          <div >集中隔离：${params[2].value} 人</div>
                      </div>
                    </div>`;
              return str;
            },
          },
          grid: {
            top: '20%',
            left: '2%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#446996',
                width: 1,
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              margin: 10,
              color: '#E3E5E6',
              textStyle: {
                fontSize: 14,
              },
            },
          },
          yAxis: {
            axisLabel: {
              formatter: '{value}',
              color: '#E3E5E6',
              textStyle: {
                fontSize: 14,
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                width: 2,
                color: '#184D9A',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
                // 使用深浅的间隔色
                color: '#184D9A',
              },
            },
          },
          series: [
            {
              name: '密接',
              type: 'bar',
              stack: '1',
              barWidth: '15px', //柱条的宽度，不设时自适应。
              data: response.data.concentratedCloseContactsList,
              // color: '#FFFF00',
              color: '#ED6E6E',
              label: {
                normal: {
                  show: false,
                  lineHeight: 20,
                  width: 80,
                  height: 20,
                  borderRadius: 200,
                  position: ['-0', '-20'],
                  color: '#fff',
                },
              },
            },
            {
              name: '次密接',
              type: 'bar',
              stack: '1',
              barWidth: '15px', //柱条的宽度，不设时自适应。
              data: response.data.concentratedSecondaryCloseContactsList,
              // color: '#19A57C',
              color: '#EFBB61',
              label: {
                normal: {
                  show: false,
                  lineHeight: 20,
                  width: 80,
                  height: 20,
                  borderRadius: 200,
                  position: ['-0', '-20'],
                  color: '#fff',
                },
              },
            },
            {
              name: '集中隔离',
              type: 'bar',
              barWidth: '15px', //柱条的宽度，不设时自适应。
              stack: '1',
              data: response.data.concentratedControlList,
              // color: '#DD4C2B',
              color: '#1F93CB',
              label: {
                normal: {
                  show: false,
                  lineHeight: 20,
                  width: 80,
                  height: 20,
                  borderRadius: 200,
                  position: ['-0', '-20'],
                  color: '#fff',
                },
              }
            }
          ]
        };
        this.pdlqs = echarts.init(this.$refs.pdlqs);
        this.pdlqs.setOption(option);
        let showOption = option;
        this.changePdlqs = setInterval(()=>{
          this.pdlqs.clear();
          if(showOption === option) {
            this.pdlqsTitle = '近10日集中观察人员趋势';
            this.pdlqs.setOption(option2);
            showOption = option2;
          } else {
            this.pdlqsTitle = '近10日居家观察人员趋势';
            this.pdlqs.setOption(option);
            showOption = option;
          }
        }, 5000)
      });
    }
  }
};
</script>

<style scoped lang="less">
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .bag {
    padding: 0 1vw;
    height: 100%;
    width: 100%;
    background: url('../../assets/home/homeBg2.jpg') no-repeat center center;
    background-size: 100% 100%;
    .header {
      padding: 0 30px;
      height: 9%;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      .date {
        margin-top: 1%;
        width: 33rem;
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #728ffc;
        opacity: 0.8;
      }
      .buttonAdmin {
        margin-top: 1%;
        width: 33rem;
        text-align: right;
        color: #ffffff;
        span {
          display: inline-block;
          padding: 0.4rem 1.2rem;
          font-size: 0.6rem;
          cursor: pointer;
          background-image: url('../../assets/home/buttonBg.png');
          background-size: 100% 100%;
        }
      }
      .title {
        width: 470px;
        height: 100%;
        cursor: pointer;
        background-size: 100% 100%;
      }
    }
    .index-content {
      height: 91%;
      display: flex;
      justify-content: space-around;
      .left {
        width: 490px;
        .left-content {
          padding: 10px 25px;
          width: 100%;
          height: 33%;
          background-image: url('../../assets/home/indexPublicBg.png');
          background-size: 100% 100%;
          .c-place {
            //border: 1px solid red;
            width: 100%;
            height: calc((100% - 60px));
            margin-top: 8px;
          }
          .left-gir {
            display: flex;
            color: #e6e6e6;
            // font-size: 0.8rem;
            font-size: 14px;
            line-height: 32px;
            font-weight: bold;
            text-align: center;
            justify-content: space-around;
            align-items: center;
            div:first-child {
              width: 45%;
              span:last-child {
                color: #dac850;
                i {
                  color: #e6e6e6;
                }
              }
            }
            div:last-child {
              width: 45%;
              span:last-child {
                color: #da5d50;
                i {
                  color: #e6e6e6;
                }
              }
            }
          }
          .left-kay-place {
            width: 100%;
            height: calc(100% - 32px - 46px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          }
          .left-kay {
            width: 100%;
            color: #e6e6e6;
            font-weight: bold;
            display: flex;
            height: 28%;
            justify-content: space-around;
            .parent {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 45%;
              text-align: center;
              height: 100%;
              background-image: url('../../assets/home/dataBorder.png');
              background-size: 100% 100%;
            }
            div:first-child {
              font-size: 14px;
              div:last-child {
                color: #dac850;
                margin-top: 3px;
                span {
                  font-size: 0.5rem;
                }
              }
            }
            div:last-child {
              font-size: 14px;
              div:last-child {
                color: #da5d50;
                margin-top: 3px;
                span {
                  font-size: 0.5rem;
                }
              }
            }
          }
          .leftKeyTop {
            margin-top: 5px;
          }
        }
      }
      .center {
        width: calc(100% - 450px - 505px);
        height: 100%;
        .center-top {
          padding: 1rem;
          height: 66%;
          .c-place {
            width: 100%;
            height: 100%;
            margin-top: 8px;
          }
        }
        .center-bottom {
          padding: 1rem 2rem;
          width: 100%;
          height: 33%;
          background-image: url('../../assets/home/indexPublicBg.png');
          background-size: 100% 100%;
          .c-place {
            width: 100%;
            height: calc((100% - 60px));
            margin-top: 8px;
          }
        }
      }
      .right {
        width: 505px;
        height: 100%;
        .right-top,
        .right-bottom {
          padding: 10px 25px;
          width: 100%;
          background-image: url('../../assets/home/indexPublicBg.png');
          background-size: 100% 100%;
        }
        .right-top {
          height: 33%;
        }
        .rightTopContent {
          margin-top: 8px;
          height: calc(100% - 46.6px - 8px);
          overflow-y: hidden;
          padding: 0 10px;
          font-size: 0.6rem;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #cccccc;
          line-height: 1.2rem;
        }
        // .rightTopContent::-webkit-scrollbar {
        //   /*滚动条整体样式*/
        //   width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
        //   height: 1px;
        // }
        // .rightTopContent::-webkit-scrollbar-thumb {
        //   /*滚动条里面小方块*/
        //   border-radius: 10px;
        //   -webkit-box-shadow: inset 0 0 2px rgba(0, 255, 255, 0.2);
        //   background: rgba(0, 255, 255, 0.5);
        // }
        // .rightTopContent::-webkit-scrollbar-track {
        //   /*滚动条里面轨道*/
        //   -webkit-box-shadow: inset 0 0 2px rgba(7, 35, 59, 0.2);
        //   border-radius: 10px;
        //   background: rgba(7, 35, 59, 0.72);
        // }
        .right-bottom {
          height: 66%;
          padding: 16px 1.5rem;
          .table-place-title {
            background: transparent;
            height: 30px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background-color: rgba(31, 147, 203, 0.6);
            color: rgba(255, 255, 255, 8);
            font-size: 12px;
            font-weight: 600;
            span {
              width: 20%;
              text-align: center;
            }
          }
          .table-body {
            margin-top: 8px;
            height: calc(100% - 46.6px - 30px - 8px);
            overflow: hidden;
            .table-line {
              margin: 0;
              width: 100%;
              height: 30px;
              color: #b3b3b3;
              font-size: 14px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              border-bottom: 1px solid #03567e;
              padding: 0;
              &:hover {
                background-color: rgba(31, 147, 203, 0.2);
              }
              span {
                width: 20%;
                text-align: center;
              }
            }
          }
        }
      }
    }
    .public-title {
      height: 2.6rem;
      display: flex;
      align-items: center;
      font-family: Source Han Sans CN;
      color: #d2e0ff;
      border-bottom: 1px solid #02bbff;
      span {
        display: flex;
        align-items: baseline;
        margin-left: 1rem;
        height: 2.6rem;
        line-height: 2.6rem;
        font-size: 16px;
        font-weight: bold;
        b {
          margin-left: 10px;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
  }
}
</style>

