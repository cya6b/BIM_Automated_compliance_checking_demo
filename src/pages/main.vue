<template>
  <div class="main_page">
    <header-content></header-content>
    <router-view class="main_content"></router-view>
  </div>
</template>
<script>
import HeaderContent from '../components/header/HeaderContent.vue'
export default {
  name: '',
  components: {HeaderContent},
  props: {},
  data () {
    return {
      hideModelList: this.$route.meta.hideModelList
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {},
  destroyed () {},
  methods: {
  }
}
</script>
<style lang='less' scoped>
.main_page{
  height: 100%;
  position: relative;
  .model_list{
    position: absolute;
    color: #FFFFFF;
    left: 300px;
    top: 0px;
  }
  .main_content{
    height: calc(100% - 50px);
    overflow: auto;
  }
}
</style>
