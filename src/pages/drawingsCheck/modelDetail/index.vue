<template>
  <div class="model_page">
    <div class="main" :class="side.visible ? 'show_side' : ''">
      <div id="modelBox">
        <span class="loading">模型转换中...</span>
      </div>
      <span class="result_icon" v-if="showResult" @click="resultIconClick">智能审查意见</span>
    </div>
    <div id="resultBox" v-show="side.visible" class="side content">
      <span class="empity_text">数据加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileId: this.$route.query.fileId,
      workId: this.$route.query.workId,
      model: {
        source: {
          type: "model3d",
          token: null,
          gFileId: null,
        },
        optC: null,
      },
      side: {
        loaded: false,
        visible: false,
        optC: null
      }
    }
  },
  created () {
    this.getViewToken()
  },
  mounted () {
  },
  computed: {
    showResult () {
      return this.workId
    }
  },
  methods: {
    resultIconClick () {
      this.side.visible = !this.side.visible
      if (this.side.visible) {
        if (this.model.optC) {
          this.initResultDom(this.model.optC)
        }
      }
    },
    getViewToken () {
      if (!this.fileId) {
        return
      }
      // let actionName = this.workId ? 'getTokenByWorkId' : 'getTokenByFileId'
      // let params = {
      //   id: this.workId || this.fileId
      // }
      const params = {
        id: this.fileId
      }
      this.$store.dispatch('getTokenByFileId', params).then(res => {
        if (res.data.code === 'SUCCESS') {
          this.model.source.token = res.data.detail
        }
      })
    },
    initModelDom () {
      if (gdaJsSDK) {
        let a = new gdaJsSDK.Review({
          el: "#modelBox",
          appId: "",
          // ableAutoLink: true,
          // appToken: "", // 接口身份认证
          source: {
            main: {
              source: this.model.source,
            },
            sub: null
          }
        })
        a.load('#modelBox', (v) => {
          if (this.showResult) {
            this.initResultDom(a)
          }
        })
        this.model.optC = a
      }
    },
    async initResultDom (model) {
      let res = await this.$store.dispatch('getModelCheckResult', {workId: this.workId})
      if (res.data.code === 'SUCCESS') {
        let tabs = gdaJsSDK.ReviewResult.formatReviewResultData(res.data.detail)
        if (this.side.optC) {
          this.side.optC.resetData({
            status: 'FINISH',
            tabs
          })
        } else {
          let r = new gdaJsSDK.ReviewResult({
            el: "#resultBox",
            appId: "",
            closeHandle: this.resultIconClick,
            showAdopt: false,
            // adoptClickHandle: adopt,
            outerChin: model,
            sourceData: {
              status: 'FINISH',
              tabs
            }
          })
          r.load("#resultBox", (v) => {
            this.side.loaded = true
          })
          this.side.optC = r
        }
      }
    }
  },
  watch: {
    'model.source.token': {
      handler (val) {
        if (val) {
          this.$nextTick(() => {
            this.initModelDom()
          })
        }
      },
    }
  }
}
</script>

<style lang="less" scoped>
.model_page{
  display: flex;
  #modelBox{
    width: 100%;
    height: 100%;
    background: #1c1e1f;
  }
  .result_icon{
    position: absolute;
    top: 8px;
    right: 4px;

    background: #282a34;
    padding: 18px 19px;
    color: #d1d1d1;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
    -ms-writing-mode: tb-lr;
    writing-mode: vertical-lr;
    letter-spacing: 2px;
    z-index: 99;
    &:hover{
      cursor: pointer;
      color: #166fdc;
    }
  }

  .loading{
    display: block;
    width: 400px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    margin: auto;
    background: #0f0f0f;
    border-radius: 4px;
    top: calc(50% - 50px);
    position: relative;
    color: #fff;
  }
  .empity_text{
    display: block;
    width: 200px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    margin: auto;
    // background: #0f0f0f;
    border-radius: 4px;
    top: 240px;
    position: relative;
    // color: #fff;
  }

  .main{
    height: 100%;
    position: relative;
    width: 100%;
    flex-grow: 1;
  }
  .main.show_side{
    width: calc(100% - 480px);
  }
  .side{
    min-width: 480px;
    max-width: 480px;
    height: 100%;
    position: relative;

    background: #282a34;
    color: #fff;
  }
  .main #modelBox {
    height: 100%;
    width: 100%;
  }
}
</style>
