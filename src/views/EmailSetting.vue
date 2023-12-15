<template>
  <div class="mainClass">
    <div class="user-header">
      <el-form :inline="true" :model="formInLine" class="factor">
        <el-form-item label="客户编号" style="margin: 10px;">
          <el-input v-model="formInLine.customerNo" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户姓名" style="margin: 10px;">
          <el-input v-model="formInLine.customerName" class="w-50 m-2" type="text" style="width: 200px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="期望发送时间" style="margin: 10px;">
          <el-date-picker
              v-model="formInLine.startTime"
              type="datetime"
              placeholder="请输入开始时间"
              format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="~" style="margin: 10px;">
          <el-date-picker
              v-model="formInLine.endTime"
              type="datetime"
              placeholder="请输入结束时间"
              format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" style="margin: 10px;">
          <el-select v-model="formInLine.status" class="w-50 m-2" placeholder="请选择">
            <el-option
                v-for="item in isStartOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div style="float: right;margin-top: 10px;">
          <el-link type="primary" @click="deleteEmail" class="queryClass">
            <el-icon>
              <Delete/>
            </el-icon>
            批量删除
          </el-link>
          <el-link type="primary" @click="add()" class="queryClass">
            <el-icon>
              <Plus/>
            </el-icon>
            新增
          </el-link>
          <el-link type="primary" @click="clear" class="queryClass">
            <el-icon>
              <RefreshLeft/>
            </el-icon>
            清空
          </el-link>
          <el-link type="primary" @click="handleSearch" class="queryClass">
            <el-icon>
              <search/>
            </el-icon>
            查询
          </el-link>
        </div>
      </el-form>
    </div>
    <div>
      <el-link type="primary" @click="startConfiguration"
               style="float: right; width: 3%; display: inline-block">
        <el-icon>
          <CaretRight/>
        </el-icon>
        启用
      </el-link>
      <el-link type="primary" @click="checkEmailConfiguration"
               style="float: right; width: 3%; display: inline-block">
        <el-icon>
          <Check/>
        </el-icon>
        审核
      </el-link>
      <el-link type="primary" style="float: right; width: 4.9%; display: inline-block">
        <el-icon>
          <AlarmClock/>
        </el-icon>
        时间设置
      </el-link>
      <el-link type="primary" @click="runEmailConfiguration"
               style="float: right; width: 3%; display: inline-block">
        <el-icon>
          <Promotion/>
        </el-icon>
        执行
      </el-link>
      <div style="clear:both;"></div>
    </div>
    <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" title="邮件维护">
      <el-form :model="addStuForm" class="addForm" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户编号：" style="display: flex">
              <el-input v-model="addStuForm.customerNo" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户姓名：" style="display: flex">
              <el-input v-model="addStuForm.customerName" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收件人：" style="display: flex">
              <el-input v-model="addStuForm.receiveEmail" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="抄送：" style="display: flex">
              <el-input v-model="addStuForm.carbon" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主题：" style="display: flex">
              <el-input v-model="addStuForm.subject" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是运用模板：" style="display: flex">
              <el-select v-model="addStuForm.isModel" class="w-50 m-2" placeholder="请选择" style="width: 100%;"
                         @change="contentChange">
                <el-option
                    v-for="item in isModel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="addStuForm.modelFlag">
          <el-col :span="24">
            <el-form-item label="模板：" style="display: flex">
              <el-select v-model="addStuForm.emailModel" class="w-50 m-2" placeholder="请选择" style="width: 100%;"
                         @change="getModelContent">
                <el-option
                    v-for="item in modeData"
                    :key="item.docTemplateId"
                    :label="item.description"
                    :value="item.docTemplateId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="addStuForm.contentFlag">
          <el-col :span="24">
            <el-form-item label="内容：" style="display: flex">
              <div style="border: 1px solid #cccccc">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                         :mode="mode"/>
                <Editor style="height: 260px; overflow-y: hidden;" v-model="addStuForm.content"
                        @onCreated="handleCreated" @change="onChange"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期望发送时间：" style="display: flex">
              <el-date-picker
                  v-model="addStuForm.expectTime"
                  class="w-50 m-2"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="expectChange"
                  placeholder="请选择时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用：" style="display: flex">
              <el-select v-model="addStuForm.status" class="w-50 m-2" placeholder="请选择" style="width: 100%;">
                <el-option
                    v-for="item in isStartOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item style="display: flex;float: right">
              <el-button :plain="true" type="primary" style="width: 100%" @click="addEmailGroup(addStuForm.type)">确认</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item style="display: flex;float: right">
              <el-button style="width: 100%" @click="cancel">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div id="table">
      <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange1"
          :stripe="true"
          :fit="true"
          style="border-radius: 5px; flex-grow: 1;"
          highlight-current-row>
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : 130"
        >
          <template v-if="item.prop == 'operator'" v-slot="scope">
            <el-button link type="primary" size="small" @click="updateEmail(scope.row)">
              <el-icon style="vertical-align: middle">
                <Edit/>
              </el-icon>
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-row style="display: flex;background-color: white;margin-top: 7px;padding: 5px;border-radius: 5px">
          <el-col :span="2">
            <div class="demonstration" style="margin-top: 7px;font-size: 12px">{{ params.size }}条记录</div>
          </el-col>
          <el-col :span="22">
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :total="params.total"
                class="pager mt-4"
                @current-change="changePage"
                :current-page="params.pageNum"
                :page-size="params.pageSize"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, ref, computed, shallowRef, onMounted} from "vue";
import {onBeforeUnmount, reactive} from "vue-demi";
import {useStore} from "vuex";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import moment from 'moment';

export default {
  components: {Editor, Toolbar},
  setup() {
    //挂载全局api
    const {proxy} = getCurrentInstance()
    let tableData = ref([]);
    let modeData = ref([]);
    let emailData = ref([]);
    let customerNo = '';
    let batchIdList = [];
    const store = useStore();
    const dialogFormVisible = reactive({
      flag: false
    });
    const tableLabel = reactive([
      {
        prop: "customerNo",
        label: "客户编号"
      },
      {
        prop: "customerName",
        label: "客户姓名"
      },
      {
        prop: "receiveEmail",
        label: "接收邮箱",
        width: 220
      },
      {
        prop: "carbon",
        label: "抄送邮箱",
        width: 220
      },
      {
        prop: "expectTime",
        label: "期望发送时间",
        width: 200
      },
      {
        prop: "status",
        label: "状态"
      },
      {
        prop: "checkStatus",
        label: "是否审核"
      },
      {
        prop: "sendStatus",
        label: "邮件状态"
      },
      {
        prop: "createdDate",
        label: "创建时间",
        width: 200
      },
      {
        prop: "operator",
        label: "操作"
      }
    ]);
    const isStartOption = [
      {
        value: 1,
        label: '启用',
      },
      {
        value: 0,
        label: '停用',
      }
    ];
    const isModel = [
      {
        value: 1,
        label: '是',
      },
      {
        value: 0,
        label: '否',
      }
    ]
    //默认必穿参数
    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      maskPermission: 1,
      pageNum: 1,
      pageSize: 15,
      customerNo: '',
      customerName: '',
      startTime: '',
      endTime: ''
    });
    //分页
    const changePage = (page) => {
      console.log(page)
      params.pageNum = page;
      getEmailList();
    }
    const handleSearch = () => {
      params.customerNo = formInLine.customerNo;
      params.customerName = formInLine.customerName;
      params.status = formInLine.status;
      params.startTime = formInLine.startTime;
      params.endTime = formInLine.endTime;
      getEmailList(params)
    }
    //表格参数对象
    const formInLine = reactive({
      customerNo: '',
      customerName: '',
      startTime: '',
      endTime: '',
      status: ''
    });

    //表单对象
    const addStuForm = reactive({
      customerNo: '',
      customerName: '',
      receiveEmail: '',
      carbon: '',
      subject: '',
      emailModel: '',
      content: '',
      expectTime: '',
      status: 0,
      sendStatus: 0,
      checkStatus: 0,
      isModel: 0,
      contentFlag: true,
      modelFlag: true,
      type: ''
    });
    const editorRef = shallowRef()
    const valueHtml = ref('<p>hello 富文本编辑器</p>')
    const toolbarConfig = {};
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    });
    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }
    const onChange = (editor) => {
      const text = editor.getHtml();
      this.$emit('update:content', text)
    }
    const cancel = () => {
      dialogFormVisible.flag = false;
      addStuForm.customerNo = '';
      addStuForm.customerName = '';
      addStuForm.receiveEmail = '';
      addStuForm.carbon = '';
      addStuForm.subject = '';
      addStuForm.emailModel = '';
      addStuForm.content = '';
      addStuForm.expectTime = '';
      addStuForm.status = 0;
      addStuForm.sendStatus = 0;
      addStuForm.checkStatus = 0;
      addStuForm.isModel = 0;
      addStuForm.contentFlag = true;
      addStuForm.modelFlag = true;
    }
    //模板
    const getModelList = async () => {
      let res = await proxy.$api.getModelList();
      modeData.value = res;
    }

    const getModelContent = async () => {
      let res = await proxy.$api.getModelContent(addStuForm.emailModel);
      console.log(res);
      addStuForm.content = res;
    }

    //内容框显隐
    const contentChange = () => {
      if (addStuForm.isModel == 1) {
        addStuForm.contentFlag = false;
        addStuForm.modelFlag = true;
      } else {
        addStuForm.contentFlag = true;
        addStuForm.modelFlag = false;
      }
    }

    const add = () => {
      dialogFormVisible.flag = true
      addStuForm.type = 'insert';
    }

    //保存邮件配置信息
    const addEmailGroup = async (type) => {
      console.log(type);
      addStuForm.expectTime = moment(addStuForm.expectTime).format('YYYY-MM-DD HH:mm:ss');
      console.log(addStuForm);
      let res = null;
      if (type == 'insert') {
        res = await proxy.$api.addEmailGroup(addStuForm);
      } else if (type == 'update') {
        res = await proxy.$api.updEmailGroup(addStuForm);
      }
      console.log(res);
      emailData.value = res;
      dialogFormVisible.flag = false
      ElMessage.success('邮件配置成功');
     await getEmailList();
    }
    //获取单个配置
    const getEmailGroupInfoById = async (id) => {
      let res = await proxy.$api.getEmailGroupInfoById(id);
      addStuForm.customerNo = res.customerNo;
      addStuForm.customerName = res.customerName;
      addStuForm.receiveEmail = res.receiveEmail;
      addStuForm.carbon = res.carbon;
      addStuForm.subject = res.subject;
      addStuForm.isModel = res.isModel;
      addStuForm.emailModel = res.emailModel;
      addStuForm.content = res.content;
      addStuForm.expectTime = res.expectTime;
      addStuForm.status = res.status;
      contentChange();
    }
    const updateEmail = (click) => {
      dialogFormVisible.flag = true;
      addStuForm.type = 'update';
      getEmailGroupInfoById(click.customerNo);
    }
    //查询邮件配置信息
    const getEmailList = async () => {
      let res = await proxy.$api.getEmailList(params);
      params.total = res.total;
      params.prePage = res.prePage
      params.size = res.size
      tableData.value = res.list;
    }

    const handleSelectionChange1 = (selection) => {
      customerNo = '';
      let idList = [];
      for (let i = 0; i < selection.length; i++) {
        let obj = selection[i]
        let id = obj.customerNo
        customerNo = customerNo + id + ',';
        idList.push(id);
      }
      customerNo = customerNo.slice(0, customerNo.length - 1);
      batchIdList = idList;
      console.log(idList);
    }

    const startConfiguration = async () => {
      let res = await proxy.$api.startConfiguration(batchIdList);
      if (res == 1) {
        ElMessage.success('邮件启用成功！');
      } else {
        ElMessage.error("邮件启用失败！");
      }

    }

    const runEmailConfiguration = async () => {
      let res = await proxy.$api.runEmailConfiguration(batchIdList);
      if (res == 1) {
        ElMessage.success('邮件执行成功！');
      } else {
        ElMessage.error("邮件执行失败！");
      }
    }

    const checkEmailConfiguration = async () => {
      let res = await proxy.$api.checkEmailConfiguration(batchIdList);
      if (res == 1) {
        ElMessage.success('邮件审核成功！');
      } else {
        ElMessage.error("邮件审核失败！");
      }
    }

    const batchDeleteEmailConfiguration = async () => {
      let res = await proxy.$api.batchDeleteEmailConfiguration(batchIdList);
      if (res == 1) {
        ElMessage.success('邮件删除成功！');
        await getEmailList();
      } else {
        ElMessage.error("邮件删除失败！");
      }
    }

    const deleteEmail = () => {
      ElMessageBox.confirm('确认删除用户编号为(' + customerNo + ')的邮件配置吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }).then(() => {
        batchDeleteEmailConfiguration();
      })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
    }

    const expectChange = () => {
      console.log(addStuForm.expectTime)
    }

    //清空
    const clear = () => {
      formInLine.startTime = '';
      formInLine.endTime = '';
      formInLine.customerNo = '';
      formInLine.customerName = '';
      formInLine.status = '';
    }

    onMounted(() => {
      getModelList(),
          getEmailList()
    })

    return {
      tableLabel,
      tableData,
      loading: computed(() => store.state.loading),
      dialogFormVisible,
      params,
      changePage,
      handleSearch,
      formInLine,
      addStuForm,
      valueHtml,
      handleCreated,
      editorRef,
      toolbarConfig,
      mode: 'simple', //简洁模式
      cancel,
      isStartOption,
      onChange,
      getModelList,
      modeData,
      getModelContent,
      emailData,
      addEmailGroup,
      isModel,
      getEmailList,
      contentChange,
      handleSelectionChange1,
      customerNo,
      startConfiguration,
      runEmailConfiguration,
      checkEmailConfiguration,
      clear,
      batchDeleteEmailConfiguration,
      deleteEmail,
      expectChange,
      updateEmail,
      add

    }
  }
}
</script>

<style lang="less" scoped>
.user-header {
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

//弹框头部
::v-deep .el-dialog__header {
  --el-text-color-primary: #1EFFFF;
  --el-text-color-regular: #fff;
  padding: 0 !important;
  width: 100%;
  height: 64px;
  background: #7986CB;
}

//弹框标题
::v-deep .el-dialog__title {
  margin-left: 24px;
  line-height: 64px;
}

.mainClass {
  padding: 5px;
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 99%;
  height: 98%;
}

#table {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.queryClass {
  margin-right: 7px;
}
</style>