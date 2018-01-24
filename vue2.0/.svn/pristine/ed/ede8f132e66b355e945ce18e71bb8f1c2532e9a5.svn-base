<template>
	<section v-if="isloaded" class="home-vue">
		<header class="ad-link">
			<section class="avatar">
				<img v-bind:src="avatar">
			</section>
			<section class="slogon">
				<h1>空间相册</h1>
				<label>纪录你的回忆</label>
			</section>
			<a v-tap="{methods : toMyHome}"  href="javascript:void(0)">开启空间</a>
		</header>
		<home-header v-bind:profiles="profiles" v-bind:is-my-home="false"></home-header>

		<section class="info">
			<section>
				<p>{{ profiles.ac }}</p>
				<h4>纪录</h4>
			</section>
			<section>
				<p>{{ profiles.pc }}</p>
				<h4>瞬间</h4>
			</section>
			<section>
				<p>{{ profiles.tpc }}</p>
				<h4>喜欢</h4>
			</section>
		</section>

		<section class="list">
			<home-list-item  v-for="item in list" v-bind:item="item" v-bind:uid="uid"  v-bind:style-obj="coverStyle">
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
	name: 'Home',
	components: {
		'home-header' : HomeHeader,
		'home-list-item' : HomeListItem
	},
	data(){
		return {
			uid: null,
			coverStyle: {},
			list: [],
			isloaded: false,
			avatar: '/static/photo/default.jpg'
		}
	},

	methods: {
		toMyHome: function(){
			if(window.isDev){
				this.$router.push('/myHome');	
			}else{
				location.href = 'http://mp.weixin.qq.com/s?__biz=MzI4MjM1OTM0Mw==&mid=100000141&idx=1&sn=e11a20643d2fba5b94e94d446aaa6ecd&chksm=6b9a62cd5cedebdbea9f92121f2507bc7cf61557b06953b396a3a50e4ea14f644b13546321bc&mpshare=1&scene=1&srcid=0930c7VC6oHJbcMubY7gfNvK#rd'
			}
		}
	},

    beforeRouteEnter : function (to, from, next) {
        setTitle('我的相册');
        next();
    },

	created: function(){
		this.uid = this.$route.params.id;
		if(this.uid == window.uid){
			this.$router.replace('/myHome');
			return false;
		}

		var that = this;
		var width = $(window).width();
		this.coverStyle = {
			height : width * 0.8 + 'px'
		}
		api.getAllHomeDataByUid(this.uid).then(function(result){
			that.isloaded = true;
			that.list = result.list;
			that.profiles = result.profiles;
		});

		this.avatar = window.headimgurl;
	}
}

</script>

<style scoped>
/**
 * 信息栏
 */
.home-vue .info{
	width: 100%;
	height: 50px;
	border-top: 1px solid rgba(220,220,220,0.5);
	overflow: hidden;
	margin-top: 20px;
	padding-top: 10px;
}
.home-vue .info section{
	width: 33.33%;
	float: left;
	text-align: center;
	border-left: 1px solid rgba(220,220,220,0.5);
}
.home-vue .info section:first-child{
	border-left: none;
}
.home-vue .info section p{
	font-size: 14px;
	color: #f64d30;
}
.home-vue .info section h4{
	font-size: 12px;
	color: #999;
}
/**
 * END OF 信息栏
 */

/**
 * 顶部广告
 */
.home-vue .ad-link{
	width: 100%;
	height: 50px;
	background: #222222;
	border-top: 1px solid #f64d30;
	overflow: hidden;
	padding: 0px 12px 0 0;
}
.home-vue .ad-link .avatar{
	width: 112px;
	height: 44px;
	float: left;
	background: url(/static/photo/icon-bg-home-top.png) no-repeat center;
	background-size: 100% 100%;
	text-align: center;
}
.home-vue .ad-link .avatar img{
	height: 36px;
	width: 36px;
	border-radius: 100%;
	position: relative;
	top: 3px;
	object-fit: cover;
}
.home-vue .ad-link .slogon{
	float: left;
	position: relative;
	left: -10px;
}
.home-vue .ad-link .slogon h1{
	color: #e0e1e3;
	font-size: 16px;
	line-height: 16px;
	height: 22px;
	padding-top: 9px;
}
.home-vue .ad-link .slogon label{
	font-size: 12px;
	color: #999999;
}
.home-vue .ad-link a{
	display: block;
	height: 32px;
	text-align: center;
	border: 1px solid #f64d30;
	float: right;
	line-height: 30px;
	color: #f64d30;
	font-size: 14px;
	padding: 0 12px;
	border-radius: 3px;
	margin-top: 9px;
}
.home-vue .ad-link a:active{
	color: white;
	background: #f64d30;
}
/**
 * END OF 顶部广告
 */
</style>