<template>
  <div v-loading="dataLoading">
    <el-table :data="tableData"
    @selection-change="handleSelectionChange"
    :cell-class-name="cellClz"
    :row-class-name="() => 'table_row_processing'"
    row-key="id">
      <el-table-column
        type="selection"
        reserve-selection
        width="55">
      </el-table-column>
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column prop="modelName" label="模型名称" min-width="100"></el-table-column>
      <el-table-column prop="fileName" label="模型文件" min-width="160">
        <template slot-scope="scope">
          <span class="row_table_btn" @click="goToDetail(scope.row)">{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataSpecification" label="模型类型" width="120"></el-table-column>
      <el-table-column label="模型专业">
        <template slot-scope="scope">
          {{ scope.row.professionSet ? professionToNames(scope.row.professionSet) : '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="上传人" width="120"></el-table-column>
      <el-table-column prop="createTime" label="上传日期" width="120">
        <template slot-scope="scope">
          {{(scope.row.createTime || '').slice(0, 10)}}
        </template>
      </el-table-column>
      <el-table-column prop="fileHandleStatusDesc" label="状态" width="100"></el-table-column>
      <el-table-column prop="workNum" label="作业详情">
        <template slot-scope="scope">
          <span class="row_table_btn" @click="workDetailClick(scope.row)">{{ scope.row.work ? `${scope.row.work.statusDesc}` : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workNum" width="80" label="作业数量"></el-table-column>
      <el-table-column prop="" label="操作" width="330">
        <template slot-scope="scope">
          <span class="row_table_btn" @click.stop="remove(scope.row)">删除</span>
          <template v-if="canCheckReview(scope.row.dataSpecification)">
            <span class="row_table_btn" @click.stop="setD(scope.row)">配置</span>
            <span class="row_table_btn" @click.stop="check(scope.row)">审查</span>
            <span class="row_table_btn" @click.stop="verify(scope.row)">验证</span>
            <span class="row_table_btn" @click.stop="historyData(scope.row)">历史记录</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column column-key="processing-cell" prop="" label="" width="1">
        <template slot-scope="scope">
          <div
            v-if="inProcessing(scope.row.fileHandleStatus)"
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
      selectedRows: []
    }
  },
  computed: {
    cellClz () {
      return (scope) => {
        let ret = ''
        if (this.inProcessing(scope.row.fileHandleStatus) && scope.column.columnKey === 'processing-cell') {
          ret = 'table_row_processing_cell'
        }
        return ret
      }
    },
    inProcessing () {
      return str => {
        return ['checking'].includes(str)
      }
    },
    canCheckReview () {
      return typeCode => {
        return ['zdb', 'gfc', 'gfcz', 'ifc'].includes(typeCode)
      }
    },
    professionToNames () {
      const _this = this
      return str => {
        return ((str || '').split(',')).map(c => {
          return (_this.$myDic.zyList.find(zy => {
            return zy.value === c
          }) || {}).label || '--'
        }).join(',')
      }
    }
  },
  watch: {
    list: {
      handler (val) {
        if (Array.isArray(val)) {
          this.tableData = val
          if (this.refreshTimer) {
            clearTimeout(this.refreshTimer)
          }
          if (this.tableData.find(r => {
            return this.inProcessing(r.fileHandleStatus)
          })) {
            this.refreshTimer = setTimeout(() => {
              this.refreshFunc && this.refreshFunc(true)
            }, 10000)
          }
        }
      }
    },
    loading: {
      handler (val) {
        this.dataLoading = val
      },
      immediate: true
    }
  },
  created () {},
  mounted () {},
  destroyed () {},
  methods: {
    workDetailClick (row) {
      let query = {
        fileId: row.id,
        workId: row.work.id,
        type: row.work.type,
        name: row.modelName,
      }
      this.$router.push({
        name: 'checkWorkInfo',
        query
      })
    },
    handleSelectionChange (val) {
      this.selectedRows = val
    },

    goToDetail (row) {
      window.open(`#/main/drawingCheck/model?fileId=${row.id}`)
    },

    remove (rowData) {
      this.$emit("remove", rowData)
    },
    setD (rowData) {
      this.$emit("setD", rowData)
    },
    check (rowData) {
      this.$emit("check", rowData)
    },
    verify (rowData) {
      this.$emit("verify", rowData)
    },
    historyData (rowData) {
      this.$emit("historyData", rowData)
    }
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
