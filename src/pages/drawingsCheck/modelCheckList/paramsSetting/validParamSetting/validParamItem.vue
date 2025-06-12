<template>
  <div class="param_item">
    <span class="delete_icon">
      <slot name="delete-icon"></slot>
    </span>
    <el-form label-position="right" :disabled="disabled"
      ref="form" :model="formData" :rules="rules">
      <el-row :gutter="24">
        <el-col :span="11">
          <el-form-item label="规范名称" prop="name">
            <el-select clearable filterable :disabled="onlyLook" placeholder="请选择规范" v-model="formData.specificationId">
              <el-option v-for="spec in guifanList" :label="spec.name" :key="spec.id" :value="spec.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="width:24px">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条文编号" prop="name">
            <el-select clearable filterable :disabled="onlyLook" placeholder="请选择条文" v-model="formData.articleId">
              <el-option v-for="spec in tiaowenList" :label="spec.code" :key="spec.id" :value="spec.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审查点" prop="name">
            <el-select clearable filterable :disabled="onlyLook"  placeholder="请选择审查点" v-model="formData.ruleId">
              <el-option v-for="spec in shenchadianList"
              :label="`${spec.clauseCode ? spec.clauseCode + '-' : ''}${spec.code}`"
              :key="spec.ruleId" :value="spec.ruleId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" :key="ele" v-for="(ele, eleIndex) in formData.elements">
        <el-col :span="6">
          <el-form-item label="构件名称">
            <el-input clearable :disabled="onlyLook" v-model="ele.elementName"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="position:relative" :span="5">
          <el-form-item label="构件ID">
            <el-input clearable :disabled="onlyLook" v-model="ele.elementId"></el-input>
          </el-form-item>
          <span v-if="!onlyLook" class="opt_btn">
            <icon title="删除构件" class="iconfont bj-icon-delete del_btn"
              v-if="formData.elements.length > 1"
              @click="formData.elements.splice(eleIndex, 1)"></icon>
            <icon title="添加构件" class="iconfont bj-icon-add- add_btn"
              v-if="eleIndex === formData.elements.length - 1"
              @click="formData.elements.push({
              elementName: '',elementId: '',attributes: [{
                key: '', value: ''
              }]
            })"></icon>
          </span>
        </el-col>
        <el-col :span="1" style="width:24px">
          <span>&nbsp;</span>
        </el-col>
        <div :key="arIndex" v-for="(ar, arIndex) in ele.attributes">
          <template v-if="arIndex">
            <el-col :span="11">
              <span>&nbsp;</span>
            </el-col>
            <el-col :span="1" style="width:24px">
              <span>&nbsp;</span>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item label="关联属性">
              <el-input clearable :disabled="onlyLook" v-model="ar.key"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="position:relative" :span="6">
            <el-form-item label="属性值">
              <el-input clearable :disabled="onlyLook" v-model="ar.value"></el-input>
            </el-form-item>
            <span v-if="!onlyLook" class="opt_btn">
              <icon title="删除属性" class="iconfont bj-icon-delete del_btn"
                v-if="ele.attributes.length > 1"
                @click="ele.attributes.splice(arIndex, 1)"></icon>
              <icon v-if="arIndex === ele.attributes.length-1" title="添加属性"
                class="iconfont bj-icon-add- add_btn"
                @click="ele.attributes.push({
                  key: '',value: ''
                })"></icon>
            </span>
          </el-col>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import validParamModel from './validParamModel'
export default {
  data () {
    return {
      formData: new validParamModel(),
      guifanList: [],
      rules: []
    }
  },
  props: {
    onlyLook: {
      default: false,
      type: Boolean
    },
    params: {
      type: Object
    },
    articles: {
      type: Array,
    }
  },
  computed: {
    tiaowenList () {
      return this.removal((this.guifanList.find(g => g.id === this.formData.specificationId) || {}).articleInfoList || [])
    },
    shenchadianList () {
      return this.removal((this.tiaowenList.find(g => g.id === this.formData.articleId) || {}).checkPointSet || [])
    }
  },
  watch: {
    params: {
      handler (val) {
        this.formData = new validParamModel(val)
      },
      immediate: true
    },
    articles: {
      handler (val) {
        if (Array.isArray(val) && val.length) {
          this.guifanList = this.removal(val)
        }
      },
      immediate: true
    },
  },
  methods: {
    removal (list) {
      let ret = []
      list.forEach(item => {
        if (!ret.find(r => {
          return r.id === item.id
        })) {
          ret.push(item)
        }
      })
      return ret
    }
  }
}
</script>

<style lang="less" scoped>
.param_item{
  padding: 12px;
  padding-right: 48px;
  padding-top: 24px;
  background: #f8f8f8;
  position: relative;
}
.delete_icon {
  position: absolute;
  top: 6px;
  right: 12px;
  z-index: 99;
  &:hover{
    cursor: pointer;
    color: red;
  }
}
.opt_btn{
  position: absolute;
  top: 8px;
  right: -24px;
  width: 32px;
  &:hover {
    cursor: pointer;
  }
}
</style>
