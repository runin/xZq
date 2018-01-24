<template>
	<section v-if="isloaded" class="my-home-vue">
		<home-header v-bind:profiles="profiles" v-bind:is-my-home="true"></home-header>

		<section class="btns">
			<a v-tap="{ methods : navTo, url : '/create'}" href="javascript:void(0);">
				<img src="/static/photo/icon-plus.png" />创作
			</a>
			<a v-tap="{ methods : navTo, url : '/myVisits'}" href="javascript:void(0);">
				<img src="/static/photo/icon-view.png" />访客
			</a>
		</section>

		<section class="list">
			<home-list-item  v-for="item in filterList" v-bind:item="item" v-bind:uid="null"  v-bind:style-obj="coverStyle">
			</home-list-item>
			<section class="empty-tips" v-if="list.length == 0">暂无相册</section>
		</section>
	</section>
</template>

<script>

import HomeHeader from './common/HomeHeader.vue'
import HomeListItem from './common/HomeListItem.vue'
import api from '../api/api'

export default{
	name: 'MyHome',
	components: {
		'home-header' : HomeHeader,
		'home-list-item' : HomeListItem
	},
	data(){
		return {
			coverStyle: {},
			list: [],
			isloaded: false
		}
	},
	computed:{
		filterList: function(){
			return this.list.filter(function(item){
				if(sessionStorage.getItem(SESSION_KEY_DELETE_ALBUM_IDS + item.ud)){
					return null;
				}else{
					return item;
				}
			})
		}
	},

	methods: {
		navTo: function(params){
			this.$router.push(params.url);
			return false;
		}
	},

    beforeRouteEnter : function (to, from, next) {
        setTitle('我的相册');
        next();
    },

	created: function(){
		var that = this;
		var width = $(window).width();
		this.coverStyle = {
			height : width * 0.8 + 'px'
		}
		api.getAllHomeData().then(function(result){
			that.isloaded = true;
			if(result.list.albums && result.list.albums.albums){
				that.list = result.list.albums.albums;	
			}
			that.profiles = result.profiles;
		}, function(){

		});
	}
}

</script>

<style scoped>
/**
 * 按钮
 */
.my-home-vue .btns{
	padding: 20px 0;
	width: 100%;
	overflow: hidden;
	margin: 0 auto;
	border-bottom: 1px solid rgba(220,220,220,0.5);
}
.my-home-vue .btns a{
	float: left;
	display: block;
	width: 22%;
	height: 32px;
	text-align: center;
	font-size: 12px;
	color: #646464;
	border: 1px solid rgba(153,153,153,0.5);
	border-radius: 3px;
	line-height: 32px;
}
.my-home-vue .btns a img{
	display: inline-block;
	height: 12px;
	margin-top: 9px;
	margin-right: 3px;
}
.my-home-vue .btns a:first-child{
	margin-right: 5%;
	margin-left: 25%;
}
/**
 * END OF 按钮
 */

.my-home-vue .list{
	border-top: 1px solid white;
}
</style>