import { createStore } from 'vuex'
import { ElLoading } from 'element-plus'

export default createStore({
    state: {
        isCollapse: true,
        currentMenu: null,
        //请求计数
        // apiCount: 0,
        // //loading实例
        // loadingInstance: null,
        loading: false,
        isLogin: false,//是否登录
        tabsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 'home'
            }
        ]
    },
    mutations: {
        updateIsCollapse(state, payload) {
            state.isCollapse = !state.isCollapse
        },
        selectMenu(state, val) {
            //判断
            if (val.name == 'home') {
                state.currentMenu = null
            } else {
                state.currentMenu = val
                let result = state.tabsList.findIndex(item => item.name === val.name)
                result == -1 ? state.tabsList.push(val) : ''
            }
        },
        closeTab(state, val) {
            let result = state.tabsList.findIndex(item => item.name === val.name)
            state.tabsList.splice(result, 1)
        },
        showLoading(state){
            state.loading = true
        },
        hideLoading (state) {
            state.loading = false
        },
        closeDialog(state){
            state.loading = false
        }
    }
})