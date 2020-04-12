import moment from 'moment';
import Vue from 'vue';
import App from './App.vue';
import './plugins/vuetify';
import router from './router';
import { store } from './store/store';
import './stylus/main.styl';
// import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV === 'development';

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

Vue.filter('formatDate', (value: any) => {
    if (value) {
        return moment(String(value)).format('YYYY/MM/DD - hh:mm');
    }
});
