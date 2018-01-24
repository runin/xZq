<template>
	<section class="single-list-vue">
		<section class="avatar">
			<img v-bind:src="item.src" onerror="this.src='/static/photo/default.jpg'" />
		</section>
		<p class="ellipsis">{{ item.content }}</p>
		<span>{{ time }}</span>
	</section>
</template>

<script>

import moment from 'moment'

export default{
	props: {
		item: Object
	},

	computed: {
		time: function () {
			moment.locale('zh-CN');
			return moment(this.item.time).fromNow();
		}
	}
}
</script>

<style scoped>
.single-list-vue{
	overflow: hidden;
	position: relative;
	padding: 10px 12px;
	border-bottom: 1px solid rgba(220, 220, 220, 0.5);
	border-top: 1px solid white;
	background: white;
}
.single-list-vue .avatar{
	width: 50px;
	height: 50px;
	float: left;
}
.single-list-vue .avatar img{
	width: 100%;
	height: 100%;
	border-radius: 100%;
	object-fit: cover;
}
.single-list-vue p{
	margin-left: 58px;
	line-height: 50px;
	font-size: 14px;
	color: #646464;
	padding-right: 60px;
}
.single-list-vue span{
	position: absolute;
	right: 12px;
	top: 10px;
	line-height: 50px;
	font-size: 12px;
	color: #999999;
}
</style>