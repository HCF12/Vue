/**
 * 整个项目api的管理
 */
import { mock } from "mockjs";
import request from "./request.js";
export default {
    //home组件 左侧表格数据获取
    getTableData(params) {
        return request({
            url: '/consumption/getUserConsumptionList',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getMenuList(params) {
        return request({
            url: '/studentMenu/getStudentMenu',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getUserSumConsumptionType(params) {
        return request({
            url: '/consumption/getUserSumConsumptionType',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getUserSumConsumptionDate(params) {
        return request({
            url: '/consumption/getUserSumConsumptionDate',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getUserSumConsumptionDateAndType(params) {
        return request({
            url: '/consumption/getUserSumConsumptionDateAndType',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getEchartsData(params) {
        return request({
            url: '/home/getChartData',
            method: 'get',
            data: params,
            mock: true
        })
    },
    getStudentList(params) {
        return request({
            url: '/studentManager/getStudent',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getGradeList(params) {
        return request({
            url: '/grade/getGrade',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getClassList(params) {
        return request({
            url: '/stuClass/getClassByGrade/' + params.gradeId,
            method: 'get',
            mock: false
        })
    },
    addStudent(params) {
        return request({
            url: '/studentManager/register',
            method: 'post',
            data: params,
            mock: false
        })
    },
    login(params) {
        return request({
            url: '/studentManager/login/',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getStudentUnlock(params) {
        return request({
            url: '/studentManager/getStudentUnlock/',
            method: 'post',
            data: params,
            mock: false
        })
    },
    unlock(params) {
        return request({
            url: '/studentManager/unlock/' + params,
            method: 'get',
            mock: false
        })
    },
    getModelList() {
        return request({
            url: '/template/getTemplate',
            method: 'get',
            mock: false
        })
    },
    getModelContent(params) {
        return request({
            url: '/template/getTemplateContent/' + params,
            method: 'get',
            mock: false
        })
    },
    addEmailGroup(params) {
        return request({
            url: '/emailGroup/addEmailGroup',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getEmailList(params) {
        return request({
            url: '/emailGroup/getEmailList',
            method: 'post',
            data: params,
            mock: false
        });
    },
    startConfiguration(params) {
        return request({
            url: '/emailGroup/startConfiguration/' + params,
            method: 'get',
            data: params,
            mock: false
        });
    },
    runEmailConfiguration(params) {
        return request({
            url: '/emailGroup/runEmailConfiguration/' + params,
            method: 'get',
            data: params,
            mock: false
        });
    },
    checkEmailConfiguration(params) {
        return request({
            url: '/emailGroup/checkEmailConfiguration/' + params,
            method: 'get',
            data: params,
            mock: false
        });
    },
    getCronExpression(params) {
        return request({
            url: '/quartz/list',
            method: 'post',
            data: params,
            mock: false
        });
    },
    sendEmail(params) {
        return request({
            url: '/testEmail/sendEmail',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getLoginHisByStudentId(params) {
        return request({
            url: '/loginHis/getLoginHisByStudentId/' + params,
            method: 'get',
            data: params,
            mock: false
        });
    },
    batchDeleteEmailConfiguration(params) {
        return request({
            url: '/emailGroup/batchDeleteEmailConfiguration/' + params,
            method: 'get',
            data: params,
            mock: false
        });
    },
    getEmailGroupInfoById(params) {
        return request({
            url: '/emailGroup/getEmailGroupInfoById/' + params,
            method: 'get',
            mock: false
        });
    },
    updEmailGroup(params) {
        return request({
            url: '/emailGroup/updEmailGroup',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getEmailGroupSendHisInfo(params) {
        return request({
            url: '/emailHis/getEmailGroupSendHisInfo',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getAllEmailGroupSendTask(params) {
        return request({
            url: '/email/getAllEmailGroupSendTask',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getConsumptionType() {
        return request({
            url: '/consumption/getConsumptionType',
            method: 'get',
            mock: false
        });
    },
    saveConsumption(param) {
        return request({
            url: '/consumption/saveConsumption',
            method: 'post',
            data: param,
            mock: false
        });
    },
    downloadBill(param) {
        return request({
            url: '/consumption/downloadBill/' + param.startTime + '/' + param.endTime + '/' + param.studentId,
            method: 'get',
            mock: false
        });
    },
    getMoneyManagementList(param) {
        return request({
            url: '/transaction/getMoneyManagementList',
            method: 'post',
            data: param,
            mock: false
        });
    },
    addMoneyTransactionByDeposit(params) {
        return request({
            url: '/transaction/addMoneyTransactionByDeposit',
            method: 'post',
            data: params,
            mock: false
        });
    },
    addMoneyTransactionByDraw(params) {
        return request({
            url: '/transaction/addMoneyTransactionByDraw',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getProductList(params) {
        return request({
            url: '/product/getProductList',
            method: 'post',
            data: params,
            mock: false
        });
    },
    addProduct(params) {
        return request({
            url: '/product/addProduct',
            method: 'post',
            data: params,
            mock: false
        });
    },
    delProduct(params) {
        return request({
            url: '/product/delProduct/' + params,
            method: 'get',
            mock: false
        });
    },
    getProductById(params) {
        return request({
            url: '/product/getProductById/' + params,
            method: 'get',
            mock: false
        });
    },
    updProduct(params) {
        return request({
            url: '/product/updProduct',
            method: 'post',
            data: params,
            mock: false
        });
    },
    setProductPriceBatch(params) {
        return request({
            url: '/product/setProductPriceBatch',
            method: 'post',
            data: params,
            mock: false
        });
    },
    setProductStockBatch(params) {
        return request({
            url: '/product/setProductStockBatch',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getRoleList() {
        return request({
            url: '/role/getRoleList',
            method: 'get',
            mock: false
        });
    },
    updPassword(params) {
        return request({
            url: '/studentManager/updPassword',
            method: 'post',
            data: params,
            mock: false
        });
    },
    batchInsertConsumption (params) {
        return request({
            url: '/consumption/batchInsertConsumption',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getEmailGroupHisById (params) {
        return request({
            url: '/emailHis/getEmailGroupHisById/' + params,
            method: 'get',
            mock: false
        });
    },
    addLoginCheck (params) {
        return request({
            url: '/loginCheck/addLoginCheck',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getCheckIdByOverdueTime (params) {
        return request({
            url: '/loginCheck/getCheckIdByOverdueTime',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getCheckIdInSideEffectTime (params) {
        return request({
            url: '/loginCheck/getCheckIdInSideEffectTime',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getBillEmailConfigurationList (params) {
        return request({
            url: '/billEmailConfiguration/getBillEmailConfigurationList',
            method: 'post',
            data: params,
            mock: false
        });
    },
    getStudentSelect () {
        return request({
            url: '/studentManager/getStudentSelect',
            method: 'post',
            mock: false
        });
    },
    addBillEmailConfiguration (params) {
        return request({
            url: '/billEmailConfiguration/addBillEmailConfiguration',
            method: 'post',
            data: params,
            mock: false
        });
    },
    updateBillEmailConfigurationStatus (params) {
        return request({
            url: '/billEmailConfiguration/updateBillEmailConfigurationStatus',
            method: 'post',
            data: params,
            mock: false
        });
    }
}