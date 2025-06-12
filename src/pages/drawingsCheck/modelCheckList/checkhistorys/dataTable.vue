<template>
  <div v-loading="dataLoading">
    <el-table :data="tableData"
    @selection-change="handleSelectionChange"
    :cell-class-name="cellClz"
    :row-class-name="() => 'table_row_processing'">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column prop="startTime" label="执行时间" width="140">
        <template slot-scope="scope">
          {{(scope.row.startTime || '').slice(0, 16)}}
        </template>
      </el-table-column>
      <el-table-column prop="typeDesc" label="作业类型" width="100"></el-table-column>
      <el-table-column prop="creatorName" label="操作人员"></el-table-column>
      <el-table-column prop="finishTime" label="完成时间" width="140">
        <template slot-scope="scope">
          {{(scope.row.finishTime || '').slice(0, 16)}}
        </template>
      </el-table-column>
      <el-table-column prop="statusDesc" label="状态" width="100"></el-table-column>
      <el-table-column prop="" label="作业详情" width="330">
        <template slot-scope="scope">
          <span class="row_table_btn" @click.stop="openModel(scope.row)">审查结果</span>
          <span class="row_table_btn" @click.stop="checkDetail(scope.row)">查看详情</span>
        </template>
      </el-table-column>
      <el-table-column column-key="processing-cell" prop="" label="" width="1">
        <template slot-scope="scope">
          <div
            v-if="inProcessing(scope.row.status)"
            class="table_row_processing_bar"
          ></div>
        </template>
      </el-table-column>
    </el-table>
    <table-empty class="table_empty" v-show="!tableData.length"></table-empty>
  </div>
</template>
<script>
import TableEmpty from '@/components/empty/TableEmpty.vue'
export default {
  name: '',
  components: {TableEmpty},
  props: {
    list: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    refreshFunc: {
      type: Function
    }
  },
  data () {
    return {
      tableData: [],
      dataLoading: false,
      selectedRows: [],
      fileId: this.$route.query.fileId
    }
  },
  computed: {
    cellClz () {
      return (scope) => {
        let ret = ''
        if (this.inProcessing(scope.row.status) && scope.column.columnKey === 'processing-cell') {
          ret = 'table_row_processing_cell'
        }
        return ret
      }
    },
    inProcessing () {
      return str => {
        return ['running'].includes(str)
      }
    },
  },
  watch: {
    list: {
      handler (val) {
        if (Array.isArray(val)) {
          this.tableData = val
          if (this.tableData.find(r => {
            return this.inProcessing(r.status)
          })) {
            setTimeout(() => {
              this.refreshFunc && this.refreshFunc(true)
            }, 10000)
          }
        }
      }
    },
    loading: {
      handler (val) {
        this.dataLoading = val
      }
    }
  },
  created () {},
  mounted () {},
  destroyed () {},
  methods: {
    handleSelectionChange (val) {
      this.selectedRows = val
    },

    openModel (row) {
      window.open(`#/main/drawingCheck/model?fileId=${this.fileId}&workId=${row.id}&type=${row.type}`)
    },

    checkDetail (data) {
      this.$router.push({
        name: 'checkWorkInfo',
        query: {
          fileId: this.fileId,
          workId: data.id,
          type: data.type,
          name: this.$route.query.name
        }
      })
    },
  }
}
</script>
<style lang='less' scoped>
.table_empty{
  height: calc(100% - 68px);
  background: #FFFFFF;
  position: relative;
  bottom: 60px;
  z-index: 9;
  .create_project_btn{
    margin-top: 16px;
  }
}
</style>
