<template>
  <div id="mainer">
    <div id="header">
      <el-form :inline="true" :model="formInLine" class="factor">
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.batchId" placeholder="批次号" type="text" style="width: 210px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.customerNo" placeholder="客户编号" type="text" style="width: 210px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.customerName" placeholder="客户名称" class="w-50 m-2" type="text"
            style="width: 210px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-input v-model="formInLine.subject" placeholder="主题" class="w-50 m-2" type="text" style="width: 210px;">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin: 10px;">
          <el-date-picker v-model="formInLine.expectedTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" start-placeholder="请输入开始时间" end-placeholder="请输入结束时间"
            class="dateClass" />
        </el-form-item>
        <el-form-item style="float: right;margin: 10px;">
          <el-button type="success" @click="handleSearch" style="width: 100px;">查询</el-button>
          <el-button type="default" @click="clear" style="width: 100px;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="bod" style="display:flex;flex-direction: column;flex-grow: 1">
      <el-table v-loading="loading" ref="multipleTable" :data="tableData" :stripe="true" :fit="true"
        style="border-radius: 5px;flex-grow: 1;" highlight-current-row @row-dblclick="getEmailDetails">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="hisGuid" label="历史编号" v-if="false" />
        <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label">
        </el-table-column>
      </el-table>
    </div>
    <div id="footer">
      <div class="demonstration" style="flex-grow: 1;font-size: 12px;">{{ params.size }}条记录</div>
      <el-pagination small background layout="prev, pager, next" :total="params.total" class="pager mt-4"
        @current-change="changePage" :current-page="params.pageNum" :page-size="params.pageSize" />
    </div>
  </div>
  <el-dialog v-model="dialogFormVisible.flag" :close-on-click-modal="false" width="750px" title="邮件查看" align-center
    draggable>
    <!-- <vue-email :email="email"></vue-email> -->
    <el-row>
      <el-col :span="24">
        <el-form-item label="发件人：">
          <el-input v-model="emailForm.sender" class="w-50 m-2" style="width: 640px;" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="收件人：">
          <el-input v-model="emailForm.receiver" style="width: 640px;" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="抄送人：">
          <el-input v-model="emailForm.carbon" class="w-50 m-2" type="text" style="width: 640px;"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="主题：">
          <el-input v-model="emailForm.subject" class="w-50 m-2" style="width: 630px" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="内容：">
          <div style="border: 1px solid #cccccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              :mode="mode" />
            <Editor style="height: 300px;width: 550px; overflow-y: hidden;" v-model="valueHtml"
              @onCreated="handleCreated" @change="onChange" />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { reactive, onBeforeUnmount } from "vue-demi";
import { computed, getCurrentInstance, onMounted, ref, shallowRef } from "vue";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useStore } from "vuex";
// import { Email } from 'emailjs-mime-builder'
// import VueEmail from 'vue-email'
export default {
  components: { Editor, Toolbar },
  setup() {
    const { proxy } = getCurrentInstance()
    const store = useStore();
    let tableData = ref([]);
    const dialogFormVisible = reactive({
      flag: false
    });
    let email = ref();
    /*const loadEmlFile = async() => {
      const response = await fetch(email);
      const arrayBuffer = await response.arrayBuffer();
      const email = await Email.parse(arrayBuffer);
    }*/
    const tableLabel = reactive([
      {
        prop: "batchGuid",
        label: "批次号",
        width: 200,
        defaultVisible: true
      },
      {
        prop: "description",
        label: "模板名称",
        width: 200,
        defaultVisible: true
      },
      {
        prop: "customerNo",
        label: "客户编号",
        width: 150,
        defaultVisible: true
      },
      {
        prop: "customerName",
        label: "客户姓名",
        width: 200,
        defaultVisible: true
      },
      {
        prop: "email",
        label: "接收邮箱",
        width: 240,
        defaultVisible: true
      },
      {
        prop: "carbon",
        label: "抄送邮箱",
        width: 260,
        defaultVisible: true
      },
      {
        prop: "subject",
        label: "主题",
        width: 200,
        defaultVisible: true
      },
      {
        prop: "pie",
        label: "发送通道",
        width: 150,
        defaultVisible: true
      },
      {
        prop: "createdDate",
        label: "发送时间",
        width: 260,
        defaultVisible: true
      }
    ]);
    const formInLine = reactive({
      customerNo: '',
      customerName: '',
      expectedTime: [],
      subject: '',
      batchId: ''
    });

    const emailForm = reactive({
      sender: '',
      receiver: '',
      carbon: '',
      subject: '',
      content: '',
      enclosure: ''
    });

    const params = reactive({
      total: 0,
      prePage: 1,
      size: 0,
      pageNum: 1,
      pageSize: 10,
      customerNo: '',
      customerName: '',
      startTime: '',
      endTime: '',
      subject: '',
      batchId: ''
    });

    const editorRef = shallowRef()
    let valueHtml = ref('<p>hello 富文本编辑器</p>');
    const toolbarConfig = {};
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    });
    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
      console.log(editorRef.value);
    }
    const onChange = (editor) => {
      const text = editor.getHtml();
      this.$emit('update:content', text)
    }

    const getEmailGroupSendHisInfo = async () => {
      let res = await proxy.$api.getEmailGroupSendHisInfo(params);
      params.total = res.total;
      params.prePage = res.prePage
      params.size = res.size
      tableData.value = res.list;
    }

    const getEmailGroupHisById = async (hisGuid) => {
      let res = await proxy.$api.getEmailGroupHisById(hisGuid);
      emailForm.carbon = res.carbon;
      emailForm.sender = res.sender;
      emailForm.receiver = res.email;
      emailForm.subject = res.subject;
      valueHtml.value = res.content;
      //email.value = res.emailPath;
      //loadEmlFile();
    }

    let getEmailDetails = (row) => {
      dialogFormVisible.flag = true;
      console.log(row);
      getEmailGroupHisById(row.hisGuid);
    }

    //分页
    const changePage = (page) => {
      console.log(page)
      params.pageNum = page;
      getEmailGroupSendHisInfo();
    }
    const handleSearch = () => {
      params.customerNo = formInLine.customerNo;
      params.customerName = formInLine.customerName;
      params.batchId = formInLine.batchId;
      params.startTime = formInLine.expectedTime[0];
      console.log(params.startTime)
      params.endTime = formInLine.expectedTime[1];
      params.subject = formInLine.subject;
      getEmailGroupSendHisInfo(params)
    }

    //清空
    const clear = () => {
      formInLine.expectedTime = [];
      formInLine.customerNo = '';
      formInLine.customerName = '';
      formInLine.batchId = '';
      formInLine.subject = '';
    }
    onMounted(() => {
      getEmailGroupSendHisInfo();
    });

    return {
      formInLine,
      tableLabel,
      loading: computed(() => store.state.loading),
      tableData,
      params,
      changePage,
      handleSearch,
      clear,
      dialogFormVisible,
      emailForm,
      mode: 'simple', //简洁模式
      valueHtml,
      toolbarConfig,
      handleCreated,
      onChange,
      editorRef,
      getEmailDetails,
      //email
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