<template>
  <el-aside :width="$store.state.isCollapse ? '200px' : '64px'">
    <el-menu
        class="el-menu-vertical-demo"
        background-color="#888888"
        text-color="white"
        :collapse="!$store.state.isCollapse"
    >
      <h2>后台管理系统</h2>
      <el-menu-item
          :index="item.path"
          v-for="item in noChildren()"
          :key="item.path"
          @click="clickMenu(item)">
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu :index="item.label" v-for="item in hasChildren()" :key="item.path">
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
              :index="subItem.path"
              v-for="(subItem,subIndex) in item.children"
              :key="subIndex"
              @click="clickMenu(subItem)">
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script>
import { useRouter } from 'vue-router'
import {getCurrentInstance, onMounted, reactive, ref} from "vue";

import {useStore} from "vuex";

export default {
  name: "CommonAside",
  setup() {
    const store = useStore();
    const {proxy} = getCurrentInstance();
    let router = useRouter();
    let role = window.sessionStorage.getItem('role');
/*    const list = [
      {
        path: '/',
        name: 'user',
        label: '用户管理',
        icon: 'user',
        url: 'UserManage/UserManage'
      },
      {
        label: '其他',
        path: '/other',
        icon: 'location',
        children: [
          {
            path: '/page1',
            name: 'page1',
            label: '页面1',
            icon: 'setting',
            url: 'Other/pageOne'
          },
          {
            path: '/page2',
            name: 'page2',
            label: '页面2',
            icon: 'setting',
            url: 'Other/pageTwo'
          }
        ]
      }
    ]*/

    const lists = ref([]);

    let params = reactive({
      role: role
    });
    const getTableList = async () => {
      let res = await proxy.$api.getMenuList(params);
      lists.value = res
    }

    const noChildren = () => {
      return lists.value.filter((item) => !item.children)
    }
    
    const hasChildren = () => {
      return lists.value.filter((item) => item.children)
    }
    const clickMenu = (item) => {
      router.push({
        name:item.name,
      })
      // vuex 管理面包屑
      store.commit('selectMenu',item)
    }
    onMounted(() => {
      getTableList();
    })
    return {
      noChildren,
      hasChildren,
      clickMenu,
      lists,
    }
  }
}
</script>

<style lang="less" scoped>
  .icons{
    height: 16px;
    width: 16px;
  }
  .el-menu-vertical-demo{
    border-right: none;
    h2{
      line-height: 45px;
      color: white;
      text-align: center;
    }
  }
</style>