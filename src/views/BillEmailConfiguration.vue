<template>
    <div id="mainer">
        <div id="header">
            <el-form :inline="true" :model="formInLine" class="factor">
                <el-form-item style="margin: 10px;">
                    <el-input v-model="formInLine.userName" placeholder="用户名称" type="text" style="width: 210px;">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <search />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin: 10px;">
                    <el-input v-model="formInLine.addressee" placeholder="收件人" class="w-50 m-2" type="text"
                        style="width: 210px;">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <search />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin: 10px;">
                    <el-select v-model="formInLine.status" class="w-50 m-2" placeholder="邮件状态" style="width: 210px;">
                        <el-option v-for="item in modeData" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;margin: 10px;">
                    <el-button type="success" @click="handleSearch" style="width: 100px;">查询</el-button>
                    <el-button type="default" @click="clear" style="width: 100px;">重置</el-button>
                    <el-button type="primary" @click="editBillEmailConfiguration('add')"
                        style="width: 100px;">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div id="bod" style="display:flex;flex-direction: column;flex-grow: 1">
            <el-table v-loading="loading" :data="tableData" :stripe="true" :fit="true"
                style="border-radius: 5px;flex-grow: 1;" highlight-current-row>
                <el-table-column prop="recGuid" label="邮件编号" v-if="false" />
                <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width">
                    <template v-if="item.prop == 'operator'" v-slot="scope">
                    <el-button link type="primary" size="small" v-if="scope.row.status == '停用'" @click="updateBillEmailConfigurationStatus(scope.row)">
                        <el-icon style="vertical-align: middle">
                            <VideoPlay />
                        </el-icon>
                        启用
                    </el-button>
                    <el-button link type="primary" size="small" v-if="scope.row.status == '启用'" @click="updateBillEmailConfigurationStatus(scope.row)">
                        <el-icon style="vertical-align: middle">
                            <VideoPause />
                        </el-icon>
                        停用
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="footer">
            <div class="demonstration" style="flex-grow: 1;font-size: 12px;">{{ page.size }}条记录</div>
            <el-pagination small background layout="prev, pager, next" :total="page.total" class="pager mt-4"
                @current-change="changePage" :current-page="page.pageNum" :page-size="page.pageSize" />
        </div>
    </div>
    <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" width="550px" title="邮件维护" align-center
        draggable>
        <el-form :inline="true" :model="emailForm" class="factor">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="接收用户：">
                        <el-select v-model="emailForm.userId" style="width: 450px;">
                            <el-option v-for="item in userData" :key="item.studentId" :label="item.studentName"
                                :value="item.studentId" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="收件邮箱：">
                        <el-input v-model="emailForm.addressee" style="width: 450px;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="抄送邮箱：">
                        <el-input v-model="emailForm.ccRecipient" class="w-50 m-2" type="text"
                            style="width: 450px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="float: right">
                <el-form-item style="margin: 30px 0px 0px 0px;">
                    <el-button :plain="true" type="primary" style="width: 100px" @click="insertEnter">确认</el-button>
                    <el-button style="width: 100px" @click="cancel">取消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus';
import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue';
import { useStore } from "vuex";
export default {
    setup() {
        const { proxy } = getCurrentInstance()
        const store = useStore();
        const dialogFormVisible = reactive({
            flag: false
        });
        let saveType = '';
        //筛选条件
        const formInLine = reactive({
            userName: '',
            addressee: '',
            status: ''
        });
        const params = reactive({
            userName: '',
            addressee: '',
            status: '',
            pageNum: 1,
            pageSize: 15
        });
        //表单数据
        const emailForm = reactive({
            userId: '',
            addressee: '',
            ccRecipient: '',
            createdBy: window.sessionStorage.getItem('studentId'),
            status: 1

        });
        //状态操作对象
        const statusObj = reactive({
            status: '',
            recGuid : ''

        });
        //表格数据
        let tableData = ref([]);
        //状态下拉选项
        let modeData = reactive([
            {
                id: 1,
                name: '启用'
            },
            {
                id: 2,
                name: '停用'
            }
        ]);
        //配置用户下拉选项
        let userData = ref([]);
        //分页对象
        let page = reactive({
            size: 0,
            total: 0,
            pageNum: 0,
            pageSize: 0
        });
        //表格列
        const tableLabel = reactive([
            {
                prop: "userName",
                label: "用户名称",
            },
            {
                prop: "addressee",
                label: "接收邮箱",
            },
            {
                prop: "ccRecipient",
                label: "抄送邮箱",
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "createdBy",
                label: "创建人",
            },
            {
                prop: "createdDate",
                label: "创建时间",
            },
            {
                prop: "operator",
                label: "操作",
            }
        ]);
        //查询
        let handleSearch = () => {
            params.addressee = formInLine.addressee;
            params.userName = formInLine.userName;
            params.status = formInLine.status;
            getBillEmailConfigurationList();
        }
        //重置
        let clear = () => {
            formInLine.addressee = '';
            formInLine.userName = '';
            formInLine.status = '';
        }
        //分页切换
        let changePage = (pager) => {
            params.pageNum = pager;
            getBillEmailConfigurationList();
        }

        //弹出对话框
        let editBillEmailConfiguration = (type) => {
            saveType = type;
            getStudentSelect();
            dialogFormVisible.flag = true;
        }

        //取消
        let cancel = () => {
            dialogFormVisible.flag = false;
            emailForm.addressee = '';
            emailForm.ccRecipient = '';
            emailForm.userId = '';
        }

        //保存
        let insertEnter = () => {
            if (emailForm.userId == '') {
                ElMessage.warning('请选择接收用户！');
                return;
            }
            if (emailForm.addressee == '') {
                ElMessage.warning('接收邮箱必填！');
                return;
            }
            if (saveType == 'add') {
                addBillEmailConfiguration();
            }
        }

        /**
         * 获取邮件账单信息
         */
        let getBillEmailConfigurationList = async () => {
            let res = await proxy.$api.getBillEmailConfigurationList(params);
            tableData.value = res.list;
            page.pageNum = res.pageNum;
            page.pageSize = res.pageSize;
            page.size = res.size;
            page.total = res.total;
        }

        /**
         * 获取用户选项
         */
        let getStudentSelect = async () => {
            let res = await proxy.$api.getStudentSelect();
            userData.value = res;
        }

        /**
         * 账单邮件配置新增
         */
        let addBillEmailConfiguration = async () => {
            let res = await proxy.$api.addBillEmailConfiguration(emailForm);
            if (res == 1) {
                ElMessage.success('账单邮件配置成功！');
                cancel();
                getBillEmailConfigurationList();
            } else {
                ElMessage.warning('账单邮件配置失败！');
                return;
            }
        }

        /**
         * 账单邮件状态操作
         */
        let updateBillEmailConfigurationStatus = async (email) => {
            let message = '';
            if (email.status == '启用') {
                message = email.addressee + '停用';
                statusObj.status = 2;
            } else {
                message = email.addressee + '启用';
                statusObj.status = 1;
            }
            statusObj.recGuid = email.recGuid;
            let res = await proxy.$api.updateBillEmailConfigurationStatus(statusObj);
            if (res == 1) {
                ElMessage.success(message + '成功！');
                cancel();
                getBillEmailConfigurationList();
            } else {
                ElMessage.warning(message + '失败');
                return;
            }
        }

        onMounted(() => {
            getBillEmailConfigurationList();
        });
        return {
            loading: computed(() => store.state.loading),
            dialogFormVisible,
            formInLine,
            emailForm,
            tableData,
            modeData,
            handleSearch,
            clear,
            tableLabel,
            changePage,
            page,
            userData,
            editBillEmailConfiguration,
            cancel,
            insertEnter,
            updateBillEmailConfigurationStatus
        }
    }
}
</script>

<style lang="less" scoped>
#header {
    justify-content: space-between;
    border-radius: 5px;
    height: 50px;

    .factor {
        font-family: 华文宋体 bold;
        color: #999999;
        font-weight: bold;
        font-size: 14px;
    }
}

#mainer {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

#footer {
    display: flex;
    flex-direction: row;
    padding: 5px;
}

.queryClass {
    padding: 7px;
    float: right;
    margin: auto 0;
}
</style>