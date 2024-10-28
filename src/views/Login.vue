<template>
  <div class="bg">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-size: 20px;font-weight: bold">后台管理系统登录</span>
        </div>
      </template>
      <div class="login-container">
        <el-form :model="loginParams" label-width="auto">
          <el-form-item label-width="80px" label="账号" style="display: flex;">
            <el-input v-model="loginParams.loginName" class="w-50 m-2" type="text" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label-width="80px" label="密码" style="display: flex;">
            <el-input v-model="loginParams.password" class="w-50 m-2" type="password" placeholder="请输入密码"
              @keyup.enter="login"></el-input>
          </el-form-item>
          <el-form-item label-width="80px">
            <el-button type="success" style="width: 100%;font-weight: bold" @click="login">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
  <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" width="400px" align-center draggable>
    <div style="border-bottom: 1px solid #CCC;margin-bottom: 10px; padding: 5px;">
      <h2>邮件验证</h2>
    </div>
    <div>
      <el-form :inline="true" :model="formLine">
        <el-row>
          <el-col><strong>验证码已发送至邮箱：{{ formLine.email }}</strong></el-col>
        </el-row>
        <el-row></el-row>
        <el-row>
          <el-col>请输入验证码：</el-col>
        </el-row>
        <el-row></el-row>
        <el-row>
          <el-col :span="19">
            <el-form-item style="width: 100%;">
              <el-input type="text" v-model="formLine.checkId" placeholder="请输入验证码" @keyup.enter="resetLogin" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 5px;">
            <el-form-item>
              <el-button type="primary" @click="resetLogin" style="width: 70px;">确认</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="border: 1px solid #CCC; height: 80px; padding-left: 20px;">
          <el-col>没有收到邮件？请尝试重新获取</el-col>
          <el-button type="primary" v-if="countDown===0" @click="startCountdown" style="width: 150px;">重新获取验证码</el-button>
          <el-button type="primary" v-else disabled>重新获取验证码{{ countDown }}s</el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { getCurrentInstance, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from 'vue-router'
import store from "../store/index.js";

export default {
  name: 'Login',
  setup() {
    //挂载全局api
    const { proxy } = getCurrentInstance();
    let router = useRouter();
    let route = useRoute();
    //定义遮罩层
    const dialogFormVisible = reactive({ flag: false });
    //默认必穿参数
    const loginParams = reactive({
      loginName: '',
      password: '',
      count: 0
    });
    let countDown = ref(0);
    let email = ref(null);
    let formLine = reactive({
      checkId: '',
      email:''
    });

    let loginCheckParam = reactive({
      loginName: '',
      email: '',
      studentName: ''
    });

    let resetLoginParam = reactive({
      checkId: '',
      loginName: ''
    });
    const login = async () => {
      if (loginParams.loginName === '') {
        ElMessage.warning('请输入登录账号！');
        return;
      }
      if (loginParams.password === '') {
        ElMessage.warning('请输入登录密码！');
        return;
      }
      let res = await proxy.$api.login(loginParams)
      if (('status' in res)) {
        if (res.status === 2) {
          loginParams.count = loginParams.count + 1;
          ElMessage.warning('密码错误！');
          return;
        } else if (res.status === 3) {
          loginParams.count = 0;
          //ElMessage.success('登录成功');
          window.sessionStorage.setItem('token', res.token);
          window.sessionStorage.setItem('studentId', res.studentId);
          window.sessionStorage.setItem('studentName', res.studentName);
          window.sessionStorage.setItem('loginName', res.loginName);
          window.sessionStorage.setItem('role', res.role);
          formLine.email = res.email;
          formLine.email = formLine.email.replace(formLine.email.slice(2,6),'****');
          loginCheckParam.email = res.email;
          loginCheckParam.loginName = res.loginName;
          resetLoginParam.loginName = res.loginName;
          loginCheckParam.studentName = res.studentName;
          addLoginCheck();
          //clickLogin();
          dialogFormVisible.flag = true;
        } else if (res.status === 1) {
          ElMessage.warning('账号不存在！');
          return;
        } else if (res.status === 4) {
          ElMessage.warning('账号已锁定！');
          return;
        }
      }
    }
    const clickLogin = () => {
      router.push({
        name: 'main'
      });
      store.state.isLogin = true;
    }

    const startCountdown = () => {
      countDown.value = 60;
      addLoginCheck();
      const intervalId = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value --;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    }

    const resetLogin = () => {
      getCheckIdByOverdueTime();
    }

    const getCheckIdByOverdueTime = async () => {
      resetLoginParam.checkId = formLine.checkId;
      let res = await proxy.$api.getCheckIdByOverdueTime(resetLoginParam);
      if (res > 0) {
        ElMessage.success('登录成功！');
        dialogFormVisible.flag = false;
        clickLogin();
      } else {
        ElMessage.warning('验证码错误！');
        return;
      }
    }

    const addLoginCheck = async () => {
      let res = await proxy.$api.addLoginCheck(loginCheckParam);
    }

    return {
      loginParams,
      login,
      clickLogin,
      formLine,
      dialogFormVisible,
      resetLogin,
      countDown,
      startCountdown
    };
  }
}
</script>

<style scoped>
.box-card {
  border: 1px solid transparent;
  background-color: rgb(255, 255, 255, 0.1);
  box-shadow: 5px 5px 0 0 rgb(0, 0, 0, 0.2);
  width: 480px;
  height: 240px;
  position: absolute;
  left: calc(50% - 250px);
  top: calc(50% - 120px);
}

.bg {
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/bg.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
}

.el-form-item__content {
  margin-left: 0 !important;
}
</style>