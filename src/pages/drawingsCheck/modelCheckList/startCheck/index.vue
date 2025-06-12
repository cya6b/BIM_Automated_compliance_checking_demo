<template>
  <div class="start_check_page">
    <div class="title">
      指定待审查条文
      <div class="right_btn">
        <el-button v-loading="startBtnLoading" type="primary" @click="startC">发起审查</el-button>
      </div>
    </div>
    <SelectCheckPoint ref="selectCheckPoint"></SelectCheckPoint>
  </div>
</template>

<script>
import DetailCheckpointDialog from './DetailCheckpointDialog.vue'
import SelectCheckPoint from './selectCheckPoint.vue'
export default {
  components: {
    DetailCheckpointDialog,
    SelectCheckPoint
},
  data () {
    return {
      fileId: this.$route.query.fileId,
      startBtnLoading: false,
    }
  },
  methods: {
    startC () {
      let cPs = this.$refs.selectCheckPoint.selectedCheckpoints
      if (!cPs.length) {
        this.$message.warning('请选择至少一条条文!')
        return
      }
      let params = {
        fileId: this.fileId,
        type: "examine",
        workRules: cPs.map(sC => {
          return {
            articleCode: sC.tw.code,
            articleContent: sC.tw.content,
            articleId: sC.tw.id,
            articleName: sC.tw.name,
            checkPointSet: [{
              code: sC.code,
              content: sC.content,
              id: sC.id,
              professionCode: sC.professionCode,
              ruleId: sC.ruleId
            }],
            specificationId: sC.gf.id,
            specificationName: sC.gf.name || '',
          }
        })
      }
      this.startBtnLoading = true
      this.$store.dispatch('startCheck', params).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.$message.success('操作成功!')
          this.$router.push({
            name: 'modelCheckList'
          })
        } else if (res.data.code === 'BUSINESS_EXCEPTION') {
          this.$message.warning(res.data.message)
        }
      }).catch(() => {
        this.$message.error('操作失败!')
      }).finally(() => {
        this.startBtnLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

.row_table_btn{
  padding: 0px 12px;
  color: #166fdc;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}

.start_check_page{
  .title{
    padding: 12px 12px 6px 12px;
    border-bottom: 2px solid #0066a5;
    font-size: 15px;

    .right_btn{
      display: inline-block;
      float: right;
      position: relative;
      bottom: 6px;
    }
  }
  .list_content{
    width: 100%;
    height: calc(100% - 64px);
    overflow-y: auto;
  }
  .selected_items{
    padding: 6px 12px;
    .clu_items{
      display: flex;
      flex-wrap: wrap;
      .empity_clu{
        padding: 6px 12px;
        width: 100%;
        text-align: center;
        color: #737272;
      }
    }
    .clu_item{
      display: inline-block;
      padding: 4px 12px;
      border: 1px solid #e1e0e0;
      border-radius: 4px;
      margin-top: 8px;
      margin-right: 12px;
      &:hover{
        cursor: pointer;
        border: 1px solid #0066a5;
      }

      .el-icon-circle-close{
        cursor: pointer;
        &:hover{
          color: red;
        }
      }
    }

    .clu_item.__active{
      border: 1px solid #0066a5;
      background: #DBEDF3;
    }
  }

  .clus_list {
    padding: 6px 12px;
    position: relative;
    .label{
      position: absolute;
      top: 24px;
      margin-bottom: 6px;
      display: inline-block;
    }
  }
}

.clus_filter{
  display: flex;
  flex-direction: row-reverse;
  padding: 6px 0px;
  .filter_item{
    width: 240px;
    margin-left: 12px;
  }
  .filter_item.search_input{
    width: 360px;
  }
  .filter_item.date_range{
    width: 350px;
  }
}

</style>
