<template>
	<section class="list-vue">
		<head-nav v-bind:item="hitem"></head-nav>
		<div id="listScrollWrap">
			<div id="listScroller">
				<news-list v-for="item in newsList" v-bind:item="item"></news-list>
				<div class="tips" v-if="pullUpShow&&pullDownShow"><p>{{tips}}</p></div>
			</div>
		</div>
	</section>
</template>

<script>

import config from '../assets/config.js'
import NewsList from './common/NewsList.vue'
import HeadNav from './common/HeadNav.vue'

export default{
	name: 'list',
	components: {
		'news-list': NewsList,
		'head-nav' : HeadNav
	},
	data() {
		return {
			eu: null,
			page: 1,
			flag: false,
			pageName: null,
			listScroll: null,
			refresh: false,
			addmore: false,
			pullUpShow: false,
			pullDownShow: false,
			loadinginterval: null,
			newsList: [],
			tips: '继续滑动加载更多内容',
			hitem: {t: window.news_title, s: 1},
		}
	},

	mounted () {
		setTitle(news_title || '视听中原');
		document.querySelector('.list-vue').addEventListener('touchmove',function(e){e.preventDefault()},false);
		this.initShare(news_title + '-新闻列表');
	},

	methods: {
		getListData: function(page) {
			var _this = this;
			var ajaxAddr = '';
			switch(this.pageName) {
				case 'newsNow':
					ajaxAddr = config.newsNow;
					break;
				case 'news24':
					ajaxAddr = config.news24;
					break;
				default:
					ajaxAddr = config.newsHot;
			}
			_this.tips = '加载中...';
			this.$http.jsonp(config.host + ajaxAddr, {
				params: {
					eu: _this.eu,
					pg: page
				}, jsonp: 'cb'
			}).then((response) => {
				var data = response.data.items;
				var len = 0;
				if (data) {
					len = data.length;
					if (len > 0) {
						++_this.page;
						_this.tips = '继续滑动加载更多内容';
					} else {
						_this.tips = '没有更多内容了';
						// console.log('没有更多内容');
						return false;
					}
				} else {
					_this.tips = '没有更多内容了';
					// console.log('没有更多内容');
					return false;
				}

				for (var i = 0; i < len; i++) _this.newsList.push(data[i]);

				if (!_this.flag) {
					_this.flag = true;
					
					setTimeout(function(){
						if( document.querySelector('#listScroller').offsetHeight > document.querySelector('body').offsetHeight ) {
							_this.pullUpShow = true;
							_this.pullDownShow = true;
							setTimeout(function(){
								_this.listScrollinit();
							}, 200);
						}
					}, 100);
				}

				if (_this.pullDownShow && _this.pullUpShow) {
					setTimeout(function(){
						_this.listScroll.refresh();
					}, 100);
				}
			}, (response) => {
				console.error('新闻列表获取失败');
				console.error(JSON.stringify(response));
			})
		},
	    listScrollinit: function(){
			var _this = this;
			var isScrolling = true;

			_this.listScroll = new IScroll('#listScrollWrap',{
				probeType: 3,
				click: true,
				scrollbars: true,
				startY: 0,
				shrinkScrollbars: 'clip'
			});

			var _maxScrollY = _this.listScroll.maxScrollY;

			_this.listScroll.on('scrollStart', function(){
				if( this.y == this.startY ) isScrolling = true;
			});

			_this.listScroll.on('scroll', function(){
				if( Math.abs(this.y - this.maxScrollY) <= 3 ) {
					_this.addmore = true;
				}
			});

			_this.listScroll.on('scrollEnd', function(){
				if( _this.addmore && this.directionY >= 0 ) {
					if (isScrolling) _this.getListData(  _this.page );
				}

				isScrolling = false;
				_this.addmore = false;
			});
	    },
        initShare: function( title ){
			var _this = this;
			wx.onMenuShareAppMessage({
			    title: title,
			    desc: '视听中原，全媒体新闻平台',
			    link: location.origin + location.pathname + '#/' + _this.eu + '/list/' + _this.pageName,
			    imgUrl: window.news_logo,
			    success: function(){
			    }
			});

			wx.onMenuShareTimeline({
			    title: title,
			    link: location.origin + location.pathname + '#/' + _this.eu + '/list/' + _this.pageName,
			    imgUrl: window.news_logo,
			    success: function () {
			    }
			});
		},
	},
	created: function(){
		var _this = this;
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		setTitle(news_title);
		this.pageName = this.$route.params.pageName;
		this.getListData( this.page );
		this.initShare(news_title + '-新闻列表');
		switch(this.pageName) {
			case 'newsNow':
				_this.hitem.t = '最新新闻';
				break;
			case 'news24':
				_this.hitem.t = '24小时新闻';
				break;
			default:
				_this.hitem.t = '热点新闻';
		}
	},
}

</script>

<style scoped>
.list-vue {
    position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: scroll;
}
#listScroller{
	position: absolute;
	z-index: 1;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
	width: 100%;
	padding: 5px 10px;
	-webkit-transform: translateZ(0);
	-moz-transform: translateZ(0);
	-ms-transform: translateZ(0);
	-o-transform: translateZ(0);
	transform: translateZ(0);
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	-webkit-text-size-adjust: none;
	-moz-text-size-adjust: none;
	-ms-text-size-adjust: none;
	-o-text-size-adjust: none;
	text-size-adjust: none;
}
#listScrollWrap{
	position: absolute;
	z-index: 1;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
}
#listScroller #pullDown, #listScroller #pullUp {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}
#listScroller #pullDown img, #listScroller #pullUp img {
	display: block;
	height: 26px;
}
.tips {
	width: 100%;
	padding: 30px 0 20px;
	text-align: center;
}
.tips p {
	display: inline-block;
	padding: 2px 16px;
	font-size: 12px;
	background: rgba(0,0,0,.15);
	border-radius: 3px;
	letter-spacing: 2px;
	text-indent: -2px;
	padding-left: 18px;
	color: rgba(255,255,255,.9);
}
</style>