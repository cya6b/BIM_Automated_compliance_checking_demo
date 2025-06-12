const loginActions = {
  getImgCode (context, params) {
    let xhr = null
    if (!window.btoa && window.ActiveXObject) {
      try {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
      } catch (e) {
        try { // IE 浏览器
          xhr = new ActiveXObject('Msxml2.XMLHTTP')
        } catch (e) {}
      }
      xhr.open('GET', '/api/admin/register/passAuth/captcha', true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          params.cb(xhr, xhr.getResponseHeader('signup-key'))
        } else {}
      }
      xhr.send()
    } else {
      this._vm.$axios.get('/api/admin/register/passAuth/captcha', {
        guest: true,
        responseType: 'arraybuffer'
      }).then(resp => {
        params.cb(resp, resp.request.getResponseHeader('signup-key'))
      })
    }
  },
  validateImgCode (context, params) {
    return this._vm.$axios.post('/api/admin/register/passAuth/captcha/' + params.imgCode, {}, {
      guest: true,
      headers: {
        'signup-key': params.imgToken
      }
    })
  },
  sendMsg (context, params) {
    return this._vm.$axios.get('/api/admin/register/passAuth/mobilecaptcha?mobile=' + params.mobile + '&captcha=' + params.imgCode + (params.type ? '&type=' + params.type : ''), {
      guest: true,
      headers: {
        'signup-key': params.imgToken
      }
    }).then(resp => {
      sessionStorage.setItem('signup-key', resp.headers['signup-key'])
      return resp
    })
  },
  validateMsgCode (context, params) {
    return this._vm.$axios.get('/api/admin/register/passAuth/validMobile', {
      guest: true,
      headers: {
        'signup-key': params.imgToken
      },
      params
    })
  }
}

export default loginActions
