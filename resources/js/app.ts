import '../css/app.css';

import { createApp } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { DefineComponent, h } from 'vue'; 
import { ZiggyVue } from 'ziggy-js';
import { initializeTheme } from './composables/useAppearance';
import EPS from '@/components/EPS.vue';
import EBITDA from '@/components/EBITDA.vue';
import ResultTable from '@/components/ResultTable.vue';
import CashFlowPerShare from"@/components/CashFlowPerShare.vue";









declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob<DefineComponent>('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue);

        // global components
        app.component('EPS', EPS); 
        app.component('EBITDA', EBITDA);
        app.component('ResultTable', ResultTable);
        app.component('CashFlowPerShare', CashFlowPerShare);

        app.mount(el);

        return app; 
    },
    progress: {
        color: '#4B5563',
    },
});


initializeTheme();