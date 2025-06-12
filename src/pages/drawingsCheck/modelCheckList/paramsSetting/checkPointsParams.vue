<template>
  <div class="valid_params_setting" v-loading="loading">
    <!-- <div class="yztjsz"><span>条文列表</span></div> -->
    <ValidParamItem :onlyLook="onlyLook" class="item" v-for="(item, itemIndex) in paramItems"
      ref="paramItem"
      :articles="guifanList" :key="item" :params.sync="item">
      <icon v-if="paramItems.length > 1 && !onlyLook" slot="delete-icon"
        class="iconfont icon-guanbi delete_item_btn" @click="deleteParamItem(itemIndex)"></icon>
    </ValidParamItem>
    <span v-if="!onlyLook" class="add_item_btn" @click="addParamItem">
      <i class="iconfont bj-icon-add-"></i>
      添加验证条件
    </span>
  </div>
</template>

<script>
import ValidParamItem from './validParamSetting/validParamItem.vue';
import validParamModel from './validParamSetting/validParamModel'
export default {
    data() {
        return {
            introduction: "",
            paramItems: [new validParamModel()],
            guifanList: [],

            loading: false
        };
    },
    components: { ValidParamItem },
    props: {
      onlyLook: {
        type: Boolean,
        default: false,
      },
      workId: {
        type: String | Number
      },
      fileId: {
        type: String | Number
      },
      modelName: {
        type: String,
        defualt: ''
      },
      articles: {
        type: Array,
      }
    },
    created () {
      if (this.workId) {
        this.getBimVerifyParams(this.workId, true)
      }else if (this.fileId) {
        this.getBimVerifyParams(this.fileId)
      }
    },
    methods: {
      addParamItem () {
        this.paramItems.push(new validParamModel())
      },
      deleteParamItem (index) {
        this.paramItems.splice(index, 1)
      },

      getData () {
        let list = []
        this.$refs.paramItem.forEach(rf => {
          const fData = rf.formData
          list.push({
            articleId: fData.articleId,
            articleName: fData.articleName,
            ruleId: fData.ruleId,
            ruleName: fData.ruleName,
            specificationId: fData.specificationId,
            specificationName: fData.specificationName,
            elements: fData.elements
          })
        })
        let ret = {
          modelDesc: this.introduction,
          fileId: this.fileId,
          rules: list
        }
        return ret
      },

      getBimVerifyParams (id, isWork) {
        if (id) {
          this.loading = true
          let params = {
            fileId: id
          }
          let aN = 'getBimVerifyParamsByFileId'
          if (isWork) {
            aN = 'getBimVerifyParamsByWorkId'
            params = {
              workId: id
            }
          }
          this.$store.dispatch(aN, params).then(res => {
            if (res.data.code === 'SUCCESS') {
              const d = res.data.detail
              this.setData(d)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      },

      setData (d) {
        let pD = [];
        let temp = d.rules || d.workRunRules || []
        temp.forEach(l => {
          pD.push({
            articleId: l.articleId,
            articleName: l.articleName,
            ruleId: l.ruleId,
            ruleName: l.ruleName,
            specificationId: l.specificationId,
            specificationName: l.specificationName,
            elements: l.elements
          })
        })
        // 数据填充
        this.introduction = d.modelDesc
        if (!pD.length) {
          pD.push(new validParamModel())
        }
        this.paramItems = pD
      },

      clearData () {
        this.introduction = ''
        this.paramItems = [new validParamModel()]
      }
    },
    watch: {
      articles: {
        handler (val) {
          if (Array.isArray(val) && val.length) {
            this.guifanList = val
          }
        },
        immediate: true
      },
    }
}
</script>

<style lang="less" scoped>
.valid_params_setting{
}
.item +.item {
  margin-top: 12px;
}
.add_item_btn{
  display: inline-block;
  padding: 6px 12px;
  margin-top: 6px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #0066a5;
  background: #0066a5;
  color: #ffffff;
}
.delete_item_btn{

}
.yztjsz{
  margin-bottom: 6px;
}
</style>
