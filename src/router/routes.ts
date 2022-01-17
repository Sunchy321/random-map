import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path:      '/',
        component: async () => import('layouts/MainLayout.vue'),
        children:  [
            {
                path:       '',
                components: {
                    default: async () => import('pages/Index.vue'),
                    drawer:  async () => import('pages/Drawer.vue'),
                },
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path:      '/:catchAll(.*)*',
        component: async () => import('pages/Error404.vue'),
    },
];

export default routes;
