<template>
  <el-header>
    <div class="l-content">
      <!--图标的展示-->
      <el-button size="small">
        <el-icon :size="20">
          <Menu/>
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{ current.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
    <span class="el-dropdown-link" style="color: white;font-weight: bold;font-size: 14px;padding: 5px">
      {{ studentName }}
      <img class="img" :src="getImgSrc('user')">
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogFormVisible.flag = true">密码修改</el-dropdown-item>
            <el-dropdown-item @click="logOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
    <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" width="550px" title="密码修改" align-center
      draggable>
      <el-form :inline="true" :model="passwordForm" class="addForm">
        <el-row>
          <el-form-item label="原密码" style="margin: 20px 0px 0px 70px;">
            <el-input v-model="passwordForm.password" class="w-50 m-2" type="password" style="width: 280px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" style="margin: 20px 0px 0px 70px;">
            <el-input v-model="passwordForm.newPassword" class="w-50 m-2" type="password" style="width: 280px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="float: right; margin: 0; padding: 0;">
          <el-form-item style="margin: 30px 0px 0px 0px;">
            <el-button :plain="true" type="primary" style="width: 100px" @click="updPassword">确认</el-button>
            <el-button style="width: 100px" @click="cancel">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
</template>

<script>
import {computed, defineComponent,getCurrentInstance,reactive} from 'vue'
import {useStore} from 'vuex'
import router from "../router/index.js";
import { ElMessage } from 'element-plus';

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    let studentName = window.sessionStorage.getItem('studentName');
    let studentId = window.sessionStorage.getItem('studentId');
    let getImgSrc = (user) => {
      return new URL(`../assets/images/${user}.jpg`, import.meta.url).href
    }
    let handleCollapse = () => {
      //调用vuex中的mutations
      store.commit("updateIsCollapse");
    }
    //计算属性
    const current = computed(() => {
      return store.state.currentMenu;
    })
    const logOut = () => {
      window.sessionStorage.clear();
      router.push({
        name: 'login'
      });
      store.state.isLogin = false;
    }
    const dialogFormVisible = reactive({
      flag: false
    });
    //表单对象
    const passwordForm = reactive({
      password: '',
      passwordForm: '',
      studentId: studentId
    });

    const cancel = () => {
      dialogFormVisible.flag = false;
    }

    let updPassword = async () => {
      let res = await proxy.$api.updPassword(passwordForm);
      ElMessage.success("密码修改成功！");
      dialogFormVisible.flag = false;
    }

    return {
      getImgSrc,
      handleCollapse,
      current,
      logOut,
      studentName,
      passwordForm,
      cancel,
      updPassword,
      dialogFormVisible
    }
  }
})
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #888888;
}

.r-content .img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.l-content {
  display: flex;
  align-items: center;
}

.l-content h3 {
  color: white;
  margin-left: 20px;
}

.bread /deep/ span {
  color: #fff !important;
  cursor: pointer !important;
}
</style>