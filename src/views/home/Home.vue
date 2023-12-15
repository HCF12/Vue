<template>
  <div>
    <el-row class="home" :gutter="20">
      <el-col :span="8" style="margin-top: 5px">
        <el-card shadow="hover">
          <div class="user">
            <img src="../../assets/images/user.jpg"/>
            <div class="user-info">
              <p class="name">{{loginName }}</p>
              <p class="role">{{studentName }}</p>
            </div>
          </div>
          <div class="login-info">
            <p>上次登录时间：<span>{{LoginHisInfo.loginDate}}</span></p>
            <P>上次登录地点：<span>{{LoginHisInfo.loginAddress}}</span></P>
          </div>
        </el-card>
        <el-card shadow="hover" style="margin-top: 20px; height: 500px">
          <el-table :data="tableData" height="270px">
            <el-table-column
                v-for="(v,k) in tableLabel"
                :key="k"
                :prop="k"
                :label="v"
            >
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16" style="margin-top: 5px">
        <el-card style="height: 500px;background-color: #99CCCC">
          <div ref="chinaMap" style="height: 500px"></div>
        </el-card>
        <div class="graph">
          <el-card style="height: 260px">
          </el-card>
          <el-card style="height: 260px">
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted, ref} from 'vue'
import chinaJson from '../../assets/js/china.json'
import * as echarts from "echarts";
import {reactive} from "vue-demi";

export default defineComponent({
  setup() {
    //挂载全局api
    const {proxy} = getCurrentInstance()
    let tableData = ref([]);
    let countData = ref([]);
    let LoginHisInfo = ref([]);
    let studentId = window.sessionStorage.getItem('studentId');
    let studentName = window.sessionStorage.getItem('studentName');
    let loginName = window.sessionStorage.getItem('loginName');
    const chinaMap = ref([]);
    const tableLabel = {
      name: '课程',
      todayBuy: '今日购买',
      monthBuy: '本月购买',
      totalBuy: '总购买'
    }
    const params = reactive({
      studentId: studentId
    });

    const getLoginHisByStudentId = async () => {
      let res = await proxy.$api.getLoginHisByStudentId(params.studentId);
      console.log("登录信息：" + res);
      LoginHisInfo.value = res;
    }
    /**
     * 设置投射点
     * 中国地理坐标图
     */
    const chinaGeoCoordMap = {
      上海: [121.46503408447266, 31.221068849156694],
      湖南省张家界: [110.54218025390624, 29.122992832430285],
      湖南省凤凰古城: [109.10110225, 27.4452938],
      浙江省杭州西湖: [120.1941180322266, 30.23469703027832],
      重庆市: [109.40093,31.018551],
      广西省北海涠洲岛: [109.23477202734375,20.857876355435824],
      哈尔滨市: [127.16687354565428,45.45942366122554],
    }
    const chinaDatas = [
      [
        {
          name: '湖南省张家界',
          value: 1,
          ints: 10,
          obj: [
            {title: '张家界(1次)'},
          ]
        },
      ],
      [
        {
          name: '湖南省凤凰古城',
          value: 1,
          ints: 10,
          obj: [
            {title: '凤凰古城(1次)'},
          ]
        },
      ],
      [
        {
          name: '浙江省杭州西湖',
          value: 1,
          ints: 10,
          obj: [
            {title: '杭州西湖(1次)'}
          ]
        },
      ],
      [
        {
          name: '重庆市',
          value: 1,
          ints: 10,
          obj: [
            {title: '巴南区花园(1次)'},
            {title: '奉节县白帝城(1次)'},
          ]
        },
      ],
      [
        {
          name: '广西省北海涠洲岛',
          value: 1,
          ints: 10,
          obj: [
            {title: '北海涠洲岛(1次)'}
          ]
        },
      ],
      [
        {
          name: '哈尔滨市',
          value: 1,
          ints: 10,
          obj: [
            {title: '哈尔滨市'}
          ]
        }
      ]

    ]
    const scatterPos = [121.46503408447266, 31.221068849156694]
    // 1
    const convertData = (data) => {
      let res = []
      for (let i = 0; i < data.length; i++) {
        let dataItem = data[i]
        let fromCoord = chinaGeoCoordMap[dataItem[0].name]
        let toCoord = scatterPos
        if (fromCoord && toCoord) {
          res.push([
            {
              tit: dataItem[0].obj,
              coord: fromCoord,
              value: dataItem[0].value,
            },
            {
              coord: toCoord,
            },
          ])
        }
      }
      return res
    }
    let series = []
    ;[['上海', chinaDatas]].forEach((item, i) => {
      series.push(
          {
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 4, //箭头指向速度，值越小速度越快
              trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'arrow', //箭头图标
              symbolSize: 8, //图标大小
            },
            coords:[[1,2],[2,3]],
            lineStyle: {
              // normal: {
              color: '#adffd0',
              width: 1, //尾迹线条宽度
              opacity: 1, //尾迹线条透明度
              curveness: 0.3, //尾迹线条曲直度
              // },
            },
            data: convertData(item[1]),
          },
          // 发射点位置涟漪等效果
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              //涟漪特效
              period: 4, //动画时间，值越小速度越快
              brushType: 'stroke', //波纹绘制方式 stroke, fill
              scale: 4, //波纹圆环最大限制，值越大波纹越大
            },
            itemStyle: {
              // normal: {
              show: false,
              color: '#f8f9f5',
              // },
            },
            label: {
              // normal: {
              show: true,
              position: 'right', //显示位置
              offset: [5, 0], //偏移设置
              formatter: function (params) {
                //圆环显示文字
                return params.data.name
              },
              fontSize: 13,
              // },
              emphasis: {
                show: true,
              },
            },
            symbol: 'circle',
            symbolSize: (val) => {
              return 5 + val[2] * 5 //圆环大小
            },

            data: item[1].map((dataItem) => {
              return {
                name: dataItem[0].name,
                tit: dataItem[0].obj,
                ints: dataItem[0].ints,
                value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value]),
              }
            }),
          },
          //被攻击点
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              //涟漪相关
              period: 2,
              brushType: 'stroke',
              scale: 5,
            },
            itemStyle: {
              color: '#f00',
            },
            label: {
              show: true,
              position: 'right',
              // offset:[5, 0],
              color: '#0f0',
              formatter: '{b}',
              textStyle: {
                color: '#fff',
                fontSize: 12,
              },
              emphasis: {
                show: true,
                color: '#f60',
              },
            },
            symbol: 'circle',
            symbolSize: 10, //圆圈大小
            data: [
              {
                name: item[0],
                value: chinaGeoCoordMap[item[0]].concat([10]),
              },
            ],
          },
      )
    })

    const drawChina = () => {
      let myChart = echarts.init(chinaMap.value)
      echarts.registerMap('china', chinaJson) //注册可用的地图
      let option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(252, 252, 252, 0.82)',
          borderColor: '#fff',
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: 'z-index:100',
          formatter: (params, ticket, callback) => {
            //根据业务自己拓展要显示的内容
            let res = ''
            let initss = 0
            let newArry = ''
            let name = params.name
            // let value = params.value[params.seriesIndex + 1]
            if (params.data.ints > 0) {
              initss = params.data.ints
            }
            if (params.data.tit?.length > 0) {
              newArry = Array.from(params.data.tit,(item)=> item.title)
            }
            res = "<div style='max-width:500px;white-space:pre-wrap;'><span>" + name + '</span>旅游：'+ "<div style='color: red;'>" + newArry + "</div></div>"
            return res
          },
        },
        geo: {
          show: true,
          center: [105.194115019531, 35.582111640625],
          map: 'china',
          roam: false, //是否允许缩放，拖拽
          zoom: 1.5, //初始化大小
          //缩放大小限制
          scaleLimit: {
            min: 0.1, //最小
            max: 12, //最大
          },
          //设置中心点
          //center: [95.97, 29.71],
          //省份地图添加背景
          //regions: regions,
          itemStyle: {
            // normal: {
            areaColor: '#99CCCC',
            color: '#e91e63',
            borderColor: '#5e84fd',
            borderWidth: 2,
            // },
          },
          label: {
            color: 'rgba(255,255,255,0.5)',
            show: false,
          },
          //高亮状态
          emphasis: {
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#e91e63',
            },
          },
          z: 10,
        },
        //配置属性
        series: series,
      }
      myChart.setOption(option)
    }
    //获取首页count数据
    const getCountData = async () => {
      let res = await proxy.$api.getCountData()
      countData.value = res
    }
    const getTableList = async () => {
      //   await axios.get("https://www.fastmock.site/mock/ea3e0492b1b6a41623db3bec4f1b94f6/api/home/getData").then((res) => {
      //     console.log(res)
      //    if(res.data.code == 200){
      //      tableData.value = res.data.data.tableData
      //    }
      //   })
      let res = await proxy.$api.getTableData();
      tableData.value = res.tableData
    }
    onMounted(() => {
      getTableList();
      getCountData();
      drawChina();
      getLoginHisByStudentId();
    })

    return {
      tableData,
      tableLabel,
      countData,
      chinaMap,
      params,
      LoginHisInfo,
      getLoginHisByStudentId,
      loginName,
      studentName
    }
  }
})
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }

    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: white;
    }

    .details {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .val {
        font-size: 30px;
        margin-bottom: 10px;
      }

      .txt {
        font-size: 14px;
        text-align: center;
        color: #999999;
      }
    }
  }

  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .el-card {
      width: 48%;
    }
  }

  width: 100%;
  height: 100%;
}
</style>