<template>
  <div class="mainClass" style="display: flex;flex-direction: column;">
    <div class="user-header">
      <el-form :inline="true" :model="formInLine" class="factor" style="margin-top: 12px">
        <el-form-item label="学生姓名" style="margin-left: 20px">
          <el-input v-model="formInLine.studentName" class="w-50 m-2" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否掩码">
          <el-switch
              v-model="formInLine.permission"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="Y"
              inactive-text="N"
              @change="changeStatus"
          />
        </el-form-item>
        <el-form-item style="float: right;">
          <el-link type="primary" @click="handleSearch">
            <el-icon>
              <search/>
            </el-icon>
            查询
          </el-link>
        </el-form-item>
        <el-form-item label-width="80%" style="float: right;">
          <el-link type="primary" @click="dialogFormVisible.flag = true">
            <el-icon>
              <Plus/>
            </el-icon>
            新增
          </el-link>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" title="人员新增">
      <el-form :model="addStuForm" class="addForm" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名：" style="display: flex">
              <el-input v-model="addStuForm.studentName" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="性别：" style="display: flex">
              <el-select v-model="addStuForm.gender" class="m-2" placeholder="请选择" style="width: 100%;">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号码：" style="display: flex">
              <el-input v-model="addStuForm.mobile" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址：" style="display: flex">
              <el-input v-model="addStuForm.address" class="w-50 m-2" :rows="3"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="年级：" style="display: flex">
              <el-select v-model="addStuForm.gradeId" class="w-50 m-2" placeholder="请选择" style="width: 100%;"
                         @change="getClassList">
                <el-option
                    v-for="item in gradeData"
                    :key="item.gradeId"
                    :label="item.gradeName"
                    :value="item.gradeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="班级：" style="display:flex;">
              <el-select v-model="addStuForm.classId" class="el-select-v2__wrapper" placeholder="请选择"
                         style="width: 100%;">
                <el-option
                    v-for="item in classData"
                    :key="item.classId"
                    :label="item.className"
                    :value="item.classId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="登录名：" style="display: flex">
              <el-input v-model="addStuForm.loginName" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="密码：" style="display: flex">
              <el-input v-model="addStuForm.password" class="w-50 m-2" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item style="display: flex;float: right">
              <el-button :plain="true" type="primary" style="width: 100%" @click="insertEnter">确认</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item style="display: flex;float: right">
              <el-button style="width: 100%" @click="cancel">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="table" style="display: flex;flex-direction: column;flex-grow: 1">
      <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange1"
          :stripe="true"
          :fit="true"
          style="border-radius: 5px;flex-grow: 1"
          highlight-current-row>
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : 190"
        >
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-row style="display: flex;background-color: white;padding: 5px;border-radius: 5px">
          <el-col :span="2">
            <div class="demonstration" style="margin-top: 7px;font-size: 12px">{{ params.size }}条记录</div>
          </el-col>
          <el-col :span="22">
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
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

import {getCurrentInstance, onMounted, ref, reactive, computed, nextTick} from "vue";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "User",
  setup() {
    //挂载全局api
    const {proxy} = getCurrentInstance()
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
        width: "260"
      },
      {
        prop: "workStatus",
        label: "状态"
      },
      {
        prop: "gradeName",
        label: "年级"
      },
      {
        prop: "className",
        label: "班级"
      },
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
      if (permission == true) {
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
      password: ''
    });
    //注册
    const registerStudent = async () => {
      let res = await proxy.$api.addStudent(addStuForm);
      registerData.value = res;
      dialogFormVisible.flag = false
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

    onMounted(() => {
      getStudentList(params);
      getGradeList();
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
      cancel
    }
  }
}
</script>

<style lang="less" scoped>
.user-header {
  background-color: white;
  border-radius: 5px;

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

//弹框头部
::v-deep .el-dialog__header {
  --el-text-color-primary: #1EFFFF;
  --el-text-color-regular: #fff;
  padding: 0 !important;
  width: 100%;
  height: 64px;
  background: #7986CB;
}

//弹框标题
::v-deep .el-dialog__title {
  margin-left: 24px;
  line-height: 64px;
}

.mainClass {
  padding: 5px;
  width: 99%;
  height: 98.5%;
}
</style>