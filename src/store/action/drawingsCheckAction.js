export default {
  // 获取模型列表
  getCheckModelList (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimFile/list`, {params})
  },
  getCopyCheckModelList (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimFile/shortInfoList`, {params})
  },

  // 添加模型
  addModel (context, params) {
    return this._vm.$axios.post(`/api/bim-model-check/bimFile/add`, params)
  },
  // 删除模型
  removeModel (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimFile/remove/${params.id}`)
  },
  // 获取条文数据
  getArticle (context, params) {
    const zy = 'JZ,JG,NT,DQ,GPS'
    return this._vm.$axios.get(`/api/bim-model-check/bimVerifyParam/article?professionSet=${zy}`)
  },
  // 保存某个模型设置的校验参数
  saveBimVerifyParam (context, params) {
    return this._vm.$axios.post(`/api/bim-model-check/bimVerifyParam/save`, params)
  },
  // 获取某个模型设置的校验参数
  getBimVerifyParamsByFileId (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimVerifyParam/info`, {params})
  },
  // 获取某次作业的校验参数
  getBimVerifyParamsByWorkId (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWorkRun/rule`, {params})
  },

  // 保存某个模型设置的审查参数
  saveCheckParams (context, params) {
    return this._vm.$axios.post(`/api/bim-model-check/bimExamineParam/save`, params)
  },

  // 获取某个模型设置的审查参数
  getCheckParamsByFileId (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimExamineParam/list`, {params})
  },
  // 获取某次作业的审查参数
  getCheckParamsByWorkId (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWorkRun/param`, {params})
  },
  // 获取审查参数下拉参数项list
  getCheckParamsLib (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimExamineParam/info`)
  },
  // 发起审查
  startCheck (context, params) {
    return this._vm.$axios.post(`/api/bim-model-check/bimWork/start`, params)
  },
  // 获取模型预览token
  getTokenByFileId (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimFile/getViewToken/${params.id}`)
  },
  // 根据workId获取模型预览token
  getTokenByWorkId (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWork/getViewToken/${params.id}`)
  },
  // 获取历史作业列表
  getModekCheckWorkList (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWork/list`, {params})
  },

  // 获取审查点详情
  getCheckPointDetailById (context, params) {
    return this._vm.$axios({
      method: 'post',
      url: `/api/bim-model-check/bimVerifyParam/detail`,
      data: [params.ids],
      headers: {
        'content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  // 获取智能意见结果
  getModelCheckResult (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWork/getArticleResult`, {params})
  },

  // 根据作业id查询本次作业的审查结果审查点列表
  getCheckPointListByWork (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWorkDiff/diffCheckPoint`, {params})
  },
  // 根据审查结果审查点 查询本审查点中的差异构件列表
  getEleListByWorkCheckPoint (context, params) {
    return this._vm.$axios.get(`/api/bim-model-check/bimWorkDiff/diffElement`, {params})
  },

  copyParams (context, params) {
    return this._vm.$axios.post(`/api/bim-model-check/paramConfig/copy?sourceFileId=${params.sourceFileId}&targetFileId=${params.targetFileId}`)
  },

  // 发起多模型审查
  mulStartCheck (context, params) {
    return this._vm.$axios.post(`/api/bim-model-check/bimWork/start`, params)
  },
}
