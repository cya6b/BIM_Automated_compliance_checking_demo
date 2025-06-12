<template>
  <el-table v-loading="loading" :data="tableData">
    <el-table-column prop="specificationName" min-width="200" label="规范名称"></el-table-column>
    <el-table-column prop="articleCode" label="条文编号" width="160"></el-table-column>
    <el-table-column prop="checkPointCode" label="审查点编号" width="160"></el-table-column>
    <el-table-column prop="diffFlag" label="差异原因说明" width="240">
      <template slot-scope="scope">
        <span>{{
          ($myDic.diffReasonFlagMap.find(d => {
            return d.key == scope.row.diffFlag
          }) || {}).label || '--'
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="" label="操作" width="200">
      <template slot-scope="scope">
        <span v-if="scope.row.diffFlag != 1" class="row_table_btn"
          @click="openEleList(scope.row)">差异构件列表</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    list: {
      handler (list) {
        this.tableData = list
      },
      immediate: true
    }
  },
  methods: {
    openEleList (row) {
      this.$emit("openEleList", row)
    }
  }
}
</script>

<style>

</style>
