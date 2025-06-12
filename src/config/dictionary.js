const myDictionarys = {
  install (Vue) {
    Vue.prototype.$myDic = myDictionarys
  },
  zyList: [
    {
      label: '建筑',
      value: 'JZ'
    },
    {
      label: '结构',
      value: 'JG'
    },
    {
      label: '暖通',
      value: 'NT'
    },
    {
      label: '电气',
      value: 'DQ'
    },
    {
      label: '给排水',
      value: 'GPS'
    }
  ],
  diffReasonFlagMap: [
    {
      key: 1,
      label: '条文未审查出结果',
    },
    {
      key: 2,
      label: '审查结果完全不对应埋点数据',
    },
    {
      key: 3,
      label: '审查结果少于埋点数据',
    },
    {
      key: 4,
      label: '审查结果对应部分埋点数据',
    }
  ],
  elementSourceMap: [
    {
      key: 1,
      label: '埋点',
    },
    {
      key: 2,
      label: '审查',
    },
  ]
}
export default myDictionarys
