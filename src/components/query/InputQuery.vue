<template>
  <div>
    <el-input v-model="inputValue"
      clearable
      class="query_input"
      suffix-icon="el-icon-search"
      :placeholder="placeholder"
      @keyup.enter.native="query"
      @clear="query"></el-input>
    <el-button type="primary" size="mini" @click="query">查询</el-button>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    placeholder: {
      type: String,
      default: '请输入'
    },
    inputVal: {
      type: String,
      default: ''
    },
    queryFunc: {
      type: Function
    }
  },
  data () {
    return {
      inputValue: null
    }
  },
  computed: {},
  watch: {
    inputVal: {
      handler (val) {
        this.inputValue = val
      },
      immediate: true
    }
  },
  created () {},
  mounted () {},
  destroyed () {},
  methods: {
    query () {
      if (this.queryFunc) {
        this.$emit('update:inputVal', this.inputValue)
        this.queryFunc(this.inputValue)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.query_input{
  width: calc(100% - 128px);
}
</style>
