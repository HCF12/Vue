<template>
  <div class="mainClass">
    <div class="user-header">
      <el-form :inline="true" :model="formInLine" class="factor">
        <el-form-item label="任务名称" style="margin: 10px;">
          <el-input v-model="formInLine.jobName" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="任务描述" style="margin: 10px;">
          <el-input v-model="formInLine.description" class="w-50 m-2" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="addBtn">
          <el-link type="primary" @click="handleSearch">
            <el-icon>
              <search/>
            </el-icon>
            查询
          </el-link>
        </el-form-item>
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
        <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : 130"
        >
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <div class="demonstration" style="margin-top: 7px;font-size: 12px;flex-grow: 1;">{{ params.size }}条记录</div>
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
  </div>
</template>

<script>
import {reactive} from "vue-demi";
import {useStore} from "vuex";
import {computed, getCurrentInstance, onMounted, onUnmounted, ref} from "vue";

export default {
  setup() {
    const {proxy} = getCurrentInstance()
    let tableData = ref([]);
    let intervalId;
    const store = useStore();
    const tableLabel = reactive([
      {
        prop: "jobName",
        label: "任务名称",
        width: 240
      },
      {
        prop: "description",
        label: "任务描述",
        width: 240
      },
      {
        prop: "cron",
        label: "执行规则",
        width: 240
      },
      {
        prop: "startTime",
        label: "开始时间",
        width: 220
      },
      {
        prop: "previousFireTime",
        label: "当前执行时间",
        width: 220
      },
      {
        prop: "nextFireTime",
        label: "下次执行时间",
        width: 220
      },
      {
        prop: "timeZone",
        label: "时区"
      },
      {
        prop: "jobStatus",
        label: "任务状态"
      }
    ]);
    //默认必穿参数
    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      pageNum: 1,
      pageSize: 15,
      jobName: '',
      description: ''
    });

    //表格参数对象
    const formInLine = reactive({
      jobName: '',
      description: ''
    });

    const getCronExpression = async () => {
      let res = await proxy.$api.getCronExpression(params);
      params.total = res.total;
      params.prePage = res.prePage
      params.size = res.size
      tableData.value = res.list;
    }

    //分页
    const changePage = (page) => {
      console.log(page)
      params.pageNum = page;
      getCronExpression(params);
    }
    const handleSearch = () => {
      params.jobName = formInLine.jobName;
      params.description = formInLine.description;
      getCronExpression(params)
    }

    onMounted(() => {
      intervalId = setInterval(() => {
        getCronExpression(params)
      }, 60000);
    });
    // 在组件卸载时清除定时器，防止内存泄漏
    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      params,
      tableLabel,
      tableData,
      loading: computed(() => store.state.loading),
      formInLine,
      getCronExpression,
      changePage,
      handleSearch
    }
  }
}
</script>

<style lang="less" scoped>
.user-header {
  justify-content: space-between;
  border-radius: 5px;

  .factor {
    font-family: 华文宋体 bold;
    color: #999999;
    font-weight: bold;
    font-size: 14px;
  }

  .el-link {
    font-family: 华文仿宋 bold;
    font-weight: bold;
    font-size: 15px;
    margin-top: 2px;
  }
}

.mainClass {
  width: 99%;
  height: 98%;
  padding: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.addBtn {
  float: right;
}

#table {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.demo-pagination-block {
  display: flex;
  flex-direction: row;
}
</style>