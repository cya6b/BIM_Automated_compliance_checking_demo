import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import main from '@/pages/main'
import store from '../store'

import modelCheckList from '@/pages/drawingsCheck/modelCheckList/index.vue'
import paramsSetting from '@/pages/drawingsCheck/modelCheckList/paramsSetting/index.vue'
import checkhistorys from '@/pages/drawingsCheck/modelCheckList/checkhistorys/index.vue'
import startCheck from '@/pages/drawingsCheck/modelCheckList/startCheck/index.vue'
import modelView from '@/pages/drawingsCheck/modelDetail/index.vue'
import checkWorkInfo from '@/pages/drawingsCheck/modelCheckList/checkhistorys/detail.vue'
Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: login,
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      meta: {
        mainPage: true,
      },
      children: [
        {
          path: 'drawingCheck/modelCheckList',
          name: 'modelCheckList',
          component: modelCheckList,
          meta: {
            breadcrumb: []
          }
        },
        {
          path: 'drawingCheck/paramsSetting',
          name: 'paramsSetting',
          component: paramsSetting,
          meta: {
            breadcrumb: [{
              label: '参数配置',
              name: 'paramsSetting'
            }]
          }
        },
        {
          path: 'drawingCheck/checkhistorys',
          name: 'checkhistorys',
          component: checkhistorys,
          meta: {
            breadcrumb: [
              {
                label: '作业历史',
                name: 'checkhistorys'
              }
            ]
          }
        },
        {
          path: 'drawingCheck/checkWorkInfo',
          name: 'checkWorkInfo',
          component: checkWorkInfo,
          meta: {
            breadcrumb: [
              {
                label: '作业历史',
                name: 'checkhistorys'
              },
              {
                label: '作业详情',
                name: 'checkWorkInfo'
              }
            ]
          }
        },
        {
          path: 'drawingCheck/startCheck',
          name: 'startCheck',
          component: startCheck,
          meta: {
            breadcrumb: [
              {
                label: '发起审查',
                name: 'startCheck'
              },
            ]
          }
        },
        {
          path: 'drawingCheck/model',
          name: 'model',
          component: modelView,
          meta: {
            breadcrumb: []
          }
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const href = window.location.href
  if (href.includes('auth_redirect')) {
    const code = href.substr(href.indexOf('code') + 5, 6)
    store.dispatch('getAccessToken', {code}).then((res) => {
      window.location.href = window.location.origin + '/#/main'
    })
  }
  if (!sessionStorage.getItem('atk') && !to.path.includes('/login')) {
    next({name: 'login'})
  }
  next()
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
