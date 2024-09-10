<template>
  <div class="mainClass">
    <div class="safe-header">
      <el-form :inline="true" :model="safeForm" class="factor" style="margin-top: 12px">
        <el-form-item label="姓名" style="margin-left: 20px">
          <el-input v-model="safeForm.studentName" class="w-50 m-2" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="登录账号">
          <el-input v-model="safeForm.loginName" class="w-50 m-2" type="text" style="width: 200px;" />
        </el-form-item>
        <el-form-item class="addBtn">
          <el-button type="success" @click="getStudentUnlock" style="width: 100px;">查询</el-button>
          <el-button type="default" @click="clear" style="width: 100px;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table v-loading="loading" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange1"
        :stripe="true" :height="720" :highlight-current-row="true" :fit="true">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width ? item.width : 380">
          <template v-if="item.prop === 'operator'" v-slot="scope">
            <el-button link type="primary" size="small" @click="clickTable(scope.row)">
              <el-icon style="vertical-align: middle">
                <Unlock />
              </el-icon>
              解锁
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "SafeManager",
  setup() {
    //挂载全局api
    const { proxy } = getCurrentInstance()
    let tableData = ref([]);
    let loginName = '';
    const store = useStore();
    const dialogFormVisible = reactive({
      flag: false
    });
    //默认必穿参数
    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      pageNum: 1,
      pageSize: 10,
      studentName: '',
      loginName: ''
    });
    const tableLabel = reactive([
      {
        prop: "studentName",
        label: "学生姓名"
      },
      {
        prop: "loginName",
        label: "账号"
      },
      {
        prop: "workStatus",
        label: "状态"
      },
      {
        prop: "operator",
        label: "操作"
      }
    ]);
    //表格参数对象
    const safeForm = reactive({
      studentName: '',
      loginName: ''
    });

    const getStudentUnlock = async () => {
      let res = await proxy.$api.getStudentUnlock(safeForm);
      console.log(res);
      tableData.value = res;
    }

    const handleSelectionChange1 = (selection) => {
      if (selection.length > 1) {
        this.loginName = selection[0].loginName;
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(selection.pop());
      }
    }
    const clickTable = async (click) => {
      let res = await proxy.$api.unlock(click.studentId);
      if (res === 1) {
        ElMessage.success("解锁成功！");
        await getStudentUnlock();
      } else {
        ElMessage.warning("解锁失败！");
      }
    }

    //清空
    const clear = () => {
      safeForm.loginName = '';
      safeForm.studentName = '';
    }

    return {
      tableLabel,
      tableData,
      loading: computed(() => store.state.loading),
      dialogFormVisible,
      safeForm,
      getStudentUnlock,
      handleSelectionChange1,
      loginName,
      params,
      clickTable,
      clear
    }
  }
}
</script>

<style lang="less" scoped>
.safe-header {
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 7px;
  border-radius: 5px;

  .factor {
    font-family: 华文宋体 bold, serif;
    color: #999999;
    font-weight: bold;
    font-size: 14px;
    height: 40px;

    .el-link {
      font-family: 华文仿宋 bold;
      font-weight: bold;
      font-size: 14px;
      margin-top: 2px;
    }
  }
}

.addBtn {
  float: right;
}

.mainClass {
  padding: 5px;
  width: 99%;
  height: 98%;
  background-color: white;
}
</style>