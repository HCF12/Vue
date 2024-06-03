<template>
  <div id="mainer">
    <div id="bod">
      <el-form :model="addStuForm" class="addForm" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="收件人：" class="formStyle" style="display: flex">
              <el-input v-model="addStuForm.recipientMailbox" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="抄送：" class="formStyle" style="display: flex">
              <el-input v-model="addStuForm.ccMailbox" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="密送：" class="formStyle" style="display: flex">
              <el-input v-model="addStuForm.bccMailbox" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主题：" class="formStyle" style="display: flex">
              <el-input v-model="addStuForm.subject" class="w-50 m-2" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item class="formStyle" label="内容：" style="display: flex">
              <div style="border: 1px solid #cccccc;flex-grow: 1">
                <Toolbar style="border-bottom: 1px solid #ccc;" :editor="editorRef" :defaultConfig="toolbarConfig"
                         :mode="mode"/>
                <Editor style="height: 500px; overflow-y: hidden;" v-model="addStuForm.sendContent"
                        @onCreated="handleCreated" @change="onChange"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item style="display: flex;float: right">
              <el-button :plain="true" type="primary" style="width: 100px" @click="sendEmail">
                <el-icon>
                <Promotion/>
              </el-icon>发送</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, shallowRef} from "vue";
import {onBeforeUnmount, reactive,ref} from "vue-demi";
import {ElMessage} from "element-plus";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

export default {
  name: "handMovementSendEmail",
  components: {Editor, Toolbar},
  setup () {
    //挂载全局api
    const {proxy} = getCurrentInstance()
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
    //表单对象
    const addStuForm = reactive({
      recipientMailbox: '',
      ccMailbox: '',
      bccMailbox: '',
      subject: '',
      sendContent: '',
      enclosures : []
    });

    const sendEmail = async () => {
      let res = await proxy.$api.sendEmail(addStuForm);
      if (res == 1) {
        ElMessage.success("发送成功！");
        addStuForm.recipientMailbox = '';
        addStuForm.ccMailbox = '';
        addStuForm.bccMailbox = '';
        addStuForm.subject = '';
        addStuForm.sendContent = '';
        addStuForm.enclosures = '';
      }else {
        ElMessage.error("发送失败！");
      }
    }

    return {
      valueHtml,
      toolbarConfig,
      handleCreated,
      onChange,
      editorRef,
      mode: 'simple', //简洁模式
      addStuForm,
      sendEmail
    }
  }
}
</script>

<style lang="less" scoped>
#mainer {
  padding: 5px;
}
.formStyle{
  font-weight: bold;
}
</style>