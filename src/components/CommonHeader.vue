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
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="logOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import {computed, defineComponent} from 'vue'
import {useStore} from 'vuex'
import router from "../router/index.js";

export default defineComponent({
  setup() {
    const store = useStore();
    let studentName = window.sessionStorage.getItem('studentName');
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
    return {
      getImgSrc,
      handleCollapse,
      current,
      logOut,
      studentName
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