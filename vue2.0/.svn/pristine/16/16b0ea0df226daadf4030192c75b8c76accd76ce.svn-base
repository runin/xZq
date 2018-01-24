<template>
	<transition name="bottom">
		<section class="music-vue">
			<header>
				<h2>换音乐</h2>
				<a v-tap="{methods : back}" href="javascript:void(0);">
					<img src="/static/photo/icon-arrow.png" />
				</a>
			</header>
			<section class="musics">
				<section v-for="(item, index) in items" v-tap="{methods : selectItem, index:index}"  v-bind:class="{ 'current' : item.isCurrent , 'selected' : (item.isSelected && !item.isCurrent)}" class="music">
					<section class="avatar">
						<img v-bind:src="item.avatar" onerror="this.src='/static/photo/default.jpg'" />
					</section>
					<section class="detail">
						<h3 class="ellipsis">{{ item.title }}</h3>
						<p class="ellipsis">{{ item.author }}</p>
					</section>
					<label v-if="item.isCurrent">当前</label>
					<a v-tap="{methods : confirm, item: item}" v-if="item.isSelected && !item.isCurrent" href="javascript:void(0)">使用</a>
				</section>
			</section>
		</section>
	</transition>
</template>

<script>

import api from '../api/api'

export default{
	name: 'Music',
	props: {
		musics: Array,
		music: Object
	},

	data(){
		return {
			items: []
		}
	},

	methods: {
		selectItem: function(params){
			for(var j in this.items){
				this.items[j].isSelected = false;
			}
			this.items[params.index].isSelected = true;
			this.$emit('play', this.items[params.index]);
		},

		back: function(){
			this.$emit('close');
			return false;
		},

		confirm: function(params){
			this.$emit('select', params.item);
			return false;
		},

		format: function(data){
			var items = [];
			var hasCurrent = false;
			for(var i in data){
				if(this.music && data[i].uuid == this.music.uuid){
					hasCurrent = true
				}
				items.push({
					avatar : data[i].ciurl,
					title : data[i].name,
					author : '',
					isCurrent : (this.music && data[i].uuid == this.music.uuid) ? true : false,
					isSelected : false,
					url : data[i].url,
					uuid : data[i].uuid
				});
			}
			if(!hasCurrent){
				items[0].isCurrent = true;
			}
			return items;
		}
	},
	
    beforeRouteEnter : function (to, from, next) {
        setTitle('更换音乐');
        next();
    },

	created: function(){
		this.items = this.format(this.musics);
	}
}

</script>

<style scoped>
.music-vue{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	min-height: 100%;
	background: #fafbfd;
	z-index: 101;
}
/**
 * 顶部
 */
.music-vue header{
	height: 50px;
	font-size: 14px;
	line-height: 50px;
	color: #646464;
	position: fixed;
	width: 100%;
	border-bottom: 1px solid rgb(255,255,255);
	z-index: 1;
}
.music-vue header h2{
	padding-left: 12px;
	letter-spacing: 1px;
	width: 100%;
	background: white;
	box-shadow: 0px 1px 5px rgba(66,66,66,0.3);
}
.music-vue header a{
	display: block;
	width: 50px;
	height: 50px;
	position: absolute;
	right: 0px;
	top: 0px;
	line-height: 12px;
	padding: 16px;
}
.music-vue header a img{
	position: relative;
	top: 1px;
}

/**
 * END OF 顶部
 */

/**
 * 音乐列表
 */
.music-vue .musics{
	padding-top: 50px;
	background: #fafbfd;
}
.music-vue .musics .music{
	border-top: 1px solid rgba(220,220,220,0.7);
	overflow: hidden;
	padding: 12px;
	-webkit-user-select:none;
	user-select:none;
	position: relative;
	z-index: 0;
}
.music-vue .musics .music:active{
	background-color: rgba(153,153,153,0.1);
}
.music-vue .musics .music:first-child{
	border-top: none;
}
.music-vue .musics .music .avatar{
	float: left;
	width: 60px;
	height: 60px;
}
.music-vue .musics .music .avatar img{
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.music-vue .musics .music .detail{
	margin-left: 72px;
}
.music-vue .musics .music.current .detail{
	padding-right: 26px;
}
.music-vue .musics .music.selected .detail{
	padding-right: 95px;
}
.music-vue .musics .music .detail h3{
	font-size: 16px;
	color: #646464;
	padding-top: 8px;
}
.music-vue .musics .music.selected .detail h3{
	color: #f64d30;
}
.music-vue .musics .music .detail p{
	font-size: 12px;
	color: #999999;
}
.music-vue .musics .music.selected .detail p{
	color: #f64d30;
}
.music-vue .musics .music label{
	position: absolute;
	right: 12px;
	top: 23px;
	font-size: 10px;
	color: white;
	background: #f64d30;
	border-radius: 3px;
	line-height: 18px;
	padding: 1px 2px;
}
.music-vue .musics .music a{
	position: absolute;
	right: 12px;
	top: 24px;
	display: block;
	color: #f64d30;
	font-size: 14px;
	border: 1px solid rgba(246,77,48,0.5);
	border-radius: 5px;
	width: 90px;
	line-height: 32px;
	text-align: center;
}
/**
 * END OF 音乐列表
 */
</style>