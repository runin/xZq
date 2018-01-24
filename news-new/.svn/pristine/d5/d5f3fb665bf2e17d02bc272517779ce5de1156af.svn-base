<template>
	<section class="matrix-vue">
		<head-nav v-bind:item="hitem"></head-nav>
		<section class="content" :style="matrixStyle">
			<section class="slogan">
				<img src="data:image/png;base64,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">
			</section>
			<section class="wrapper">
				<section v-for="(item, index) in items" class="category" :style="itemStyle">
					<div class="swiper-container">
				        <div class="swiper-wrapper">
				            <div v-for="(slider, i) in item" class="swiper-slide">
				            	<section v-tap="{ methods:toMatrix, mu:slider.uu }"  class="slider-item">
					            	<i :style="'background:url(' + slider.lg + ') no-repeat #FFF;background-size:100% 100%;object-fit:cover;'"></i>
					            	<p>{{slider.nm}}</p>
					            	<i class="badge" v-if="slider.an">{{slider.an < 99 ? slider.an : '99+'}}</i>
				            	</section>
				            </div>
				        </div>
				    </div>
				</section>
			</section>
		</section>
		<foot-nav></foot-nav>
	</section>
</template>

<script>

import config from '../assets/config.js'
import swiper from '../assets/swiper.js'
import FootNav from './common/FootNav.vue'
import HeadNav from './common/HeadNav.vue'

export default{
	name: 'matrix',
	components: {
		'foot-nav' : FootNav,
		'head-nav' : HeadNav
	},

	data(){
		return {
			eu: null,
			items: null,
			auuid: null,
			avatar: null,
			nickname: '匿名',
			itemStyle: {},
			coverStyle: {},
			coverImgStyle: {},
			coverWrapperStyle: {},
			isLoaded: true,
			info: null,
			zanList: [],
			isMoreShow: false,
			isDeleteShow: false,
			sliderNum: 3.8,
			matrixStyle: {},
			hitem: {t: '新闻矩阵', s: 0},
		}
	},

	computed: {
		time: function () {
			return formatSqlTime(this.info.ct, '/');
		}
	},

	methods: {
		toMatrix: function(result){
			this.$router.push('/' + this.eu + '/matrix/' + result.mu);
		},
		itemsRemake: function(items) {
			var len = items.length, newItems = {'i1':null,'i2':null,'i3':null};
			if (len <= 12 ) {
				this.sliderNum = 4;
				var modNum = len % 4;
				var rowNum = Math.floor(len / 4) + 1;
				switch (rowNum) {
					case 1:
						newItems = {'i': items};
						break;
					case 2:
						newItems = {'i1': items.slice(0, 4), 'i2': items.slice(4, len)};
						break;
					default:
						newItems.i1 = items.slice(0, 4);
						newItems.i2 = items.slice(4, 8);
						newItems.i3 = items.slice(8, len);
				}
			} else {
				var modNum = len % 3;
				var baseNum = (len - modNum) / 3;
				newItems.i1 = items.slice(0, baseNum + modNum);
				newItems.i2 = items.slice(baseNum + modNum, 2 * baseNum + modNum);
				newItems.i3 = items.slice(2 * baseNum + modNum, len);
			}
			return newItems;
		},
		fixHeight: function() {
			var lastHeight = $(window).height() - 80 - $('.slogan').height();
			this.matrixStyle = {
				'height' : ($(window).height() - 50) + 'px'
			};
			this.itemStyle = {
				'min-height' : lastHeight / 3 + 'px'
			}
		},
		getMatrix: function() {
			var _this = this;
			_this.$http.jsonp(config.host + config.matrix, {
				params: {
					eu: this.eu
				}, jsonp: 'cb'}
			).then((response)=>{
				// console.log(response);
				var data = response.data;
				if (data && data.code == 0) {
					_this.items = _this.itemsRemake(data.items);
					this.$nextTick(function(){
						var swiper = new Swiper('.swiper-container', {
							slidesPerView: _this.sliderNum,
							spaceBetween: 0
						});
						this.fixHeight();
					});
				}
			}, (response)=>{
				console.error('新闻Matrix获取失败');
				console.error(JSON.stringify(response));
			});
		},
        initShare: function( title ){
			var _this = this;
			wx.onMenuShareAppMessage({
			    title: title,
			    desc: '视听中原，全媒体新闻平台',
			    link: location.origin + location.pathname + '#/' + _this.eu + '/matrix',
			    imgUrl: window.news_logo,
			    success: function(){
			    }
			});

			wx.onMenuShareTimeline({
			    title: title,
			    link: location.origin + location.pathname + '#/' + _this.eu + '/matrix',
			    imgUrl: window.news_logo,
			    success: function () {
			    }
			});
		},
	},

	beforeRouteEnter : function (to, from, next) {
        next();
    },

    beforeRouteLeave : function (to, from, next) {
        next();
    },

	created: function(){
		setTitle(news_title || '视听中原');
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		this.getMatrix();
		this.initShare(news_title + '-新闻矩阵');

	},
	mounted() {
		this.fixHeight();
		setTitle(news_title || '视听中原');
		this.initShare(news_title + '-新闻矩阵');
	}
}

</script>

<style scoped>
.matrix-vue {
	width: 100%;
	height: 100%;
	overflow: hidden;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#004ea2+0,002c66+100 */
  background: #004ea2; /* Old browsers */
  background: -moz-radial-gradient(center, ellipse cover,  #004ea2 0%, #002c66 100%); /* FF3.6-15 */
  background: -webkit-radial-gradient(center, ellipse cover,  #004ea2 0%,#002c66 100%); /* Chrome10-25,Safari5.1-6 */
  background: radial-gradient(ellipse at center,  #004ea2 0%,#002c66 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#004ea2', endColorstr='#002c66',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}
.content {
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: scroll;
	-webkit-overflow-scrolling:touch;
}
.slogan {
	position: relative;
	display: block;
	padding: 10vw 0;
	font-size: 0;
	margin: 0 auto;
	text-align: center;
}
/*.slogan:after {
	content: '';
	position: absolute;
	width: 80vw;
	height: 30vw;
	background: url(/static/images/light.png) no-repeat;
	background-size: 100% 100%;
	bottom: -3vw;
	left: 0;
	pointer-events: none;
}*/
.slogan img {
	height: 30px;
}
.wrapper {
	overflow: initial;
	font-size: 0;
}
.category {
	margin: 0 10px 10px;
}
.swiper-container {
	overflow: initial;
}
.slider-item {
	text-align: center;
	color: #FFF;
	margin: 0 5px;
}
.slider-item i {
	width: 100%;
	height: 0;
	padding-bottom: 100%;
	display: block;
}
.slider-item .badge {
    position: absolute;
	display: inline-block;
    text-align: center;
    width: initial;
    background: #f74c31;
    color: #fff;
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    min-width: 10px;
    -webkit-border-radius: 15px;
    top: -4px;
    right: -3px;
    font-style: normal;
}
.slider-item p {
	font-size: 11px;
	line-height: 1.4;
	margin-top: 5px;
	display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    min-height: 30px;
}
</style>