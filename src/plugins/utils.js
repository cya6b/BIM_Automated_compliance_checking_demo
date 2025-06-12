const util = {
  // eslint-disable-next-line object-shorthand
  install: function (Vue) {
    Vue.prototype.$util = util
    window.qs = function (selector) {
      return document.querySelector(selector)
    }
    window.gv = function () {
      let dom = qs('.el-button')
      if (!dom) {
        dom = qs('.el-input')
      }
      return dom && dom.__vue__
    }
    window.showMethods = function (object) {
      if (typeof object === 'object') {
        Object.keys(object).forEach(key => {
          window.showMethods(object[key])
        })
      }
    }
  },

  randomFloat () {
    const fooArray = new Uint32Array(1)
    const maxUint32 = 0xFFFFFFFF
    return crypto.getRandomValues(fooArray)[0] / maxUint32
  }
}

export default util
