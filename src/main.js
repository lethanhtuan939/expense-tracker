import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primeuix/themes/aura'
import appState from '../plugins/appState'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

import 'primeicons/primeicons.css'
import './index.css'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
});
app.use(ToastService)
app.use(appState);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip)

app.mount('#app');
