<template>
  <div class="tags">
    <el-tag
        :key="tag.name"
        v-for="(tag,index) in tags"
        :closable="tag.name !== 'home' ? true : false"
        :disable-transitions="false"
        :effect="$route.name === tag.name ? 'dark' : 'plain'"
        @click="changeMenu(tag)"
        @close="handleClose(tag,index)"
    >
      {{tag.label}}
    </el-tag>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {useRouter,useRoute} from "vue-router";
export default {
  name: "CommonTab",
  setup (){
    const store = useStore();
    const router = useRouter();
    const route = useRoute()
    const tags = store.state.tabsList
    const changeMenu = (item) => {
      router.push({
        name: item.name
      })
    }
    const handleClose = (tag,index) =>{
      let length = tags.length-1;
      //处理vuex中的tabsList
      store.commit('closeTab',tag)
      if(tag.name !== route.name){
        return;
      }
      if(index === length){
        router.push({
          name: tags[index-1].name
        })
      }else{
        router.push({
          name: tags[index].name
        })
      }
    }
    return{
      tags,
      changeMenu,
      handleClose
    }
  }
}
</script>

<style lang="less" scoped>
.tags{
  padding: 7px;
  width: 100%;
  .el-tag{
    margin-left: 15px;
    cursor: pointer;
  }
}
</style>