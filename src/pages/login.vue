<template>
  <div :class="`login_page ${SYS_GLOBAL.sysDicCode}`">
    <div :class="`sys_title_empty`">{{ SYS_GLOBAL[SYS_GLOBAL.sysDicCode].title }}</div>
    <login-content class="login_content"></login-content>
    <bottom-content class="bottom_content"></bottom-content>
  </div>
</template>
<script>
import LoginContent from '../components/login/LoginContent.vue'
import BottomContent from '../components/footer/bottomContent.vue'
export default {
  name: '',
  components: {LoginContent, BottomContent},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  destroyed () {},
  methods: {}
}
</script>
<style lang='less' scoped>
.login_page{
  position: relative;
  height: 100%;
  min-height: 800px;
  background: #0f24df;
  background-image: url('../assets/背景图.jpg');
  overflow: auto;
}

.sys_title_empty{
  height: 64px;
  margin: 0 auto;
  margin-top: 8%;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 66px;
}
.login_content{
  margin: 0 auto;
  margin-top: 40px;
}
.bottom_content{
  position: absolute;
  width: 100%;
  bottom: 36px;
  padding: 8px 0px;
  text-align: center;
}
</style>
