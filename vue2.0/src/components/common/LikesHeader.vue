<template>
	<header class="like-header-vue">
		<a v-tap="{methods : navTo, url: '/myHome'}" class="back" href="javascript:void(0)">
			<img src="/static/photo/icon-arrow-left.png" />
		</a>
		<a v-tap="{methods : navTo, url: '/likes/' + id}" v-bind:class="{ 'active' : isLikes }" class="tab-item" href="javascript:void(0)">喜欢</a>
		<a v-tap="{methods : navTo, url: '/visits/' + id}" v-bind:class="{ 'active' : isVisits }" class="tab-item" href="javascript:void(0)">访客</a>
	</header>
</template>

<script>
export default{
	props: {
		id: String
	},

	data(){
		return {
			isLikes: false,
			isVisits: false
		}
	},

	methods: {
		back: function(){
			this.$router.push('/home');
			return false;
		},

		navTo: function(params){
			this.$router.push(params.url);
			return false;
		}
	},

	created: function(){
		if(this.$route.path.indexOf('/visits') >= 0){
			this.isVisits = true;
		}else{
			this.isLikes = true;
		}
	}
}
</script>

<style scoped>
.like-header-vue{
	height: 45px;
	background: white;
	width: 100%;	
	position: fixed;
	left: 0px;
	top: 0px;
	z-index:2;
	box-shadow: 0px 1px 5px rgba(66,66,66,0.3);
}
.like-header-vue .back{
	display: block;
	float: left;
	width: 25%;
}
.like-header-vue .back img{
	height: 16px;
	margin-top: 16px;
	padding-left: 12px;
}
.like-header-vue .tab-item{
	display: block;
	width: 25%;
	text-align: center;
	color: #646464;
	font-size: 14px;
	float: left;
	line-height: 43px;
}
.like-header-vue .tab-item.active{
	border-bottom: 2px solid #f64d30;
	color: #f64d30;
}
.like-header-vue .tab-item:first-child{
	margin-left: 25%;
}
</style>