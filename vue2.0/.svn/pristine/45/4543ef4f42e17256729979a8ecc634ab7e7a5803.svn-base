<template>
	<section>
		<keep-alive include="myHome">
			<router-view v-if="isWxReady"></router-view>
		</keep-alive>
		<section class="prepareing" v-if="!isWxReady && !isError">正在加载</section>
		<section class="erroring" v-if="isError">网络不太给力，请稍后重试</section>
	</section>
</template>

<script>

import api from '../api/api.js'

export default{
	name: 'Main',
	data(){
		return {
			isWxReady: false,
			isError: false
		}
	},

	created: function(){
		var that = this;
		api.getTicket().then(function(){
			var musics = sessionStorage.getItem(SESSION_KEY_MUSICS);
			var tmpls = sessionStorage.getItem(SESSION_KEY_TMPLS);
			if(musics && tmpls){
				that.isWxReady = true;
			}else{
				api.getMusicAndTmpls().then(function(result){
					sessionStorage.setItem(SESSION_KEY_MUSICS, JSON.stringify(result.musics));
					sessionStorage.setItem(SESSION_KEY_TMPLS, JSON.stringify(result.tmpls));
					that.isWxReady = true;
				}, function(){
					that.isError = true;
				});
			}
		}, function(){
			that.isError = true;
		});
	}
}

</script>

<style scoped>
.prepareing{
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	text-align: center;
	font-size: 14px;
	color: #999;
	padding-top: 15px;
	height: 100%;
	background: rgba(241,245,248,1);
}
.erroring{
	width: 100%;
	text-align: center;
	font-size: 14px;
	color: #999;
	padding-top: 15px;
}
</style>