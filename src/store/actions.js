
/**
 * public actions here
 */
import loginActions from './action/loginAction'
import publicActions from './action/publicAction'
import drawingsCheckActions from './action/drawingsCheckAction'
import accountActions from './action/accountAction'
let actions = {
  ...loginActions,
  ...publicActions,
  ...drawingsCheckActions,
  ...accountActions,
  getBizType (context, params) {
    return this._vm.$axios.get('/api/admin/dictionary/getBizType').then(res => {
      if (res.data.code === 'SUCCESS') {
        let data = res.data.detail
        context.commit('setBizType', data)
      }
    })
  },
}

export default actions
