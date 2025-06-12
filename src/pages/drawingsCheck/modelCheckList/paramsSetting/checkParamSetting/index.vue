<template>
  <div class="check_param_setting" v-loading="loading">
    <!-- <div><span>模型文件验证参数配置</span></div> -->
    <el-form v-if="!hideModelName" label-position="left">
      <el-form-item label="模型名称">
        <el-input readonly="true" v-model="modelName"></el-input>
      </el-form-item>
    </el-form>
    <div class="cslb"><span>参数列表</span></div>
    <div class="profe_item" v-for="(profe, profeIndex) in paramsFormatLibrary" :key="profeIndex">
      <div class="profe_item_header" @click="profeItemHeaderClick(profe)">
        <i class="el-icon el-icon-arrow-right" :class="profe.show ? 'turn_right_90' : ''"></i>
        <span>{{ profe.professionName }}</span>
      </div>
      <div class="profe_item_content" v-show="profe.show">
        <el-form>
          <el-row :gutter="24">
            <el-col :span="8" v-for="(r, lIndex) in profe.list" :key="lIndex">
              <el-form-item :label="r.keyName">
                <el-select :disabled="onlyLook" v-if="r.type === 'single'" v-model="r.value" clearable>
                  <el-option v-for="(vI, vIndex) in r.items" :key="vIndex" :label="vI.valueName" :value="vI.value"></el-option>
                </el-select>
                <el-select :disabled="onlyLook" v-else-if="r.type === 'multiple'" multiple v-model="r.value" clearable>
                  <el-option v-for="(vI, vIndex) in r.items" :key="vIndex" :label="vI.valueName" :value="vI.value"></el-option>
                </el-select>
                <el-input :disabled="onlyLook" v-else v-model="r.value" clearable></el-input>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
const DefaultParamsList = [{
  type: 'input',
  dataType: '',
  key: '',
  keyName: '',
  value: '',
  valueName: ''
}]
export default {
    data() {
        return {
            loading: false,
            paramsLibrary: [],
            paramsFormatLibrary: [],
            paramsList: [DefaultParamsList[0]]
        };
    },
    props: {
      hideModelName: {
        default: false,
      },
      onlyLook: {
        type: Boolean,
        default: false,
      },
      workId: {
        type: String | Number
      },
      fileId: {
        type: String | Number
      },
      modelName: {
        type: String,
        defualt: ''
      },
    },
    computed: {},
    async created () {
      await this.getLib()
      if (this.workId) {
        this.getCheckParams(this.workId, true)
      }else if (this.fileId) {
        this.getCheckParams(this.fileId)
      }
    },
    methods: {
      addParamItem () {
        this.paramsList.push({
          key: '',
          value: ''
        })
      },
      deleteParamItem (index) {
        this.paramsList.splice(index, 1)
      },
      getLib () {
        return new Promise((resolve, reject) => {
          this.$store.dispatch('getCheckParamsLib').then(res => {
            if (res.data.code === 'SUCCESS') {
              this.paramsFormatLibrary = this.paramsLibrarySplitByProfession(res.data.detail)
            }
          }).finally(() => {
            resolve()
          })
        })
      },
      getData () {
        let list = []
        this.paramsFormatLibrary.forEach(pro => {
          pro.list.filter(item => {
            return item.value && item.value.length
          }).forEach((item, index) => {
            list.push({
              type: item.type,
              dataType: item.dataType,
              key: item.key,
              keyName: item.keyName,
              value: Array.isArray(item.value) ? item.value.join(',') : item.value,
              valueName: Array.isArray(item.valueName) ? item.value.join(',') : item.valueName,
              professionCode: item.professionCode,
              professionName: item.professionName
            })
          })
        })
        let ret = {
          fileId: this.fileId,
          params: list
        }
        return ret
      },

      getCheckParams (id, isWork) {
        if (id) {
          this.loading = true
          let params = {fileId: id}
          let aName = 'getCheckParamsByFileId'
          if (isWork) {
            aName = 'getCheckParamsByWorkId'
            params = {workId: id}
          }
          this.$store.dispatch(aName, params).then(res => {
            if (res.data.code === 'SUCCESS') {
              const d = res.data.detail
              this.setData(d)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      },

      setData (d) {
        let pD = [];
        ((Array.isArray(d) ? d : d.params) || []).forEach(item => {
          let pro = this.paramsFormatLibrary.find(pro => {
            return pro.professionCode === item.professionCode
          })
          if (pro) {
            let temp = pro.list.find(l => l.key === item.key)
            if (temp) {
              temp.value = item.type === 'multiple' ? item.value && item.value.split(',') : item.value || mull
              temp.valueName = item.type === 'multiple' ? item.valueName && item.valueName.split(',') : item.valueName || ''
            }
          }
        })
      },

      clearData () {
        this.paramsList = [DefaultParamsList[0]]
      },
      paramsLibrarySplitByProfession (list) {
        let ret = []
        list.forEach(l => {
          let tempR = ret.find(r => {
            return r.professionCode === l.professionCode
          })
          if (!tempR) {
            tempR = {
              professionCode: l.professionCode,
              professionName: l.professionName,
              list: []
            }
            const professionSet = this.$store.getters.getModelInfo.professionSet
            let show = true
            if (professionSet && !professionSet.includes(tempR.professionCode)) {
              show = false
            }
            this.$set(tempR, 'show', show)
            ret.push(tempR)
          }
          tempR.list.push({
            ...l,
            value: null,
            valueName: ''
          })
        })
        return ret
      },
      profeItemHeaderClick (profe) {
        profe.show = !profe.show
      }
    },
    watch: {
      articles: {
        handler (val) {
          if (Array.isArray(val) && val.length) {
            this.guifanList = val
          }
        },
        immediate: true
      },
    }
}
</script>

<style lang="less" scoped>
.check_param_setting{
}
.item +.item {
  margin-top: 12px;
}
.add_item_btn{
  display: inline-block;
  padding: 6px 12px;
  margin-top: 6px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #0066a5;
  background: #0066a5;
  color: #ffffff;
}
.delete_item_btn{

}
.cslb{
  margin-bottom: 6px;
}

.opt_btn{
  position: absolute;
  top: 10px;
  right: -24px;
  width: 32px;
  &:hover {
    cursor: pointer;
  }
}

.profe_item{
  border: 1px solid #E4E7ED;
  background: #f8f8f8;
  +.profe_item{
    margin-top: 12px;
  }
  .profe_item_header{
    padding: 6px 12px;
    background: #e1e1e1;
    border-bottom: 1px solid #E4E7ED;
    &:hover{
      cursor: pointer;
      background: #d6d6d6;
    }
  }
  .profe_item_content{
    padding: 12px 24px;
  }
}
</style>
