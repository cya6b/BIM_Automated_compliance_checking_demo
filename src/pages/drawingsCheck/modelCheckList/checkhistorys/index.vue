<template>
  <div>
    <div class="title">
      “{{modelName}}” 作业历史
      <span class="total_info">共 “{{dataList.length}}” 条数据</span>
    </div>
    <dataTable v-loading="listLoading" class="list" :list="dataList" :refreshFunc="search"></dataTable>
  </div>
</template>

<script>
import dataTable from './dataTable.vue';
export default {
  components: {
    dataTable
  },
  data () {
    return {
      modelName: this.$route.query.name,
      fileId: this.$route.query.fileId,
      dataList: [],
      listLoading: false
    }
  },
  created () {
    this.search()
  },
  methods: {
    search (noLoading) {
      if (this.fileId) {
        if (!noLoading) {
          this.listLoading = true
        }
        this.$store.dispatch('getModekCheckWorkList', {fileId: this.fileId}).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.dataList = res.data.detail
          }
        }).finally(() => {
          this.listLoading = false
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.title{
    padding: 12px 12px 6px 12px;
    border-bottom: 2px solid #0066a5;
    font-size: 15px;
}
.list {
  margin-top: 12px;
}
.total_info{
  float: right;
}
</style>
