let getters = {
  getModelInfo (state, getters) {
    return state.model
  },
  getAccount (state, getters) {
    return state.account
  },
  getMsgArr (state, getters) {
    return state.msgArr
  }
}

export default getters
