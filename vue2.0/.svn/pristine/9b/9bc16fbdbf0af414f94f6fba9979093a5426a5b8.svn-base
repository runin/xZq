<template>
	<section v-if="isLoaded" class="play-vue">
		<component :is="type" v-if="photos.length" v-bind:title="title" v-bind:author="author" v-bind:preview="false" v-bind:photos="photos" v-bind:tmpl="tmpl" v-on:end="playEnd" v-on:playing="hideEditBtn"></component>

		<bgm v-if="music" v-bind:music-data="music"></bgm>
		<dialog-end v-if="isEndDialogShow" v-bind:uuid="uuid" v-bind:usid="usid" v-bind:is-zan="isZan" v-bind:profiles="profiles"></dialog-end>
		<a v-if="isAuthor && !hideEdit" v-tap="{methods : toEdit}" class="edit" href="javascript:void(0)">
			<img src="/static/photo/icon-edit-white.png" />
			编辑
		</a>
		<a v-tap="{methods : zan}" href="javascript:void(0);" class="zan-icon">
			<img v-bind:src="isZan ? '/static/photo/icon-heart-active.png' : '/static/photo/icon-heart.png' " />
		</a>
		<dialog-qrcode v-if="isQrShow" v-on:close="qrClose()"></dialog-qrcode>
	</section>
</template>

<script>

import api from '../api/api'
import bgm from './Bgm.vue'
import dialogEnd from './DialogEnd.vue'
import dialogShare from './DialogShare.vue'
import dialogQrcode from './DialogQrcode.vue'

export default{
	name: 'Play',
	components: {
		'newyear' : function(resolve){require(['./tmpls/newyear.vue'], resolve)},
		'christmas' : function(resolve){require(['./tmpls/christmas.vue'], resolve)},
		'huaqiangu' : function(resolve){require(['./tmpls/huaqiangu.vue'], resolve)},
		'tour' : function(resolve){require(['./tmpls/tour.vue'], resolve)},
		'train' : function(resolve){require(['./tmpls/train.vue'], resolve)},
		'travel': function(resolve){require(['./tmpls/travel.vue'], resolve)},
		'yaqu': function(resolve){require(['./tmpls/yaqu.vue'], resolve)},
		'dad': function(resolve){require(['./tmpls/dad.vue'], resolve)},
		'paonan': function(resolve){require(['./tmpls/paonan.vue'], resolve)},
		'young': function(resolve){require(['./tmpls/young.vue'], resolve)},
		'bgm': bgm,
		'dialog-end': dialogEnd,
		'dialog-share': dialogShare,
		'dialog-qrcode': dialogQrcode
	},

	data(){
		return {
			isLoaded: false,
			uuid: null,
			btnStyle: {},
			imageStyle: {},
			images: [],
			photos: [],
			music: null,
			tmpl: null,
			type: 'travel',
			detail: null,
			profiles: null,
			usid: null,
			isZan: false,
			isAuthor: false,
			title: null,
			author: null,
			hideEdit: false,

			shareTitle: '',
			shareDesc: '',

			isEndDialogShow: false,
			isQrShow: false
		}
	},

	methods: {
		hideEditBtn: function(){
			this.hideEdit = true;
		},

		playEnd: function(){
			this.isEndDialogShow = true;
		},

		init: function(result){
        	this.photos = result.photos.photos;
			this.initTmplAndMusic(result.detail.tu, result.detail.mu);
			this.initShare(result.detail.tt, result.detail.nn, result.detail.ptc, result.detail.ci, result.detail.ct);
			this.title = result.detail.tt;
			this.author = result.detail.nn;
			this.detail = result.detail;
			setTitle(result.detail.tt);
			this.profiles = result.profiles.data;
			this.usid = result.detail.usid;
			this.isZan = (result.detail.ps == 1) ? true : false;
			this.isAuthor = (result.detail.usid == window.uid) ? true : false;
        },

        initShare: function(title, nickname , num, ci, time){
			var that = this;
			wx.onMenuShareAppMessage({
			    title: that.replaceData(that.shareTitle, title, nickname, num, time),
			    desc: that.replaceData(that.shareDesc, title, nickname, num, time),
			    link: location.origin + location.pathname + '#/play/' + this.uuid,
			    imgUrl: ci,
			    success: function(){
			    	that.isQrShow = true;
			    	api.share(that.uuid);
			    }
			});

			wx.onMenuShareTimeline({
			    title: that.replaceData(that.shareTitle, title, nickname, num, time),
			    link: location.origin + location.pathname + '#/play/' + this.uuid,
			    imgUrl: ci,
			    success: function () {
			        api.share(that.uuid);
			    }
			});

			wx.showMenuItems({
			    menuList: ['menuItem:share:timeline']
			});
		},

		qrClose: function(){
			this.isQrShow = false;
		},

		replaceData: function(text, title, name, num, time){
			if(text){
				return text.replace(/@title/g, title).replace(/@name/g, name).replace(/@number/, num).replace(/@date/g, formatSqlTime(time, '.'));
			}else{
				return title;
			}

		},

        initTmplAndMusic: function(tu, mu){
        	var tmpls = sessionStorage.getItem(SESSION_KEY_TMPLS);
        	var tmplMusic = null;
        	if(tmpls && tmpls.length > 0){
        		var tmpls = this.tmpls = JSON.parse(tmpls);
        		for(var i in tmpls){
        			if(tu && tu != ''){
        				if(tmpls[i].uuid == tu){
	        				this.tmpl = tmpls[i];
	        				tmplMusic = tmpls[i].bgmUuid;
	        				break;
	        			}
        			}else{
        				if(tmpls[i].isde == 1){
	        				this.tmpl = tmpls[i];
	        				tmplMusic = tmpls[i].bgmUuid;
	        				break;
	        			}
        			}
        		}
        	}
        	// 默认音乐
        	var musics = sessionStorage.getItem(SESSION_KEY_MUSICS);
        	if(musics && musics.length > 0){
        		var musics = this.musics = JSON.parse(musics);
        		for(var i in musics){
        			if(mu && mu != ''){
        				if(musics[i].uuid == mu){
	        				this.music = musics[i];
	        				break;
	        			}
        			}else{
        				if(tmplMusic && tmplMusic!= ''){
	        				// 使用主题配套音乐
	        				if(musics[i].uuid == tmplMusic){
		        				this.music = musics[i];
		        				break;
		        			}
	        			}else{
	        				// 如没有，使用默认音乐
	        				if(musics[i].isde == 1){
		        				this.music = musics[i];
		        				break;
		        			}
	        			}
        			}
        		}
        	}

        	this.type = this.tmpl.url;
        	this.shareTitle = this.tmpl.wxstt;
        	this.shareDesc = this.tmpl.wxsdt;
		},

		toEdit: function(){
			this.$router.push('/preview/' + this.uuid);
		},

		zan: function(){
			this.isZan = true;
			api.zanAlbum(this.uuid);
		}
	},

    beforeRouteEnter : function (to, from, next) {
        setTitle('');
        next();
    },

    beforeRouteLeave : function (to, from, next) {
        this.isLoaded = false;
    	eventHub.$emit('stopMusic');
    	next();
    },

	created: function(){
		var imageRatio = 0.25;
		var width = $(window).width();
		this.imageStyle = {
			'height': width * imageRatio + 'px',
			'width' : width * imageRatio + 'px',
			'margin-left': width * ( 1 - imageRatio * 3 ) / 6 + 'px',
			'margin-right': width * ( 1 - imageRatio * 3 ) / 6 + 'px'
		};

		this.uuid = this.$route.params.id;
		var that = this;
    	this.uuid = this.$route.params.id;
    	api.getAllPlayData(this.uuid).then(function(result){
    		that.init(result);
    		that.isLoaded = true;
    	});
	}
}

</script>

<style scoped>
.play-vue{
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
}
/**
 * 编辑按钮
 */
.play-vue .edit{
	width: 80px;
	height: 32px;
	line-height: 32px;
	background: rgba(0,0,0,0.5);
	border-radius: 3px;
	color: white;
	position: fixed;
	left: 12px;
	top: 16px;
	text-align: center;
	font-size: 14px;
	z-index: 10;
}
.play-vue .edit img{
	width: 14px;
	margin-top: 8px;
}
/**
 * END OF 编辑按钮
 */

/**
 * 点赞
 */
.play-vue .zan-icon{
	position: fixed;
	width: 40px;
	height: 40px;
	padding:6px;
	bottom: 5%;
	right: 12px;
	z-index: 19;
}
/**
 * END OF 点赞
 */
</style>
