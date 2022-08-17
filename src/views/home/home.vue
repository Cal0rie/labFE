<!-- home -->
<template>
  <div class="home">
    <div class="bag">
      <div class="header">
        <span class="date">{{ str }} &nbsp; {{ days }}</span>
        <span class="title" @click="goOne"></span>
        
      </div>
      <div class="grid">
        <div class="bg-purple">
          <div class="purple-grid">
            <div class="grid-title">用户注册情况统计</div>
            <div class="grid-content lneD" style="margin-top: 6px">
              <span>系统总用户：</span>
              <span>{{ totalUsers || 0 }}<i>人</i></span>
            </div>
            <div class="grid-content lneD">
              <span>禁用用户：</span>
              <span>{{ delUsers || 0 }}<i>人</i></span>
            </div>
            <div class="grid-content lneD">
              <span>当天注册：</span
              ><span>{{ todayUsers || 0 }}<i>人</i></span>
            </div>
          </div>
        </div>
        <div class="bg-purple">
          <div class="purple-grid">
            <div class="grid-title">设备借用情况统计</div>
            <div class="grid-content mar_top">
              <div class="flex">
                <p>
                  <span>系统在借设备数：</span
                  ><span>{{ totalUse || 0 }}<i>台</i></span>
                </p>
                <p>
                  <span>今日出借设备数：</span
                  ><span>{{ todayUse || 0 }}<i>台</i></span>
                </p>
              </div>
            </div>
           
          </div>
        </div>
        <div class="bg-purple">
          <div class="purple-grid">
            <div class="grid-title">设备归还情况统计</div>
            <div class="grid-content mar_top">
              <div class="flex">
                <p>
                  <span>今日归还设备数：</span
                  ><span>{{ totalBack || 0 }}<i>台</i></span>
                </p>
                <p>
                  <span>系统待归还设备数：</span
                  ><span>{{ todayBack || 0 }}<i>台</i></span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-purple">
          <div class="purple-grid">
            <div class="grid-title">设备报修情况统计</div>
            <div class="grid-content mar_top">
              <div class="flex">
                <p>
                  <span>今日报修设备数：</span
                  ><span>{{ totalRepair || 0 }}<i>台</i></span>
                </p>
                <p>
                  <span>系统待修设备数：</span
                  ><span>{{ todayRepair || 0 }}<i>台</i></span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    
     
   

    </div>
     <div style="margin-top: 50px;">
        <span class="date">近期借用设备记录</span>
     <el-table v-loading="loading" :data="equipmentList" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编号" align="center" prop="id"  width="50"/>
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="设备型号" align="center" prop="remark" width="80"/>
      <el-table-column label="借还状态" align="center" prop="equipmentStatus" :formatter="stateFormat"/>
      <el-table-column label="设备借用人" align="center" prop="equipmentDept" />
      <el-table-column label="借用时间" align="center" prop="useTime" />
      <el-table-column label="设备图片" align="center" prop="equipmentPic" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.equipmentPic" :width="50" :height="50"/>
        </template>
      </el-table-column>
      
    </el-table>

     </div>
  </div>
  
   
  
</template>

<script>
import { vaccinationreportAgeInfo, vaccinationreportBaseInfo, vaccinationreportOldInfo, vaccinationreportDailyInfo, vaccinationreportVillageInfo,initDataSel,Equipmentlist } from '@/api/home/home'
import echarts from 'echarts';
import { on, off } from '@/plugins/tools';
import { getRouters } from '@/api/menu'

export default {
  name: "Home",
  data() {
    return {
      totalUsers:null,
      delUsers:null,
      todayUsers:null,
      totalUse:null,
      todayUse:null,
      totalBack:null,
      todayBack:null,
      totalRepair:null,
      todayRepair:null,
      dataTotal: {},
      // 设备管理表格数据
      equipmentList: [],
      // 遮罩层
      loading: true,
      qzrjz: null,
      qzjqz: null,
      gnldry: null,
      gcjmjqz: null,
      str: '',
      days: ''
    };
  },
  created () {
    //this.init();
     this.getList();
    this.initDataSel();
  },
  mounted () {
    this.getCurrentDate();
    setInterval(() => {
      this.getCurrentDate();
    }, 1000)

    on(window, 'resize', this.resize);
  },
  methods: {
 
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
    // 向后端请求路由数据
    getRouter(){
      getRouters().then(res => {
        this.path = '';
        debugger
        this.findChildrenPath(res.data);
        this.$router.push({ path: this.path }).catch(()=>{});
      })
    },
    // 查找登录页
    findChildrenPath(list){
      this.path = this.path + '/' + list[0].path.replace('/', '');
      if (list[0].children && list[0].children.length > 0) {
        return this.findChildrenPath(list[0].children);
      }
    },
    // 切换首页
    goOne () {
      this.$router.push({ path: '/index' })
    },
    dispatchActionFunc(name, echart, series, time = 2000) {
      let count = 0;
      this[name] = setInterval(() => {
        if (count > series[0].data.length - 1) { count = 0; }
        echart.dispatchAction({
          type: 'downplay',
          seriesIndex: 2 // serieIndex的索引值 可以触发多个
        });
        echart.dispatchAction({
          type: 'highlight',
          seriesIndex: 2,
          dataIndex: count,
        });
        echart.dispatchAction({
          type: 'showTip',
          seriesIndex: 2,
          dataIndex: count,
        });
        ++count;
      }, time);
    },
    initDataSel(){
       initDataSel().then(res => {
        let objlist=res.initdatalist;    
          this.totalUsers= objlist[0].totalUsers;
          this.delUsers=objlist[1].totalUsers;
          this.todayUsers=objlist[2].totalUsers;
          this.totalUse=objlist[3].totalUsers;
          this.todayUse=objlist[4].totalUsers;
          this.totalBack=objlist[6].totalUsers;
          this.todayBack=objlist[5].totalUsers;
          this.totalRepair=objlist[8].totalUsers;
          this.todayRepair=objlist[7].totalUsers;
      })
    },
    /** 查询设备管理列表 */
    getList() {
      this.loading = true;
      Equipmentlist(this.queryParams).then(response => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
     //设备状态(0、入库 1、使用中 2、维护中)
    stateFormat(row, column) {
      console.log(row.equipmentStatus)
      if (row.equipmentStatus === '0') {
        return '入库'
      } else if (row.equipmentStatus === '1') {
        return '使用中'
      } else if (row.equipmentStatus === '2') {
        return '维护中'
      }
    },
  },

   

  beforeDestroy () {
    clearInterval(this.gcjmjqzScroll);
    this.gcjmjqzScroll = null;
    off(window, 'resize', this.resize);
  }
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .bag {
    // padding: 0 1.5rem;
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
    .grid {
      margin-top: 30px;
      display: flex;
      justify-content: space-around;
      .bg-purple {
        width: 19%;
        height: 8rem;
        padding: 16px 10px;
        background-image: url('../../assets/home/dataBorder.png');
        background-size: 100% 100%;
        .purple-grid {
          .grid-title {
            width: 100%;
            font-size: 18px;
            font-family: Microsoft YaHei;
            text-align: center;
            line-height: 24px;
            font-weight: bold;
            color: #d2e0ff;
          }
          .grid-content {
            text-align: center;
            font-weight: bold;
            font-family: Microsoft YaHei;
            line-height: 30px;
            span:first-child {
              color: #e6e6e6;
              font-size: 14px;
            }
            span:last-child {
              font-size: 16px;
              color: #dac850;
            }
            span {
              i {
                font-size: 14px;
              }
            }
            p {
              margin: 0;
            }
            .flex {
              display: flex;
              justify-content: space-around;
              span:first-child {
                font-size: 12px;
              }
              span:last-child {
                font-size: 14px;
              }
              i {
                font-size: 12px;
              }
            }
          }
          .mar_top {
            margin-top: 10px;
          }
          .lneD {
            line-height: 23px;
          }
        }
      }
    }
    .center {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      height: calc((100% - 280px) / 2);
      .center-content {
        padding: 10px 25px;
        width: 33%;
        height: 100%;
        background-image: url('../../assets/home/cent.png');
        background-size: 100% 100%;
        .c-place {
          width: 100%;
          height: calc(100% - 60px);
          margin-top: 8px;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      height: calc((100% - 280px) / 2);
      margin-top: 8px;
      .footer-content {
        padding: 10px 25px;
        width: 100%;
        height: 100%;
        background-image: url('../../assets/home/footer.png');
        background-size: 100% 100%;
        .c-place {
          width: 100%;
          height: calc(100% - 60px);
          margin-top: 8px;
        }
      }
    }
    .center-content-title {
      border-bottom: 1px solid #02bbff;
      line-height: 3rem;
      font-size: 16px;
      display: flex;
      align-items: center;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #d2e0ff;
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
      img {
        margin-right: 1rem;
      }
    }
  }
}
</style>

