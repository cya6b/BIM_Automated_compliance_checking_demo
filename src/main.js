// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { install } from '@/config/axios.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import myDic from './config/dictionary'
import util from './plugins/utils.js'
import myEnums from './config/enum/index'
// 系统变量配置
import globalConf from '@/config/sysGlobalConfig'

// 样式
import './style/override.less'
import '../static/iconfont/iconfont.less'
import './style/modules.less'
import './style/public.less'

Vue.prototype.SYS_GLOBAL = globalConf
Vue.config.productionTip = false
// 控制台不打印vue-warn
Vue.config.silent = true;
Vue.use(ElementUI)
Vue.use(myDic)
Vue.use(util)
Vue.use(myEnums)
install(Vue, router)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
