import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/user/userRegister'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/adminUser',
    component: Layout,
    redirect: '/adminUser/student',
    name: '用户管理',
    meta: {
      roles: ['admin'],
      title: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'student',
        name: 'adminUser',
        component: () => import('@/views/admin/student.vue'),
        meta: { title: '学生管理', icon: 'user' }
      },
      {
        path: 'clubAdmin',
        name: 'adminClubAdmin',
        component: () => import('@/views/admin/clubAdmin.vue'),
        meta: { title: '社团管理员管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/adminClub',
    component: Layout,
    redirect: '/adminClub/club',
    name: '社团/组织管理',
    meta: {
      title: '社团/组织管理',
      icon: 'el-icon-s-home'
    },
    children: [
      {
        path: 'club',
        name: 'clubAdmin',
        component: () => import('@/views/club/club.vue'),
        meta: { title: '社团管理', icon: 'el-icon-help' }
      },
      {
        path: 'clubNotice',
        name: 'clubNotice',
        component: () => import('@/views/club/clubNotice.vue'),
        meta: { title: '社团公告', icon: 'user' }
      },
      {
        path: 'clubActivity',
        name: 'clubActivity',
        component: () => import('@/views/club/clubActivity.vue'),
        meta: { title: '社团活动', icon: 'el-icon-trophy' }
      },
      {
        path: 'clubWarning',
        name: 'clubWarning',
        component: () => import('@/views/club/clubWarning.vue'),
        meta: { title: '警告信息', icon: 'el-icon-warning' }
      }
    ]
  },
  {
    path: '/adminSystem',
    component: Layout,
    redirect: '/adminSystem/system',
    name: '系统管理',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-home'
    },
    children: [
      {
        path: 'system',
        name: 'systemAdmin',
        component: () => import('@/views/system/systemAdmin.vue'),
        meta: { title: '系统管理', icon: 'el-icon-help' }
      },
      {
        path: 'organization',
        name: 'organizationAdmin',
        component: () => import('@/views/system/organizationAdmin.vue'),
        meta: { title: '组织架构管理', icon: 'el-icon-help' }
      },
      {
        path: 'announcement',
        name: 'announcementAdmin',
        component: () => import('@/views/system/systemNotice.vue'),
        meta: { title: '系统公告', icon: 'el-icon-help' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
