<template>
  <el-form :model="addStuForm" class="addForm" label-width="auto">
    <el-row>
      <el-col :span="24">
        <el-form-item label="消费日期：">
          <el-input type="date" v-model="addStuForm.consumptionDate" placeholder="请选择交易日期" format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss" change="getdate()" style="width: 90%;" />
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
    <el-row>
      <el-col>
        <el-form-item style="display: flex;float: right;margin-right: 160px">
          <el-button :plain="true" style="width: 100px" type="primary" @click="enter">确认
          </el-button>
          <el-button style="width: 100px" @click="cancel">取消</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getCurrentInstance, onMounted, ref, shallowRef } from "vue";
import { onBeforeUnmount, reactive } from "vue-demi";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ElMessage } from "element-plus";

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
    const addStuForm = reactive({
      consumptionDate: '',
      amount: '',
      consumptionType: '',
      remark: '',
      consumptionBy: studentId
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

    const getConsumptionType = async () => {
      modeData.value = await proxy.$api.getConsumptionType();
    }

    const saveConsumption = async () => {
      let res = await proxy.$api.saveConsumption(addStuForm);
      console.log(res);
      ElMessage.success('账单信息保存成功！');
      cancel();
    }

    const enter = () => {
      saveConsumption();
    };
    const cancel = () => {
      addStuForm.consumptionDate = '';
      addStuForm.amount = '';
      addStuForm.consumptionType = '';
      addStuForm.remark = '';
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
      enter,
      cancel,
      getdate
    }
  }
}
</script>

<style scoped lang="less"></style>