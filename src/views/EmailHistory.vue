<template>
  <div id="mainer">
    <div id="header">
      <el-form :inline="true" :model="formInLine" class="factor">
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.batchId" placeholder="批次号" type="text" style="width: 240px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.customerNo" placeholder="客户编号" type="text" style="width: 240px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.customerName" placeholder="客户名称" class="w-50 m-2" type="text" style="width: 240px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.subject" placeholder="主题" class="w-50 m-2" type="text" style="width: 240px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-date-picker
              v-model="formInLine.expectedTime"
              type="datetimerange"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="请输入开始时间"
              end-placeholder="请输入结束时间"
              class="dateClass"
          />
        </el-form-item>
        <el-form-item class="queryClass">
          <el-link type="primary" @click="clear" style="font-size: 15px;font-weight: bold;font-family: 华文宋体 bold;">
            <el-icon>
              <RefreshLeft/>
            </el-icon>
            清空
          </el-link>
        </el-form-item>
        <el-form-item class="queryClass">
          <el-link type="primary" @click="handleSearch"
                   style="font-size: 15px;font-weight: bold;font-family: 华文宋体 bold;">
            <el-icon>
              <search/>
            </el-icon>
            查询
          </el-link>
        </el-form-item>
      </el-form>
    </div>
    <div id="bod" style="display:flex;flex-direction: column;flex-grow: 1">
      <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :stripe="true"
          :fit="true"
          style="border-radius: 5px;flex-grow: 1;"
          highlight-current-row>
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : 130"
        >
        </el-table-column>
      </el-table>
    </div>
    <div id="footer" style="display:flex;flex-direction:row;height:40px; margin-top: 10px;">
      <div class="demonstration" style="flex-grow: 1;font-size: 12px;margin-top: 7px;">{{ params.size }}条记录</div>
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="params.total"
          class="pager mt-4"
          @current-change="changePage"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
      />
    </div>
  </div>
</template>

<script>
import {reactive} from "vue-demi";
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {useStore} from "vuex";
export default {
  setup() {
    const {proxy} = getCurrentInstance()
    const store = useStore();
    let tableData = ref([]);
    const tableLabel = reactive([
      {
        prop: "batchGuid",
        label: "批次号",
        width: 200
      },
      {
        prop: "description",
        label: "模板名称",
        width: 200
      },
      {
        prop: "customerNo",
        label: "客户编号",
        width: 150
      },
      {
        prop: "customerName",
        label: "客户姓名",
        width: 200
      },
      {
        prop: "email",
        label: "接收邮箱",
        width: 240
      },
      {
        prop: "carbon",
        label: "抄送邮箱",
        width: 260
      },
      {
        prop: "subject",
        label: "主题",
        width: 200
      },
      {
        prop: "pie",
        label: "发送通道",
        width: 150
      },
      {
        prop: "createdDate",
        label: "发送时间",
        width: 260
      }
    ]);
    const formInLine = reactive({
      customerNo: '',
      customerName: '',
      expectedTime: [],
      subject: '',
      batchId: ''
    });

    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      pageNum: 1,
      pageSize: 10,
      customerNo: '',
      customerName: '',
      startTime: '',
      endTime: '',
      subject: '',
      batchId: ''
    });

    const getEmailGroupSendHisInfo = async () => {
      let res = await proxy.$api.getEmailGroupSendHisInfo(params);
      params.total = res.total;
      params.prePage = res.prePage
      params.size = res.size
      tableData.value = res.list;
    }

    //分页
    const changePage = (page) => {
      console.log(page)
      params.pageNum = page;
      getEmailGroupSendHisInfo();
    }
    const handleSearch = () => {
      params.customerNo = formInLine.customerNo;
      params.customerName = formInLine.customerName;
      params.batchId = formInLine.batchId;
      params.startTime = formInLine.expectedTime[0];
      console.log(params.startTime)
      params.endTime = formInLine.expectedTime[1];
      params.subject = formInLine.subject;
      getEmailGroupSendHisInfo(params)
    }

    //清空
    const clear = () => {
      formInLine.expectedTime = [];
      formInLine.customerNo = '';
      formInLine.customerName = '';
      formInLine.batchId = '';
      formInLine.subject = '';
    }
    onMounted(() => {
      getEmailGroupSendHisInfo();
    });

    return {
      formInLine,
      tableLabel,
      loading: computed(() => store.state.loading),
      tableData,
      params,
      changePage,
      handleSearch,
      clear,
    }
  }
}
</script>

<style lang="less" scoped>
#header {
  justify-content: space-between;
  border-radius: 5px;
  height: 50px;

  .factor {
    font-family: 华文宋体 bold;
    color: #999999;
    font-weight: bold;
    font-size: 14px;
  }
}

#mainer {
  padding: 5px;
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 99%;
  height: 98%;
}


.queryClass {
  padding: 7px;
  float: right;
  margin: auto 0;
}

</style>