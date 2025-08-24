import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import appState from '../plugins/appState'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import ConfirmationService from 'primevue/confirmationservice'

import 'primeicons/primeicons.css'
import './index.css'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
});
app.use(appState);
app.use(ToastService)
app.directive('tooltip', Tooltip)
app.use(ConfirmationService)

app.mount('#app');
