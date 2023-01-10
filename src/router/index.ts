import { createRouter, createWebHistory } from 'vue-router';
import { LocalStorage } from 'quasar';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'Login',
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        title: 'Log In',
        noHeader: true,
        unAuthenticate: true,
      },
      component: () => import('../views/Login.vue'),
    },
  ],
});
router.beforeEach((to) => {
  let isAuthenticated = false;
  const auth = LocalStorage.getItem('auth');
  if (auth?.accessToken) {
    isAuthenticated = true;
  }
  if (!isAuthenticated && to.name !== 'Login' && !to.meta.unAuthenticate) {
    return { name: 'Login' };
  }
});
export default router;
