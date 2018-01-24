<template>
	<section class="lists-vue">
		<head-nav v-bind:item="hitem"></head-nav>
		<div id="matrixListScrollWrap">
			<div id="matrixListScroller">
				<div class="content">
					<div class="hd">
						<img :src="matrixImg">
						<div class="tvinfo">
							<h1>{{matrixName}}</h1>
							<p>已发布文章<label>{{matrixNum}}</label>条</p>
						</div>
					</div>
					<div class="list-vue">
						<news-block v-for="item in newsList" v-bind:item="item"></news-block>
					</div>
					<div class="tips" v-if="pullUpShow&&pullDownShow"><p>{{tips}}</p></div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>

import config from '../assets/config.js'
import NewsBlock from './common/NewsBlock.vue'
import HeadNav from './common/HeadNav.vue'

export default{
	name: 'matrixlist',
	components: {
		'news-block': NewsBlock,
		'head-nav' : HeadNav
	},

	data(){
		return {
			eu: null,
			mu: null,
			page: 1,
			listScroll: null,
			refresh: false,
			addmore: false,
			pullUpShow: false,
			pullDownShow: false,
			loadinginterval: null,
			newsList: [],
			matrixName: null,
			matrixNum: null,
			matrixImg: null,
			flag: false,
			tips: '继续滑动加载更多内容',
			hitem: {t: window.news_title, s: 1},
		}
	},

	mounted () {
		setTitle(news_title || '视听中原');
		document.querySelector('.lists-vue').addEventListener('touchmove',function(e){e.preventDefault()},false);
		this.initShare(news_title + '矩阵列表');
	},

	methods: {
		getMatrixInfo: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.matrixInfo, {
				params: {
					mu: _this.mu
				}, jsonp: 'cb'
			}).then((response) => {
				// console.log(response);
				var data = response.data;
				if (data && data.code == 0) {
					_this.hitem.t = data.nm;
					_this.matrixName = data.nm;
					_this.matrixNum = data.an;
					_this.matrixImg = data.lg;
				}
			}, (response) => {
				console.error('新闻矩阵信息获取失败');
				console.error(JSON.stringify(response));
			})
		},
		getListData: function(page) {
			var _this = this;
			_this.tips = '加载中...';
			this.$http.jsonp(config.host + config.matrixList, {
				params: {
					mu: _this.mu,
					pg: page
				}, jsonp: 'cb'
			}).then((response) => {
				// console.log(response);
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
						if( document.querySelector('#matrixListScroller').offsetHeight > document.querySelector('body').offsetHeight ) {
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
				console.error('新闻矩阵列表获取失败');
				console.error(JSON.stringify(response));
			})
		},
	    listScrollinit: function(){
			var _this = this;
			var isScrolling = true;

			_this.listScroll = new IScroll('#matrixListScrollWrap',{
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
			    link: location.origin + location.pathname + '#/' + _this.eu + '/matrix/' + _this.mu,
			    imgUrl: window.news_logo,
			    success: function(){
			    }
			});

			wx.onMenuShareTimeline({
			    title: title,
			    link: location.origin + location.pathname + '#/' + _this.eu + '/matrix/' + _this.mu,
			    imgUrl: window.news_logo,
			    success: function () {
			    }
			});
		},
	},

	created: function(){
		setTitle(news_title || '视听中原');
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		this.mu = this.$route.params.mu;
		this.getMatrixInfo();
		this.getListData( this.page );
		this.initShare(news_title + '矩阵列表');
	}
}

</script>

<style scoped>
.lists-vue {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	padding: 5px 10px;
}
.lists-vue .hd {
	width: 100%;
	margin-bottom: 10px;
	background: url(../assets/img/banner.jpg) no-repeat;
	background-size: cover;
}
.lists-vue .hd img {
	display: block;
	/*width: 16vw;*/
	height: 90px;
	margin: 0 auto;
	padding: 4vw 0;
}
.lists-vue .hd .tvinfo {
	width: 100%;
	background: rgba(255,255,255,.5);
	text-align: center;
	padding: 6px;
	font-size: 15px;
	color: #0167bb;
}
.lists-vue .hd .tvinfo p {
	font-size: 12px;
}
.list-vue {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.content {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
#matrixListScroller{
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
#matrixListScrollWrap{
	position: absolute;
	z-index: 1;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
}
#matrixListScroller #pullDown, #matrixListScroller #pullUp {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}
#matrixListScroller #pullDown img, #matrixListScroller #pullUp img {
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