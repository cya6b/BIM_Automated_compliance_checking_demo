<template>
  <div class="login_form">
    <el-input class="login_input" prefix-icon="iconfont bj-icon-Username" placeholder="输入用户名"
      v-model="form.username" clearable></el-input>
    <el-input class="login_input" prefix-icon="iconfont bj-icon-password" type='password' placeholder="输入密码"
      v-model="form.password" clearable></el-input>
    <el-input class="login_input img_code_input" prefix-icon="iconfont bj-icon-tushen-xmba"
      id="imgCode" name="imgCode" autocomplete="off"
      @keyup.native="imgCodeChange" maxlength="4" v-model="form.imgCode"
      placeholder="输入图形验证码" :error="errorMsg"></el-input>
    <div class="img_code">
      <img title="验证码" :src="imgData" @click="getImgCode"/>
    </div>
    <el-button class="login_btn" :disbaled="loginLoading" @click="login">
      {{loginLoading ? '登录中...': '登 录'}}
    </el-button>
    <slot name="bottom-link"></slot>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    loginFunc: {
      type: Function
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: '',
        imgCode: ''
      },
      imgToken: null,
      imgData: '',
      imgCodeValid: false,
      loginLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getImgCode()
    if (this.$route.query.code) {
      _self.$store.dispatch('getOAuthAccessTokenByCode', {
        code: _self.$route.query.code
      }).then(res => {
        let atk = res.data.detail.access_token
        sessionStorage.setItem('atk', atk)
        window.location.href = window.location.origin + urlPrefix + '#/projectOverview/ProjectReviewList'
      })
    }
  },
  mounted () {},
  destroyed () {},
  methods: {
    imgCodeChange () {

    },
    // 获取图形验证码
    getImgCode () {
      const _this = this
      _this.form.imgCode = ''
      _this.imgCodeValid = false
      _this.$store.dispatch('getImgCode', {
        cb: (resp, imgToken) => {
          _this.imgToken = imgToken
          if (typeof window.btoa === 'function') {
            let imgArray = new Uint8Array(resp.data)
            let imgStr = imgArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
            _this.imgData = 'data:image/png;base64,' + btoa(imgStr)
          }
        }
      })
    },
    login () {
      if (this.loginFunc) {
        this.loginLoading = true
        this.loginFunc({
          ...this.form,
          imgToken: this.imgToken
        }).then(res => {
          this.loginLoading = false
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
.login_form{
  border: 1px solid #40A9FF;
  border-radius: 8px;
  text-align: center;
  padding: 24px 30px;
  /deep/.login_input{
    width: 360px;
    .el-input__inner{
      height: 40px !important;
    }
    .el-input__prefix{
      color: #0050B3;
    }
    +.login_input{
      margin-top: 16px;
    }
    &.img_code_input{
      width: 220px;
    }
  }
  .img_code{
    display: inline-block;
    width: 128px;
    height: 38px;
    margin-left: 6px;
    position: relative;
    top: 14px;
    border-radius: 2px;
    border: 1px solid #D9D9D9;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .login_btn{
    width: 360px;
    height: 40px;
    margin-top: 22px;
    background: #0050B3;
    color: #ffffff;
    &:hover{
      background: #166fdc;
      color: #ffffff;
    }
  }
}
</style>
