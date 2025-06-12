<template>
  <div>
    <div class="point_list_content">
      <checkPointList :loading="listLoading" :list="tableData" @openEleList="openEleList"></checkPointList>
    </div>
    <el-dialog
      title="差异构件列表"
      width="600px"
      :visible.sync="eleDialog.visible">
      <EleList class="ele_list" :list="eleDialog.elesData"></EleList>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkPointList from './checkPointResultList.vue';
import EleList from './eleList.vue';
export default {
    components: {
      EleList,
      checkPointList
    },
    data() {
      return {
        workId: this.$route.query.workId,
        tableData: [],
        listLoading: false,
        eleDialog: {
          visible: false,
          elesData: []
        }
      };
    },
    created () {
      this.getCheckPointsList()
    },
    methods: {
      getCheckPointsList () {
        this.listLoading = true
        this.$store.dispatch("getCheckPointListByWork", {
          workId: this.workId
        }).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.tableData = res.data.detail
          }
        }).finally(() => {
          this.listLoading = false
        })
      },
      openEleList(row) {
        this.$store.dispatch("getEleListByWorkCheckPoint", {
          workId: this.workId,
          ruleId: row.ruleId
        }).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.eleDialog.elesData = res.data.detail
            this.eleDialog.visible = true
          }
        }).catch(err => {
          this.$message.warning("未查询到构件列表!")
        })
      },
      cancel () {
        this.eleDialog.elesData = []
        this.eleDialog.visible = false
      }
    },
}
</script>

<style lang="less" scoped>
.ele_list{
  max-height: 480px;
  overflow:auto
}
</style>
