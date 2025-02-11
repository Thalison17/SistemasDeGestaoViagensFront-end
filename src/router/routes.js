const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: '/reservas', name: 'reservas', component: () => import('pages/ReservasPage.vue') },
      { path: '/cliente', name: 'cliente', component: () => import('src/pages/Cliente/CadCliente.vue') },
      { path: '/clientes', name: 'clientes', component: () => import('src/pages/Cliente/ListCliente.vue') },
      { path: '/destino', name: 'destino', component: () => import('pages/Destino/CadDestino.vue') },
      { path: '/destinos', name: 'destinos', component: () => import('pages/Destino/ListDestino.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
