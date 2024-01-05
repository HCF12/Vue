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
          <el-form-item label="账号" style="display: flex;">
            <el-input v-model="loginParams.loginName" class="w-50 m-2" type="text" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" style="display: flex;">
            <el-input v-model="loginParams.password" class="w-50 m-2" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" style="width: 100%;font-weight: bold" @click="login">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import {getCurrentInstance, reactive} from "vue";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from 'vue-router'
import store from "../store/index.js";

export default {
  name: 'Login',
  setup() {
    //挂载全局api
    const {proxy} = getCurrentInstance();
    let router = useRouter();
    let route = useRoute();
    //默认必穿参数
    const loginParams = reactive({
      loginName: '',
      password: '',
      count: 0
    });
    const login = async () => {
      if(loginParams.loginName === ''){
        ElMessage.warning('请输入登录账号！');
        return;
      }
      if(loginParams.password === ''){
        ElMessage.warning('请输入登录密码！');
        return;
      }
      let res = await proxy.$api.login(loginParams)
      if(('status' in res)){
        if(res.status === 2){
          loginParams.count =  loginParams.count + 1;
          ElMessage.warning('密码错误！');
          return;
        }else if(res.status === 3){
          loginParams.count =  0;
          ElMessage.success('登录成功');
          window.sessionStorage.setItem('token',res.token);
          window.sessionStorage.setItem('studentId',res.studentId);
          window.sessionStorage.setItem('studentName',res.studentName);
          window.sessionStorage.setItem('loginName',res.loginName);
          clickLogin();
        }else if(res.status === 1){
          ElMessage.warning('账号不存在！');
          return;
        }else if(res.status === 4){
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

    return {
      loginParams,
      login,
      clickLogin
    };
  }
}
</script>

<style scoped>
.box-card {
  border: 1px solid transparent;
  background-color: rgb(255,255,255,0.1);
  box-shadow: 5px 5px 0 0 rgb(0,0,0,0.2);
  width: 480px;
  height: 240px;
  position: absolute;
  left: calc(50% - 250px);
  top: calc(50% - 120px);
}
.bg{
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/bg.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>