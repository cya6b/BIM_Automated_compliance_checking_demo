<template>
  <div class="login_box">
    <login-form ref="loginForm" class="form_content" :loginFunc="login">
      <help-doc-link class="help_link" slot="bottom-link" :linkData="helpLinkList"></help-doc-link>
    </login-form>
  </div>
</template>

<script>
import HelpDocLink from './HelpDocLink.vue'
import LoginForm from './LoginForm.vue'
import SYS_GLOBAL from '@/config/sysGlobalConfig'
const helpLinkData = {
  design: [
    { label: '操作说明', url: SYS_GLOBAL.handbookSettings[SYS_GLOBAL.sysDicCode].design.book},
    { label: '学校主页', url: SYS_GLOBAL.handbookSettings[SYS_GLOBAL.sysDicCode].design.video}
  ]
}
export default {
  name: '',
  components: {LoginForm, HelpDocLink},
  props: {},
  data () {
    return {
      activeName: 'design'
    }
  },
  computed: {
    helpLinkList () {
      return helpLinkData[this.activeName] || []
    }
  },
  watch: {},
  created () {},
  mounted () {},
  destroyed () {},
  methods: {
    topItemClick (activeName) {
      this.activeName = activeName
    },
    topItemClz (activeName) {
      return `top_item ${this.activeName === activeName ? '__active' : ''}`
    },
    refreshImgCode () {
      if (this.$refs.loginForm) {
        this.$refs.loginForm.form.imgCode = ''
        this.$refs.loginForm.getImgCode()
      }
    },
    login (data) {
      return new Promise((resolve) => {
        // 假设的用户名和密码
        const validUsername = 'admin'
        const validPassword = '123456'
        const validImgCode = 'abcd'  // 这里可以改成你期望的验证码

        // 登录逻辑：检查用户名、密码和验证码
        if (!data.username) {
          this.$message.warning('请输入用户名!')
          resolve()
          return
        }
        if (!data.password) {
          this.$message.warning('请输入密码!')
          resolve()
          return
        }
        if (!data.imgCode) {
          this.$message.warning('请输入图形验证码!')
          resolve()
          return
        }

        // 校验硬编码的账号密码
        if (data.username === validUsername && data.password === validPassword && data.imgCode === validImgCode) {
          // 模拟登录成功
          sessionStorage.setItem('atk', 'fake-token')  // 设置一个假的 token
          this.$router.push({ path: '/main' })  // 跳转到主页面
        } else {
          this.$message.warning('账号、密码或验证码错误')
        }

        // 刷新验证码
        this.refreshImgCode()

        resolve()  // 继续执行其他操作
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login_box{
  width: 566px;
}
.top{
  color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  .top_item{
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 174px;
    height: 100px;
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    align-items: center;
    +.top_item{
      margin-left: 24px;
    }
    &:hover{
      cursor: pointer;
    }
    &.__active{
      background: rgba(0, 80, 179, .75);
      border: 1px solid #40A9FF;
      .arrow{
        display: inline;
      }
    }
    .text_1{
      font-size: 24px;
      display: block;
    }
    .arrow{
      display: none;
      width:0px;
      height:0px;
      border-left:9px solid transparent;  /* 右透明 */
      border-right:9px solid transparent; /*右透明 */
      border-bottom:10px solid #40A9FF; /* 定义底部颜色 */
      font-size:0px;
      line-height:0px;
      position: absolute;
      bottom: -24px;
    }
  }
}
.form_content{
  margin-top: 22px;
  background: #FFFFFF;
  .help_link{
    margin-top: 12px;
  }
}
</style>

