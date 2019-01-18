export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/user/login' },
      {
        name: 'app',
        icon: 'appstore',
        path: '/app',
        routes: [
          {
            path: '/app/app-version',
            name: 'app-version',
            icon: 'home',
            component: './App/AppVersion',
          },
          {
            path: '/app/app-data-statistics',
            name: 'app-data-statistics',
            icon: 'stock',
            component: './App/AppDataStatistics',
          },
          // {
          //   path: '/app/app-startup-page',
          //   name: 'app-startup-page',
          //   icon: 'copy',
          //   component: './App/AppStartupPage',
          // },
        ],
      },
      // {
      //   name: 'student-management',
      //   icon: 'usergroup-add',
      //   path: '/student-management',
      //   routes: [
      //     {
      //       path: '/student-management/leave-management',
      //       name: 'leave-management',
      //       icon: 'user-delete',
      //       component: './StudentManagement/LeaveManagement',
      //     },
      //   ],
      // },
      {
        name: 'payment',
        icon: 'pay-circle',
        path: '/payment',
        routes: [
          {
            path: '/payment/payment-home',
            name: 'payment-home',
            icon: 'home',
            component: './Payment/PaymentHome',
          },
          {
            path: '/payment/payment-particulars',
            name: 'payment-particulars',
            icon: 'setting',
            hideInMenu: true,
            component: './Payment/PaymentParticulars',
          },
          {
            path: '/payment/payment-create',
            name: 'payment-create',
            icon: 'form',
            component: './Payment/PaymentCreate',
          },
          {
            path: '/payment/payment-detail',
            name: 'payment-detail',
            icon: 'exception',
            component: './Payment/PaymentDetail',
          },
        ],
      },
      {
        name: 'activite',
        icon: 'warning',
        path: '/activite',
        routes: [
          {
            path: '/activite/activity-create',
            name: 'activity-create',
            icon: 'plus',
            hideInMenu: true,
            component: './Activite/ActivityCreate',
          },
          {
            path: '/activite/activity-management',
            name: 'activity-management',
            icon: 'setting',
            component: './Activite/ActivityManagement',
          },
          {
            path: '/activite/flow-presentation',
            name: 'flow-presentation',
            icon: 'red-envelope',
            component: './Activite/FlowPresentation',
          },
        ],
      },
      {
        name: 'i-pay',
        icon: 'dollar',
        path: '/i-pay',
        routes: [
          {
            path: '/i-pay/i-pay-statistics',
            name: 'i-pay-statistics',
            icon: 'property-safety',
            component: './IPay/IPayStatistics',
          },
          {
            path: '/i-pay/i-pay-data',
            name: 'i-pay-data',
            icon: 'home',
            component: './IPay/IPayData',
          },
          {
            path: '/i-pay/i-pay-school-detail',
            name: 'i-pay-school-detail',
            icon: 'rise',
            component: './IPay/IPaySchoolDetail',
          },
          {
            path: '/i-pay/i-pay-order',
            name: 'i-pay-order',
            icon: 'ordered-list',
            component: './IPay/IPayOrder',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            hideInMenu: true,
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            hideInMenu: true,
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },    
      {
        component: '404',
      },
    ],
  },
];
