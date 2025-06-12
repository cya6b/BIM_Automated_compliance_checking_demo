<template>
  <div class="check_list">
    <div class="list_op">
      <div class="opt_btns">
        <el-button type="primary" @click="openAddForm">上传BIM模型</el-button>
        <el-button @click="startMuCheck">多BIM模型审查</el-button>
      </div>
      <div class="query_input">
        <input-query :inputVal.sync="query.inputVal" :placeholder="'请输入模型名称进行查询'"
          :queryFunc="search"></input-query>
      </div>
    </div>
    <list-table class="list"
      ref="listTable"
      @remove="remove"
      @setD="setD"
      @historyData="historyData"
      @verify="verify"
      @check="check"
      :loading="loading" :list="list" :refreshFunc="getList"></list-table>
    <my-pagination v-show="list.length" :total="total" :pageSize.sync="size" :currentPage.sync="page"
        :updateData="getList"></my-pagination>

    <el-dialog
      title="上传BIM模型"
      width="440px"
      :visible.sync="add.dialogVisible"
      :before-close="cancel">
      <add-form ref="addForm"></add-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :destroy-on-close="true"
      title="多BIM模型审查"
      width="85%"
      :visible.sync="mulCheckData.dialogVisible"
      :before-close="mulCheckClose">
      <mulCheck ref="mulCheckForm" class="mul_check" :models="mulCheckData.models"></mulCheck>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelMulCheck">取 消</el-button>
        <el-button type="primary" v-loading="mulCheckData.saveloading"
          @click="mulSave">发起</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import ListTable from './dataTable.vue'
import MyPagination from '../../../components/myPagination/MyPagination.vue'
import InputQuery from '../../../components/query/InputQuery.vue'
import AddForm from './addForm.vue'
import mulCheck from './startCheck/mulCheck/index.vue'
export default {
  name: '',
  components: {
    InputQuery, MyPagination, ListTable, AddForm,
    mulCheck,
  },
  props: {},
  data () {
    return {
      query: {
        inputVal: ''
      },
      list: [],
      loading: false,
      total: 0,
      page: 1,
      size: 15,

      add: {
        addLoading: false,
        dialogVisible: false,
      },

      mulCheckData: {
        models: [],
        saveloading: false,
        dialogVisible: false,
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getList()
  },
  mounted () {
    // let a = "443" ?? '4'
  },
  destroyed () {},
  methods: {
    search () {
      this.page = 1
      this.getList()
    },
    getList (noLoading = false) {
      const _this = this
      if (!noLoading) {
        this.loading = true
      }
      this.$store.dispatch('getCheckModelList', {
        pageNum: this.page,
        pageSize: this.size,
        keyword: this.query.inputVal
      }).then(res => {
        if (res.data.code === 'SUCCESS') {
          const detail = res.data.detail
          _this.list = detail.records
          _this.total = Number(detail.total || 0)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    // add
    openAddForm () {
      this.add.dialogVisible = true
    },
    handleClose () {
    },
    cancel () {
      this.add.dialogVisible = false
      this.clearAddForm()
    },
    save () {
      this.add.addLoading = true
      const form = this.$refs.addForm
      let file = form.files[0]
      let name = form.name
      let zy = form.zy
      if (!file) {
        this.$message.warning("请上传文件!")
        return
      }
      if (!zy) {
        this.$message.warning("请选择专业!")
        return
      }
      let params = {
        fileName: file ? file.name : '',
        modelName: name,
        objectKey: file ? file.objectKey : null,
        professionSet: Array.isArray(zy) ? zy.join(',') : null
      }
      this.$store.dispatch('addModel', params).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.$message.success('保存成功!')
          this.clearAddForm()
          this.add.dialogVisible = false
          this.search()
        }
      }).catch(err => {
        if (err.data.code === 'DATA_EXCEPTION') {
          this.$message.warning(`${err.data.message}`)
          this.addFormShowValideMsg()
        }
      }).finally(() => {
        this.add.addLoading = false
      })
    },
    clearAddForm () {
      this.$refs.addForm && this.$refs.addForm.resetForm && this.$refs.addForm.resetForm()
    },
    addFormShowValideMsg () {
      this.$refs.addForm && this.$refs.addForm.showValideMsg && this.$refs.addForm.showValideMsg()
    },

    // remove

    remove (data) {
      if (!data) {
        return
      }
      const h = this.$createElement
      this.$confirm('提示', {
        title: '提示',
        message: h('div', null, [
          h('span', null, `确认删除模型 "${data.modelName}" ?`),
          h('p', null, '删除后以往基于模型文件的作业将无法查询!')
        ]),
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: data.id
        }
        this.$store.dispatch('removeModel', params).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.search()
          }
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.data.message
          })
        })
      }).catch(() => {
      })
    },

    setD (data) {
      this.$store.commit("SET_MODEL_INFO", data)
      this.$router.push({
        name: 'paramsSetting',
        query: {
          fileId: data.id,
          name: data.modelName
        }
      })
    },
    cancelMulCheck () {
      this.mulCheckData.dialogVisible = false
    },
    mulCheckClose () {
      this.cancelMulCheck()
    },
    // 发起多模型审查
    mulSave () {
      let cPs = this.$refs.mulCheckForm.getData().selectedCheckpoints || []
      this.mulCheckData.saveloading = true
      let params = {
        fileIds: this.mulCheckData.models.map(m => {
          return m.id
        }),
        type: "verify",
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
      this.$store.dispatch('mulStartCheck', params).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.$message.success('发起成功!')
          this.mulCheckData.dialogVisible = false
          document.location.reload()
        } else if (res.data.code === 'BUSINESS_EXCEPTION') {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.error('发起失败!')
      }).finally(() => {
        this.mulCheckData.saveloading = false
      })
    },

    historyData (data) {
      this.$store.commit("SET_MODEL_INFO", data)
      this.$router.push({
        name: 'checkhistorys',
        query: {
          fileId: data.id,
          name: data.modelName
        }
      })
    },
    startMuCheck () {
      let ids = this.$refs.listTable.selectedRows
      if (!ids.length) {
        this.$message.warning('请勾选模型！')
        return
      }
      this.mulCheckData.models = ids
      this.mulCheckData.dialogVisible = true
    },
    check (data) {
      this.$store.commit("SET_MODEL_INFO", data)
      this.jumpTocheck(data.id)
    },
    jumpTocheck (ids) {

      this.$router.push({
        name: 'startCheck',
        query: {
          fileId: ids,
        }
      })
    },
    verify (data) {
      if (!data) {
        return
      }
      const h = this.$createElement
      this.$confirm('提示', {
        title: '发起模型文件验证',
        message: h('div', null, [
          h('span', null, `即将对模型 "${data.modelName}" 发起模型验证?`),
          h('p', null, '对模型验证时，将使用设置中指定的条文和审查参数对模型进行审查，然后按照验证参数对模型进行验证。')
        ]),
        confirmButtonText: '发起',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          fileId: data.id,
          type: 'verify'
        }
        this.$store.dispatch('startCheck', params).then(res => {
          if (res.data.code === 'SUCCESS') {
            this.$message.success('操作成功!')
          } else if (res.data.code === 'BUSINESS_EXCEPTION') {
            this.$message.warning(res.data.message)
          }
        }).catch(() => {
          this.$message.error('操作失败!')
        })
      })
    }
  }
}
</script>
<style lang='less' scoped>
.check_list{
  box-sizing: border-box;
  padding: 16px 24px;
  .list_op{
    display: flex;
    justify-content: space-between;
    .query_input{
      width: 500px;
    }
  }
  .region_list{
    margin: 16px -24px 0px -24px;
  }
  .list{
    margin-top: 16px;
  }
}
.mul_check{
  height: 600px;
  overflow:auto
}
</style>
