<template>
	<section>
		<section class="change-vue">
			<header>
				<h2>改图片</h2>
				<a v-tap="{methods : back}"  href="javascript:void(0);">
					<img src="/static/photo/icon-arrow.png" />
				</a>
			</header>
			<h1 class="ellipsis">{{ title }}</h1>

			<section class="images">

				<section v-for="(image, index) in images" class="image" v-bind:style='imageStyle'>
					<img class='upload-item' v-bind:src="image.url" onerror="this.src='/static/photo/default.jpg'" />
					<a v-tap="{methods : del, index: index}"  href="javascript:void(0);"><img src="/static/photo/icon-close.png"></a>
				</section>
				
				<a v-if="images.length < maxUpload" v-tap="{methods : upload}" v-bind:style='imageStyle' class="btn">
					<img src="/static/photo/icon-plus.png" />
					<p>添加图片</p>
				</a>

			</section>
			<section class="bottom-btn">
				<a v-tap="{methods : confirm}"   href="javascript:void(0);">确定</a>
			</section>
		</section>

		<section v-if="isUploading" class="dialog-change-vue">
			<section class="dialog">
				<loading></loading>
				<p>{{ curUploading }} / {{ images.length }}</p>
				<label>正在上传图片</label>
			</section>
		</section>

		<section v-if="isCreating" class="dialog-create-vue">
			<section class="dialog">
				<loading></loading>
				<label>图片修改中</label>
			</section>
		</section>
	</section>
</template>

<script>

import Loading from './common/Loading.vue'
import api from '../api/api.js'


export default{
	name: 'Change',
	components: {
		'loading' : Loading
	},

	props: {
		title: String,
		photos: Array,
		uuid: String
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
			localIds: []
		}
	},

	methods: {
		back: function(){
			this.$dispatch('closeChange');
			return false;
		},

		confirm: function(){
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

			if(!localId.liu && !localId.wiu){

				wx.uploadImage({
					localId: localId.url,
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
			}else{
				
				if(localId.liu){
					that.serverIds.unshift(localId.liu);
				}else{
					that.serverIds.unshift(localId.wiu);
				}

				if(that.localIds.length > 0){
					that.uploadToWx();
				}else{
					that.isUploading = false;
					that.createAlbum();
				}
			}
		},

		createAlbum: function(){

			var that = this;
			this.isCreating = true;

			var previewImages = [];
			var uploadFormatData = [];

			$('.change-vue .upload-item').each(function(i){
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
			api.changeAlbum(this.uuid, uploadFormatData).then(function(result){
				// localStorage.setItem(SESSION_KEY_PREVIEW_ITEMS, JSON.stringify({
				// 	'title' : that.title ,
				// 	'photos' : previewImages,
				// 	'cover' : result.data.ci
				// }));
				that.$dispatch('changeFinish');
				return false;
			}, function(){
				that.isCreating = false;
			});
		},

		verify: function(){
			
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
			        	images.push({ 'url' : res.localIds[i] });
			        }
			        that.images = that.images.concat(images);
			    }
			});
		},

		del: function(index){
			this.images.splice(index,1);
		}
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

		this.images = this.photos;
	}
}

</script>

<style scoped>
.change-vue{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	z-index: 1;
}
.change-vue h1{
	font-size: 30px;
	color: #999999;
	text-align: center;
	padding-top: 60px;
}
/**
 * 顶部
 */
.change-vue header{
	height: 50px;
	font-size: 14px;
	line-height: 50px;
	color: #646464;
	position: fixed;
	width: 100%;
	border-bottom: 1px solid rgb(255,255,255);
	background: url(/static/photo/bg-main.jpg) no-repeat;
	background-size: cover;
	z-index: 1;
}
.change-vue header h2{
	padding-left: 12px;
	letter-spacing: 1px;
	width: 100%;
	border-bottom: 1px solid rgba(220,220,220,0.5);
}
.change-vue header a{
	display: block;
	width: 50px;
	height: 50px;
	position: absolute;
	right: 0px;
	top: 0px;
	line-height: 12px;
	padding: 16px;
}
.change-vue header a img{
	position: relative;
	top: 1px;
}

/**
 * END OF 顶部
 */

/**
 * 上传列表
 */
.change-vue .images{
	overflow: hidden;
	padding-top: 15px;
}
.change-vue .images .image{
	float: left;
	margin-bottom: 15px;
	position: relative;
}
.change-vue .images .image img{
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.change-vue .images .image a{
	position: absolute;
	display: block;
	width: 18px;
	height: 18px;
	right: -7px;
	top: -6px;
	-webkit-user-select:none;
	user-select:none;
}
.change-vue .images .btn{
	float: left;
	margin-bottom: 15px;
	position: relative;
	border: 1px solid rgba(153,153,153,0.5);
	border-radius: 5px;
	text-align: center;
	-webkit-user-select:none;
	user-select:none;
}
.change-vue .images .btn:active{
	background-color: rgba(153,153,153,0.4);
}
.change-vue .images .btn img{
	width: 40%;
	display: block;
	margin: 0 auto;
	padding-top: 22%;
}
.change-vue .images .btn p{
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
.change-vue .bottom-btn{
	position: fixed;
	left: 0px;
	bottom: 0px;
	background: white;
	height: 60px;
	width: 100%;
	border-top: 1px solid rgba(216,216,216,.5);
	padding-top: 10px;
}
.change-vue .bottom-btn a{
	display: block;
	width: 80%;
	height: 40px;
	margin: 0 auto;
	border: 1px solid rgba(246,77,48,0.5);
	border-radius: 5px;
	text-align: center;
	line-height: 38px;
	font-size: 18px;
	color: #f64d30;
	-webkit-user-select:none;
	user-select:none;
}
.change-vue .bottom-btn a:active{
	background-color: rgba(246,77,48,0.2);
}
/**
 * END OF 下一步
 */

/**
 * 上传中
 */

.dialog-change-vue{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.75);
	font-size: 12px;
	color: #f65e44;
	z-index: 1;
}
.dialog-change-vue .dialog{
	position: absolute;
	background: white;
	width: 50%;
	left: 25%;
	border-radius: 5px;
	top: 30%;
	text-align: center;
	padding: 20px 0;
}
.dialog-change-vue .dialog label{
	display: block;
	color: #999999;
	font-size: 12px;
	padding-top: 10px;
}
.dialog-change-vue .dialog p{
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
	z-index: 1;
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