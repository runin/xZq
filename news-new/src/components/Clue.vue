<template>
	<section class="clue-vue" :style="clueStyle">
		<head-nav v-bind:item="hitem"></head-nav>
		<div class="wrapper" v-bind:style="wrapperStyle">
			<div class="mask" v-if="isShow">
				<div class="content">
					<p>为保证新闻线索真实性</p>
					<p>请在微信中打开该页面进行操作</p>
					<p>感谢您的理解</p>
				</div>
			</div>
			<h1>请您写下新闻线索:</h1>
			<textarea class="content" id="content" placeholder="" v-model="content"></textarea>
			<section class="upload">
				<section v-for="(image, index) in images" class="item-wrapper">
					<div class="item"><img :src="image" /></div>
					<a v-tap="{ methods : delImage, index: index }" href="javascript:void(0);">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAA3NCSVQICAjb4U/gAAAA/FBMVEX///9mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmb////7+/v5+fn39/fz8/Px8fHt7e3r6+vp6enn5+fk5OTi4uLh4eHg4ODd3d3b29vZ2dnX19fT09PR0dHPz8/MzMzJycnGxsbFxcXDw8PBwcG+vr69vb27u7u5ubm3t7ezs7OxsbGvr6+qqqqjo6OhoaGfn5+ZmZmTk5ORkZGPj4+Ojo6Li4uIiIiFhYWCgoKBgYF+fn58fHx6enp4eHh2dnZ0dHRycnJwcHBvb29sbGxqampmZmZiYmJgYGBeXl5cXFxaWlpYWFhWVlZUVFQuqMf3AAAAVHRSTlMAESIzRFVmd4iZqrvM3e7///////////////////////////////////////////////////////////////////////////////////////////8yVYPWAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAA9pJREFUWIXNmGlb00AQx0mPNCdpATlUyiGVwwMREbWCHALS7NX6/b+LadNtdvbIUXwenZfdZ3/9z87szGQXFv6FWVYtMcv6G6i67fpBuBgnthgGntOsPYFWs70JCVrgNuaT2tTRUgudelWaZQcmWmpeoxLPDvNxE2R5lY0CddzckmfplMMlFjZL4Ool5aXmFPKaxtDqzS9w266GSyzMzfRWZV5ygXKiPQ8vj1jd39RMXjfn5CXXWxuZGowvqkL0dECQf4gRSo37EaMM/mFL5YH7gfHZbu9iaOBhcrp3MiDgNyUwdbCDHkZR1OnriZgeJatbMfAgyHMY04NobG0tEZN0tQuJtjljOE9PxLg3XYXERRBpS6h/CHOezmuC9mar3QEWVhyTQPYpykzWSNCusLpHhFgDiWKBZj1hi6SRxNviYnQvShRSB9yR4TuwR9RIB1tgbXkgZmOYAT3g1VUH7Mo00sdNsBKdMXAes/otXTrWb2s1sl/PIe/jEF6X2QWUq8xQInb6I4TQ8H4d8k4kXhYWLy4gtr9Ryq7XIO+DzIvjaa+21DYy7MNzjLq9Hfgf0XuVx1OxrizE8UgmyvaWaepboD9CrdeSHep4/BBdHVD1WrR9irWb0iLma9fyNPaInjfNRNOoYNT4Cht46e2zjJOWgbhj5KVh1mQNt9G5hrcdE+OGyV2pGZeTZrSr8Do/zc2rEBiPjhXgel6D9QuB+wpwZWA8wWKF7HZZPcOz3wVAc1DY3ZrKG9ceI9BV6n8xz9RdJ+bkJTa7W9XyzBMAb85KOczVl6sxLYjaqT+PZ9ZYU3teKZ5J47TvafJG5W1ICaSNNe9SSlSUeCx9xY8HMlHVyFu9XGEVfUsXI0TYm0Kv+ZDYgD9TWd/yj/FWVEjMRgeQ2vhB0rdylW5UiZew8GTzF0gcdgS3PbvmQhTiSwQqTzYWi40UEThgrd5mA4xCvBFrrZ8NS6BPsWNxy9qdOBBJxFUwfYnfumJY8KCbbdl4gAMWIC5diWcIx3ZRIolnxBePcr0XiO3vIMrwYxyMI5QTNxWeSPwC7oq/AA0k95QofYpIxM/w7slfPrA708FO1H5t6JeIHnei9imcvtS3AnhdMLq8McwvY42359cU8EKFJ5dFREhOuyRMEq/9BvfNgCKzdbycIafITI8ttYpPLNxcAy/JxrmI2s95TpzDa7O+ideVHqrGVvRYZem7tNH08QVW5TUoKPWGWPdLu1v2MdYuFW2/wkOs5RQigzKPkSKylZtBfkXcxIzvzkH1V2cus+kEEjT0WvPSOLTebDme53ue69iNpzzc/y/2B7sPHF9+7MVCAAAAAElFTkSuQmCC" />
					</a>
				</section>
				<a v-if="images.length < maxUpload" v-tap="{ methods : addPic }"  class="btn">
					<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAMAAAArDjJDAAAAA3NCSVQICAjb4U/gAAAAS1BMVEX///9mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmb////o6Ojg4ODGxsa9vb2qqqqgoKCVlZWKiopmZmb0ZByQAAAAGXRSTlMAESIzRFVmd4iZqrvM3e7/////////////oVaodwAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAG0SURBVFiFrZjbmsIgDIShWlosy3pYlfd/0i3WVq0cBjpzuYv/l6QJJBEiIblXejDWOmd/zKDVXqZOx9V0g/vS0DWlHKnMN2eSUSW2Nb2Ngbxsj5omdYozSUOWqaRFi2Uq71s0RmuZjJctZNLTsDZF6nGQVx8FyUMZaUyzSPRlICUrWRWkkRUiFXs36fBNAvIyLL0mtbUk51bJ2hTk01r2M1fhHA/JvJPUFtKHi3KDe172lV3VX2/W8hWbrSTn5sgXFnFIPSdSXs9o5T/f+XQ6Z44oLKduv6Nu6TMGCzqCegS+46A66JqCUP7iypIwlBNix0LtkErGUAqpPwylkccBQw3IpYehjAAKEENZJiryj7GCFx096vj2h7/gTyKohyFRncKosIMVqFisqlCRZCiPlWGmKLFwiOVMvGSIVx/zQiY+E8THi/ik5tMBQSms/QBQc7OWa4ruHnVPHpmnnWzgr5fLNX1iaZJ5DSSzrSU228wRgDmYEMcl5hDHHC2ZAy9zDK/wMejdJNrKQjAXKcz1zqgOWzp1WZBgrsK8lzq9oNMlu0Pa2nAyjbTMfNr2WrHa/Ir1H2REheaMieWDAAAAAElFTkSuQmCC" />
				</a>

			    <form id="upload-form" class="upload-form none" enctype="multipart/form-data" method="post">
			        <input type="file" id="file-upload" @change="onFileChange" accept="image/*" capture>
			    </form>
			</section>
			<h1>请您留下联系方式:</h1>
			<input type="text" id="name" placeholder="姓名" v-model="name">
			<input type="tel" id="tel" placeholder="手机号" v-model="tel">
			<a href="javascript:void(0);" class="btn-clue" v-tap="{ methods : commitClue }">提交线索</a>
			<div class="freeNo">
				<span>请遵守</span><a href="javascript:void(0);" v-tap="{ methods : showRule }">《河南新闻》用户协议</a>
			</div>
		</div>
		<div class="bg"></div>
		<foot-nav></foot-nav>
		<div class="rule" v-if="isRuleShow">
			<a href="javascript:void(0);" class="ruleClose" v-tap="{ methods : ruleClose }"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAACJSURBVDiNrdVBCsAgDETR0KuL6CHtWX43FayoiaaCIDp5qwEFKEAExLkjUOoBIDmw9BqxXmQHWrEMSPtwgn6wHtxF0yg7ClrQITYDNXSKrcAZusQ0sEdVzAK2qIoBcom+MGSatL0apkrt9kxFt3umobuYip5gS/QUm854sOGsAMGB9WgQ/v0C7gdzfLr+8RRctgAAAABJRU5ErkJggg=="></a>
			<div class="ruleWrap">
				<p></p>
				<p style="font-size:16px;text-align:center;font-weight:bold;">《河南新闻》用户协议</p>
				<p style="text-indent: 24px;">关于河南广播电视台及本协议：河南广播电视台在此特别提醒用户认真阅读本《河南新闻用户协议》（下称《协议》）。用户应认真阅读本协议中各条款，包括免除或者限制河南广播电视台责任的免责任条款及对用户的权利限制。如您未满18周岁，请在法定监护人的陪同下阅读本协议，并特别注意未成年人使用条款。</p>
				<p style="text-indent: 24px;">1、一切移动客户端用户在下载并浏览APP软件时均被视为已经仔细阅读本条款并完全同意。凡以任何方式登陆本APP，或直接、间接使用本APP资料者，均被视为自愿接受本网站相关声明和用户服务协议的约束。</p> 
				<p style="text-indent: 24px;">2、手机APP转载的内容并不代表手机APP之意见及观点，也不意味着本网赞同其观点或证实其内容的真实性。
				<p style="text-indent: 24px;">3、手机APP转载的文字、图片、音视频等资料均由本APP用户提供，其真实性、准确性和合法性由信息发布人负责。APP手机APP不提供任何保证，并不承担任何法律责任。 </p>
				<p style="text-indent: 24px;">4、手机APP所转载的文字、图片、音视频等资料，如果侵犯了第三方的知识产权或其他权利，责任由作者或转载者本人承担，本APP对此不承担责任。 </p>
				<p style="text-indent: 24px;">5、手机APP不保证为向用户提供便利而设置的外部链接的准确性和完整性，同时，对于该外部链接指向的不由手机APP实际控制的任何网页上的内容，手机APP不承担任何责任。 </p>
				<p style="text-indent: 24px;">6、用户明确并同意其使用手机APP网络服务所存在的风险将完全由其本人承担；因其使用手机APP网络服务而产生的一切后果也由其本人承担，手机APP对此不承担任何责任。 </p>
				<p style="text-indent: 24px;">7、除手机APP注明之服务条款外，其它因不当使用本APP而导致的任何意外、疏忽、合约毁坏、诽谤、版权或其他知识产权侵犯及其所造成的任何损失，APP手机APP概不负责，亦不承担任何法律责任。</p> 
				<p style="text-indent: 24px;">8、对于因不可抗力或因黑客攻击、通讯线路中断等手机APP不能控制的原因造成的网络服务中断或其他缺陷，导致用户不能正常手机APP，手机APP不承担任何责任，但将尽力减少因此给用户造成的损失或影响。</p> 
				<p style="text-indent: 24px;">9、本声明未涉及的问题请参见国家有关法律法规，当本声明与国家有关法律法规冲突时，以国家法律法规为准。 </p>
				<p style="text-indent: 24px;">10、本网站相关声明版权及其修改权、更新权和最终解释权均属手机APP所有。 </p>
			</div>
		</div>
	</section>
</template>

<script>

import config from '../assets/config.js'
import FootNav from './common/FootNav.vue'
import HeadNav from './common/HeadNav.vue'

export default{
	name: 'clue',
	components: {
		'foot-nav' : FootNav,
		'head-nav' : HeadNav
	},

	data(){
		return {
			eu: null,
			images: [],
			imagesUrl: [],
			maxUpload: 3,
			clueStyle: {},
			wrapperStyle: {},
			content: '',
			name: '',
			tel: '',
			isShow: false,
			hitem: {t: '新闻线索', s: 0},
			isRuleShow: false
		}
	},

	mounted() {
		// document.querySelector('.clue-vue').addEventListener('touchmove',function(e){e.preventDefault()},false);
		setTitle(news_title || '视听中原');
		this.initShare('新闻线索-' + news_title);
		
		if (isWeixin()) {
			this.isShow = false;
		} else {
			if ($.fn.cookie('useId') == 'holdfun') {
				this.isShow = false;
			} else {
				this.isShow = true;
			}
		}
	},

	methods: {
		addPic: function() {
			$('input[type=file]').trigger('click');
		},
        initShare: function( title ){
			var _this = this;
			wx.onMenuShareAppMessage({
			    title: title,
			    desc: '视听中原，全媒体新闻平台',
			    link: location.origin + location.pathname + '#/' + _this.eu + '/clue',
			    imgUrl: window.news_logo,
			    success: function(){
			    }
			});

			wx.onMenuShareTimeline({
			    title: title,
			    link: location.origin + location.pathname + '#/' + _this.eu + '/clue',
			    imgUrl: window.news_logo,
			    success: function () {
			    }
			});
		},
		onFileChange: function(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length)return;
			this.createImage(files);
		},
		createImage: function(file) {
			var _this = this;
			if(typeof FileReader === 'undefined'){
				alert('当前浏览器不支持图片上传');
				return false;
			}
			var image = new Image();
			for(var i = 0; i < file.length; i++){
				var reader = new FileReader();
				reader.readAsDataURL(file[i]);
				reader.onload =function(e){
					_this.images.push(e.target.result);
					_this.uploadImage();
				};
			};
		},
		delImage: function(result) {
			// console.log(result);
			this.images.splice(result.index, 1);
			if (this.imagesUrl[result.index]) this.imagesUrl.splice(result.index, 1);
		},
		removeImage: function() {
			this.images = [];
		},
		uploadImage: function(ret) {
			var _this = this;
			var $file_upload = document.getElementById('file-upload');
			var img = $file_upload.files[0];
			var fd = new FormData();
			fd.append('file', img);
			fd.append("uu", openid);
			fd.append("uc", matk);
			fd.append("eu", news_eu);
			fd.append("cb", "callbackUpload");

			var xhr = new XMLHttpRequest();
			xhr.addEventListener("load", function(evt) {
				// console.log(evt);
			    if (evt.target && evt.target.responseText) {
					var data = $.parseJSON(evt.target.responseText.replace('callbackUpload(','').replace(');',''));
					if (data.code == 0 && data.filePath) {
		            	_this.imagesUrl.push(data.filePath);
					} else {
						alert("上传失败，请稍后再试");
					}
			    }
			}, false);
			if (fd == 0) return;
			xhr.addEventListener("error", function() {
			    alert('上传出错，单张图片大小不能超过5M');
			}, false);
			xhr.addEventListener("abort", function() {
			    alert("上传已取消");
			}, false);
			xhr.open('POST', config.host + config.upload);
			xhr.send(fd);
		},
		check: function() {
			var _this = this;
			var content = $.trim(_this.content);
			var name = $.trim(_this.name);
			var tel = $.trim(_this.tel);
			if (content.length == 0) {
				alert('还没有填写新闻线索');
				$('#content').focus();
				return false;
			} else if (content.length > 600) {
				alert('输入不能超过600字');
				$('#content').focus();
				return false;
			}
			if (name.length == 0) {
				alert('您还没有提供联系方式');
				$('#name').focus();
				return false;
			} else if (name.length > 20) {
				alert('输入不能超过20字');
				$('#name').focus();
				return false;
			}
			if (tel.length == 0) {
				alert('您还没有提供联系方式');
				$('#tel').focus();
				return false;
			} else if (!/^1\d{10}$/.test(tel)) {
				alert('请正确输入11位手机号码');
				$('#tel').focus();
				return false;
			}
			return true;
		},
		commitClue: function() {
			var _this = this;
			if (_this.check()) {
				_this.$http.jsonp(config.host + config.clueSave, {
					params: {
						uu: $.fn.cookie('uu') ? $.fn.cookie('uu') : openid,
						uc: $.fn.cookie('uc') ? $.fn.cookie('uc') : matk,
						eu: news_eu,
						ct: encodeURIComponent(_this.content),
						rn: encodeURIComponent(_this.name),
						ph: _this.tel,
						ig: _this.imagesUrl.join(';')
					}, jsonp: 'cb'}
				).then((response)=>{
					// console.log(response);
					var data = response.data;
					// if (data && data.code == 0) {
						alert('提交成功！感谢您的新闻线索');
						_this.content = '';

						_this.images = [];
						_this.imagesUrl = [];
						_this.name = '';
						_this.tel = '';
					// }
				}, (response)=>{
					console.error('新闻线索提交失败');
					console.error(JSON.stringify(response));
				});
			}
		},
		showRule: function () {
			this.isRuleShow = true;
		},
		ruleClose: function () {
			this.isRuleShow = false;
		}
	},
	beforeRouteEnter : function (to, from, next) {
        next();
    },
	created: function(){
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		setTitle(news_title);
		this.clueStyle = {
			'width': $(window).width() + 'px',
			'height': $(window).height() + 'px'
		};
		this.wrapperStyle = {
			'height': $(window).height() - 50 + 'px'
		};
		if (isWeixin()) {
			this.isShow = false;
		} else {
			if ($.fn.cookie('useId') == 'holdfun') {
				this.isShow = false;
			} else {
				this.isShow = true;
			}
		}
		this.initShare('新闻线索-' + news_title);
	}

}

</script>

<style scoped>
.rule {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99999;
	overflow-y: scroll;
	background: #F4F4F4;
	font-size: 0;
}
.rule .ruleClose {
	position: fixed;
	z-index: 999;
	top: 6px;
	right: 6px;
	background: #c1c1c1;
	padding: 7px;
	border-radius: 100%;
}
.rule .ruleClose img {
	width: 12px;
}
.rule .ruleWrap {
	padding: 20px;
	line-height: 22px;
	color: #666;
	font-size: 14px;
}
.rule .ruleWrap p {
	margin-bottom: 10px;
}
.freeNo {
	text-align: center;
	color: #aaa;
}
.freeNo a {
	display: inline-block;
	color: #888;
	font-size: 13px;
	padding-bottom: 2px;
	border-bottom: 1px solid #AAA;
}
.clue-vue {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: #f1edea;
	color: #333;
	font-size: 14px;
}
.wrapper {
	position: relative;
	width: 100%;
	padding: 0 4%;
	margin: 0 auto;
	overflow: hidden;
	overflow-y: scroll;
	-webkit-overflow-scrolling:touch;
	z-index: 66;
}
.mask {
	position: fixed;
	z-index: 99;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0,0,0,.85);
}
.mask .content {
	position: relative;
	z-index: 1;
	color: #FFF;
	text-align: center;
	padding-top: 45vh;
	width: 96%;
	margin: 0 auto;
}
.mask .content p {
	font-size: 16px;
	letter-spacing: 2px;
	padding-left: 2px;
	line-height: 1.5;
}
.upload {
	display: block;
	width: 100%;
	font-size: 0;
	margin: 15px auto;
}
h1 {
	font-size: 15px;
	margin: 30px auto 6px;
}
textarea, input {
	display: block;
	width: 100%;
	border: 1px solid #b9b6b4;
	background: #FFF;
	color: #333;
	border-radius: 5px;
	padding: 8px 10px;
	margin-bottom: 10px;
}
textarea {
	height: 120px;
	resize: none;
}
.btn-clue {
	/*position: fixed;*/
	display: block;
	margin: 30px auto;
	width: 72%;
	height: 46px;
	line-height: 46px;
	text-align: center;
	background: #5caaf2;
	font-size: 17px;
	letter-spacing: 3px;
	padding-left: 3px;
	color: #FFF;
	border-radius: 50px;
	bottom: 70px;
	left: 14%;
	z-index: 66;
}
.btn {
	display: inline-block;
	width: 46px;
	height: 46px;
	padding: 8px;
	border-radius: 5px;
	border: 1px dashed #333;
	overflow: hidden;
}

.item-wrapper {
	position: relative;
	display: inline-block;
	vertical-align: bottom;
	width: 46px;
	height: 46px;
	margin-right: 10px;
}
.item {
	display: inline-block;
	overflow: hidden;
	width: 46px;
	height: 46px;
	border-radius: 5px;
	border: 1px solid #333;
	vertical-align: bottom;
}
.item img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.item-wrapper a {
	display: block;
	position: absolute;
	width: 20px;
	height: 20px;
	top: -8px;
	right: -8px;
	z-index: 66;
}
.bg {
	position: absolute;
	width: 30vh;
	height: 60vh;
	background: url(data:image/png;base64,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) no-repeat;
	background-size: auto 100%;
	top: 25vh;
	right: 0;
	z-index: 0;
	pointer-events: none;
}
</style>