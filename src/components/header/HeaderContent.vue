<template>
  <div class="main_header">
    <div :class="`header_logo ${SYS_GLOBAL.sysDicCode}`">
      <span class="header_logo_title" @click="goHome">福建师范大学BIM模型审查系统</span>
      <span class="bread_crumb_item" @click="jump(b.name)" v-for="b in breadcrumb" :key="b"> / {{b.label}}</span>
    </div>
    <user-info class="header_user_info"></user-info>
  </div>
</template>
<script>
import UserInfo from './components/userInfo.vue'
export default {
  name: '',
  components: {UserInfo},
  props: {},
  data () {
    return {
    }
  },
  computed: {
    breadcrumb () {
      return this.$route.meta.breadcrumb
    }
  },
  watch: {},
  created () {},
  mounted () {
  },
  destroyed () {},
  methods: {
    goHome () {
      this.$router.push({
        name: 'modelCheckList'
      })
    },
    jump (name) {
      this.$router.push({
        name,
        query: {
          ...this.$route.query
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.main_header{
  overflow: hidden;
  height: 50px;
  background-image: url('../../assets/顶部条.jpg');
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header_logo{
    width: 434px;
    height: 17px;
    margin-left: 24px;
  }
  .header_user_info{
    margin-right: 24px;
    float: right;
    color: #FFFFFF;
  }
  .header_logo_title {
    color: #FFFFFF;
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
    line-height: 12px;
    &:hover{
      cursor: pointer;
    }
  }
  .bread_crumb_item{
    line-height: 12px;
    color: #FFFFFF;
    font-weight: bold;
    font-size: 20px;
    &:hover{
      cursor: pointer;
    }
  }
}
</style>
