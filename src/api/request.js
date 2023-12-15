import axios from "axios";
import config from "../config/index.js";
import {ElLoading, ElMessage} from 'element-plus'
import store from "../store/index.js";

const NETWORK_ERROR = '网络请求异常，请稍后重试....'
//创建一个axios实例对象
const service = axios.create({
    baseURL: config.baseApi,
    timeout:5000
})
//在请求之前做一些事情
service.interceptors.request.use((req) => {
    //store.commit("updateApiCount", "add");
    store.state.isLoading=true
    store.commit('showLoading')
    return req
},error => {
    //store.commit("updateApiCount", "sub");
    store.commit('hideLoading')
    ElMessage.error(error || NETWORK_ERROR);
    return Promise.reject(error || NETWORK_ERROR);
})

//在请求之后做一些事情
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data
    //根据后端 协商 视情况而定
    if(code == 200){
        store.state.isLoading=false//loading加载动画
        store.commit('hideLoading')
        return data
    }else if(code == 400){
        store.commit('hideLoading')
        ElMessage.warning(msg || NETWORK_ERROR);
        return Promise.reject(msg || NETWORK_ERROR);
    }else{
        store.commit('hideLoading')
        ElMessage.error(msg || NETWORK_ERROR);
        return Promise.reject(msg || NETWORK_ERROR);
    }
})

//封装的核心函数
function request(options) {
    options.method = options.method || 'get'
    if(options.method.toLocaleUpperCase() == 'get'){
        options.params = options.data
    }
    //对mock的处理
    let isMock = config.mock
    if(typeof options.mock !== 'undefined'){
        isMock = options.mock
    }
    //对生产环境做处理
    if(config.env == 'prod'){
        //生产环境不让用mock
        service.defaults.baseURL = config.baseApi
    }else{
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }
    return service(options)
}

export default request