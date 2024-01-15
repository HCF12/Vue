<template>
  <div id="mainer">
    <div id="header">
      <el-form :inline="true" :model="formInLine" class="factor">
        <el-form-item label="批次号" style="margin: 10px;">
          <el-input v-model="formInLine.batchId" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户编号" style="margin: 10px;">
          <el-input v-model="formInLine.customerNo" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户姓名" style="margin: 10px;">
          <el-input v-model="formInLine.customerName" class="w-50 m-2" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="主题" style="margin: 10px;">
          <el-input v-model="formInLine.subject" class="w-50 m-2" type="text" style="width: 190px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="期望发送时间" style="margin: 10px;">
          <el-date-picker
              v-model="formInLine.startTime"
              type="datetime"
              placeholder="请输入开始时间"
              format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="~" style="margin: 10px;">
          <el-date-picker
              v-model="formInLine.endTime"
              type="datetime"
              placeholder="请输入结束时间"
              format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
    </div>
    <div>
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
        prop: "content",
        label: "正文",
        width: 400
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
      startTime: '',
      endTime: '',
      subject: '',
      batchId: ''
    });

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

    const getEmailGroupSendHisInfo = async () =>{
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
      params.startTime = formInLine.startTime;
      params.endTime = formInLine.endTime;
      params.subject = formInLine.subject;
      getEmailGroupSendHisInfo(params)
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
    onMounted( () => {
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
      clear
    }
  }
}
</script>

<style lang="less" scoped>
#header {
  justify-content: space-between;
  border-radius: 5px;
  height: 50px  ;
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
  float: right; width: 4%;
  display: inline-block;
  font-size: 15px;
  font-weight: bold;
  font-family: 华文宋体 bold;
}
</style>