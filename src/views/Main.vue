<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <el-aside width="200px">
        <common-aside />
      </el-aside>
      <el-container>
        <common-header/>
        <common-tab />
        <el-main class="right-main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import CommonHeader from "../components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import CommonTab from "../components/CommonTab.vue";
export default defineComponent({
  components: {
    CommonHeader,
    CommonAside,
    CommonTab
  }
})
</script>

<style>
.el-main right-main{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>