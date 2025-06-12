<template>
  <div class="params_setting_page">
    <el-button class="copy_btn" type="primary" @click="copyParams">复制配置参数</el-button>
    <el-tabs class="tb" id="folderTrType" v-model="tabType">
      <el-tab-pane label="验证参数配置" name="first">
        <validParamsSetting
        class="__tab_content"
        ref="validParamsSetting"
        :fileId="fileId"
        :modelName="name"
        :articles="validParam.articles"></validParamsSetting>
        <div class="bottom_btns">
          <el-button type="primary"
          v-loading="validParam.saveloading"
          @click="saveValidParams">保存验证条件</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="审查参数配置" name="second">
        <checkParamSetting
        class="__tab_content"
        ref="checkParamsSetting"
        :fileId="fileId"
        :modelName="name"></checkParamSetting>
        <div class="bottom_btns">
          <el-button type="primary"
          v-loading="checkParam.saveloading"
          @click="saveCheckParams">保存审查参数</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="复制模型参数"
      width="440px"
      :visible.sync="copy.visible"
      :before-close="cancel">
      <div>
        <el-select filterable placeholder="请选择要复制的模型" v-model="copy.modelId">
          <el-option v-for="item in modelList" :key="item" :label="item.modelName" :value="item.id"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCopy">取 消</el-button>
        <el-button type="primary" v-loading="copy.submitLoading" @click="copySumbit">复 制</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import validParamsSetting from './validParamSetting/index.vue'
import checkParamSetting from './checkParamSetting/index.vue'
import copyParam from './copyParam/index.vue'
export default {
  components: {
    validParamsSetting,
    checkParamSetting,
    copyParam
  },
  data () {
    return {
      tabType: 'first',
      fileId: this.$route.query.fileId,
      name: this.$route.query.name,

      validParam: {
        saveloading: false,
        articles: [],
      },
      checkParam: {
        saveLoading: false,
      },

      copy: {
        modelId: null,
        visible: false,
        submitLoading: false
      },
      modelList: []
    }
  },
  created () {
    this.getArticleData()
    this.getModelList()
  },
  methods: {
    copyParams () {
      this.copy.visible = true
    },
    cancelCopy () {
      this.copy.visible = false
    },
    copySumbit () {
      if (!this.copy.modelId) {
        this.$message.warning('请选择要复制参数的模型!')
        return
      }
      this.copy.submitLoading = true
      let params = {
        targetFileId: this.fileId,
        sourceFileId: this.copy.modelId,
      }
      this.$store.dispatch('copyParams', params).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.copy.visible = false
          document.location.reload()
        } else {
          this.$message.warning('复制失败!')
        }
      }).catch(err => {
        this.$message.warning('复制失败!')
      }).finally(() => {
        this.copy.submitLoading = false
      })
    },
    getArticleData () {
      if (this.validParam.articles.length) {
        return
      }
      this.$store.dispatch('getArticle').then(res => {
        if (res.data.code === 'SUCCESS') {
          const detail = res.data.detail
          this.validParam.articles = detail
        }
      })
    },
    getModelList () {
      this.$store.dispatch('getCopyCheckModelList', {
        hasConfig: false,
        limit: 999999,
      }).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.modelList = (res.data.detail || []).filter(item => {
            return item.id !== this.fileId
          })
        }
      })
    },

    saveValidParams () {
      let d = null
      if (this.$refs.validParamsSetting && this.$refs.validParamsSetting.getData) {
        d = this.$refs.validParamsSetting.getData()
      }
      if (d) {
        this.validParam.saveloading = true
        this.$store.dispatch('saveBimVerifyParam', d).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.$message.success('保存成功!')
          }
        }).catch(() => {
          this.$message.error('保存失败!')
        }).finally(() => {
          this.validParam.saveloading = false
        })
      }
    },

    saveCheckParams () {
      let d = null
      if (this.$refs.checkParamsSetting && this.$refs.checkParamsSetting.getData) {
        d = this.$refs.checkParamsSetting.getData()
      }
      if (d) {
        this.checkParam.saveloading = true
        this.$store.dispatch('saveCheckParams', d).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.$message.success('保存成功!')
          }
        }).catch(() => {
          this.$message.error('保存失败!')
        }).finally(() => {
          this.checkParam.saveloading = false
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.params_setting_page{
  // padding: 12px;
  position: relative;
  .copy_btn{
    position: absolute;
    right: 24px;
    top: 2px;
    z-index: 99;
  }
}
/deep/.el-tabs{
  height: calc(100% - 50px);
  .el-tabs__content{
    padding: 24px;
    overflow-y: auto;
    .__tab_content{
      height: calc(100% - 60px);
      padding: 0px 12px 12px 0px;
      overflow-y: auto;
    }
  }
}
.bottom_btns{
  margin-top: 12px;
  text-align: center;
}
</style>
