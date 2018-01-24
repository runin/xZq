import './assets/core.css'

import Vue from 'vue'
import vueTap from 'v-tap';
import VueRouter from 'vue-router'

import App from './components/Main.vue'
import Create from './components/Create.vue'
import Upload from './components/Upload.vue'
import MyHome from './components/MyHome.vue'
import Home from './components/Home.vue'

import MyVisits from './components/myVisits.vue'
import MyLikes from './components/myLikes.vue'
import Visits from './components/Visits.vue'
import Likes from './components/Likes.vue'

import Album from './components/Album.vue'
import Preview from './components/Preview.vue'
import Play from './components/Play.vue'

Vue.use(vueTap);
Vue.use(VueRouter);

const routes = [
  { path: '/create', component: Create },
  { path: '/upload', component: Upload },
  { path: '/myHome', component: MyHome },
  { path: '/home/:id', component: Home },
  { path: '/myVisits', component: MyVisits },
  { path: '/myLikes', component: MyLikes },
  { path: '/visits/:id', component: Visits },
  { path: '/likes/:id', component: Likes },
  { path: '/album/:id', component: Album },
  { path: '/home/:uid/album/:id', component: Album },
  { path: '/preview/:id', component: Preview },
  { path: '/play/:id', component: Play },
  { path: '/', redirect: '/create' }
]

const router = new VueRouter({
	routes : routes
})

new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})

// 全局总线
window.eventHub = new Vue();