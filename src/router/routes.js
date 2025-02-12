const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: '/reservas', name: '/reservas', component: () => import('pages/ReservasPage.vue') },
      { path: '/destinos', name: 'destinos', component: () => import('pages/DestinoPage.vue')},
      { path: '/destinos/:id', name: 'destino-detalhes', component: () => import('pages/DestinoDetalhes.vue')},
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
