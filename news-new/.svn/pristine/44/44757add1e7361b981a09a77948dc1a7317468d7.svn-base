<template>
	<div class="home-vue" :class="{ 'open': isOpen }" v-if="isPageLoad">
		<head-nav :item="hitem"></head-nav>
		<div class="home-wrapper" :style="wrapperStyle">
			<div class="swiper-container" v-if="isSwiperLoaded">
				<div class="swiper-wrapper">
					<slider-list v-for="slider in swiperList" :slider="slider"></slider-list>
				</div>
			</div>

			<div class="express-news" v-if="isNewsNowLoaded">
				<p class="news-tit">正在发生：</p>
				<div id="scroll-news" class="news-list-wrapper">
					<ul class="news-list">
						<li class="news-item" v-for="item in newsNowList">
							<a href="javascript:void(0);" :class="'news_' + item.tc" v-tap="{ methods : toUrl, au: item.uu }" >{{ item.tt }}</a>
						</li>
					</ul>
				</div>
			</div>

			<div class="news-block none" v-if="isNewsNowLoaded">
				<div class="hd">
					<p>正在发生</p>
					<a href="javascript:void(0);" class="more" v-tap="{ methods:toList, pageName:'newsNow' }" v-if="isNewsNowMore">更多&gt;&gt;</a>
				</div>
				<div class="bd">
					<news-block v-for="item in newsNowList" :item="item"></news-block>
				</div>
			</div>

			<div class="news-block" v-if="isNewsHotLoaded">
				<div class="hd">
					<p>热点新闻</p>
					<a href="javascript:void(0);" class="more" v-tap="{ methods:toList, pageName:'newsHot' }" v-if="isNewsHotMore">更多&gt;&gt;</a>
				</div>
				<div class="bd">
					<news-block v-for="item in newsHotList" :item="item"></news-block>
				</div>
			</div>

			<div class="news-block" v-if="isNews24Loaded">
				<div class="hd">
					<p>24小时新闻</p>
					<a href="javascript:void(0);" class="more" v-tap="{ methods:toList, pageName:'news24' }" v-if="isNews24More">更多&gt;&gt;</a>
				</div>
				<div class="bd">
					<news-block v-for="item in news24List" :item="item"></news-block>
				</div>
			</div>
		</div>
    <float-add v-on:isOpenChild="isOpenParent"></float-add>
		<foot-nav></foot-nav>
	</div>
</template>

<script>

import config from '../assets/config.js'
import swiper from '../assets/swiper.js'
import FootNav from './common/FootNav.vue'
import SliderList from './common/SliderList.vue'
import NewsBlock from './common/NewsBlock.vue'
import HeadNav from './common/HeadNav.vue'
import FloatAdd from './common/FloatAdd.vue'

export default{
	name: 'Home',
	components: {
		'foot-nav' : FootNav,
		'news-block' : NewsBlock,
		'slider-list' : SliderList,
		'head-nav' : HeadNav,
		'float-add' : FloatAdd
	},
	data(){
		return {
			hitem: {t: window.news_title, s: 0},
			eu: null,
			mySwiper: null,
			newsNum: 4,
			wrapperStyle: {},
			swiperList: [],
			isSwiperLoaded: false,
			isSwiperMore: false,
			newsNowList: [],
			isNewsNowLoaded: false,
			isNewsNowMore: false,
			news24List: [],
			isNews24Loaded: false,
			isNews24More: false,
			newsHotList: [],
			isNewsHotLoaded: false,
			isNewsHotMore: false,
			isPageLoad: true,
			newsNowFlag: null,
      isOpen: false,
		}
	},
	methods: {
		toUrl: function(result){
			this.$router.push('/' + this.eu + '/article/' + result.au);
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
		toList: function(result){
			this.$router.push('/' + this.eu + '/' + result.pageName);
		},
		getHomeNews: function() {
		  var _this = this;
      _this.getSwiper();
		  setTimeout(function () {
        _this.getNewsNow();
        setTimeout(function () {
          _this.getNewsHot();
          setTimeout(function () {
            _this.getNews24();
          }, 300);
        }, 300);
      }, 300);
		},
		getSwiper: function() {
			var _this = this;
			console.log('getSwiper()')
			this.$http.jsonp(config.host + config.swiper, {params: {eu: this.eu}, jsonp: 'cb'}).then((response)=>{
				if (response.data && response.data.code == 0) {
					_this.swiperList = response.data.items;
					_this.isSwiperLoaded = true;
					this.$nextTick(function(){
						_this.swiperInit();
					});
				}
			}, (response)=>{
				console.error('新闻Swiper获取失败');
				console.error(JSON.stringify(response));
			});
		},
		getNewsNow: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.newsNow, {params: {eu: this.eu}, jsonp: 'cb'}).then((response)=>{
				// console.log(response);
				if (response.data && response.data.code == 0) {
					_this.newsNowList = response.data.items;
					_this.isNewsNowLoaded = true;
					this.$nextTick(function(){
						if (_this.newsNowList.length > 1) _this.scrollNews();
					});
				}
			}, (response)=>{
				console.error('新闻Now获取失败');
				console.error(JSON.stringify(response));
			});
		},
		getNews24: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.news24, {params: {eu: this.eu}, jsonp: 'cb'}).then((response)=>{
				if (response.data && response.data.code == 0) {
					_this.news24List = response.data.items.slice(0, _this.newsNum);
					_this.isNews24Loaded = true;
					if (response.data.items.length > 4) {
						_this.isNews24More = true;
					}
				}
			}, (response)=>{
				console.error('新闻24获取失败');
				console.error(JSON.stringify(response));
			});
		},
		getNewsHot: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.newsHot, {params: {eu: this.eu}, jsonp: 'cb'}).then((response)=>{
				if (response.data && response.data.code == 0) {
					_this.newsHotList = response.data.items.slice(0, _this.newsNum);
					_this.isNewsHotLoaded = true;
					if (response.data.items.length > 4) {
						_this.isNewsHotMore = true;
					}
				}
			}, (response)=>{
				console.error('新闻Hot获取失败');
				console.error(JSON.stringify(response));
			});
		},
		swiperInit: function() {
			var _this = this;
			_this.mySwiper = new Swiper('.swiper-container', {
				direction: 'horizontal',
				autoplayDisableOnInteraction: false,
				autoplay: 3e3,
				
				effect : 'coverflow',
				slidesPerView: 1,
				centeredSlides: true,
				coverflow: {
					rotate: -5,
					stretch: 15,
					depth: 120,
					modifier: 3,
					slideShadows : true
				},  
				onSlideChangeEnd: function(swiper) {
					_this.mySwiper.startAutoplay();
				}
			});
		},
		scrollNews: function() {
			var _this = this;
			if ($("#scroll-news").length > 0) {
				_this.newNowFlag = setInterval(function() {
					$("#scroll-news").find(".news-list").animate({
						"-webkit-transform": "translate3d(0px,-29px, 0px)",
						transform: "translate3d(0px,-29px, 0px)",
					}, 500, "ease", function() {
						$(this).css({
							"-webkit-transform": "translate3d(0px,0px, 0px)",
							transform: "translate3d(0px,0px, 0px)",
						});
						$('li').eq(0).appendTo(this);
					})
				}, 3e3);
			}
		},
		initShare: function( title ){
			var _this = this;
			wx.onMenuShareAppMessage({
				title: title,
				desc: '视听中原，全媒体新闻平台',
				link: location.origin + location.pathname + '#/' + _this.eu,
				imgUrl: window.news_logo,
				success: function(){
				}
			});

			wx.onMenuShareTimeline({
				title: title,
				link: location.origin + location.pathname + '#/' + _this.eu,
				imgUrl: window.news_logo,
				success: function () {
				}
			});
		},
		refresh: function () {
			this.$router.go(0)
		},
		deSwiper: function () {
			this.mySwiper = null
		},
    isOpenParent: function (data) {
      this.isOpen = data
    }
	},
	beforeRouteEnter: function(to, from, next) {
		next();
		console.log('beforeRouteEnter');
	},
	beforeRouteLeave: function(to, from, next) {
		next();
		console.log('beforeRouteLeave');
	},
	beforeDestroy () {
		var _this = this;
    clearInterval( _this.newsNowFlag );
    console.log('beforeDestroy');
  },
  created: function(){
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		setTitle(news_title);
		this.wrapperStyle = {
			'height': $(window).height() - 50 + 'px'
		};
		this.getHomeNews();
		this.initShare(news_title);
		console.log('created');
	},
	mounted() {
		setTitle(news_title || '视听中原');
		this.initShare(news_title);
		console.log('mounted');
	},
	activated() {
		// this.getHomeNews();
	},
	deactivated() {
		// this.getHomeNews();
		this.deSwiper();
		this.swiperList = [];
	}
}

</script>

<style scoped>
ul, ol, li {
	list-style: none outside none;
}
.home-vue {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.home-vue.open:before {
  content: '';
  display: block;
  opacity: .7;
  position: absolute;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #000;
}
.home-wrapper {
	width: 100vw;
	height: 100%;
	overflow: hidden;
	overflow-y: scroll;
	-webkit-overflow-scrolling:touch;
}
.home-vue .swiper-container {
	width: 92%;
	margin: 0 auto;
	padding: 15px 0;
	overflow: initial;
	height: calc(100vw * 0.52 + 30px);
	height: -webkit-calc(100vw * 0.52 + 30px);
}

.home-vue > div:nth-last-child(2) {
	margin-bottom: 65px;
}

.news-block {
	width: 100%;
	background: #FFF;
	margin-bottom: 10px;
	overflow: hidden;
	padding: 10px 15px 5px;
}
.news-block .hd {
	position: relative;
	width: 100%;
	margin-bottom: 8px;
	overflow: hidden;
}
.news-block .hd p {
	font-size: 16px;
	color: #ff4c6a;
}
.news-block .hd .more {
	position: absolute;
	font-size: 13px;
	color: #999;
	bottom: 0;
	right: 0;
}
.news-block .bd {
	width: 100%;
	overflow: hidden;
	font-size: 0;
}

.express-news {
	margin: 0 auto 8px;
	height: 36px;
	font-size: 14px;
	background-color: #fff;
	padding: 0 15px;
	position: relative;
}
.express-news .news-tit {
	width: 75px;
	height: 36px;
	line-height: 36px;
	position: absolute;
	top: 0;
	left: 16px;
	display: block;
	color: #ff4c6a;
}
.express-news .news-list-wrapper {
	padding: 0 0 0 75px;
	height: 36px;
	overflow: hidden;
}
.express-news .news-item {
	font-size: 14px;
	line-height: 22px;
	height: 22px;
	margin: 7px 0;
}
.express-news .news-item a {
	color: #181818;
	overflow: hidden;
	white-space: nowrap;
	-o-text-overflow: ellipsis;
	text-overflow: ellipsis;
	display: block;
	line-height: 22px;
	height: 22px;
}
/*.express-news .news-item a:before {
	content: '';
	display: inline-block;
	padding: 1px 4px;
	color: #FFF;
	font-size: 11px;
}
.express-news .news-item .news_3:before {
	content: '视频';
	background: #5caaf2;
}
.express-news .news-item .news_4:before {
	content: '直播';
	background: #ff5353;
}*/
.isApp .home-wrapper {
	height: -webkit-calc(100% - 55px) !important;
	height: calc(100% - 55px) !important;
}


</style>