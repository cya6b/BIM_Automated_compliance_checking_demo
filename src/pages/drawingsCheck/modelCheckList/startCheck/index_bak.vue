<template>
  <div class="start_check_page">
    <div class="title">
      指定待审查条文
      <div class="right_btn">
        <el-button v-loading="startBtnLoading" type="primary" @click="startC">发起审查</el-button>
      </div>
    </div>
    <div class="selected_items">
      <span>已选择条文</span>
      <div class="clu_items">
        <span class="clu_item" v-for="(clu, cluIndex) in seletedClus" :key="clu">
          {{ clu.code }}
          <el-icon class="el-icon-circle-close" @click.native="removeSelect(cluIndex)"></el-icon>
        </span>
        <div class="empity_clu" v-if="!seletedClus.length">
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
      <el-table v-loading="listLoading" :data="tableData" max-height="400px">
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column label="专业" width="120">
            <template slot-scope="scope">
              <span>{{ zyMap[scope.row.zy] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="条文编号" prop="code" width="160"></el-table-column>
          <el-table-column label="条文内容" prop="content"></el-table-column>
          <!-- <el-table-column label="审查点编号"></el-table-column>
          <el-table-column label="审查点内容"></el-table-column> -->
          <el-table-column label="所属规范">
            <template slot-scope="scope">
              <span>{{ scope.row.gf.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <span class="row_table_btn" @click="selectRow(scope.row)">选定</span>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
data () {
  return {
    seletedClus: [],
    clusList: [],
    listLoading: false,

    filter: {
      zy: null,
      gf: '',
      startTime: null,
      endTime: null,
      keyword: ''
    },
    zyList: [],
    gfList: [],
    fileId: this.$route.query.fileId,
    startBtnLoading: false,
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
    return this.clusList.filter(c => {
      return !this.seletedClus.find(sC => {
        return sC.id === c.id
      })
    }).filter(c => {
      if (this.filter.zy) {
        return c.zy === this.filter.zy
      }
      return true
    }).filter(c => {
      if (this.filter.gf) {
        return c.gf.id === this.filter.gf
      }
      return true
    }).filter(c => {
      if (this.filter.keyword) {
        return c.code.includes(this.filter.keyword) || c.content.includes(this.filter.keyword)
      }
      return true
    })
  }
},
  methods: {
    selectRow (row) {
      this.seletedClus.push(row)
    },
    removeSelect (index) {
      this.seletedClus.splice(index, 1)
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
            detail.forEach(d => {
              d.articleInfoList.forEach(a => {
                let zy = 'default'
                if (a.checkPointSet && a.checkPointSet.length) {
                  zy = a.checkPointSet[0].professionCode
                  this.pushtoZyList(zy)
                }
                let gf = {
                  code: d.code,
                  id: d.id,
                  name: d.name,
                  num: d.num
                }
                this.pushtoGfList(gf)
                clus.push({
                  ...a,
                  gf,
                  zy
                })
              })
            })
            this.clusList = clus
          }
        }
      }).finally(() => {
        this.listLoading = false
      })
    },

    startC () {
      if (!this.seletedClus.length) {
        this.$message.warning('请选择至少一条条文!')
        return
      }
      let params = {
        fileId: this.fileId,
        type: "examine",
        workRules: this.seletedClus.map(sC => {
          return {
            articleCode: sC.code,
            articleContent: sC.content,
            articleId: sC.id,
            articleName: sC.name,
            checkPointSet: sC.checkPointSet,
            ruleId: sC.gf.id,
            specificationId: sC.specificationId,
            specificationName: sC.specificationName || '',
          }
        })
      }
      this.startBtnLoading = true
      this.$store.dispatch('startCheck', params).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.$message.success('操作成功!')
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
  padding: 12px;
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
  .selected_items{
    padding: 6px 12px;
    .clu_items{
      display: flex;
      flex-wrap: wrap;
      width: calc(100% - 80px);
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

      +.clu_item {
        margin-left: 12px;
      }
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
}

</style>
