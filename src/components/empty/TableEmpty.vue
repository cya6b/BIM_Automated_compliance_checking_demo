<template>
  <div class="empty">
    <img src="@/assets/tableEmpty.png">
    <div class="content_tip">{{tip}}</div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    tip: {
      type: String,
      default: '暂无数据'
    }
  },
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
.empty{
  text-align: center;
  padding:64px 0px;
  .content_tip{
    color: #333333D9;
    text-align: center;
    margin-top:8px
  }
}
</style>
