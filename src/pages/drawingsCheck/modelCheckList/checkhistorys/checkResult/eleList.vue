<template>
  <el-table :data="tableData">
    <el-table-column type="index" width="55" label="序号"></el-table-column>
    <el-table-column prop="elementName" label="构件名称"></el-table-column>
    <el-table-column prop="elementId" label="构件ID" width="120"></el-table-column>
    <el-table-column prop="source" label="来源" width="120">
      <template slot-scope="scope">
        <span>{{
          ($myDic.elementSourceMap.find(d => {
            return d.key == scope.row.source
          }) || {}).label || '--'
        }}</span>
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
