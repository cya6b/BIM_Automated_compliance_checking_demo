
/**
 * public mutations here
 */
import Vue from 'vue'
let mutations = {
  SET_ACCOUNT_INFO (state, params) {
    state.account = {
      ...state.account,
      ...params
    }
    if (!state.account.role) {
      state.account.role = {}
    }
  },
  SET_PROJECT (state, params) {
    state.project = {
      ...state.project,
      ...params,
      ...params.projectBasicInfo,
      ...params.projectInfo
    }
    if (params.projectParticipant) {
      state.project.projectParticipant = params.projectParticipant
    }
  },
  UPDATE_PROJECT (state, params) {
    for (let i in params) {
      state.project[i] = params[i]
    }
  },
  SET_SPOT_CHECK_TASK (state, params) {
    state.task = {
      ...state.project,
      ...params
    }
  },
  SET_MODEL_INFO (state, params) {
    state.model = params
  },
  SET_CURRENT_REVIEW_INFO (state, params) {
    state.currentReviewInfo = {
      ...state.currentReviewInfo,
      ...params
    }
  },
  SET_CHECK_DRAWING_INFO (state, params) {
    state.checkDrawingInfo = {
      ...state.checkDrawingInfo,
      ...params
    }
  },
  UPDATE_CHECK_DRAWING_INFO (state, params) {
    for (let i in params) {
      state.checkDrawingInfo[i] = params[i]
    }
  },
  SET_CHECK_DRAWING_INFO__CURRENT_DRAWING (state, params) {
    if (!state.checkDrawingInfo.currentOpenDrawingInfo) {
      state.checkDrawingInfo.currentOpenDrawingInfo = {}
    }
    state.checkDrawingInfo.currentOpenDrawingInfo = {
      ...state.checkDrawingInfo.currentOpenDrawingInfo,
      ...params
    }
  },
  setBizType (state, params) {
    state.bizType = params
  },
  SET_GRAPH_SEPARATOR: (state, param) => {
    if (typeof param.separator === 'string') {
        state.separator = param.separator
    }
    if (typeof param.order === 'string') {
        state.separatorOrder = param.order
    }
    if (typeof param.suffix === 'boolean') {
        state.separatorSuffix = param.suffix
    }
  }
}
export default mutations
