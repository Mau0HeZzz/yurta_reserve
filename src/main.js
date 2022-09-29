import Vue from 'vue';
import { VueMaskDirective } from 'v-mask';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.directive('mask', VueMaskDirective);

const moment = require('moment');
require('moment/locale/ru');
Vue.use(require('vue-moment'), { moment });

import VueApexCharts from 'vue-apexcharts';
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

import { createProvider, onLogout } from './vue-apollo';

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    signOut() {
      onLogout(this.$apollo.provider.defaultClient);
      localStorage.clear();
      sessionStorage.clear();
      router.go('Login');
    },
    showNotice(type = null, title = null, text = null, time = 5000) {
      this.snackbars.push({
        type: type,
        title: title,
        text: text,
        time: time,
        show: true
      });
    },
    titlesFirstWordReduction(string = '') {
      let str = string;
      switch (string) {
        case 'Физическое лицо':
          str = 'Физ.лицо';
          break
        case 'Юридическое лицо':
          str = 'Юр.лицо';
          break
        case 'Республика Башкортостан':
          str = 'РБ';
          break
        case 'Российская Федерация':
          str = 'РФ';
          break
      }
      return str;
    },
  }
});

new Vue({
  data: {
    urlMap: 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    snackbars: []
  },
  router,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
