import Vue from 'vue'
import Router from 'vue-router'

// 登录
// const Login = (resolve) => {
//   import('components/login/login').then((module) => {
//     resolve(module)
//   })
// }

// 精选
const Index = (resolve) => {
  import('components/index/index').then((module) => {
    resolve(module)
  })
}

// 乐享生活
const Enjoy = (resolve) => {
  import('components/enjoy/enjoy').then((module) => {
    resolve(module)
  })
}

// 全球资产配置
const Global = (resolve) => {
  import('components/global/global').then((module) => {
    resolve(module)
  })
}

const GlobalDetail = (resolve) => {
  import('components/global/detail').then((module) => {
    resolve(module)
  })
}

const MigrationPlanning = (resolve) => {
  import('components/global/migration').then((module) => {
    resolve(module)
  })
}

const LifePlanning = (resolve) => {
  import('components/global/lifeplan').then((module) => {
    resolve(module)
  })
}

const Assess = (resolve) => {
  import('components/global/assess').then((module) => {
    resolve(module)
  })
}

// const FillAssess = (resolve) => {
//   import('components/global/fill-assess').then((module) => {
//     resolve(module)
//   })
// }

// const ChildEducation = (resolve) => {
//   import('components/global/education').then((module) => {
//     resolve(module)
//   })
// }

// 我的
const Mine = (resolve) => {
  import('components/mine/mine').then((module) => {
    resolve(module)
  })
}

const Focus = (resolve) => {
  import('components/mine/focus').then((module) => {
    resolve(module)
  })
}

const Booking = (resolve) => {
  import('components/mine/booking').then((module) => {
    resolve(module)
  })
}

const UserInfo = (resolve) => {
  import('components/mine/info').then((module) => {
    resolve(module)
  })
}

const More = (resolve) => {
  import('components/mine/more').then((module) => {
    resolve(module)
  })
}

// 乐享生活详情
const enjoyDetail = (resolve) => {
  import('components/enjoy/enjoydetail').then((module) => {
    resolve(module)
  })
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login,
    //   meta: {
    //     title: '登录'
    //   }
    // },
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta: {
        title: '热门精选'
      }
    },
    {
      path: '/enjoy',
      name: 'enjoy',
      component: Enjoy,
      meta: {
        title: '乐享生活'
      },
      children: [
        {
          path: 'enjoydetail',
          name: 'enjoydetail',
          component: enjoyDetail
          // meta: {
          //   title: '我的关注'
          // }
        }
      ]
    },
    {
      path: '/global',
      name: 'global',
      component: Global,
      meta: {
        title: '全球资产配置'
      },
      children: [
        {
          path: 'detail',
          name: 'detail',
          component: GlobalDetail
        },
        {
          path: 'migration/:id',
          name: 'migration',
          component: MigrationPlanning
        },
        {
          path: 'life',
          name: 'life',
          component: LifePlanning
        },
        {
          path: 'assess',
          name: 'assess',
          component: Assess
        }
        // {
        //   path: 'fillassess',
        //   name: 'fillassess',
        //   component: FillAssess
        // }
        // {
        //   path: '/migration',
        //   name: 'migration',
        //   component: Migration
        // }
      ]
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine,
      meta: {
        title: '我的'
      },
      children: [
        {
          path: 'focus',
          name: 'focus',
          component: Focus,
          meta: {
            title: '我的关注'
          }
        },
        {
          path: 'booking',
          name: 'booking',
          component: Booking,
          meta: {
            title: '我的预约'
          }
        },
        {
          path: 'info',
          name: 'info',
          component: UserInfo,
          meta: {
            title: '修改个人信息'
          }
        },
        {
          path: 'more',
          name: 'more',
          component: More,
          meta: {
            title: '更多'
          }
        }
      ]
    }
  ]
})
