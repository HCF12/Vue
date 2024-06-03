import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import './assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index.js'
import './api/mock.js'
import api from './api/api.js'
import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'
import * as echarts from 'echarts'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/es/locale/lang/zh-cn';
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$api = api
app.config.globalProperties.$echarts = echarts
app.config.strict = false
app.use(router).use(store).use(ElementPlus,{locale})
app.mount('#app')
// app.use(ElementPlus)
