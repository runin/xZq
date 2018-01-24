<template>
	<transition name="fadein">
		<section class="dialog-end-vue">
			<section v-bind:style="dialogStyle" class="dialog">
				<section class="avatar">
					<img v-bind:src="profiles.headimgurl" />
				</section>
				<h1 class='ellipsis'>{{ profiles.nickname }}</h1>
				<p class='ellipsis'>{{ profiles.ac }}个作品</p>
				<a v-tap="{methods : toHome}" class="goin ellipsis" href="javascript:void(0)">我要做相册</a>
				<a v-tap="{methods : zan}" class="zan" href="javascript:void(0)">
					<img v-bind:src="isZan ? '/static/photo/icon-heart-active.png' : '/static/photo/icon-heart.png'" />
				</a>
			</section>
		</section>
	</transition>
</template>

<script>

import api from '../api/api'

export default{
	name: 'DialogEnd',
	props: {
		uuid: String,
		usid: String,
		profiles: Object,
		isZan: Boolean
	},

	data(){
		return {
			dialogStyle: {}
		}
	},

	methods: {
		zan : function(){
			if(!this.isZan){
				this.isZan = true;
				api.zanAlbum(this.uuid);
			}
		},

		toHome: function(){
			this.$router.push('/create');
			return false;
		}
	},

	created: function(){
		var height = $(window).height();
		this.dialogStyle = {
			'top' : (height - 288) / 2 + 'px'
		}
	}
}

</script>

<style scoped>
.dialog-end-vue{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.75);
	z-index: 20;
}
.dialog-end-vue .dialog{
	position: absolute;
	background: white url(/static/photo/bg-main.jpg) no-repeat;
	background-size: 100% 100%;
	width: 66%;
	left: 17%;
	border-radius: 5px;
	top: 20%;
	text-align: center;
}
.dialog-end-vue .dialog .avatar{
	width: 80px;
	height: 80px;
	border-radius: 100%;
	border: 1px solid rgba(146,146,146,0.5);
	margin: 20px auto 10px;
	padding: 8px;
}
.dialog-end-vue .dialog .avatar img{
	border-radius: 100%;
}
.dialog-end-vue .dialog h1{
	font-size: 14px;
	color: #646464;
}
.dialog-end-vue .dialog p{
	font-size: 12px;
	color: #999999;
	padding-bottom: 5px;
}
.dialog-end-vue .dialog .goin{
	display: inline-block;
	max-width: 80%;
	margin: 10px auto 15px;
	border: 1px solid rgba(246,77,48,0.5);
	color: #f64d30;
	font-size: 14px;
	border-radius: 5px;
	padding: 8px 10px;
}
.dialog-end-vue .dialog .goin:active{
	background: #f64d30;
	color: white;
}
.dialog-end-vue .dialog .zan{
	width: 100%;
	display: block;
	height: 60px;
	padding-top: 15px;
	border-top: 1px solid rgba(220,220,220,0.5);
}
.dialog-end-vue .dialog .zan:active{
	background: white;
	border-radius: 0 0 5px 5px;
}
.dialog-end-vue .dialog .zan img{
	width: 30px;
	height: 30px;
}
</style>