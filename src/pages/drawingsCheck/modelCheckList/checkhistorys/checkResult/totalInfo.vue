<template>
  <div class="total_info_content">
    <div class="total_count">
      <div v-for="item in totalCountData" :key="item">
        <div> {{ item.label }}</div>
        <div>{{ item.count }}</div>
      </div>
    </div>
    <div class="result_chart">
      <div class="result_chart_header">验证数据结果图</div>
      <div class="chart_items">
        <div class="chart_item" v-for="item in chartData" :key="item">
          <el-progress type="circle" stroke-width="12" :percentage="item.scale"></el-progress>
          <span class="chart_item_label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalCountData: [],
      chartData: [],
    }
  }
}
</script>

<style lang="less" scoped>
.total_info_content{
  display: flex;
  .total_count{
    width: 33%
  }
  .result_chart{
    width: 66%;
    .result_chart_header{
      text-align: center;
      padding: 6px 0px;
      font-size: 16px;
    }
    .chart_items{
      display: flex;
      justify-content: space-around;
      .chart_item{
        width: 126px;
        position: relative;
        .chart_item_label{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 4px;
          font-size: 12px;
          color: #9f9b9b;
        }
      }
    }
  }
}
</style>
