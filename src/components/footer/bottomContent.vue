<template>
  <div class="link_wrap">
    <div>
      <span>技术支持：</span>
      <span>福建师范大学地理研究所</span>
      <span class="_blank"></span>
      <span>联系邮箱：</span>
      <span>cya187508866962021@163.com</span>
    </div>
    <div>
      <span>Copyright © Fujian Normal university. All rights reserved.</span>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
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
.link_wrap{
  font-size: 14px;
  color: #000000;
  line-height: 22px;
  position: relative; /* 设置定位 */
  top: 830px; /* 通过调整该值使内容向上移动 */
  ._blank{
    display: inline-block;
    width: 12px;
  }
}
</style>
