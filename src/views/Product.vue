<template>
    <div id="page">
        <div id="header">
            <el-form :inline="true" :model="formParams">
                <el-row>
                    <el-form-item label="起始时间" style="margin: 20px;">
                        <el-date-picker v-model="formParams.startEndTime" type="datetimerange"
                            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="至"
                            start-placeholder="请输入开始时间" end-placeholder="请输入结束时间" />
                    </el-form-item>
                    <el-form-item label="产品编号" style="margin: 20px;">
                        <el-input v-model="formParams.productNo" class="m-2" placeholder="支持模糊搜索"
                            style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="产品标题" style="margin: 20px;">
                        <el-input v-model="formParams.productName" class="m-2" placeholder="支持模糊搜索"
                            style="width: 220px;" />
                    </el-form-item>
                    <el-form-item style="float: right; margin: 20px;">
                        <el-button type="success" @click="queryProduct" style="width: 80px;">查询</el-button>
                        <el-button type="default" @click="resetQueryParams" style="width: 80px;">重置</el-button>
                        <el-button type="primary" @click="add()" style="width: 80px;">新增</el-button>
                        <el-button type="primary" @click="batchUpdPrice" style="width: 80px;">价格设置</el-button>
                        <el-button type="primary" @click="batchUpdStock" style="width: 80px;">库存设置</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div id="mainer">
            <el-table v-loading="loading" ref="multipleTable" :data="tableData" :stripe="true" :fit="true"
                @selection-change="handleSelectionChange" style="border-radius: 5px;flex-grow: 1;"
                highlight-current-row>
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width ? item.width : 200">
                    <template v-if="item.prop === 'productPict'" v-slot="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.productPict" :fit="fit" />
                    </template>
                    <template v-if="item.prop === 'productLink'" v-slot="scope">
                        <el-link :href="scope.row.productLink" target="_blank">{{ scope.row.productLink }}</el-link>
                    </template>
                    <template v-if="item.prop === 'operator'" v-slot="scope">
                        <el-button type="danger" @click="delOK(scope.row.id)">删除</el-button>
                        <el-button type="primary" @click="getProductById(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="footer">
            <div class="demonstration" style="flex-grow: 1;font-size: 12px;">{{ pager.size }}条记录</div>
            <el-pagination small background layout="prev, pager, next" :total="pager.total" class="pager mt-4"
                @current-change="changePage" :current-page="pager.pageNum" :page-size="pager.pageSize" />
        </div>
    </div>
    <el-dialog v-model="dialogVisible.flag" title="添加商品" width="650px" align-center draggable>
        <el-form :inline="true" :model="productForm">
            <el-row>
                <el-col>
                    <el-form-item label="产品编号" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productNo" placeholder="请输入产品编号" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="产品名称" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productName" placeholder="请输入产品名称" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="产品标题" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productTitle" placeholder="请输入产品标题" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="产品链接" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productLink" placeholder="请输入产品链接" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="图片链接" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productPict" placeholder="请输入图片链接" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="产品规格" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productSpecs" placeholder="请输入产品规格" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="产品库存" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productStock" type="number" placeholder="请输入产品库存"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="供应商价格" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productPrice" placeholder="请输入产品库存" style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="内部价格" label-width="120px" style="margin: 20px 70px 0px 50px; width: 500px;">
                        <el-input v-model="productForm.productPriceInside" placeholder="请输入产品内部价格"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible.flag = false">取消</el-button>
                <el-button type="primary" @click="save()">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible.priceFlag" title="价格设置" width="500px" align-center draggable>
        <el-form :inline="true" :model="productPriceForm">
            <el-row>
                <el-col>
                    <el-form-item label="供应商价格" label-width="100px" style="margin: 20px 70px 0px 20px; width: 350px;">
                        <el-input type="number" v-model="productPriceForm.productPrice" placeholder="请设置供应商价格"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="内部价格" label-width="100px" style="margin: 20px 70px 0px 20px; width: 350px;">
                        <el-input type="number" v-model="productPriceForm.productPriceInside" placeholder="请设置内部价格"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible.priceFlag = false">取消</el-button>
                <el-button type="primary" @click="setProductPriceBatch">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible.stockFlag" title="库存设置" width="500px" align-center draggable>
        <el-form :inline="true" :model="productStockForm">
            <el-row>
                <el-col>
                    <el-form-item label="产品库存" label-width="100px" style="margin: 0px 70px 0px 20px; width: 350px;">
                        <el-input type="number" v-model="productPriceForm.productStock" placeholder="请设置产品库存"
                            style="width: 100%;" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible.stockFlag = false">取消</el-button>
                <el-button type="primary" @click="setProductStockBatch">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
    setup() {
        const { proxy } = getCurrentInstance();
        //查询条件
        let formParams = reactive({
            startEndTime: [], //起止时间
            productName: '',//产品名称
            productTitle: ''//产品标题
        });
        //获取studentId
        let studentId = window.sessionStorage.getItem('studentId');
        let param = reactive({
            startTime: '',
            endTime: '',
            pageNum: 0,
            pageSize: 15,
            productName: '',
            productTitle: '',
            productPriceInside: '',
            productNo: ''
        });
        //定义遮罩层
        const dialogVisible = reactive({ flag: false, priceFlag: false, stockFlag: false });
        //定义数据存储对象
        let productForm = reactive({
            productName: '',
            productTitle: '',
            productLink: '',
            productStock: 0,
            productPict: '',
            productSpecs: '',
            productPrice: '',
            productPriceInside: '',
            productNo: '',
            createdBy: studentId
        });
        let productId = '';
        let batchIdList = [];
        //价格批量设置
        let productPriceForm = reactive({
            productPrice: 0,
            productPriceInside: 0,
            productId: []
        });
        //库存批量设置
        let productStockForm = reactive({
            productStock: 0,
            productId: []
        });
        const store = useStore();
        //定义表格数据
        let tableData = ref([]);
        //定义表格列
        const tableLabel = reactive([
            {
                prop: "id",
                label: "序号",
                width: 70,
                alignCenter: true
            },
            {
                prop: "operator",
                label: "操作",
                width: 200,
                alignCenter: true
            },
            {
                prop: "productNo",
                label: "产品编号",
                width: 120,
                alignCenter: true
            },
            {
                prop: "productName",
                label: "产品名称",
                width: 120,
                alignCenter: true
            },
            {
                prop: "productTitle",
                label: "产品标题",
                width: 200,
                alignCenter: true
            },
            {
                prop: "productLink",
                label: "产品链接",
                width: 200,
                alignCenter: true
            },
            {
                prop: "productStock",
                label: "产品库存",
                width: 120,
                alignCenter: true
            },
            {
                prop: "productPict",
                label: "产品图片",
                width: 150,
                alignCenter: true
            },
            {
                prop: "productSpecs",
                label: "产品规格",
                width: 210,
                alignCenter: true
            },
            {
                prop: "productPrice",
                label: "供应商价格",
                width: 100,
                alignCenter: true
            },
            {
                prop: "productPriceInside",
                label: "内部价格",
                width: 100,
                alignCenter: true
            },
            {
                prop: "studentName",
                label: "更新人",
                width: 120,
                alignCenter: true
            },
            {
                prop: "createdDate",
                label: "更新时间",
                alignCenter: true
            },

        ]);
        //定义分页器
        let pager = reactive({
            size: 0,
            total: 0,
            pageNum: 0,
            pageSize: 0
        });
        //接口调用（获取产品信息）
        const getProductList = async () => {
            let res = await proxy.$api.getProductList(param);
            tableData.value = res.list;
            pager.size = res.size;
            pager.total = res.total;
            pager.pageNum = res.pageNum;
            pager.pageSize = res.pageSize;
        }
        //查询
        let queryProduct = () => {
            param.startTime = formParams.startEndTime[0];
            param.endTime = formParams.startEndTime[1];
            param.productNo = formParams.productNo;
            param.productTitle = formParams.productTitle;
            getProductList();
        }
        //分页值改变
        let changePage = (page) => {
            param.pageNum = page;
            getProductList();
        }
        let savaType = reactive({
            type: ''
        });
        //数据保存
        let save = () => {
            if (savaType.type == 'add') {
                addProduct();
            } else {
                updProduct();
            }
        }
        //新增产品
        let addProduct = async () => {
            let res = await proxy.$api.addProduct(productForm);
            queryProduct();//刷新列表
            dialogVisible.flag = false;
            clearForm();//清除表单数据
            ElMessage.success('保存成功！');
        }
        //新增
        let add = () => {
            savaType.type = 'add';
            dialogVisible.flag = true;
        }
        //批量改价
        let batchUpdPrice = () => {
            if (batchIdList.length == 0) {
                ElMessage.warning('请至少勾选一个产品！');
                return;
            }
            dialogVisible.priceFlag = true;
        }
        //批量改库存
        let batchUpdStock = () => {
            if (batchIdList.length == 0) {
                ElMessage.warning('请至少勾选一个产品！');
                return;
            }
            dialogVisible.stockFlag = true;
        }
        //更新产品
        let updProduct = async () => {
            let res = await proxy.$api.updProduct(productForm);
            queryProduct();//刷新列表
            dialogVisible.flag = false;
            clearForm();//清除表单数据
            ElMessage.success('保存成功！');
        }
        //删除前二次确认
        let delOK = (id) => {
            ElMessageBox.confirm('确认删除产品数据吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                draggable: true,
            }).then(() => {
                delProduct(id);
            })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '取消删除',
                    })
                })
        }
        //删除产品
        let delProduct = async (id) => {
            let res = await proxy.$api.delProduct(id);
            queryProduct();//刷新列表
            ElMessage.success('删除成功！');
        }
        //获取主键编号
        const handleSelectionChange = (selection) => {
            productId = '';
            let idList = [];
            for (let i = 0; i < selection.length; i++) {
                let obj = selection[i]
                let id = obj.id
                productId = productId + id + ',';
                idList.push(id);
            }
            productId = productId.slice(0, productId.length - 1);
            batchIdList = idList;
            productPriceForm.productId = batchIdList;
            productStockForm.productId = batchIdList;
        }

        const setProductPriceBatch = async () => {
            let res = await proxy.$api.setProductPriceBatch(productPriceForm);
            if (res === 1) {
                dialogVisible.priceFlag = false;
                queryProduct();//刷新列表
                ElMessage.success('价格设置成功！');
            } else {
                ElMessage.error("价格设置失败！");
            }

        }

        const setProductStockBatch = async () => {
            let res = await proxy.$api.setProductStockBatch(productStockForm);
            if (res === 1) {
                dialogVisible.stockFlag = false;
                queryProduct();//刷新列表
                ElMessage.success('库存设置成功！');
            } else {
                ElMessage.error('库存设置失败！');
            }

        }

        //修改前查询
        let getProductById = async (id) => {
            savaType.type = 'upd';
            dialogVisible.flag = true;
            let res = await proxy.$api.getProductById(id);
            productForm.productName = res.productName;
            productForm.productTitle = res.productTitle;
            productForm.productLink = res.productLink;
            productForm.productStock = res.productStock;
            productForm.productPict = res.productPict;
            productForm.productSpecs = res.productSpecs;
            productForm.productPrice = res.productPrice;
            productForm.productPriceInside = res.productPriceInside;
            productForm.productNo = res.productNo;
            productForm.id = res.id;
        }
        //清除表单数据
        let clearForm = () => {
            productForm.productName = '';
            productForm.productTitle = '';
            productForm.productLink = '';
            productForm.productStock = 0;
            productForm.productPict = '';
            productForm.productSpecs = '';
            productForm.productPrice = '';
            productForm.productPriceInside = '';
            productForm.productNo = '';
        }
        //重置查询条件
        let resetQueryParams = () => {
            formParams.startEndTime = [];
            formParams.productName = '';
            formParams.productTitle = '';
            formParams.productNo = '';
        }
        onMounted(() => {
            getProductList();
        })
        //数据返回
        return {
            formParams,
            loading: computed(() => store.state.loading),
            tableData,
            tableLabel,
            changePage,
            pager,
            queryProduct,
            dialogVisible,
            productForm,
            save,
            resetQueryParams,
            delOK,
            getProductById,
            add,
            productPriceForm,
            batchUpdPrice,
            batchUpdStock,
            productStockForm,
            handleSelectionChange,
            setProductPriceBatch,
            setProductStockBatch
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