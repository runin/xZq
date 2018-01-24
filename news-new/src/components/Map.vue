<template>
	<section class="map-vue">
		<head-nav v-bind:item="hitem"></head-nav>
		<div class="map-container" id="map-container"></div>
		<div class="news-container" v-show="maplist.length">
			<news-list v-for="item in maplist" v-bind:item="item"></news-list>
		</div>
		<foot-nav></foot-nav>
	</section>
</template>

<script>

import config from '../assets/config.js'
import velocity from '../assets/seedui.js'
import FootNav from './common/FootNav.vue'
import NewsList from './common/NewsList.vue'
import HeadNav from './common/HeadNav.vue'
import imgReady from 'img-ready'

export default{
	name: 'map',
	components: {
		'foot-nav' : FootNav,
		'news-list': NewsList,
		'head-nav' : HeadNav
	},
	data() {
		return {
			map: null,
			pointMarkers: [],
			maplist: [],
			contentHeight: '0px',
			delaytime: 100000*1000,
			newsTimeFlag: null,
			maploading: false,
			pageSize: 20,
			hitem: {t: '新闻地图', s: 0},
		}
	},

	mounted() {
		setTitle(news_title || '视听中原');
		var _this = this;
		var devicedpr = _this.deviceDPR();
		if( devicedpr > 1 ) {
			_this.map = new AMap.Map('map-container',{
				resizeEnable: true,
				zoom: 7,
				center: [113.65356445, 33.75966612],
				zooms: [4, 13]
			});
		} else {
			_this.map = new AMap.Map('map-container',{
				resizeEnable: true,
				zoom: 7,
				center: [113.65356445, 33.75966612],
				zooms: [4, 13]
			});
		}

		_this.map.plugin(['AMap.MarkerClusterer'], function(){
			_this.maploading = true;
			_this.getTime();
		});

		if( _this.newsTimeFlag ) {
			clearInterval( _this.newsTimeFlag );
		}

		// _this.newsTimeFlag = setInterval(function(){
		// 	_this.getTime();
		// }, _this.delaytime);

		_this.map.on('click', function(){
			velocity(document.querySelector('.news-container'),{
				height: 0
			},{
				duration: 500,
				complete: function(){
					_this.maplist = [];
				}
			})
		});
		
		_this.initShare(news_title + '-新闻地图');
	},

	methods: {
		toUpload: function() {
			this.$router.replace('/upload');
			return false;
		},
		getTime: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.maps, {params: {eu: news_eu}, jsonp: 'cb'}).then((response)=>{
				// console.log(response);
				var data = response.data;
				if (data && data.code == 0) {
					_this.createPoints(data.items);
					_this.maploading = false;
				}
			}, (response)=>{
				console.error('新闻MapPoint获取失败');
				console.error(JSON.stringify(response));
			});
		},
		getList: function(cityCode, pageNum, num) {
			var _this = this;
			if (pageNum > num) {
				setTimeout(function(){
					_this.contentHeight = _this.calcContainerHeight();
					velocity(document.querySelector('.news-container'),{
						height: _this.contentHeight + 'px'
					},{
						duration: 500
					});
				}, 300);
				return false;
			}
			if (pageNum == 1) _this.maplist = [];
			this.$http.jsonp(config.host + config.mapList, {params: {
				eu: news_eu,
				ch: cityCode,
				pg: pageNum
			}, jsonp: 'cb'}).then((response)=>{
				// console.log(response);
				var data = response.data;
				if (data && data.code == 0) {
					_this.maplist = _this.maplist.concat(data.items);
					_this.getList(cityCode, ++pageNum, num);
				}
			}, (response)=>{
				console.error('新闻MapPoint获取失败');
				console.error(JSON.stringify(response));
			});
		},
		calcContainerHeight: function(){
			var len = document.querySelectorAll('.news-list-vue').length;
			var totalHeight = 0;
			for( var i = 0; i < len; i++ ) {
				totalHeight += document.querySelectorAll('.news-list-vue')[i].offsetHeight;
			};
			return totalHeight;
		},
	    deviceDPR: function() {
			var dpr = 0;
			var ua = (window.navigator.appVersion.match(/android/gi), window.navigator.appVersion.match(/iphone/gi));
			var _dpr = window.devicePixelRatio;
			dpr = ua ? ( (_dpr >= 3 && (!dpr || dpr >= 3)) ? 3 : (_dpr >= 2 && (!dpr || dpr >= 2)) ? 2 : 1 ) : 1;
			return dpr;
	    },
	    createPoints: function(data) {
			var _this = this;
			var len = data.length;
			if (_this.pointMarkers.length > 0) {
				_this.map.remove(_this.pointMarkers);
			}
			for( var i = 0; i < len; i++ ) {
				var marker = new AMap.Marker({
					position: data[i].ct.split(','),
					map: _this.map,
					extData: data[i].ch,
					clickable: true,
					offset: new AMap.Pixel(-16, -26),
					content: '<p class="map_point">' + (data[i].an > 98 ? '99+' : data[i].an) + '</p>'
				});
				_this.pointMarkers.push( marker );
			};

			for( var i = 0; i < len; i++ ) {
				_this.pointMarkers[i].on('click', function() {
					var num = Math.ceil(parseFloat(this.getContent().replace('<p class="map_point">','').replace('</p>','').replace('+','')) / _this.pageSize);
					_this.getList(this.getExtData(), 1, num);
				});
			};
	    },
        initShare: function( title ){
			var _this = this;
			wx.onMenuShareAppMessage({
			    title: title,
			    desc: '视听中原，全媒体新闻平台',
			    link: location.origin + location.pathname + '#/' + _this.eu + '/map',
			    imgUrl: window.news_logo,
			    success: function(){
			    }
			});

			wx.onMenuShareTimeline({
			    title: title,
			    link: location.origin + location.pathname + '#/' + _this.eu + '/map',
			    imgUrl: window.news_logo,
			    success: function () {
			    }
			});
		},
	},
    beforeRouteEnter : function (to, from, next) {
        next();
    },
	beforeDestroy () {
		var _this = this;
		clearInterval( _this.newsTimeFlag );
	},
	created: function(){
		setTitle(news_title || '视听中原');
		this.initShare(news_title + '-新闻地图');
	},
}

</script>

<style scoped>
.map-vue {
    width: 100%;
    height: 100%;
    overflow: hidden;
	-webkit-overflow-scrolling:touch;
}
.map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.news-container {
	position: absolute;
	background: #fff;
	width: 100%;
	padding: 0 3%;
	left: 0;
	bottom: 50px;
	height: 0;
	overflow: auto;
	z-index: 999;
	max-height: 40vh;
}
</style>