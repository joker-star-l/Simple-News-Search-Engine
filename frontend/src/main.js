import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.$baseUrl = 'http://127.0.0.1:8080'

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
