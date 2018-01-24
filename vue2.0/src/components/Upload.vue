<template>
	<section>
		<section class="upload-vue">
			<header>
				<textarea id="upload_textarea" v-bind:class="{ 'error' : emptyTips }" v-model="title" placeholder="把你的标题写在这里......">
				</textarea>
			</header>
			<section class="images">
				<section v-for="(image, index) in images" class="image" v-bind:style='imageStyle'>
					<img v-bind:src="image.src" class='upload-item' onerror="this.src='/static/photo/default.jpg'" />
					<a v-tap="{ methods : del, index: index }" href="javascript:void(0);">
						<img src="/static/photo/icon-close.png" />
					</a>
				</section>
				<a v-if="images.length < maxUpload" v-tap="{ methods : upload }"  v-bind:style='imageStyle' class="btn">
					<img src="/static/photo/icon-plus.png" />
					<p>添加图片</p>
				</a>
			</section>
			<section class="bottom-btn">
				<a v-on:click="toPreview()"  href="javascript:void(0);">下一步</a>
			</section>
		</section>

		<section v-if="isUploading" class="dialog-upload-vue">
			<section class="dialog">
				<loading></loading>
				<p>{{ curUploading }} / {{ images.length }}</p>
				<label>正在上传图片</label>
			</section>
		</section>

		<section v-if="isCreating" class="dialog-create-vue">
			<section class="dialog">
				<loading></loading>
				<label>相册创建中</label>
			</section>
		</section>

	</section>
</template>

<script>

import Loading from './common/Loading.vue'
import api from '../api/api.js'

export default{
	name: 'Upload',
	components: {
		'loading' : Loading
	},

	data(){
		return {
			maxUpload: 9,
			imageStyle: {},
			images: [],
			serverIds: [],
			isUploading: false,
			curUploading: 0,
			isCreating: false,
			title: '',
			emptyTips: false,
			localIds: []
		}
	},

	methods: {
		toPreview: function(){
			if(this.verify()){
				this.isUploading = true;
				this.localIds = this.images.concat();
				this.uploadToWx();
			}
		},

		uploadToWx: function(){
			var localId = this.localIds.pop();
			var that = this;
			this.curUploading++;
			wx.uploadImage({
				localId: localId.src,
				isShowProgressTips: false,
				success: function (res) {
					that.serverIds.unshift(res.serverId);
					if(that.localIds.length > 0){
						that.uploadToWx();
					}else{
						that.isUploading = false;
						that.createAlbum();
					}
				},
				error: function(){
					// FIX ME 微信上传失败处理
				}
			});
		},

		createAlbum: function(){
			var that = this;
			this.isCreating = true;

			var previewImages = [];
			var uploadFormatData = [];
			$('.upload-vue .upload-item').each(function(i){
				var width = $(this)[0].naturalWidth;
				var height = $(this)[0].naturalHeight;
				previewImages.push({
					url : $(this).attr('src'),
					width : width,
					height : height
				});
				uploadFormatData.push({
					media: that.serverIds[i],
					width: width,
					height: height
				});
			});

			api.createAlbum(this.title, uploadFormatData).then(function(result){
				if(result.data.code == 0){
					localStorage.setItem(SESSION_KEY_PREVIEW_ITEMS, JSON.stringify({
						'title' : that.title ,
						'photos' : previewImages,
						'cover' : result.data.ci
					}));
					that.$router.replace('preview/' + result.data.auuid);
					return false;
				}else if(result.data.code == 6){
					alert('制作相册数量到达上限，请明日再试');
					that.isCreating = false;
				}else{
					that.isCreating = false;
				}
			});
		},

		verify: function(){
			this.emptyTips = false;
			if(this.title.length <= 0){
				alert('请填写标题');
				this.emptyTips = true;
				document.getElementById('upload_textarea').focus();
				return false;
			}

			if(this.title.length >= 15){
				document.getElementById('upload_textarea').focus();
				alert('标题最多15个字');
				return false;
			}

			if(this.images.length <= 0){
				alert('请添加图片');
				return false;
			}
			return true;
		},

		upload: function(){
			var that = this;
            wx.chooseImage({
			    count: this.maxUpload - this.images.length,
			    sizeType: ['original', 'compressed'],
			    sourceType: ['album'],
			    success: function (res) {
			        var images = [];
			        for(var i in res.localIds){
			        	images.push({ 'src' : res.localIds[i] });
			        }
			        that.images = that.images.concat(images);
			    }
			});
		},

		del: function(index){
			this.images.splice(index,1);
		}
	},

	beforeRouteEnter : function (to, from, next) {
		setTitle('上传照片');
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
		}
		this.upload();
	}
}

</script>

<style scoped>
/**
 * 顶部
 */
.upload-vue header{
	padding-top: 10px;
	height: 91px;
	font-size: 30px;
	line-height: 35px;
	color: #999999;
	overflow : hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	border-bottom: 1px solid rgba(220,220,220,0.5);
	font-weight: normal;
	padding: 10px 13px 10px;
	background: white;
}
.upload-vue header h1{
	width: 9em;
	margin: 0 auto;
	text-align: left;
	letter-spacing: 1px;
}
.upload-vue header textarea{
	border: none;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	font-size: 30px;
	line-height: 35px;
	-webkit-overflow-scrolling: touch;
	resize:none;
	transition: color 1s ease;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
}

.upload-vue header textarea.error::-webkit-input-placeholder{
	color: #f64d30; 
} 
/**
 * END OF 顶部
 */

/**
 * 上传列表
 */
.upload-vue .images{
	overflow: hidden;
	padding-top: 15px;
}
.upload-vue .images .image{
	float: left;
	margin-bottom: 15px;
	position: relative;
}
.upload-vue .images .image img{
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.upload-vue .images .image a{
	position: absolute;
	display: block;
	width: 18px;
	height: 18px;
	right: -7px;
	top: -6px;
	-webkit-user-select:none;
	user-select:none;
}
.upload-vue .images .btn{
	float: left;
	margin-bottom: 15px;
	position: relative;
	border: 1px solid rgba(153,153,153,0.5);
	border-radius: 5px;
	text-align: center;
	-webkit-user-select:none;
	user-select:none;
}
.upload-vue .images .btn:active{
	background-color: rgba(153,153,153,0.4);
}
.upload-vue .images .btn img{
	width: 40%;
	display: block;
	margin: 0 auto;
	padding-top: 22%;
}
.upload-vue .images .btn p{
	font-size: 12px;
	color: #646464;
	padding-top: 3px;
}
/** 
 * END OF 上传列表
 */

/**
 * 下一步
 */
.upload-vue .bottom-btn{
	position: fixed;
	left: 0px;
	bottom: 0px;
	background: white;
	width: 100%;
	border-top: 1px solid rgba(216,216,216,.5);
	padding-top: 10px;
	padding-bottom: 9px;
}
.upload-vue .bottom-btn a{
	display: block;
	width: 40%;
	line-height: 42px;
	margin: 0 auto;
	border: 1px solid rgba(246,77,48,0.5);
	border-radius: 5px;
	text-align: center;
	font-size: 18px;
	color: #f64d30;
	-webkit-user-select:none;
	user-select:none;
}
.upload-vue .bottom-btn a:active{
	background-color: rgba(246,77,48,0.2);
}
/**
 * END OF 下一步
 */

/**
 * 上传中
 */

.dialog-upload-vue{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.75);
	font-size: 12px;
	color: #f65e44;
}
.dialog-upload-vue .dialog{
	position: absolute;
	background: white;
	width: 50%;
	left: 25%;
	border-radius: 5px;
	top: 30%;
	text-align: center;
	padding: 20px 0;
}
.dialog-upload-vue .dialog label{
	display: block;
	color: #999999;
	font-size: 12px;
	padding-top: 10px;
}
.dialog-upload-vue .dialog p{
	padding-top: 10px;
}
/**
 * END OF 上传中
 */

/**
 * 创建中
 */
.dialog-create-vue{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.75);
	font-size: 12px;
	color: #f65e44;
}
.dialog-create-vue .dialog{
	position: absolute;
	background: white;
	width: 50%;
	left: 25%;
	border-radius: 5px;
	top: 30%;
	text-align: center;
	padding: 20px 0;
}
.dialog-create-vue .dialog label{
	color: #999999;
	font-size: 12px;
	display: block;
	padding-top: 10px;
}
/**
 * END OF 创建中
 */
</style>