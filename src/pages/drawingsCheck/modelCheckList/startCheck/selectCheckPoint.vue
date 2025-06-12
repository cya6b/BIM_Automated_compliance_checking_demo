<template>
  <div>
    <div class="list_content">
      <div class="selected_items">
        <span>已选择条文</span>
        <div class="clu_items">
          <span class="clu_item" :class="activeCluItem === ck ? '__active' : ''"
            @click="cluItemClick(ck)" v-for="(ck, ckIndex) in selectedCheckpoints" :key="ckIndex">
            {{ `${ck.tw.code} - ${ck.tk ? ck.tk.code + '-' + ck.code : ck.code}` }}
            <el-icon class="el-icon-circle-close" @click.native.stop="removeSelect(ck)"></el-icon>
          </span>
          <div class="empity_clu" v-if="!selectedCheckpoints.length">
            <span>暂未选择条文!</span>
          </div>
        </div>
      </div>
      <div class="clus_list">
        <span class="label">选择条文</span>
        <div class="clus_filter">
          <div class="filter_item search_input">
            <el-input clearable suffix-icon="el-icon-search" v-model="filter.keyword" placeholder="输入条文编号或内容">
            </el-input>
          </div>
          <div class="filter_item date_range">
            <el-date-picker
              v-model="filter.dataRange"
              value-format="yyyy-MM-dd HH:MM:SS"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="filter_item">
            <el-select width="120" clearable v-model="filter.orgName" placeholder="选择企业名称">
              <!-- <el-option v-for="gf in gfList" :key="gf.id" :value="gf.id" :label="gf.name"></el-option> -->
            </el-select>
          </div>
          <div class="filter_item">
            <el-select width="120" clearable v-model="filter.gf" placeholder="选择规范">
              <el-option v-for="gf in gfList" :key="gf.id" :value="gf.id" :label="gf.name"></el-option>
            </el-select>
          </div>
          <div class="filter_item">
            <el-select clearable v-model="filter.zy" placeholder="选择专业">
              <el-option v-for="zy in zyList" :key="zy.key" :value="zy.key" :label="zy.value"></el-option>
            </el-select>
          </div>
        </div>
        <el-table ref="tableRef" highlight-current-row
            v-loading="listLoading" :data="tableData" max-height="500px"
            @selection-change="handleSelectionChange"
            @select="checkBoxClick"
            @select-all="checkAllBoxClick"
            row-key="id">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column type="index" width="55" label="序号"></el-table-column>
            <el-table-column label="专业" width="120">
              <template slot-scope="scope">
                <span>{{ zyMap[scope.row.professionCode] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="条文编号" prop="code" width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.tw.code }}</span>
              </template>
            </el-table-column>
            <el-table-column label="条文内容" prop="content">
              <template slot-scope="scope">
                <div class="content" v-html="scope.row.tw.content"></div>
              </template>
            </el-table-column>
            <el-table-column label="审查点编号">
              <template slot-scope="scope">
                <span>{{ `${scope.row.clauseCode ? scope.row.clauseCode + '-' : ''}${scope.row.code || ''}` }}</span>
              </template>
            </el-table-column>
            <el-table-column label="审查点内容">
              <template slot-scope="scope">
                <span>{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属规范">
              <template slot-scope="scope">
                <span>{{ scope.row.gf.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <span class="row_table_btn" @click.stop="rowDetail(scope.row)">详情</span>
                <span v-if="!hasSelected(scope.row)"
                  class="row_table_btn" @click.stop="selectRow(scope.row)">选定</span>
                <span v-else>已选定</span>
              </template>
            </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="审查点详情"
      width="640px"
      :visible.sync="detailVisible">
      <DetailCheckpointDialog
        style="max-height:600px;overflow-y:auto"
        ref="DetailCheckpointDialog"
        v-model="detailInfo"
      ></DetailCheckpointDialog>
    </el-dialog>
  </div>
</template>

<script>
import DetailCheckpointDialog from './DetailCheckpointDialog.vue'
export default {
  components: {
    DetailCheckpointDialog
  },
  data () {
    return {
      selectedSelectionBox: [],
      selectedCheckpoints: [],
      checkpointsList: [],

      listLoading: false,

      filter: {
        zy: null,
        gf: '',
        startTime: null,
        endTime: null,
        keyword: '',
        dataRange: null
      },
      zyList: [],
      gfList: [],
      startBtnLoading: false,

      detailVisible: false,
      detailInfo: {
        checkPoint: {},
        checkPointRefArticleList: [],
        checkPointRefCheckObjectList: [],
        checkPointRefDrawingObjectList: [],
        specificationInfo: [],
        checkPointRefTagItemNecessaryList: [],
        checkPointRefTagItemNotNecessaryList: [],
        customTagItemNameSet: null,
        ruleInfo: {},
        articleInfo: {},
        clauseInfo: {}
      },

      activeCluItem: null,
    }
  },
  created () {
    this.getArticleData()
  },
  computed: {
    zyMap () {
      return {
        JZ: '建筑',
        JG: '结构',
        GPS: '给排水',
        NT: '暖通',
        DQ: '电气',
        default: '--'
      }
    },
    tableData () {
      return this.checkpointsList
      .filter(c => {
        if (this.filter.dataRange) {
          return this.dateInRange(this.filter.dataRange, c.createTime)
        }
        return true
      })
      .filter(c => {
        if (this.filter.zy) {
          return c.professionCode === this.filter.zy
        }
        return true
      }).filter(c => {
        if (this.filter.gf) {
          return c.gf.id === this.filter.gf
        }
        return true
      }).filter(c => {
        if (this.filter.keyword) {
          return c.tw.code.includes(this.filter.keyword) || c.tw.content.includes(this.filter.keyword)
        }
        return true
      })
    },
    hasSelected () {
      return row => {
        return this.selectedCheckpoints.find(sC => {
          return sC.id === row.id
        })
      }
    }
  },
  methods: {
    dateInRange (range, date) {
      if (Array.isArray(range)) {
        let s = Date.parse(range[0] || '0000')
        let e = Date.parse(range[1] || '9999')
        let i = Date.parse(date)
        if (s < i && i < e) {
          return true
        }
      }
      return false
    },
    handleSelectionChange (val) {
      this.selectedSelectionBox = val
    },
    cluItemClick (cluItem) {
      if (this.activeCluItem === cluItem) {
        this.activeCluItem = null
      } else {
        this.activeCluItem = cluItem
      }
    },
    async rowDetail (row) {
      let res = await this.$store.dispatch('getCheckPointDetailById', {ids: row.ruleId})
      if (res.data.code === 'SUCCESS') {
        let detail = res.data.detail
        if (Array.isArray(detail) && detail.length) {
          const d = detail[0]
          this.detailInfo = {
            ...d,
            checkPoint: {
              ...row,
              checkPointInfo: d.checkPointInfo
            },
            clauseInfo: d.clauseInfoList[0] || {},
            checkPointRefCheckObjectList: d.checkObjectList,
            checkPointRefDrawingObjectList: d.drawingObjectList,
            checkPointRefTagItemNecessaryList: d.tagItemList,
            checkPointRefTagItemNotNecessaryList: [],
          }
        }
      } else {
        this.detailInfo.checkPoint = {
          ...row
        }
        this.detailInfo.articleInfo = {
          ...row.tw
        }
        this.detailInfo.clauseInfo = {
          ...row.tk
        }
        this.detailInfo.specificationInfo = {
          ...row.checkPointRefSpecificationDTO
        }
      }
      this.detailVisible = true
    },
    checkBoxClick (selection, row) {
      if (selection.find(s => {
        return s.id === row.id
      })) { // 选中
        this.selectRow(row)
      } else {
        this.removeSelect(row)
      }
    },
    checkAllBoxClick (selection) {
      if (selection.length) {
        selection.forEach(r => {
          if (!this.selectedCheckpoints.find(s => {
            return s.id === r.id
          })) {
            this.selectRow(r)
          }
        })
      } else {
        this.tableData.forEach(r => {
          this.removeSelect(r)
        })
      }
    },
    selectRow (row) {
      this.selectedCheckpoints.push(row)
      this.toggleSelection([row])
    },
    removeSelect (row) {
      let index = this.selectedCheckpoints.findIndex(s => {
        return s.id === row.id
      })
      if (index !== -1) {
        this.toggleSelection([this.selectedCheckpoints[index]], false)
        this.selectedCheckpoints.splice(index, 1)
      }
    },
    toggleSelection (list, selected = true) {
      const _this = this
      if (list && list.length) {
        list.forEach(l => {
          _this.$refs.tableRef.toggleRowSelection(l, selected ? true : false)
        })
      } else {
        _this.$refs.tableRef.clearSelection();
      }
    },
    pushtoZyList(zyCode) {
      if (!this.zyList.find(zy => {
        return zy.key === zyCode
      })) {
        this.zyList.push({
          key: zyCode,
          value: this.zyMap[zyCode]
        })
      }
    },
    pushtoGfList (gf) {
      if (!this.gfList.find(g => {
        return g.id === gf.id
      })) {
        this.gfList.push(gf)
      }
    },
    getArticleData () {
      this.listLoading = true
      this.$store.dispatch('getArticle').then(res => {
        if (res.data.code === 'SUCCESS') {
          const detail = res.data.detail
          if (detail && Array.isArray(detail)) {
            let clus = []
            let checkpoints = []
            detail.forEach(d => {
              this.pushtoGfList(d)
              d.articleInfoList.forEach(a => {
                if (a.checkPointSet && a.checkPointSet.length) {
                  a.checkPointSet.forEach(c => {
                    this.pushtoZyList(c.professionCode)
                    checkpoints.push({
                      ...c,
                      gf: { // 规范
                        code: d.code,
                        id: d.id,
                        name: d.name,
                        num: d.num,
                      },
                      tw: { // 条文
                        code: a.code,
                        content: a.content,
                        id: a.id,
                        name: a.name,
                        specificationId: a.specificationId,
                        strong: a.strong
                      },
                      // 条款
                      tk: Array.isArray(c.clauseInfoList) ? c.clauseInfoList[0] : null
                    })
                  })
                }
              })
            })
            this.checkpointsList = checkpoints
          }
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
  },
  watch: {
    activeCluItem: {
      handler (val) {
        if (!val) {
          this.$refs.tableRef && this.$refs.tableRef.setCurrentRow(null)
        } else {
          let cR = this.tableData.find(r => {
            return r.id === val.id
          })
          if (cR) {
            this.$refs.tableRef && this.$refs.tableRef.setCurrentRow(cR)
          }
        }
      }
    },
    tableData: {
      handler (val) {
        this.$nextTick(() => {
          val.forEach(v => {
            if (this.selectedCheckpoints.find(s => {
              return s.id === v.id
            })) {
              this.toggleSelection([v])
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>

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
