/**
 * 环境配置文件
 * 一般在企业级项目里面有三个环境（开发、测试、生产）
 */

//当前的环境
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
    dev: {
        baseApi: 'http://127.0.0.1:8085',
        mockApi: 'https://www.fastmock.site/mock/ea3e0492b1b6a41623db3bec4f1b94f6/api'
    },
    test: {
        baseApi: 'http://127.0.0.1:8085',
        mockApi: 'https://www.fastmock.site/mock/ea3e0492b1b6a41623db3bec4f1b94f6/api'
    },
    prod: {
        baseApi: 'http://39.101.131.236:8083/AppManagement',
        mockApi: 'https://www.fastmock.site/mock/ea3e0492b1b6a41623db3bec4f1b94f6/api'
    }
}

export default {
    env,
    //mock的总开关
    mock: true,
    ...EnvConfig[env]
}