import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router/router';
import fastclick from 'fastclick';

import 'common/stylus/index.styl';

fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
