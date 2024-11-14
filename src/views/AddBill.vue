<template>
  <el-form :model="addStuForm" class="addForm" label-width="auto">
    <el-row>
      <el-col :span="24">
        <el-form-item label="录入方式：">
          <el-select v-model="addStuForm.saveType" class="w-50 m-2" placeholder="请选择" style="width: 90%;">
            <el-option v-for="item in saveType" :key="item.type" :label="item.typeName" :value="item.type" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div v-show="addStuForm.saveType == 2">
      <el-row>
        <el-col :span="24">
          <el-form-item label="选择文件：">
            <input type="file" @change="handFileUpload" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div v-show="addStuForm.saveType == 1">
      <el-row>
        <el-col :span="24">
          <el-form-item label="消费日期：">
            <!-- <el-input type="date" v-model="addStuForm.consumptionDate" placeholder="请选择交易日期"
              format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" change="getdate()" style="width: 90%;" /> -->
            <DatePicker placeholder="请选择日期时间" v-model="addStuForm.consumptionDate" format="yyyy-MM-dd" style="width: 90%;"
              show-time enable-seconds />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="消费金额：">
            <el-input v-model="addStuForm.amount" class="w-50 m-2" type="text" style="width: 90%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="消费类型：">
            <el-select v-model="addStuForm.consumptionType" class="w-50 m-2" placeholder="请选择" style="width: 90%;">
              <el-option v-for="item in modeData" :key="item.id" :label="item.consumptionType" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <textarea style="width: 90%;height: 300px" v-model="addStuForm.remark"></textarea>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col>
        <el-form-item style="display: flex;float: right;margin-right: 160px">
          <el-button :plain="true" style="width: 100px" type="primary" @click="save">确认
          </el-button>
          <el-button style="width: 100px" @click="cancel">取消</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { getCurrentInstance, onMounted, ref, shallowRef } from "vue";
import { onBeforeUnmount, reactive } from "vue-demi";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ElMessage } from "element-plus";
import DatePicker from '../components/DatePicker.vue'
//import type { UploadInstance } from 'element-plus';
//import config from "../config/index.js";
export default {
  components: { Editor, Toolbar },
  setup() {
    //挂载全局api
    const { proxy } = getCurrentInstance()
    const editorRef = shallowRef()
    const valueHtml = ref('<p>hello 富文本编辑器</p>')
    const toolbarConfig = {};
    let modeData = ref([]);
    let studentId = window.sessionStorage.getItem('studentId');
    const fileInput = ref(null);
    const selectedFile = ref(null);
    //let url = ref(config.baseApi + "/consumption/batchInsertConsumption");
    const addStuForm = reactive({
      consumptionDate: '',
      amount: '',
      consumptionType: '',
      remark: '',
      consumptionBy: studentId,
      saveType: ''
    });
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

    let saveType = reactive([
      {
        type: 1,
        typeName: '手动录入'
      },
      {
        type: 2,
        typeName: '批量导入'
      }
    ]);

    const getConsumptionType = async () => {
      modeData.value = await proxy.$api.getConsumptionType();
    }

    const saveConsumption = async () => {
      let res = await proxy.$api.saveConsumption(addStuForm);
      console.log(res);
      ElMessage.success('账单信息保存成功！');
      cancel();
    }

    const save = () => {
      if (addStuForm.saveType == 1) {
        saveConsumption();
      } else {
        uploadFile();
      }
      cancel();
    }

    /*const enter = () => {
      saveConsumption();
    };*/
    const cancel = () => {
      addStuForm.consumptionDate = '';
      addStuForm.amount = '';
      addStuForm.consumptionType = '';
      addStuForm.remark = '';
      selectedFile.value = null;
    }

    const handFileUpload = (event) => {
      selectedFile.value = event.target.files[0];
      console.log(event);
    };

    const uploadFile = async () => {
      if (!selectedFile.value) {
        ElMessage.warning('请选择一个文件');
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile.value);

      try {
        const response = await proxy.$api.batchInsertConsumption(formData);
        if (response == 1) {
          ElMessage.success('上传成功');
        } else {
          ElMessage.warning('上传失败');
        }
      } catch (error) {
        ElMessage.error('上传异常' + error);
      }
    }

    const getdate = () => {
      console.log(addStuForm.consumptionDate);
    }
    onMounted(() => {
      getConsumptionType()
    });

    return {
      editorRef,
      valueHtml,
      toolbarConfig,
      handleCreated,
      onChange,
      mode: 'simple', //简洁模式
      modeData,
      getConsumptionType,
      addStuForm,
      //enter,
      cancel,
      getdate,
      saveType,
      handFileUpload,
      save,
      fileInput,
      //url
    }
  }
}
</script>

<style scoped lang="less"></style>