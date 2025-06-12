<template>
<!-- 侧边栏|主区域，可以拖动中间的线调整左右两边宽度,side栏slot可以样式指定宽度px，content栏slot样式100%宽度就行 -->
<div :class="wrapClz">
    <div v-if="head" class="label-bar">
        {{label}}
    </div>
    <div :class="mainClz">
        <slot></slot>
    </div>
</div>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    props: {
        head: {
          type: Boolean,
          default: true
        },
        label: {
          type: String,
          default: null
        }
    },
    computed: {
      mainClz () {
        let r = 'main'
        if (!this.head) {
          r = 'main p'
        }
        return r
      },
      wrapClz () {
        let r = 'card-box-wrap'
        if (this.$route.path.indexOf('acceptTask') > -1) {
          r = 'card-box-wrap full-w'
        }
        return r
      }
    },
    methods: {
    },
    mounted () {
    }
}
</script>

<style lang='less' scoped>
  .card-box-wrap {
    position: relative;
    box-sizing: border-box;
    margin: 0 50px 20px 50px;
    background-color: #fff;
    border: 1px solid #dcdee3;

    &.full-w {
      margin: 0 -12px 20px -12px;
      border-left: none;
      border-right: none;
    }

    .label-bar {
      background-color: #e9e9e9;
      height: 50px;
      line-height: 50px;
      padding: 0 24px;
      color: rgb(7, 103, 179);
    }
    .main {
      width: 100%;
      padding: 0 0 40px 0;

      &.p {
        padding-top: 12px;
      }
    }
  }
</style>
