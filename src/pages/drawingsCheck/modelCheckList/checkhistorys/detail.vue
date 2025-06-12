<template>
  <div class="check_detail_page">
    <div class="title">
      <span>审查详情</span>
      <div class="right_btn">
        <!-- <el-button v-loading="startBtnLoading" type="primary" @click="reStartC">重新发起审查</el-button> -->
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="tabType">
        <el-tab-pane label="作业参数" name="first">
          <div>
            <span class="p_label">审查参数</span>
            <CheckParams :hideModelName="true" onlyLook :workId="workId" :modelName="modelName"></CheckParams>
          </div>
          <div>
            <span class="p_label">{{workType === 'verify' ? '验证参数' : '条文列表'}}</span>
            <ValidParams v-if="workType === 'verify'" onlyLook :workId="workId" :modelName="modelName" :articles="articles"></ValidParams>
            <checkPointsList v-else onlyLook :workId="workId" :modelName="modelName" :articles="articles"></checkPointsList>
          </div>

        </el-tab-pane>
        <el-tab-pane v-if="workType === 'verify'" label="验证结果" name="second">
          <ValidCheckResult :workId="workId"></ValidCheckResult>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ValidParams from '../paramsSetting/validParamSetting/index.vue'
import checkPointsList from '../paramsSetting/checkPointsParams.vue'
import CheckParams from '../paramsSetting/checkParamSetting/index.vue'
import ValidCheckResult from './checkResult/validCheckResult.vue'

export default {
  components: {
    ValidParams,
    CheckParams,
    checkPointsList,
    ValidCheckResult
},
  data () {
    return {
      tabType: 'first',
      workType: this.$route.query.type,
      workId: this.$route.query.workId,
      fileId: this.$route.query.fileId,
      modelName: this.$route.query.name,

      articles: []
    }
  },
  created () {
    this.getArticleData()
  },
  methods: {
    getArticleData () {
      if (this.articles.length) {
        return
      }
      this.$store.dispatch('getArticle').then(res => {
        if (res.data.code === 'SUCCESS') {
          const detail = res.data.detail
          this.articles = detail
        }
      })
    },
    reStartC () {
      this.$router.push({
        name: 'startCheck',
        query: this.$route.query
      })
    }
  }
}
</script>

<style lang="less" scoped>
.check_detail_page{
  .title{
    padding: 12px 12px 6px 12px;
    border-bottom: 2px solid #0066a5;
    font-size: 15px;
    height: 24px;

    .right_btn{
      display: inline-block;
      float: right;
      position: relative;
      bottom: 6px;
    }
  }

  .content{
    height:calc(100% - 44px)
  }
  /deep/.el-tabs{
    height: calc(100% - 50px);
    .el-tabs__content{
      padding: 24px;
      overflow-y: auto;
    }
  }

  .p_label{
    display: inline-block;
    margin-bottom: 8px;
    color: #0066a5;
  }
}
</style>
