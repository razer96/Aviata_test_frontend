import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import store from './store'
import './assets/styles/flexboxgrid.min.css'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
