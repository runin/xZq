<template>
	<section v-if="isLoaded" class="album-vue" v-bind:style="coverWrapperStyle">
		<a v-if="!uid" v-tap="{methods : more}" class="more-btn edit-btn" href="javascript:void(0)">
			<img v-bind:src="isMoreShow ? '/static/photo/icon-arrow-top-grey.png' : '/static/photo/icon-arrow-grey.png' "  />
		</a>
		<section v-if="isMoreShow" transition="fade" class="more">
			<a v-tap="{methods : toEdit}" class="edit edit-btn" href="javascript:void(0)">
				<img src="/static/photo/icon-edit.png" />
			</a>
			<a v-tap="{methods : toDel}"  class="edit edit-btn" href="javascript:void(0)">
				<img src="/static/photo/icon-delete.png" />
			</a>
		</section>
		<section class="cover" v-bind:style="coverStyle">
			<section class="cover-inner" v-bind:style="coverImgStyle">
				<img v-bind:src="info.ci" onerror="this.src='/static/photo/default.jpg'" />
			</section>
		</section>
		<h1>{{ info.tt }}</h1>
		<a  v-tap="{methods : toPlay}" class="play" href="javascript:void(0)">
			<img src="/static/photo/icon-play.png" />
			播放相册
		</a>
		<section class="bottom">
			<section class="nums">
				<span>{{ time }}</span>
				<span>{{ info.ptc ? info.ptc : 0 }}个瞬间</span>
				<span>访客{{ info.vc ? info.vc : 0 }}</span>
			</section>
			<section class="icons">
				<a v-tap="{methods : zan}"  href="javascript:void(0)">
					<img v-bind:src="info.ps == 1 ? '/static/photo/icon-heart-active.png' : '/static/photo/icon-heart.png'" />
				</a>
				<section class="avatars">
					<img v-for="zan in zanList" v-bind:src="zan.nickname" onerror="this.src='/static/photo/default.jpg'" />
				</section>
			</section>
		</section>
		<dialog-del v-bind:is-show="isDeleteShow" v-on:cancel="delCancel" v-on:confirm="delConfirm"></dialog-del>
	</section>
</template>

<script>

import api from '../api/api'
import DialogDel from '../components/DialogDel.vue'

export default{
	name: 'Album',
	components: {
		'dialog-del' : DialogDel
	},

	data(){
		return {
			auuid: null,
			avatar: null,
			nickname: '匿名',
			itemStyle: {},
			coverStyle: {},
			coverImgStyle: {},
			coverWrapperStyle: {},
			isLoaded: false,
			info: null,
			zanList: [],
			isMoreShow: false,
			isDeleteShow: false
		}
	},

	computed: {
		time: function () {
			return formatSqlTime(this.info.ct, '/');
		}
	},

	methods: {
		toPlay: function(){
			this.$router.push('/play/' + this.info.ud);
			return false;
		},

		toEdit: function(){
			this.$router.push('/preview/' + this.info.ud);
			return false;
		},

		toDel: function(){
			this.isDeleteShow = true;
		},

		more: function(){
			if(this.isMoreShow){
				this.isMoreShow = false;	
			}else{
				this.isMoreShow = true;
			}
		},

		zan: function(){
			this.info.ps = 1;
			api.zanAlbum(this.auuid);
		},

		getZanList: function(){
			var that = this;
			api.getLastZanList(that.auuid).then(function(result){
				that.zanList = result.data.pfriends;
				that.isLoaded = true;
			}, function(){
				that.isLoaded = true;
			});
		},

		delCancel: function(){
			this.isDeleteShow = false;
		},

		delConfirm: function(){
			var that = this;
			api.delAlbum(this.auuid).then(function(){
				sessionStorage.setItem(SESSION_KEY_DELETE_ALBUM_IDS + that.auuid, true);
				that.isDeleteShow = false;
				history.back();
			}, function(){
				that.isDeleteShow = false;
				alert('网络不给力，请稍后重试');
			});
		}
	},

	beforeRouteEnter : function (to, from, next) {
        setTitle('我的相册');
        next();
    },

    beforeRouteLeave : function (to, from, next) {
        this.isLoaded = false;
        next();
    },

	created: function(){
		var width = $(window).width();
		var height = $(window).height();
		var coverHeight = height - 20 - 80 - 110 - height * 0.15;
		this.coverStyle = {
			'height' : coverHeight + 'px',
			'margin-bottom' : height * 0.05 + 'px'
		}

		this.coverImgStyle = {
			'width' : coverHeight * 0.5 + 'px',
			'height' : coverHeight * 0.5 + 'px',
			'margin-top' : coverHeight * 0.25 + 'px',
			'margin-left' : (width - coverHeight * 0.5)/2 + 'px'
		}

		this.coverWrapperStyle = {
			'padding-top' : height * 0.1 + 'px'
		}


		var that = this;
        this.auuid = this.$route.params.id;
        this.uid = this.$route.params.uid;
        if(this.uid){
        	api.getFriendAlbumDetailByUid(this.auuid).then(function(result){
				that.info = result.data;
				that.getZanList();
			});
        }else{
        	api.getAlbumDetail(this.auuid).then(function(result){
				that.info = result.data;
				that.getZanList();
			});
        }
	}
}

</script>

<style scoped>
/**
 * 封面
 */
.album-vue .cover{
	background: url(/static/photo/bg-green-open.png) no-repeat center;
	background-size: auto 100%;
	text-align: center;
	position: relative;
}
.album-vue .cover img{
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.album-vue .cover-inner{
	position: absolute;
}
/**
 * END OF 封面
 */

/**
 * 标题
 */
.album-vue h1{
	text-align: center;
	font-size: 18px;
	height: 20px;
	color: #646464;
}
/**
 * END OF 标题
 */

/**
 * 播放按钮
 */
.album-vue .play{
	display: block;
	width: 50%;
	height: 40px;
	line-height: 40px;
	margin: 20px auto 30px;
	border: 1px solid rgba(246, 77, 48, 0.5);
	color: #f64d30;
	text-align: center;
	font-size: 16px;
	border-radius: 5px;
}
.album-vue .play:active{
	background: rgba(247, 77, 48, 0.2);
}
.album-vue .play img{
	height: 20px;
	margin-top: 10px;
}
/**
 * END OF 播放按钮
 */

/**
 * 底部
 */
.album-vue .bottom{
	height: 110px;
	border-top: 1px solid rgba(220,220,220,0.5);
	padding: 10px 10%;
}
.album-vue .bottom .nums{
	overflow: hidden;
	padding-bottom: 10px;
}
.album-vue .bottom .nums span{
	display: block;
	width: 33.33%;
	float: left;
	text-align: center;
	font-size: 12px;
	color: #646464;
}
.album-vue .bottom .nums span:first-child{
	text-align: center;
}
.album-vue .bottom .nums span:last-child{
	text-align: right;
}
.album-vue .bottom .icons{
	overflow: hidden;
}
.album-vue .bottom .icons a{
	width: 33.33%;
	float: left;
	text-align: center;
}
.album-vue .bottom .icons a img{
	width: 32px;
	height: 32px;
}
.album-vue .bottom .icons .avatars{
	width: 66.67%;
	float: left;
	overflow: hidden;
	height: 32px;
}
.album-vue .bottom .icons .avatars img{
	display: block;
	float: left;
	width: 32px;
	height: 32px;
	object-fit: cover;
	border-radius: 50%;
	margin: 0 5px;
}
/**
 * END OF 底部
 */

/**
 * 编辑按钮
 */
.album-vue .edit-btn{
	display: block;
	width: 40px;
	height: 40px;
	background: rgba(0,0,0,0.7);
	border-radius: 100%;
	padding: 8px;
}
.album-vue .more-btn{
	position: fixed;
	top: 12px;
	right: 12px;
	background: rgba(0,0,0,0.5);
}
.album-vue .more-btn:active{
	background-color: rgba(0,0,0,0.7);
}
.album-vue .more-btn img{
	position: relative;	
	top: 1px;
}
.album-vue .more{
	position: fixed;
	right: 12px;
	top: 52px;
	width: 40px;
	z-index: 1;
}
.album-vue .more a{
	margin-top: 10px;
}
/**
 * END OF 编辑按钮
 */
</style>