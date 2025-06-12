<template>
  <div class="detail-info">
    <p class="title" @click="openData.specification = !openData.specification">
      <i
        class="iconfont icon-icon_arrow4"
        :class="{ rotate: !openData.specification }"
      ></i>
      规范信息
    </p>
    <div v-show="openData.specification">
      <div class="item">
        <span class="label">规范名称：</span>
        {{ form.specificationInfo.name || "无" }}
      </div>
      <div class="item">
        <span class="label">条文编号：</span>{{ form.articleInfo.code || "无" }}
      </div>
      <div class="item">
        <span class="label">条文内容：</span>
        <div class="content" v-html="form.articleInfo.content"></div>
      </div>
      <div
        class="item"
        :class="{
          'no-data': !form.clauseInfo.code,
        }"
      >
        <span class="label">条款编号：</span>{{ form.clauseInfo.code || "无" }}
      </div>
      <div
        class="item"
        :class="{
          'no-data': !form.clauseInfo.content,
        }"
      >
        <span class="label">条款内容：</span>
        <div
          class="content"
          v-if="form.clauseInfo.content"
          v-html="form.clauseInfo.content"
        ></div>
        <div v-else class="content">无</div>
      </div>
    </div>

    <p class="title" @click="openData.checkPonint = !openData.checkPonint">
      <i
        class="iconfont icon-icon_arrow4"
        :class="{ rotate: !openData.checkPonint }"
      ></i>
      审查点内容
    </p>
    <div v-show="openData.checkPonint">
      <div class="item">
        <span class="label">审查点编号：</span>{{ form.checkPoint.code }}
      </div>
      <div class="item">
        <span class="label">审查点内容：</span>{{ form.checkPoint.content }}
      </div>
      <div class="item">
        <span class="label">支持专业：</span
        >{{ getProfessionsNameList(form.checkPoint.professionCode) }}
      </div>
      <div class="item">
        <span class="label">标签（必选）：</span>
        <div class="tag-list">
          <div class="item" :key="key" v-for="(item, key) in necessaryList">
            {{ key }}:
            <span :key="itm.id" v-for="(itm, idx) in necessaryList[key]"
              >{{ itm.tagItemName || itm.name }}
              <i v-if="idx !== necessaryList[key].length - 1">,</i></span
            >
          </div>
        </div>
      </div>
      <div
        class="item"
        :class="{
          'no-data': !Object.keys(notNecessaryList).length,
        }"
      >
        <span class="label">标签（可选）：</span>
        <div class="tag-list" v-if="Object.keys(notNecessaryList).length">
          <div class="item" :key="key" v-for="(item, key) in notNecessaryList">
            {{ key }}:
            <span :key="itm.id" v-for="(itm, idx) in notNecessaryList[key]"
              >{{ itm.tagItemName || itm.name }}
              <i v-if="idx !== notNecessaryList[key].length - 1">,</i></span
            >
          </div>
        </div>
        <span v-else>无</span>
      </div>
      <div class="item">
        <span class="label">审查点主对象：</span
        >{{
          (form.checkPointRefCheckObjectList.find((e) => {return e.main}) || {}).name
        }}
      </div>
      <div
        class="item"
        :class="{
          'no-data': !checkObjectLinkName,
        }"
      >
        <span class="label">审查点关联对象：</span
        >{{ checkObjectLinkName || "无" }}
      </div>
      <div
        class="item"
        :class="{
          'no-data': !form.checkPoint.platform,
        }"
      >
        <span class="label">支持平台：</span
        >{{ form.checkPoint.platform || "无" }}
      </div>
      <template v-if="(form.checkPoint.platform || '').indexOf('A平台') > -1">
        <div class="item">
          <span class="label">审查点主图纸：</span
          >{{
            (form.checkPointRefDrawingObjectList.find(e => { return e.main }) || {}).description
          }}
        </div>
        <div
          class="item"
          :class="{
            'no-data': !checkPointRefDrawingLinkName,
          }"
        >
          <span class="label">审查点关联图纸：</span
          >{{ checkPointRefDrawingLinkName || "无" }}
        </div></template
      >
      <div class="item" :class="{ 'no-data': !form.checkPoint.advice }">
        <span class="label">反馈意见模板：</span
        >{{ form.checkPoint.advice || "无" }}
      </div>
      <div class="item" :class="{ 'no-data': !form.checkPoint.prdInfo }">
        <span class="label">关联Prd：</span
        >{{ form.checkPoint.prdInfo || "无" }}
      </div>
    </div>

    <p
      class="title"
      @click="openData.ruleInfo = !openData.ruleInfo"
      v-if="form.checkPoint"
    >
      <i
        class="iconfont icon-icon_arrow4"
        :class="{ rotate: !openData.ruleInfo }"
      ></i>
      审查规则详情
    </p>
    <div v-show="openData.ruleInfo" v-if="form.checkPoint.ruleId">
      <div class="item">
        <span class="label">规则id：</span>
        {{ form.checkPoint.ruleId || "无" }}
      </div>
      <div class="item">
        <span class="label">执行类型：</span>
        {{ (form.executeType === 1 || form.checkPoint.executeType) ? "解释执行" : "例程" }}
      </div>
      <div class="item">
        <span class="label">脚本内容：</span>
        <div class="script_style">{{ form.checkPoint.script || '' }}</div>
      </div>
    </div>

    <!-- <div style="margin-top: 16px; text-align: right">
      <permission-verification check="checkpoint_update">
      <a-button @click="toEdit">去编辑</a-button>
      </permission-verification>
      <a-button style="margin-left: 16px" type="primary" @click="handleCancel">
        关闭
      </a-button>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "DetailCheckpointDialog",
  props: {
    value: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  computed: {
    checkObjectLinkName() {
      if (!this.form.checkPointRefCheckObjectList.length) {
        return "";
      }
      let list = this.form.checkPointRefCheckObjectList.filter((e) => !e.main);
      if (list.length) {
        return list.map((e) => e.name).join(",");
      } else {
        return "";
      }
    },
    checkPointRefDrawingLinkName() {
      if (!this.form.checkPointRefDrawingObjectList.length) {
        return "";
      }
      let list = this.form.checkPointRefDrawingObjectList.filter(
        (e) => !e.main
      );
      if (list.length) {
        return list.map((e) => e.description).join(",");
      } else {
        return "";
      }
    },
    // 必选标签
    necessaryList() {
      let tagMap = {};
      for (let item of this.form.checkPointRefTagItemNecessaryList) {
        if (tagMap[item.tagClassName]) {
          tagMap[item.tagClassName].push(item);
        } else {
          tagMap[item.tagClassName] = [item];
        }
      }
      return tagMap;
    },
    // 可选标签
    notNecessaryList() {
      let tagMap = {};
      for (let item of this.form.checkPointRefTagItemNotNecessaryList) {
        if (tagMap[item.tagClassName]) {
          tagMap[item.tagClassName].push(item);
        } else {
          tagMap[item.tagClassName] = [item];
        }
      }
      return tagMap;
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.form = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      form: {
        checkPoint: {},
        checkPointRefArticleList: [],
        checkPointRefCheckObjectList: [],
        checkPointRefDrawingObjectList: [],
        specificationInfo: [],
        checkPointRefTagItemNecessaryList: [],
        checkPointRefTagItemNotNecessaryList: [],
        customTagItemNameSet: null,
        ruleInfo: {},
        articleInfo: {},
        clauseInfo: {}
      },
      professionsList: [],
      openData: {
        specification: true,
        checkPonint: true,
        ruleInfo: true,
      },
    };
  },
  created() {
  },
  methods: {
    // 获取专业名称
    getProfessionsNameList(record) {
      let list = [];
      if (!Array.isArray(record)) {
        return ''
      }
      for (let item of record) {
        let data = this.professionsList.find((e) => {
          return item === e.id;
        });
        if (data) {
          list.push(data.name);
        }
      }
      return list.join(",");
    }
  },
  components: {},
};
</script>
<style lang="less" scoped>
.detail-info {
  .title {
    color: #17171c;
    font-size: 16px;
    cursor: pointer;
    i {
      transition: all 0.2s;
    }
  }
  .rotate {
    display: inline-block;
    transform: rotate(180deg);
  }
  .item {
    padding: 8px 0;
    display: flex;
    color: #17171c;
    &.no-data {
      color: rgba(140, 143, 160, 0.5);
    }
    .label {
      width: 120px;
      color: #17171c;
      text-align: right;
      font-weight: bold;
      margin-right: 10px;
    }
    .content {
      flex: 1;
      /deep/ img {
        width: 100%;
      }
      /deep/ p {
        margin: 0px;
      }
    }
    .tag-list {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .item {
        min-height: 24px;
        display: flex;
        flex-wrap: wrap;
        background: #dbdbe8;
        border-radius: 2px;
        line-height: 24px;
        color: #17171c;
        padding: 0 5px;
        margin: 2px;
        span {
          margin-left: 2px;
        }
      }
    }
  }
  /deep/.ant-tag {
    margin-bottom: 5px;
  }
  .script_style {
    float: right;
    padding: 6px;
    width: calc(100% - 120px);
    border: 1px solid #999;
  }
}
</style>
