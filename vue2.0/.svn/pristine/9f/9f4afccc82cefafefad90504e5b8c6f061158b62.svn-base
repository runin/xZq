<template>
	<section>
		<section v-if="isLoaded" class="preview-vue">
			<component :is="type" v-if="photos.length" v-bind:author="author" v-bind:title="title" v-bind:preview="true" v-bind:photos="photos" v-bind:tmpl="tmpl"></component>
			<section class="btns">
				<a v-tap="{methods : toTmpl}" href="javascript:void(0)">
					<img src="/static/photo/icon-change-theme.png" />
				</a>
				<a v-tap="{methods : toMusic}"  href="javascript:void(0)">
					<img src="/static/photo/icon-change-music.png" />
				</a>
				<a v-if="canChange" v-tap="{methods : toChange}" href="javascript:void(0)">
					<img src="/static/photo/icon-change-pic.png" />
				</a>
				<a v-tap="{methods : save}" class="save" href="javascript:void(0)">保存</a>
			</section>
			<bgm v-if="music && !bgmIconHide" v-bind:music-data="music"></bgm>
		</section>
		<tmpl v-if="isTmplShow" v-bind:tmpls="tmpls" v-bind:tmpl="tmpl" v-on:close="tmplClose" v-on:select="tmplSelect"></tmpl>
		<music v-if="isMusicShow" v-bind:musics="musics" v-bind:music="music" v-on:close="musicClose" v-on:select="musicSelect" v-on:play="musicPlay"></music>
		<dialog-share v-if="isShareShow" v-on:close="shareClose()"></dialog-share>
		<dialog-qrcode v-if="isQrShow" v-on:close="qrClose()"></dialog-qrcode>
	</section>
</template>

<script>

import moment from 'moment'
import api from '../api/api'
import bgm from './Bgm.vue'
import Tmpl from './Tmpl.vue'
import Music from './Music.vue'
import Change from './Change.vue'
import dialogEnd from './DialogEnd.vue'
import dialogShare from './DialogShare.vue'
import dialogQrcode from './DialogQrcode.vue'

export default{
	name: 'Preview',
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
		'tmpl': Tmpl,
		'music': Music,
		'change': Change,
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
			isTmplShow: false,
			isMusicShow: false,
			isChangeShow: false,
			musics: null,
			tmpls: null,
			title: null,
			author: null,
			canChange: false,

			shareTitle: '',
			shareDesc: '',

			bgmIconHide: false,
			isShareShow: false,

			isQrShow: false
		}
	},

	methods: {
		toUpload: function(){
			this.$router.push('/upload');
			return false;
		},

		toTmpl: function(){
			this.isTmplShow = true;
			return false;
		},

		toMusic: function(){
			this.isMusicShow = true;
			return false;
		},

		toChange: function(){
			var that = this;
			that.isChangeShow = true;

			return false;
		},

		navTo: function(url){
			this.$router.push(url);
			return false;
		},

		save: function(){
			var that = this;
			api.saveAlbum(this.uuid).then(function(result){
				that.isShareShow = true;
				that.bgmIconHide = true;
			}, function(){
				// FIX ME 发布失败
			});
		},

		initTmplAndMusic: function(tu, mu){
			//  默认主题
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


			wx.hideMenuItems({
			    menuList: ['menuItem:share:timeline']
			});
		},

		replaceData: function(text, title, name, num, time){
			if(text){
				var result = text.replace(/@title/g, title).replace(/@name/g, name).replace(/@number/, num);
				if(time){
					result = result.replace(/@date/g, formatSqlTime(time, '.'));
				}else{
					result = result.replace(/@date/g, moment().format("YYYY.MM.DD"));
				}
				return result;
			}else{
				return title
			}

		},

		initStorageData: function(){
			var previewDatas = localStorage.getItem(SESSION_KEY_PREVIEW_ITEMS);

        	if(previewDatas && previewDatas.length > 0){
        		var datas = JSON.parse(previewDatas);
        		this.photos = datas.photos;
        		this.initTmplAndMusic();
        		this.initShare(datas.title, window.nickname, datas.photos.length, datas.cover, null);
        		this.title = datas.title;
        		this.author = window.nickname;
        	}
		},

		init: function(result){
			this.photos = result.photos.photos;
			this.initTmplAndMusic(result.detail.tu, result.detail.mu);
			this.initShare(result.detail.tt, result.detail.nn, result.detail.ptc, result.detail.ci, result.detail.ct);
			this.title = result.detail.tt;
			this.author = result.detail.nn;
		},

		shareClose: function(){
			this.isShareShow = false;
			this.bgmIconHide = false;
		},

		qrClose: function(){
			this.isQrShow = false;
		},

		tmplClose: function(){
			this.isTmplShow = false;
		},

		tmplSelect: function(tmplObj){
			this.type = tmplObj.url;
			this.tmpl = tmplObj;
			this.isTmplShow = false;
			api.updateTmpl(this.uuid, tmplObj.uuid);
		},

		musicClose: function(){
			this.isMusicShow = false;
		},

		musicSelect: function(musicObj){
			this.isMusicShow = false;
			this.music = musicObj;
			api.updateMusic(this.uuid, this.music.uuid);
		},

		musicPlay: function(musicObj){
			eventHub.$emit('updateMusic', musicObj);
		}
	},

	beforeRouteEnter : function (to, from, next) {
        setTitle('相册预览');
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

		var that = this;

		var that = this;
    	this.uuid = this.$route.params.id;
    	api.getAllPreviewData(this.uuid).then(function(result){
    		// 已上架
    		that.init(result);
    		that.isLoaded = true;
    		transition.next();
    	}, function(){
    		// 未上架
    		that.initStorageData();
    		that.isLoaded = true;
    		transition.next();
    	});
	}
}

</script>

<style scoped>

/**
 * 底部按钮
 */
.preview-vue{
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
}
.preview-vue .btns{
	position: fixed;
	bottom: 0px;
	width: 100%;
	padding: 12px;
	z-index: 100;
}
.preview-vue .btns a{
	display: block;
	float: left;
	width: 45px;
	height: 45px;
	border-radius: 45px;
	background: rgba(0,0,0,0.7);
	padding: 7px;
	margin-right: 12px;
}

.preview-vue .btns a.save{
	background: rgba(255,255,255,0.7);
	border: 1px solid rgba(246,77,48,0.5);
	color: rgb(246,77,48);
	font-size: 16px;
	text-align: center;
	line-height: 43px;
	padding: 0;
	float: right;
	margin: 0px;
}
.preview-vue .btns a.save:active{
	background: #ff7c65;
	color: white;
}
/**
 * END OF 底部按钮
 */
</style>
