<template>
	<header class="home-header-vue">
		<section class="avatar-wrapper">
			<section class="avatar">
				<img v-bind:src="profiles.headimgurl" />
			</section>
			<section v-if="isMyHome" class="header-item left">
				<h2>{{ profiles.ac }}</h2>
				<p>纪录</p>
			</section>
			<section v-if="isMyHome" class="header-item right">
				<h2>{{ profiles.pc }}</h2>
				<p>瞬间</p>
			</section>
		</section>
		<h1 class='ellipsis'>{{ profiles.nickname }}</h1>
	</header>
</template>

<script>
export default{
	props: {
		profiles: Object,
		isMyHome: Boolean
	}
}
</script>

<style scoped>
/**
 * 顶部
 */
.home-header-vue .avatar-wrapper{
	position: relative;
}
.home-header-vue{
	padding-top: 20px;
}
.home-header-vue .avatar{
	width: 80px;
	height: 80px;
	border-radius: 100%;
	border: 1px solid rgba(146,146,146,0.5);
	margin: 0px auto 10px;
	padding: 8px;
}
.home-header-vue .avatar img{
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 100%;
}
.home-header-vue .header-item{
	position: absolute;
	width: 30%;
	top: 20px;
}
.home-header-vue .header-item h2{
	font-size: 16px;
	color: #f64d30;
}
.home-header-vue .header-item p{
	font-size: 12px;
	color: #999999;
}
.home-header-vue .header-item.left{
	left: 0px;
}
.home-header-vue .header-item.left h2{
	text-align: right;
}
.home-header-vue .header-item.left p{
	text-align: right;
}
.home-header-vue .header-item.right{
	right: 0px;
}
.home-header-vue h1{
	font-size: 14px;
	color: #646464;
	text-align: center;
}
/**
 * END OF 顶部
 */
</style>