<template>
  <div class="mainClass" style="display: flex;flex-direction: column;">
    <div class="user-header">
      <el-form :inline="true" :model="formInLine" class="factor" style="margin-top: 12px">
        <el-form-item label="学生姓名" style="margin-left: 20px">
          <el-input v-model="formInLine.studentName" class="w-50 m-2" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否掩码">
          <el-switch v-model="formInLine.permission" class="ml-2" inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y" inactive-text="N"
            @change="changeStatus" />
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="success" @click="handleSearch" style="width: 100px;">查询</el-button>
          <el-button type="default" @click="resetQueryParams" style="width: 100px;">重置</el-button>
          <el-button type="primary" @click="dialogFormVisible.flag = true" style="width: 100px;">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" width="850px" title="人员新增" align-center
      draggable>
      <el-form :inline="true" :model="addStuForm" class="addForm">
        <el-row>
          <el-form-item label="姓名" style="margin-left: 20px;">
            <el-input v-model="addStuForm.studentName" class="w-50 m-2" type="text" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="80px">
            <el-input v-model="addStuForm.mobile" class="w-50 m-2" type="text" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="addStuForm.gender" class="m-2" placeholder="请选择" style="width: 180px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账号" style="margin-left: 20px;">
            <el-input v-model="addStuForm.loginName" class="w-50 m-2" type="text" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="80px">
            <el-input v-model="addStuForm.password" class="w-50 m-2" type="password" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="addStuForm.role" class="m-2" placeholder="请选择" style="width: 180px;">
              <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" style="margin-left: 20px; display: flex;">
              <el-input v-model="addStuForm.address" class="w-50 m-2" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="float: right">
          <el-form-item style="margin: 30px 0px 0px 0px;">
            <el-button :plain="true" type="primary" style="width: 100px" @click="insertEnter">确认</el-button>
            <el-button style="width: 100px" @click="cancel">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="table" style="display: flex;flex-direction: column;flex-grow: 1">
      <el-table v-loading="loading" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange1"
        :stripe="true" :fit="true" style="border-radius: 5px;flex-grow: 1" highlight-current-row>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width ? item.width : 240">
        </el-table-column>
      </el-table>
      <div id="footer">
        <div class="demonstration" style="flex-grow: 1;font-size: 12px;">{{ params.size }}条记录</div>
        <el-pagination small background layout="prev, pager, next" :total="params.total" class="pager mt-4"
          @current-change="changePage" :current-page="params.pageNum" :page-size="params.pageSize" />
      </div>
    </div>
  </div>
</template>

<script>

import { getCurrentInstance, onMounted, ref, reactive, computed, nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "User",
  setup() {
    //挂载全局api
    const { proxy } = getCurrentInstance()
    let tableData = ref([]);
    const store = useStore()
    const dialogFormVisible = reactive({
      flag: false
    })
    const tableLabel = reactive([
      {
        prop: "studentName",
        label: "学生姓名"
      },
      {
        prop: "gender",
        label: "性别"
      },
      {
        prop: "mobile",
        label: "手机号"
      },
      {
        prop: "address",
        label: "地址",
        width: "400"
      },
      {
        prop: "workStatus",
        label: "状态"
      },
      /* {
         prop: "gradeName",
         label: "年级"
       },
       {
         prop: "className",
         label: "班级"
       },*/
      {
        prop: "loginName",
        label: "账号"
      }
    ])
    const openVn = () => {
      ElMessage('this is a message.')
    }
    const options = [
      {
        value: 1,
        label: '男'
      },
      {
        value: 2,
        label: '女'
      }

    ]
    const roleOptions = ref([]);
    const gradeData = ref([]);

    const classData = ref([]);
    //注册返回
    const registerData = ref([]);

    //默认必穿参数
    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      maskPermission: 1,
      pageNum: 1,
      pageSize: 15,
      studentName: ''
    })

    const getStudentList = async () => {
      let res = await proxy.$api.getStudentList(params)
      params.total = res.total;
      params.prePage = res.prePage
      params.size = res.size
      tableData.value = res.list.map((item) => {
        item.gradeName = item.grade.gradeName;
        item.className = item.cls.className;
        return item;
      });
    }

    const getGradeList = async () => {
      let res = await proxy.$api.getGradeList()
      gradeData.value = res
    }

    //角色
    const getRoleList = async () => {
      let res = await proxy.$api.getRoleList()
      roleOptions.value = res
    }
    const classParams = reactive({
      gradeId: ''
    })
    //班级
    const getClassList = async () => {
      classParams.gradeId = addStuForm.gradeId
      let res = await proxy.$api.getClassList(classParams);
      classData.value = res;

    }


    //分页
    const changePage = (page) => {
      console.log(page)
      params.pageNum = page;
      getStudentList(params)
    }

    const changeStatus = (permission) => {
      if (permission === true) {
        params.maskPermission = 0
      } else {
        params.maskPermission = 1
      }
      getStudentList(params)
    }

    //表格参数对象
    const formInLine = reactive({
      studentName: '',
      permission: 1
    });

    //表单对象
    const addStuForm = reactive({
      studentName: '',
      gender: '',
      mobile: '',
      address: '',
      gradeId: '',
      classId: '',
      loginName: '',
      password: '',
      role: ''
    });
    //注册
    const registerStudent = async () => {
      let res = await proxy.$api.addStudent(addStuForm);
      registerData.value = res;
      getStudentList(params);
      dialogFormVisible.flag = false;
      ElMessage.success('注册成功');
    }
    //新增确定
    const insertEnter = () => {
      registerStudent()
    }
    const handleSearch = () => {
      params.studentName = formInLine.studentName;
      getStudentList(params)
    }
    const cancel = () => {
      dialogFormVisible.flag = false;
    }
    const handleSelectionChange1 = (selection) => {
      if (selection.length > 1) {
        this.ids1 = selection[0].studentName;
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(selection.pop());
        this.$refs.multipleTable.setCurrentRow(tableData.value[0]);
      }
    }
    //重置
    let resetQueryParams = () => {
      formInLine.permission = 1;
      formInLine.studentName = '';
    }

    onMounted(() => {
      getStudentList(params);
      getGradeList();
      getRoleList();
    })
    return {
      tableLabel,
      tableData,
      changePage,
      params,
      classParams,
      changeStatus,
      formInLine,
      handleSearch,
      loading: computed(() => store.state.loading),
      dialogFormVisible,
      addStuForm,
      options,
      gradeData,
      classData,
      getGradeList,
      getClassList,
      registerStudent,
      registerData,
      insertEnter,
      openVn,
      handleSelectionChange1,
      cancel,
      roleOptions,
      resetQueryParams
    }
  }
}
</script>

<style lang="less" scoped>
.user-header {
  .factor {
    font-family: 华文宋体 bold;
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

.mainClass {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: white;
}

#footer {
  display: flex;
  flex-direction: row;
  padding: 5px;
}
</style>