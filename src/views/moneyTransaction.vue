<template>
    <div id="page">
        <div id="header">
            <el-form :inline="true" :model="formParams">
                <el-form-item label="起始时间" style="margin: 20px;">
                    <el-date-picker v-model="formParams.startEndTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" start-placeholder="请输入开始时间"
                        end-placeholder="请输入结束时间" />
                </el-form-item>
                <el-form-item label="交易类型" style="margin: 20px;">
                    <el-select v-model="formParams.transactionType" class="m-2" placeholder="请选择" style="width: 230px;">
                        <el-option v-for="item in transactionTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;margin: 20px;">
                    <el-button type="success" @click="queryTransaction" style="width: 100px;">查询</el-button>
                    <el-button type="default" @click="resetQueryParams" style="width: 100px;">重置</el-button>
                    <el-button type="primary" @click="dialogVisible.flag = true" style="width: 100px;">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div id="mainer">
            <el-table v-loading="loading" ref="multipleTable" :data="tableData" :stripe="true" :fit="true"
                style="border-radius: 5px;flex-grow: 1;" highlight-current-row>
                <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width ? item.width : 420">
                </el-table-column>
            </el-table>
        </div>
        <div id="footer">
            <div class="demonstration" style="flex-grow: 1;font-size: 12px;">{{ pager.size }}条记录</div>
            <el-pagination small background layout="prev, pager, next" :total="pager.total" class="pager mt-4"
                @current-change="changePage" :current-page="pager.pageNum" :page-size="pager.pageSize" />
        </div>
    </div>
    <el-dialog v-model="dialogVisible.flag" title="交易" width="650px" align-center draggable>
        <el-form :inline="true" :model="transactionForm">
            <el-row>
                <el-col>
                    <el-form-item label="交易日期" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input type="date" v-model="transactionForm.transactionDate" placeholder="请选择交易日期"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="交易类型" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-select v-model="transactionForm.transactionType" class="m-2" placeholder="请选择交易类型"
                            style="width: 100%;">
                            <el-option v-for="item in transactionTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="交易金额" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="transactionForm.transactionAmount" type="number" placeholder="请输入交易金额"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="交易备注" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="transactionForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible.flag = false" style="width: 100px;">取消</el-button>
                <el-button type="primary" @click="save" style="width: 100px;">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus';
import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
    setup() {
        const { proxy } = getCurrentInstance();
        //查询条件
        let formParams = reactive({
            startEndTime: [], //起止时间
            transactionType: ''//交易类型
        });
        //获取studentId
        let studentId = window.sessionStorage.getItem('studentId');
        let param = reactive({
            transactionDate: '',
            pageNum: 0,
            pageSize: 15,
            transactionsBy: studentId,
            transactionType: ''
        });
        //定义遮罩层
        const dialogVisible = reactive({ flag: false });
        //定义数据存储对象
        let transactionForm = reactive({
            transactionDate: '',
            transactionType: '',
            transactionAmount: 0,
            remark: '',
            transactionsBy: studentId
        });
        const store = useStore();
        //定义交易类型下拉框
        let transactionTypeOptions = reactive(
            [
                {
                    label: '存入',
                    value: '1'
                },
                {
                    label: '支取',
                    value: '2'
                }
            ]
        );
        //定义表格数据
        let tableData = ref([]);
        //定义表格列
        const tableLabel = reactive([
            {
                prop: "transactionDate",
                label: "交易日期"
            },
            {
                prop: "transactionTypeDesc",
                label: "交易类型"
            },
            {
                prop: "transactionAmount",
                label: "交易金额"
            },
            {
                prop: "remark",
                label: "交易备注"
            }
        ]);
        //定义分页器
        let pager = reactive({
            size: 0,
            total: 0,
            pageNum: 0,
            pageSize: 0
        });
        //接口调用（获取交易信息）
        const getMoneyManagementList = async () => {
            let res = await proxy.$api.getMoneyManagementList(param);
            tableData.value = res.list;
            pager.size = res.size;
            pager.total = res.total;
            pager.pageNum = res.pageNum;
            pager.pageSize = res.pageSize;
        }
        //查询
        let queryTransaction = () => {
            param.startTime = formParams.startEndTime[0];
            param.endTime = formParams.startEndTime[1];
            param.transactionType = formParams.transactionType;
            getMoneyManagementList();
        }
        //分页值改变
        let changePage = (page) => {
            param.pageNum = page;
            getMoneyManagementList();
        }
        //数据保存
        let save = () => {
            if (transactionForm.transactionType == '1') {
                addMoneyTransactionByDeposit();
            } else {
                addMoneyTransactionByDraw();
            }
        }
        //存入
        let addMoneyTransactionByDeposit = async () => {
            let res = await proxy.$api.addMoneyTransactionByDeposit(transactionForm);
            ElMessage.success('保存成功！');
            queryTransaction();//刷新列表
            dialogVisible.flag = false;
            clearForm();//清除表单数据
        }
        //支取
        let addMoneyTransactionByDraw = async () => {
            let res = await proxy.$api.addMoneyTransactionByDraw(transactionForm);
            ElMessage.success('保存成功！');
            queryTransaction();//刷新列表
            dialogVisible.flag = false;
            clearForm();//清除表单数据

        }
        //清除表单数据
        let clearForm = () => {
            transactionForm.remark = '';
            transactionForm.transactionAmount = 0;
            transactionForm.transactionDate = '';
            transactionForm.transactionType = '';
        }
        //重置查询条件
        let resetQueryParams = () => {
            formParams.startEndTime = [];
            formParams.transactionType = '';
        }
        onMounted(() => {
            getMoneyManagementList();
        })
        //数据返回
        return {
            formParams,
            transactionTypeOptions,
            loading: computed(() => store.state.loading),
            tableData,
            tableLabel,
            changePage,
            pager,
            queryTransaction,
            dialogVisible,
            transactionForm,
            save,
            resetQueryParams
        }
    }
}
</script>

<style lang="less" scoped>
#page {
    width: 100%;
    height: 100%;
    display: flex; //弹性布局
    flex-direction: column; //纵向布局
    background-color: #fff;
    border-radius: 5px;
}

#mainer {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

#footer {
    display: flex;
    flex-direction: row;
    padding: 5px;
}
</style>