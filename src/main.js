import Vue from 'vue'
import App from './App.vue'
import VueInteractJs from "vue-interactjs"
import less from 'less'
import moment from 'moment'
import recur from 'moment-recur'
import _ from 'lodash'

Vue.prototype._ = _
Vue.use(less)
Vue.use(VueInteractJs);
Vue.config.productionTip = false
Vue.prototype.$moment = moment;
Vue.prototype.$moment.recur = recur;

new Vue({
  render: h => h(App),
}).$mount('#app')
