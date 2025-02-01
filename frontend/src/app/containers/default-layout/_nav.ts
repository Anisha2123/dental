import { INavData } from '@coreui/angular';

export const navItems:
 INavData[] =
  [

  {
    name: 'Dashboard',
    url: 'dashboard',
    icon:'fa-solid fa-house-chimney'

  },
  {
    name: 'Dentists',
    url: 'registered-dentists',
    icon:'fa-solid fa-user'
  },
  /*{
    name: 'Registration Form',
    url: 'register-form',
    icon: 'fa-solid fa-address-card'
  },*/

  {
    name: 'Uploaded X-Rays',
    url: '/uploaded-xray/0',
    icon: 'fa-solid fa-cloud-arrow-up'
  },
  {
    name: 'Manage Subscription',
    url: 'subscription-list',
    icon: 'fa-solid fa-bookmark'
  },
  // {
  //   name: 'Financials',
  //   url: 'financial',
  //   icon: 'fa-solid fa-file-invoice-dollar'
  // },



/*  {
    name: 'Charts',
    url: '/charts',
    iconComponent: { name: 'cil-chart-pie' }
  },


  {
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login'
      },
      {
        name: 'Register',
        url: '/register'
      },
      {
        name: 'Error 404',
        url: '/404'
      },
      {
        name: 'Error 500',
        url: '/500'
      }
    ]
  },*/
];

export const navItemsUser:
 INavData[] =
  [
    {
      name: 'Dashboard',
      url: 'dashboard',
      icon:'fa-solid fa-house-chimney'

    },
    {
      name: 'Upload X-Ray',
      url: 'upload-xray/0',
      icon:'fa-solid fa-cloud-arrow-up'

    },


  ]




