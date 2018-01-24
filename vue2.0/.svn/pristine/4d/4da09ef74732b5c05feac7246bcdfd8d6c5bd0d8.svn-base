<template>
	<section class="multi-list-vue">
		<section class="avatar">
			<img v-bind:src="item.src" onerror="this.src='/static/photo/default.jpg'" />
		</section>
		<section class="detail">
			<h3 class="ellipsis">{{ item.title }}</h3>
			<section class="control">
				<span class="time ellipsis">{{ time }}</span>
				<span class="link ellipsis">
					{{ tips }}<a v-tap="{ methods:toAlbum, id:item.auuid }" href="javascript:void(0);">《{{ item.name }}》</a>
				</span>
			</section>
		</section>
	</section>
</template>

<script>

import moment from 'moment'

export default{
	props: {
		tips: String,
		item: Object
	},

	computed: {
		time: function () {
			moment.locale('zh-CN');
			return moment(this.item.time).fromNow();
		}
	},

	methods: {
		toAlbum: function(auuid){
			this.$router.push('/album/' + auuid);
			return result;
		}
	},
}
</script>

<style scoped>
.multi-list-vue{
	overflow: hidden;
	position: relative;
	padding: 10px 12px;
	border-bottom: 1px solid rgba(220, 220, 220, 0.5);
	border-top:1px solid white;
}
.multi-list-vue .avatar{
	width: 50px;
	height: 50px;
	float: left;
}
.multi-list-vue .avatar img{
	width: 100%;
	height: 100%;
	border-radius: 100%;
	object-fit: cover;
}
.multi-list-vue .detail{
	margin-left: 58px;
	padding-top: 5px;
}
.multi-list-vue .detail h3{
	font-size: 16px;
	color: #646464;
	padding-bottom: 3px;
}
.multi-list-vue .detail .control{
	font-size: 10px;
	color: #999;
}
.multi-list-vue .detail .control .time{
	float: left;
	width: 5em;
	display: block;
}
.multi-list-vue .detail .control .link{
	display: block;
	margin-left: 5em;
}
.multi-list-vue .detail .control .link a{
	color: #f64d30; 
}
/*.multi-list-vue p{
	margin-left: 58px;
	line-height: 50px;
	font-size: 14px;
	color: #646464;
	padding-right: 30px;
}
.multi-list-vue span{
	position: absolute;
	right: 12px;
	top: 10px;
	line-height: 50px;
	font-size: 12px;
	color: #999999;
}*/
</style>