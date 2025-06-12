import md5 from 'js-md5'
import qs from 'qs'
const loginConfig = {
  clientId: '***', // 根据后端服务自行配置
  clientSecret: '***' // 根据后端服务自行配置
}
export default {
  login (context, params) {
    let randomState = sessionStorage.getItem('uaastate') || Math.floor(this._vm.$util.randomFloat() * 10000)
    sessionStorage.setItem('uaastate', randomState)
    return new Promise((resolve, reject) => {
      params.password = md5(params.password)
      let p = qs.stringify({
        username: params.username,
        password: params.password,
        captcha: params.imgCode,
        redirect_url: params.redirect_url + '?redirect=true'
      })
      return this._vm.$axios.post(`/uaa/login`, p, {
        guest: true,
          headers: {
            'signup-key': params.imgToken
          }
      }).then(resp => {
        window.location.href = `/uaa/oauth/authorize?response_type=code&client_id=${loginConfig.clientId}&scope=document_enterprise_files_write paas-gdoc_tenant document_project_files_write colibri_sms document_incoming_files_read paas-databag_tenant paas-comment-service_tenant document_project_files_read document_my_files_read document_incoming_files_write account_token_login document_my_files_write document_appdata_read paas-organization_tenant paas-new-storage-service_tenant account_info_write document_enterprise_files_read document_appdata_write account_info_read colibri_email&state=${randomState}&redirect_uri=${params.redirect_url}${encodeURIComponent('/#/auth_redirect?redirect=true')}`
        resolve(resp)
      }).catch(err => {
        let errInfo = err.headers.message ? decodeURI(err.headers.message) : '登录失败!'
        this._vm.$message({
          type: 'error',
          message: errInfo
        })
        reject(err)
      })
    })
  },
  getAccessToken (context, params) {
    return new Promise((resolve, reject) => {
      this._vm.$axios.post('/uaa/oauth/token', {}, {
        params: {
          grant_type: 'authorization_code',
          redirect_uri: location.origin + '/#/auth_redirect?redirect=true',
          client_id: loginConfig.clientId,
          client_secret: loginConfig.clientSecret,
          state: sessionStorage.getItem('uaastate'),
          code: params.code
        }
      }).then(res => {
        sessionStorage.setItem('atk', res.data.access_token)
        resolve(res)
      }).catch((err) => {
        this._vm.$message.error('获取token失败')
        reject(err)
      })
    })
  },
  getAccountInfo (context, params) {
    return this._vm.$axios.get(`/api/admin/credential/getCredentialInfo`)
  },
  logout (context, params) {
    return this._vm.$axios.get(`/uaa/logout?redirect_uri=${window.location.origin}/uaa/login?logout`)
  }
}
