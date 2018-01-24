<template>
	<section class="article-vue">
		<head-nav v-bind:item="hitem"></head-nav>
		<div class="article-wrapper" :style="articleStyle" id="articleScroll">
			<div class="content">
				<p class="tail">
					<span class="flag" :class="newsStyle">{{ newsStyleName }}</span>
					<span class="num">{{pnum}}</span>
				</p>
				<h1 class="title">{{title}}</h1>
				<p class="info">
					<span class="tvname">{{tvname}}</span>
					<span class="time">{{time}}</span>
				</p>
				<div class="detail" v-html="detail">{{detail}}</div>
				<div class="video-wrapper" v-if="isVideo&&isSingleV" :style="vStyle">
					<video allowfullscreen="false" x-webkit-airplay="true" :poster="cover" webkit-playsinline playsinline id="video" class="video" controls preload="auto" :style="vStyle"><source :src="video" type="video/mp4" /></video>
				</div>
				<div class="iframe-wrapper" v-if="isVideo&&!isSingleV">
					<iframe :src="iframeUrl"></iframe>
				</div>
			</div>
			<div class="comment" v-if="isShow">
				<div class="hd">
					<fieldset>
						<legend>全部评论</legend>
					</fieldset>
				</div>
				<div class="bd">
					<div class="no-comment" v-if="isEmpty">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAB4CAMAAAAe0x1QAAAAA3NCSVQICAjb4U/gAAABHVBMVEX////d3d3Dw8MEAADd3d0EAADd3d0EAADd3d3Dw8NHREQzMzMxLi4bGBgQDAwPCwvd3d1qaGhcWVnd3d3Dw8OVk5OTkZGPjY2KiIiHhoZ9e3s/PT3d3d3Dw8OtrKyopqalo6OioKChn5+dnJyZmZnd3d3Dw8O7urpYV1fd3d3R0dHJyMjDw8O+vb2Vk5NjYmLd3d3MzMzDw8NqaGjd3d3R0dHDw8OZmZltbGzl5eXj4+Pd3d3R0dHDw8Ps6+vp6em5ubmxsbFzc3Pz8/Px8fHv7+/s6+uZmZl2dnb19fXz8/Pr6+vp6enl5eXf39/d3d3Z2dnX19fJyMjGxsbHxsbDw8PCwcG+vb25ubm3traxsbGmpqajo6OZmZl5eXlFAz2WAAAAX3RSTlMAERERIiIzM0REREREREREVVVVZmZmZmZmZmZmd3d3d3d3d3d3iIiIiJmZmZmZmZmqqqqqu7u7u7vMzMzMzN3d3d3d7u7u7u7u//////////////////////////////LDaZAAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAADpElEQVR4nO2bC1vTMBSGN7rQcREREEUum8BQcCiDgm5VrgOplwkqQwH9/z/DNmXQlZ6tJL3Nfu/z7FlHT7qelyTNmjST6Qzzh0SBHsVfBsxzU/qwSYb5qQLtYu5ZoEfxk4NbTCAHTToQQwAxBBBDADEEEEMAMQS3OdDjV0KMzwI9iiNPr52uGJECPQrEEEAMAcQQQAwBxBBADAHEEEAMAcQQQAwBxBBADAHEEEAMAcQQQAwBxBDg1iYBboYTQAwBxBBADAHEEEAMAcOKKm/8ZcA8N6UPm2R8/PtvB25CBQAAAAAAAAAAAAAAAAAAAAAAAAAQC4oqRmt9p2BxJd6su8OKVUOEo8qwqYYNV46EileLCV9OwSpCeVlsDyrK4LZw8UqizSjzwokZhsaYJlF8PsmtSa1JZGaMjcmUrqlxZ98B9VAmtYUFmdKHiRZzIJNasShT+gBiIAZiIAZiIKYNiCGAGIJUislrpa4xqRSzpuvj3WLSKkbLdolJpZiSbleZ3Hg/GZNKMXlTjGa+L3eoOKkUkzXF6DnepGaomFSKMasKb0szur5GhaRTzLgpZpk3KY0KSaeYnN3JWG9USArF5LXRjGYqyVpiXDXGMZUUq5hYJpnMLjdnXbD7M6PuPoYtVusH18hkJinGaJ1DvbYY4VSK2fOWrE4mn9NcI2BlUSodB5JiHDyPrs5Yo5hR66W5B8DqTlDpBCdmO8L+xhRiNif+ah/5qkFlE6AYI0Ix/TpH0zXXL4K0i7E6XZPSnR9KqRdjXrF1r18DwYmZmgrsUNGOabLhijkcGZGa4XUS8WAvXDEFxgpBHes/ElOfsxYOzdWDOVoSxVRXX92fcmGIKSZsqFAWKL7qXsaVRDG1ZzHgXpcTvZi798ODuyoFSFRiNt+72IQYiOnEilvMCsRwJj64mIAYTp9bTB/E2KzbPnZ37fd1xy5VbCl4qOxEJmaJ+9i7vNzjG0uOXcrTuDXc5bHIHbyvIpx8t2heXTX5xolz38/zxhfOp7h9GMZn6zy+nf8QSFFMTIP7OLu4OOMbjbadp81fnEbcWgzjt3UezVORFAXb0paz693yDJF6kCAYYlg2X3aKKXvHsBcxN6baYPQPWsw6xcwSQWzoyeTk6z8t3k6Gy80XfbQ/P4rjca4Bp5gBMkxRlJHjv9dMK6HCNlpf9IbZf4nQxw1tQ7y+TpFsep+f7fHLkOcDlQfvbC8bD8P9oqBoTWWHPk+qXD9AyQKpKv8AUQnP+olNXd0AAAAASUVORK5CYII=">
						<p>沙发还没人 快来</p>
					</div>
					<comment-list v-for="item in talkList" v-bind:item="item"></comment-list>
				</div>
			</div>
			<a href="javascript:void(0)" class="btn-home" v-tap="{ methods:toHome }">查看更多精彩内容</a>
		</div>
		<div class="send" v-if="isShow">
			<input id="btn-send" type="text" v-model="message" :placeholder="placeholder" >
			<a href="javascript:void(0)" v-tap="{ methods:sendTalk }">发送</a>
		</div>
	</section>
</template>

<script>

import config from '../assets/config.js'
import CommentList from './common/CommentList.vue'
import HeadNav from './common/HeadNav.vue'

export default{
	name: 'article',
	components: {
		'comment-list' : CommentList,
		'head-nav' : HeadNav
	},
	data(){
		return {
			eu: null,
			au: null,
			page: 1,
			ptype: null,
			pnum: null,
			title: null,
			tvname: null,
			time: null,
			detail: null,
			cover: null,
			video: null,
			isVideo: false,
			isSingleV: false,
			isEmpty: true,
			isShow: false,
			talkList: [],
			newsStyle: 'none',
			newsStyleName: '图文',
			message: '',
			placeholder: '说点什么吧…',
			vStyle: {},
			articleStyle: {},
			iframeUrl: '',
			articleScroll: null,
			hitem: {t: window.news_title, s: 1},
		}
	},
	methods: {
		getArticle: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.article, {params: {au: this.au}, jsonp: 'cb'}).then((response)=>{
				// console.log(response);
				var data = response.data;
				if (data && data.code == 0) {
					_this.initShare( data.tt, data.dl, data.pt );
					_this.pnum = data.pn;
					_this.title = data.tt;
					_this.hitem.t = data.tt;
					if (data.tt) { setTitle(data.tt) }
					_this.tvname = data.an;
					_this.time = data.ht;
					_this.detail = data.dl;
					_this.cover = data.pt;
					if (data.tc == 3) {
						_this.newsStyle = 'type0';
						_this.newsStyleName = '视频';
					} else if (data.tc == 4) {
						_this.newsStyle = 'type1';
						_this.newsStyleName = '直播';
					}
					if (data.vu) {
						_this.video = data.vu;
						if (news_av) {
							_this.iframeUrl = '/VR.html?mvi=' + data.vu + '&cvi=' + news_av + '&cover=' + data.pt + '&v=' + VERSION;
							_this.isSingleV = false;
						} else {
							_this.iframeUrl = '/VR.html?mvi=' + data.vu + '&cover=' + data.pt + '&v=' + VERSION;
							_this.isSingleV = true;
						}
						_this.isVideo = true;
					}
				}
			}, (response)=>{
				console.error('新闻Article获取失败');
				console.error(JSON.stringify(response));
			});
		},
		getCommentList: function(page) {
			var _this = this;
			this.$http.jsonp(config.host + config.talkList, {
				params: {
					au: this.au,
					pg: page
				}, jsonp: 'cb'}
			).then((response)=>{
				// console.log(response);
				var data = response.data;
				if (data && data.code == 0) {
					var len = data.items.length;
					_this.isEmpty = false;
					for (var i = 0; i < len; i++) _this.talkList.push(data.items[i]);
				} else {
					_this.isEmpty = true;
				}
			}, (response)=>{
				console.error('新闻Article获取失败');
				console.error(JSON.stringify(response));
			});
		},
		sendTalk: function() {
			var _this = this;
			var message = $.trim(_this.message);
			if (message.length > 0 && message.length <= 150) {
				_this.placeholder = '说点什么吧…';
				_this.$http.jsonp(config.host + config.talkSave, {
					params: {
						uu: openid,
						uc: matk,
						au: this.au,
						ct: encodeURIComponent(message)
					}, jsonp: 'cb'}
				).then((response)=>{
					// console.log(response);
					var data = response.data;
					if (data && data.code == 0) {
						var talk = {};
						talk['hi'] = avatar;
						talk['tm'] = new Date().toLocaleString();
						talk['nn'] = nickname;
						talk['ct'] = _this.message;
						_this.talkList.unshift(talk);
						_this.message = '';
						_this.isEmpty = false;
						$('#btn-send').blur();
						document.getElementById('articleScroll').scrollTop = $('.content').height();
					} else {
						alert('新闻评论发送失败，请稍后再试');
						console.error(JSON.stringify(response));
					}
				}, (response)=>{
					console.error('新闻Article获取失败');
					console.error(JSON.stringify(response));
				});
			} else {
				_this.placeholder = '评论在150字内…';
			}
		},
		toHome: function() {
			this.$router.push('/' + this.eu + '/');
		},
        initShare: function( title, desc, img ){
			var _this = this;
			wx.onMenuShareAppMessage({
			    title: title,
			    desc: desc || '视听中原，全媒体新闻平台',
			    link: location.origin + location.pathname + '#/' + _this.eu + '/article/' + _this.au,
			    imgUrl: img || window.news_logo,
			    success: function(){
			    }
			});

			wx.onMenuShareTimeline({
			    title: title,
			    link: location.origin + location.pathname + '#/' + _this.eu + '/article/' + _this.au,
			    imgUrl: img || window.news_logo,
			    success: function () {
			    }
			});
		},
	},
	beforeRouteEnter : function (to, from, next) {
        next();
    },
	beforeDestroy () {
		setTitle(news_title);
	},
    created: function(){
      if (this.$route.path.indexOf(';H5') >= 0) {
        this.eu = this.$route.params.eu.slice(0,-3);
      }else {
        this.eu = this.$route.params.eu;
      }
		this.au = this.$route.params.au;
		this.getArticle();
		this.vStyle = {
			'height': Math.round($(window).width() * 0.7) + 'px',
			'overflow': 'hidden'
		};
		if (isWeixin()) {
			this.getCommentList(this.page);
			this.isShow = true;
			this.articleStyle = {
				'height': $(window).height() - 50 + 'px'
			};
		} else {
			this.isShow = false;
			this.articleStyle = {
				'height': $(window).height() + 'px'
			};
		}
	}
}

</script>

<style scoped>
.freePower {
	text-align: center;
	margin-bottom: 10px;
}
.freePower a {
	font-size: 13px;
	color: #aaa;
}
.article-vue {
	width: 100%;
	height: 100%;
	-webkit-overflow-scrolling:touch;
	background: #FFF;
}
.article-wrapper {
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: scroll;
	-webkit-overflow-scrolling:touch;
}
.content {
	padding: 8px 12px;
	margin-bottom: 15px;
}
.content .tail {
	font-size: 12px;
	color: #FFF;
	margin-bottom: 15px;
}
.content .tail .flag {
	background: #5BAAF3;
	padding: 2px 8px;
}
.content .tail .type1 {
	background: #ff4c6a;
}
.content .tail .num {
	position: relative;
	top: 1px;
	color: #848484;
}
.content .tail .num:before {
	content: '';
	position: relative;
	top: 1px;
	display: inline-block;
	width: 12px;
	height: 13px;
	margin-right: 4px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABKBAMAAAAbAFTyAAAAA3NCSVQICAjb4U/gAAAAMFBMVEX///91dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXXGulhdAAAAEHRSTlMAESIzRFVmd4iZqrvM3e7/dpUBFQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAKcSURBVEiJtVbNbtNAELYdk6SlVL2CgPbUW9O+ACRHLlV5AtoXQCl3BH2DAEJIgIR7RkhBQkJckKnEAamCIOAeQMANufy1tMT+mF2vHe/OOs0BvkPsmf28Ozu/cRwd555GX5+0nFHw7kEguTGC4wZQuF5OupBxkJwv49TF8uD+A/H4XUbq0uJNevri1E07ZzK3Rdh2YCfRyjv16veBazbOEbJnJhNOAr9spAawlQtuD8mchRQiLqgXgIfW034WRN963hSwUZQ7GHDSCuKZonwK4F4PsavJVYtRHvBBU7gRvpukqmGSMGrXJB0FlnRNE39M0jRiQ3MMiUlqYt/QTLC9nTazgKxcM1Qdzd8CPrsKJZx5YY8nXogd00zuzbFIPbw3SRGe/bfjgnFuN5afVrFnaGo86xZZNVKtzhmqaRZzrhHftXRNk1d6ldV1wDPTteT4N5NEaaBfr2brPk0kWt2d5okpK0EzKuB14DgVvfipNfzgJPq02Gwa9i5Gxf8mF7y+0RoUKKDDBrUAFnCJi9RXP2cWRfTFGucsyyb/KL1EKN7jlsk5rkbBYzpxPkzf9w2rKtST8UIOjO1XciL06OetTlol1XPnTD5b4iVfsLSso0DhCz2vZPNnnfKCjNfC2aExIQxwL0vO4JJQnoCW5WI8qQvP3325fUu5q60NK5I+cac4flToPuTrhKcF4WzB7xTMjzaO40XDoIclG8mtVKnXSsaWI7NqLz9to4REvlHndW2jRmFKlUPFnqgpssXJknGbIkjreNE+SBUaadvosFlQxER6qz4fWQVQv3stY2KZyEOEIjJ1PkI0tEUmkCdsBZZjVnhxdoQrBeQmK+X/giTqogVeLY1uCorxOkXu4PYo3BHRw+HY+Yek7uGkzb9yVnC5RAffQAAAAABJRU5ErkJggg==) no-repeat;
	background-size: 100% 100%;
}
.content .title {
	color: #004CA4;
	font-size: 19px;
	line-height: 1.5;
	margin-bottom: 10px;
	word-break: break-word;
}
.content .info {
	font-size: 12px;
	margin-bottom: 10px;
	color: #444;
}
.content .info .tvname {
	margin-right: 8px;
}
.content .detail {
	font-size: 15px;
	line-height: 1.4;
	color: #888;
}
.content .detail img {
	width: 100%;
	height: auto;
}
.comment {
	width: 100%;
	padding-bottom: 10px;
}
.comment .hd {
	text-align: center;
}
.comment .hd fieldset {
	display: inline-block;
	text-align: center;
	border-top: 1px #1D5CA6 solid;
	font-size: 13px;
	letter-spacing: 2px;
	color: #1D5CA6;
	padding: 0 15px;
}
.comment .hd fieldset legend {
	padding: 0 6px;
}
.send {
	position: fixed;
	width: 100%;
	left: 0;
	bottom: 0;
	background: #FFF;
	border-top: 1px solid #AEA9A6;
	padding: 10px;
	text-align: center;
}
.send:before {
	content: '';
	display: inline-block;
	width: 30px;
	height: 23px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABRCAYAAAAgoNN3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAX2SURBVHic7Z1ZaB1VGMd/Sa611mqtVHGpldSKuASEIi64FmvdKlgMNAZ8UAxUqLg9RLFPFi0o+BBUbDEvtgYTEdxbW9PWuvVFAoFCRSJI9KHFlrZabdp4ffhmuJPxLnPmnJlzZvnB5TInM3M+7j9n/c/9btvw8DA5Yg1wJfA0MK17s+7ubu2A4lKxVrN5HgAGgA7gUuBh4C+rEWnQbjsAQ1wPDCGigIi0E7jAWkSa5EGYJcAnwJxQ+XXAd8BVqUdkgKwLcx7whfdej07gG+D2tAIyRZaFmYO0lCUtzpsPbAN6E4/IIFkWZgAZW6IwC3gXeDG5cMySZWHWA/sUzm8DXgLeAU5LJCKDZFGYNu/9F+BmYJfi9Y8CnwJnG4zJOFkTphf4EjjHOz4MrAA2K97nLmRSsNBcaGbJkjDLgEHgTuRDXeSVTwGPIF2bCl3AD8C1pgI0SVaE6QI+RAZxgKuRD3Wpd1wF1gGPAScV7nsx8DVwt5kwzZEFYRYCnwPzQuUXIuPLfYGyQe/4qML9z0Km3Y/HD9E8rgszDxGl0VgwF/gI2bz02Y5MCiYV6qkAG4FXqE0urOKyMLOQ7qurxXkdwJvAq9Q+1HFkjTOmWGc/sAU4XfE647gqTBvSLS1TuOY54H1gtnf8O3ArsFWx7h7gA8VrjOOqMC8TbwulG/gKWOAdHwNWApsU7jEFvB6jbqO4KMwapEuJy03IrrK/h3YK6AOeR2ZvzagiC9BRjfqN4Jowvtmly+XA98CNgbINSCs80eS6F5AxxjouCRM2u3RZgPznPxQoGwKWA4fqnP8WIp4TuCJMI7NLl9nIhODZQNkepLubCJR9DKw1XLcWLgjTyuzSpR14DXiDWmvcj3Rze71XDwYe3jCJ7YcxoppdJngC2V9bjTykcQC4w4vheAr1K2GzxXQgfX5Us8sE9wO7qT2k8TfwR4r1R8amMAPILCxtliKTAtu9RVNsCdPPzP2tNJn26j9lqf5I2BCmF1nZ22ItMgtzmrSF8c0uWzu4G5D1ivOkKUzY7EqbLcjKPhOkJUwjsystRpE9sFZ7Zc6QhjCtzK6kGQdWIbvGmSFpYaKaXUkxCdwLHLFUf2ySFCaO2WWSI4goKhazMyQpTFyzywRTSPc1bql+bZISRtfs0sEZs0uHJIQxZXbFxRmzSwfTwpg2u1RxyuzSwaQwSZldUXHO7NLBlDBJm12tcNLs0sGEMGmaXfX4GXlEyTmzSwddYWyYXUEOAvd477lCVxhbZhdIC1mJtJjcoSOMbbOrBxlbcklcYUqzK2HiCFOaXSmgKkxpdqWEijCl2ZUiUYUpza6UiSJMaXZZoJUwpdlliVbClGaXJZoJU5pdFmkkTGl2WaaeMHORcaU0uyxST5g/kewSB1KOBXJmdukQFCa4mt+LfONqf4qx5M7s0iEozG3MTLI2gXxXcU8KceTS7NIhKMxiZCb0GbUka4eQb/kOJRhDbs0uHYLCdHrvy5mZZO0EspZJYkDOtdmlQ7jF+HQhfb6fZK2KZJbow9w3sXJvdukQFOay0N8u4v9J1jYh/+HHDNSde7NLh3pdWRA/yVpfoGwrktXoN416C2F26eALM9971aMCvM3MJGtjwA3E28cqjNmlgy9MvdYSph94j1qStUkkk952hfoKZXbp4AsT9WG91YgQ53rHR5FdgsEI1xbO7NJBpcX43ILkA/MnCyeR7K3raNwSCml26RBHGIArEHGCT2CuR/Ifh1tEYc0uHXxhwlPlKJyP/HjOg4GyzUjm8MPecaHNLh18YRY3PasxZwAjwFOBsl3IpGCCgptdOlS816JWJzahA0nu2Qk8g6zo9wHXINmNSmLQDlyCmUxETyJpcc/0jktRNGgnfjcWZhrJA7bC0P0KTYV4A7/PT8AOZG2zk3I6bIwKalPlg0jCaV+MX5MIqkSEadaVHUe8mR3ea4wCbaeMjIxYqzsszL/Aj9SE+Bb4J8H6CyOyKhVkArAREWIUR5N3Fo0KtV8tKnEIFxJil9ShrVpNv5sPDKrlGNOAssU4yn8X0CLP2v75NwAAAABJRU5ErkJggg==) no-repeat;
	background-size: cover;
	vertical-align: middle;
	margin-right: 5px;
}
.send input[type='text'] {
	width: calc(100% - 106px);
	width: -webkit-calc(100% - 106px);
	padding: 7px 10px;
	outline: none;
	background: #FFF;
	border: 1px solid #A5A5A5;
	border-radius: 3px;
	overflow: hidden;
	font-size: 14px;
}
.send a {
	position: relative;
	display: inline-block;
	font-size: 14px;
	color: #FFF;
	text-align: center;
	background: #5CAAF2;
	width: 60px;
	height: 32px;
	line-height: 32px;
	letter-spacing: 3px;
	padding-left: 3px;
	border-radius: 4px;
}
.comment .bd {
	padding: 8px 12px;
}

.video-wrapper {
	display: block;
	width: 100%;
	margin: 20px auto;
}
.video-wrapper video {
	display: block;
	width: 100%;
	height: 100%;
}
.no-comment {
	width: 100%;
	margin: 20px auto 0;
	font-size: 13px;
	color: #AAA;
	text-align: center;
	overflow: hidden;
}
.no-comment img {
	height: 20vw;
}
.no-comment p {
	margin-top: 10px;
}
.iframe-wrapper {
	width: 100%;
	margin: 20px auto;
}
iframe {
	width: 100%;
	height: 230px;
}
.btn-home {
	display: block;
	width: 90%;
	margin: 30px auto;
	height: 40px;
	line-height: 40px;
	text-align: center;
	font-size: 15px;
	color: #FFF;
	background: #378ad6;
	border-radius: 5px;
	letter-spacing: 2px;
	padding-left: 4px;
}
.isApp .article-wrapper {
	height: 100% !important;
}
</style>