import './assets/core.css'

import Vue from 'vue'
import vueTap from 'v-tap';
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import { Promise } from 'es6-promise'

import App from './components/App.vue'

/*import Home from './components/Home.vue'
import Map from './components/Map.vue'
import Matrix from './components/Matrix.vue'
import MatrixList from './components/MatrixList.vue'
import Clue from './components/Clue.vue'

import List from './components/List.vue'
import Article from './components/Article.vue'*/

const Home = r => require.ensure([], () => r(require('./components/Home.vue')), 'chunkname1')
const Map = r => require.ensure([], () => r(require('./components/Map.vue')), 'chunkname2')
const Matrix = r => require.ensure([], () => r(require('./components/Matrix.vue')), 'chunkname3')
const MatrixList = r => require.ensure([], () => r(require('./components/MatrixList.vue')), 'chunkname4')
const Clue = r => require.ensure([], () => r(require('./components/Clue.vue')), 'chunkname5')
const List = r => require.ensure([], () => r(require('./components/List.vue')), 'chunkname6')
const Article = r => require.ensure([], () => r(require('./components/Article.vue')), 'chunkname7')

Vue.use(vueTap);
Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
	mode: 'hash',
	routes : [
		{ path: '/:eu', component: Home },
		{ path: '/:eu/map', component: Map },
		{ path: '/:eu/matrix', component: Matrix },
		{ path: '/:eu/matrix/:mu', component: MatrixList },
		{ path: '/:eu/clue', component: Clue },
		{ path: '/:eu/:pageName', component: List },
		{ path: '/:eu/article/:au', component: Article },
		{ path: '*', redirect: '/:eu' }
	]
});

new Vue({
	router,
	el: '#app',
	template: '<App/>',
	components: { App }
});

window.eventHub = new Vue();