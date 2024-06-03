<template>
  <div id="mainer">
    <div id="header">
      <el-form :inline="true" :model="formInLine" class="factor">
        <el-form-item label="期望发送时间" style="margin: 10px;">
          <el-date-picker
              v-model="formInLine.expectedTime"
              type="datetimerange"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="请输入开始时间"
              end-placeholder="请输入结束时间"
          />
        </el-form-item>
        <div style="float: right;margin-top: 10px;">
          <el-link type="primary" @click="clear" class="queryClass">
            <el-icon>
              <RefreshLeft/>
            </el-icon>
            清空
          </el-link>
          <el-link type="primary" @click="handleSearch" class="queryClass">
            <el-icon>
              <search/>
            </el-icon>
            查询
          </el-link>
        </div>
      </el-form>
    </div>
    <div id="table">
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
    <div id="footer" style="display:flex;flex-direction:row;height:40px;">
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
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {reactive} from "vue-demi";
import {useStore} from "vuex";

export default {
  setup() {
    const {proxy} = getCurrentInstance();
    const store = useStore();
    const formInLine = reactive({
      customerNo: '',
      customerName: '',
      expectedTime: [],
      subject: '',
      batchId: ''
    });
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
        prop: "expectedStartDate",
        label: "期望发送时间",
        width: 260
      }
    ]);
    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      pageNum: 1,
      pageSize: 15,
      customerNo: '',
      customerName: '',
      startTime: '',
      endTime: '',
      subject: '',
      batchId: ''
    });
    const getAllEmailGroupSendTask = async () => {
      let res = await proxy.$api.getAllEmailGroupSendTask(params);
      params.total = res.total;
      params.prePage = res.prePage
      params.size = res.size
      tableData.value = res.list;
    }

    //分页
    const changePage = (page) => {
      console.log(page)
      params.pageNum = page;
      getAllEmailGroupSendTask();
    }
    const handleSearch = () => {
      params.customerNo = formInLine.customerNo;
      params.customerName = formInLine.customerName;
      params.batchId = formInLine.batchId;
      params.startTime = formInLine.expectedTime[0];
      params.endTime = formInLine.expectedTime[1];
      params.subject = formInLine.subject;
      getAllEmailGroupSendTask(params)
    }

    //清空
    const clear = () => {
      formInLine.startTime = '';
      formInLine.endTime = '';
      formInLine.customerNo = '';
      formInLine.customerName = '';
      formInLine.batchId = '';
      formInLine.subject = '';
    }
    onMounted(() => {
      getAllEmailGroupSendTask();
    });
    return {
      formInLine,
      loading: computed(() => store.state.loading),
      tableData,
      tableLabel,
      params,
      clear,
      handleSearch,
      changePage
    }
  }
}
</script>

<style lang="less" scoped>
#mainer {
  padding: 5px;
  width: 99%;
  height: 98%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

#header {
  width: 100%;
  height: 60px;
}

#table {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.queryClass {
  margin-right: 7px;
  font-size: 15px;
  font-weight: bold;
}
</style>