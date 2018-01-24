<template>
	<section class="home-list-item-vue">
		<section class="inner-wrapper">
			<h3>{{ time }}</h3>
			<h1>{{ item.tt }}</h1>
			<section v-tap="{methods : toAlbum}" class="cover" v-bind:style="styleObj">
				<section class="cover-contain">
					<img v-bind:src="item.ci" onerror="this.src='/static/photo/default.jpg'" />
					<img class="mask" src="/static/photo/mask-cover.png" />
				</section>
			</section>
			<section v-if="uid" class="detail">
				<!-- 好友的 -->
				<section v-tap="{methods : zan}"  class="detail-item">
					<img v-bind:src="(item.ps && item.ps == 1 ? '/static/photo/icon-heart-active.png' : '/static/photo/icon-heart.png' )" />
					{{ item.pc ? item.pc : 0 }}
				</section>
				<section class="detail-item">
					<img src="/static/photo/icon-view.png" />
					{{ item.vc ? item.vc : 0 }}
				</section>
			</section>

			<section v-else class="detail">
				<!-- 自己的 -->
				<section v-tap="{methods : toLikes}"  class="detail-item">
					<img v-bind:src="(item.ps == 1 ? '/static/photo/icon-heart-active.png' : '/static/photo/icon-heart.png' )" />
					{{ item.pc ? item.pc : 0 }}
				</section>
				<section v-tap="{methods : toVisits}"  class="detail-item">
					<img src="/static/photo/icon-view.png" />
					{{ item.vc ? item.vc : 0 }}
				</section>
			</section>

		</section>
	</section>
</template>

<script>

import api from '../../api/api'

export default{
	props: {
		item: Object,
		styleObj: Object,
		uid: String
	},

	computed: {
		time: function () {
			return formatSqlTime(this.item.ct, '.');
		}
	},

	methods: {
		toAlbum: function(index){
			if(this.uid){
				this.$router.push('/home/' + this.uid + '/album/' + this.item.ud);
			}else{
				this.$router.push('/album/' + this.item.ud);
			}
			return false;
		},

		toLikes: function(){
			this.$router.push('/likes/' + this.item.ud);
			return false;
		},

		toVisits: function(){
			this.$router.push('/visits/' + this.item.ud);
			return false;
		},

		zan: function(){
			if(this.item.ps && this.item.ps == 1){
				return false;
			}

			this.item = Object.assign({}, this.item, { ps : 1 });
			this.item.pc += 1;
			api.zanAlbum(this.item.ud);
		}
	}
}
</script>

<style scoped>
/**
 * 列表
 */
.home-list-item-vue{
	background: rgba(241,245,248,1);
}
.home-list-item-vue .inner-wrapper{
	padding: 10% 0;
	width: 80%;
	margin: 0 auto;
	position: relative;

}
.home-list-item-vue h3{
	font-size: 18px;
	color: #646464;
	position: absolute;
	top: 5%;
	left: 4%;
}
.home-list-item-vue h1{
	font-size: 12px;
	color: #646464;
	position: absolute;
	top: 11%;
	left: 4%;
}
.home-list-item-vue .cover{
	width: 100%;
	background: url(/static/photo/bg-green.png) no-repeat;
	background-size: 100% 100%;
	padding: 20%;

}
.home-list-item-vue .cover .cover-contain{
	width: 100%;
	height: 100%;
	position: relative;
}
.home-list-item-vue .cover img{
	width: 100%;
	height: 100%;
	object-fit:cover;
}
.home-list-item-vue .cover .mask{
	position: absolute;
	top: 0px;
	left: 0px;
}
.home-list-item-vue .detail{
	overflow: hidden;
	position: absolute;
	left: 4%;
	bottom: 10%;
}
.home-list-item-vue .detail .detail-item{
	font-size: 12px;
	color: #646464;
	float: left;
	margin-right: 12px;
	line-height: 16px;
}
.home-list-item-vue .detail .detail-item img{
	height: 16px;
	position: relative;
	top: 3.5px;
}
/**
 * END OF 列表
 */
</style>