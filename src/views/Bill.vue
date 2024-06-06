<template>
  <div id="mainer">
    <div id="left">
      <el-tabs :tab-position="tabPosition" v-model="activeName" class="demo-tabs" :type="card"
               style="flex-grow: 1;background-color: white" :tab-change="activeNameChange">
        <el-tab-pane label="消费明细" name="first">
          <el-form :inline="true" :model="formInLine" class="factor">
            <el-select el-select v-model="formInLine.status" class="m-2" placeholder="请选择日期"
                       @change="statusChange">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-link type="primary" @click="downloadBill">
              <el-icon><Download /></el-icon>下载
            </el-link>

          </el-form>
          <el-table :data="tableData" style="height: 720px">
            <el-table-column
                v-for="(v,k) in tableLabel"
                :key="k"
                :prop="k"
                :label="v"
                style="border: 1px solid red"
            >
            </el-table-column>
          </el-table>
          <div class="demo-pagination-block">
            <div class="demonstration" style="margin-top: 7px;font-size: 12px;flex-grow: 1;">{{
                consumptionParam.size
              }}条记录
            </div>
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :total="consumptionParam.total"
                class="pager mt-4"
                @current-change="changePage"
                :current-page="consumptionParam.pageNum"
                :page-size="consumptionParam.pageSize"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="类别汇总" name="second">
          <el-form :inline="true" :model="formInLine" class="factor">
            <el-select el-select v-model="formInLine.status" class="m-2" placeholder="请选择日期"
                       @change="statusChange">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form>
          <el-table :data="tableDataOne" style="height: 720px">
            <el-table-column
                v-for="(v,k) in tableLabelOne"
                :key="k"
                :prop="k"
                :label="v"
            >
            </el-table-column>
          </el-table>
          <div class="demo-pagination-block">
            <div class="demonstration" style="margin-top: 7px;font-size: 12px;flex-grow: 1;">{{
                consumptionParam.size1
              }}条记录
            </div>
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :total="consumptionParam.total1"
                class="pager mt-4"
                @current-change="changePage"
                :current-page="consumptionParam.pageNum"
                :page-size="consumptionParam.pageSize"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="日期汇总" name="third">
          <el-form :inline="true" :model="formInLine" class="factor">
            <el-select el-select v-model="formInLine.status" class="m-2" placeholder="请选择日期"
                       @change="statusChange">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form>
          <el-table :data="tableDataTwo" style="height: 720px">
            <el-table-column
                v-for="(v,k) in tableLabelTwo"
                :key="k"
                :prop="k"
                :label="v"
            >
            </el-table-column>
          </el-table>
          <div class="demo-pagination-block">
            <div class="demonstration" style="margin-top: 7px;font-size: 12px;flex-grow: 1;">{{
                consumptionParam.size2
              }}条记录
            </div>
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :total="consumptionParam.total2"
                class="pager mt-4"
                @current-change="changePage"
                :current-page="consumptionParam.pageNum"
                :page-size="consumptionParam.pageSize"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="日期类目汇总" name="fourth">
          <el-form :inline="true" :model="formInLine" class="factor">
            <el-select el-select v-model="formInLine.status" class="m-2" placeholder="请选择日期"
                       @change="statusChange">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form>
          <el-table :data="tableDataThree" style="height: 720px">
            <el-table-column
                v-for="(v,k) in tableLabelThree"
                :key="k"
                :prop="k"
                :label="v"
            >
            </el-table-column>
          </el-table>
          <div class="demo-pagination-block">
            <div class="demonstration" style="margin-top: 7px;font-size: 12px;flex-grow: 1;">{{
                consumptionParam.size3
              }}条记录
            </div>
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :total="consumptionParam.total3"
                class="pager mt-4"
                @current-change="changePage"
                :current-page="consumptionParam.pageNum"
                :page-size="consumptionParam.pageSize"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
import {reactive} from "vue-demi";
import moment from "moment";
import config from "../config/index.js";

export default defineComponent({
  setup() {
    const {proxy} = getCurrentInstance()
    const tabPosition = ref('left');
    const activeName = ref('first');
    const card = ref('border-card');
    let tableData = ref([]);
    let tableDataOne = ref([]);
    let tableDataTwo = ref([]);
    let tableDataThree = ref([]);
    let studentId = window.sessionStorage.getItem('studentId');
    const formInLine = reactive({
      startTime: '',
      endTime: '',
      status: 0
    });
    const options = [
      {
        value: 0,
        label: '全部日期'
      },
      {
        value: 6,
        label: '近一日'
      },
      {
        value: 1,
        label: '近一周'
      },
      {
        value: 2,
        label: '近一月'
      },
      {
        value: 3,
        label: '近三月'
      },
      {
        value: 4,
        label: '近半年'
      },
      {
        value: 5,
        label: '近一年'
      }
    ]
    const tableLabel = {
      consumptionDate: '消费日期',
      consumptionType: '消费类目',
      amount: '消费金额',
      remark: '备注'
    }
    const tableLabelOne = {
      consumptionType: '消费类目',
      amountTotal: '消费金额'
    }
    const tableLabelTwo = {
      consumptionDate: '消费日期',
      amountTotal: '消费金额'
    }
    const tableLabelThree = {
      consumptionDate: '消费日期',
      consumptionType: '消费类目',
      amountTotal: '消费金额'
    }
    const consumptionParam = reactive({
      studentId: studentId,
      pageNum: 1,
      pageSize: 15,
      startTime: '',
      endTime: '',
      total: 0,
      size: 0,
      prePage: 0,
      total1: 0,
      size1: 0,
      prePage1: 0,
      total2: 0,
      size2: 0,
      prePage2: 0,
      total3: 0,
      size3: 0,
      prePage3: 0
    });
    const getUserSumConsumptionType = async () => {
      let res = await proxy.$api.getUserSumConsumptionType(consumptionParam);
      consumptionParam.total1 = res.total;
      consumptionParam.prePage1 = res.prePage
      consumptionParam.size1 = res.size
      tableDataOne.value = res.list
    }
    const getUserSumConsumptionDate = async () => {
      let res = await proxy.$api.getUserSumConsumptionDate(consumptionParam)
      consumptionParam.total2 = res.total;
      consumptionParam.prePage2 = res.prePage
      consumptionParam.size2 = res.size
      tableDataTwo.value = res.list
    }
    const getUserSumConsumptionDateAndType = async () => {
      let res = await proxy.$api.getUserSumConsumptionDateAndType(consumptionParam)
      consumptionParam.total3 = res.total;
      consumptionParam.prePage3 = res.prePage
      consumptionParam.size3 = res.size
      tableDataThree.value = res.list
    }
    const getTableList = async () => {
      let res = await proxy.$api.getTableData(consumptionParam);
      consumptionParam.total = res.total;
      consumptionParam.prePage = res.prePage
      consumptionParam.size = res.size
      tableData.value = res.list
    }

    /**
     * 账单下载
     * @returns {Promise<void>}
     */
    const downloadBill = async () => {
      /*let res = await proxy.$api.downloadBill(consumptionParam);
      downLoad(res);*/
      window.open(config.baseApi + '/consumption/downloadBill/' + consumptionParam.startTime + '/' + consumptionParam.endTime + '/' + consumptionParam.studentId);
    }

    const downLoad = (res, fileName) => {
      let name;
      if (fileName) {
        name = fileName;
      } else {
        if (res.headers["content-disposition"]) {
          const contentDisposition = res.headers["content-disposition"].split("=");
          name = (contentDisposition && decodeURI(contentDisposition[1])) || "";
        }
      }
      const file = new File([res.data], res.data);
      const href = URL.createObjectURL(file);
      const aTag = document.createElement("a");
      aTag.download = name;
      aTag.target = "_blank";
      aTag.href = href;
      aTag.click();
      URL.revokeObjectURL(href);
    }

    const now = ref(new Date());

    const yearStartTime = () => {
      const year = now.value.getFullYear();
      const today = new Date();
      const nextMonth = today.getMonth() + 1;
      const day = new Date(year, nextMonth, 0).getDate();
      const hours = 23;
      const minutes = 59;
      const seconds = 59;
      const milliseconds = 999;
      consumptionParam.startTime = moment(new Date(year, 0, 1)).format('YYYY-MM-DD');
      consumptionParam.endTime = moment(new Date(year, nextMonth - 1, day, hours, minutes, seconds, milliseconds).getTime()).format('YYYY-MM-DD');
    };
    const statusChange = () => {
      console.log(activeName.value);
      console.log(formInLine.status)
      if (formInLine.status === 1) {
        // 创建一个新的Date对象表示今天的日期
        let currentDate = new Date();
        let startDate = new Date();
        startDate.setDate(currentDate.getDate() - 6);
        // 计算一周的起止时间
        consumptionParam.startTime = moment(startDate).format('YYYY-MM-DD');
        consumptionParam.endTime = moment(currentDate).format('YYYY-MM-DD');
      } else if (formInLine.status === 2) {
        // 创建一个新的Date对象表示今天的日期
        let currentDate = new Date();
        let startDate = new Date();
        startDate.setDate(currentDate.getDate() - 29);
        // 计算一月的起止时间
        consumptionParam.startTime = moment(startDate).format('YYYY-MM-DD');
        consumptionParam.endTime = moment(currentDate).format('YYYY-MM-DD');
      } else if (formInLine.status === 3) {
        // 创建一个新的Date对象表示今天的日期
        let currentDate = new Date();
        let startDate = new Date();
        startDate.setDate(currentDate.getDate() - 89);
        // 计算一月的起止时间
        consumptionParam.startTime = moment(startDate).format('YYYY-MM-DD');
        consumptionParam.endTime = moment(currentDate).format('YYYY-MM-DD');
      } else if (formInLine.status === 4) {
        // 创建一个新的Date对象表示今天的日期
        let currentDate = new Date();
        let startDate = new Date();
        startDate.setDate(currentDate.getDate() - 179);
        // 计算一月的起止时间
        consumptionParam.startTime = moment(startDate).format('YYYY-MM-DD');
        consumptionParam.endTime = moment(currentDate).format('YYYY-MM-DD');
      } else if (formInLine.status === 5) {
        // 创建一个新的Date对象表示今天的日期
        let currentDate = new Date();
        let startDate = new Date();
        startDate.setDate(currentDate.getDate() - 364);
        // 计算一月的起止时间
        consumptionParam.startTime = moment(startDate).format('YYYY-MM-DD');
        consumptionParam.endTime = moment(currentDate).format('YYYY-MM-DD');
      } else if (formInLine.status === 6) {
        let currentDate = new Date();
        consumptionParam.startTime = moment(currentDate).format('YYYY-MM-DD');
        consumptionParam.endTime = moment(currentDate).format('YYYY-MM-DD');
      }
      if (activeName.value === 'first') {
        getTableList();
      } else if (activeName.value === 'second') {
        getUserSumConsumptionType();
      } else if (activeName.value === 'third') {
        getUserSumConsumptionDate();
      } else if (activeName.value === 'fourth') {
        getUserSumConsumptionDateAndType();
      }
    }


    const activeNameChange = () => {
      if (activeName.value === 'first') {
        getTableList();
      } else if (activeName.value === 'second') {
        getUserSumConsumptionType();
      } else if (activeName.value === 'third') {
        getUserSumConsumptionDate();
      } else if (activeName.value === 'fourth') {
        getUserSumConsumptionDateAndType();
      }
    }

    //分页
    const changePage = (page) => {
      console.log(page)
      consumptionParam.pageNum = page;
      if (activeName.value === 'first') {
        getTableList()
      } else if (activeName.value === 'second') {
        getUserSumConsumptionType();
      } else if (activeName.value === 'third') {
        getUserSumConsumptionDate();
      } else if (activeName.value === 'fourth') {
        getUserSumConsumptionDateAndType();
      }

    }

    onMounted(() => {
      getTableList();
      getUserSumConsumptionType();
      getUserSumConsumptionDate();
      getUserSumConsumptionDateAndType();
      yearStartTime();
    })
    return {
      tabPosition,
      getUserSumConsumptionType,
      getUserSumConsumptionDate,
      getUserSumConsumptionDateAndType,
      getTableList,
      tableLabel,
      tableLabelOne,
      tableLabelTwo,
      tableLabelThree,
      tableData,
      tableDataOne,
      tableDataTwo,
      tableDataThree,
      card,
      formInLine,
      options,
      statusChange,
      activeName,
      changePage,
      consumptionParam,
      activeNameChange,
      downloadBill
    }
  }
});
</script>
<style scoped lang="less">
#mainer {
  background-color: white;
  display: flex;
  height: 99%;
  width: 99%;
}

#left {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.demo-pagination-block {
  display: flex;
  flex-direction: row;
}
</style>