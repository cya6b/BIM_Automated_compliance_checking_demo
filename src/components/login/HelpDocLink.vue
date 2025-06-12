<template>
  <div>
    <span class="link_item" v-for="(l, lIndex) in linkData" :key="lIndex" @click="itemClick(l)">
      {{l.label}}
    </span>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    linkData: {
      type: Array,
      required: true
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
  methods: {
    itemClick (val) {
      if (val && val.url) {
        if(val.url.includes('.pdf') || val.url.includes('.PDF')) {
          window.open(val.url)
          return
        }
        let aDom = document.createElement('a')
        aDom.href = val.url
        aDom.click()
      } else {
        this.$message.warning('暂无源数据!')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.link_item{
  font-size: 14px;
  color: #0050B3;
  cursor: pointer;
  &:hover{
    color: #166fdc;
    text-decoration: underline;
    text-underline-position: under;
  }
  &+.link_item::before {
    content: "";
    display: inline-block;
    margin: 0px 12px;
    width: 1px;
    height: 16px;
    position: relative;
    top: 2px;
    background: #0050B3;
  }
}
</style>
