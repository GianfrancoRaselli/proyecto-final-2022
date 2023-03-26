import { createApp } from 'vue';
import App from './App.vue';

import router from '@/router';
import store from '@/store';
import FontAwesome from '@/plugins/FontAwesome';
import '@/axios';

import AppNotifications from '@/components/global/AppNotifications';
import AppDate from '@/components/global/AppDate';
import AppAlert from '@/components/global/AppAlert';
import AppButton from '@/components/global/AppButton';
import AppBadge from '@/components/global/AppBadge';
import AppSpinner from '@/components/global/AppSpinner';
import AppProgress from '@/components/global/AppProgress';
import AppInputErrors from '@/components/global/AppInputErrors';
import AppShowAddress from '@/components/global/AppShowAddress';
import AppShowAmount from '@/components/global/AppShowAmount';
import AppShowEth from '@/components/global/AppShowEth';
import AppPill from '@/components/global/AppPill';
import AppMyAddress from '@/components/global/AppMyAddress';

import 'bootstrap/dist/js/bootstrap.min.js';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(FontAwesome);

app.component('AppNotifications', AppNotifications);
app.component('AppDate', AppDate);
app.component('AppAlert', AppAlert);
app.component('AppButton', AppButton);
app.component('AppBadge', AppBadge);
app.component('AppSpinner', AppSpinner);
app.component('AppProgress', AppProgress);
app.component('AppInputErrors', AppInputErrors);
app.component('AppShowAddress', AppShowAddress);
app.component('AppShowAmount', AppShowAmount);
app.component('AppShowEth', AppShowEth);
app.component('AppPill', AppPill);
app.component('AppMyAddress', AppMyAddress);

app.mount('#app');
