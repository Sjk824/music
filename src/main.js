import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router/router';
import store from './store/index';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';

import 'common/stylus/index.styl';

fastclick.attach(document.body);

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
