<template>
  <div class="setting_content">
    <span>{{userName}}</span>
    <el-dropdown @command="settingsAction">
      <i class="setting_icon iconbtn iconfont bj-icon-setting"></i>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item command="resetPassword">
          <i class="iconbtn iconfont bj-icon-edit" style="float:left; font-size: 14px;"></i>修改密码
        </el-dropdown-item> -->
        <el-dropdown-item command="logout">
          <i class="iconbtn iconfont bj-icon-tuichu" style="float:left; font-size: 14px;"></i>退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  computed: {
    userName () {
      return this.$store.getters.getAccount.accountName || '用户名'
    }
  },
  watch: {},
  created () {},
  mounted () {},
  destroyed () {},
  methods: {
    settingsAction (command) {
      const _this = this
      if (command === 'logout') {
        _this.$store.dispatch('logout').finally(() => {
          _this.clearSessionStorage()
          window.location.href = '#/login'
        })
      } else if (command === 'resetPassword') {
        _this.dialogVisible = true
      }
    },
    clearSessionStorage () {
      let onis = sessionStorage.getItem('onis')
      sessionStorage.clear()
      sessionStorage.setItem('onis', onis)
    }
  }
}
</script>
<style lang='less' scoped>
.setting_content{
  display: flex;
  align-items: center;
}
.setting_icon{
  color: #fff;
}
</style>
