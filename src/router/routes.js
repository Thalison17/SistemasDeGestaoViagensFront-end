const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: '/reservas', name: '/reservas', component: () => import('pages/ReservasPage.vue') },
    ]
  },
  { path: '/cad', name: 'cad', component: () => import('pages/CadCliente.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
