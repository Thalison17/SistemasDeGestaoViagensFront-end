const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: '/reservas', name: 'reservas', component: () => import('pages/ReservasPage.vue') },
      { path: '/cliente', name: 'cliente', component: () => import('pages/CadCliente.vue') },
      { path: '/destino', name: 'destino', component: () => import('pages/CadDestino.vue') },
      { path: '/destinos', name: 'destinos', component: () => import('pages/ListDestino.vue') },
      { path: 'viagens', name: 'viagens', component: () => import('pages/ListViagem.vue') },
      { path: 'viagem', name: 'viagem', component: () => import('pages/CadViagem.vue') }
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
