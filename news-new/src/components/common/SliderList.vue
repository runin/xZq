<template>
	<div class="swiper-slide-vue swiper-slide" v-tap="{ methods:toArticle, au:slider.uu }">
		<div class="slider">
			<div class="desc">
				<p class="tail" :class="newsStyle"><span class="flag">{{ newsStyleName }}</span><span class="num">{{slider.pn}}</span></p>
				<p class="title"><span>{{slider.tt}}</span></p>
			</div>
			<div class="sliderCover" :style="'background:url(' + slider.pt + ') no-repeat;background-size:cover;background-position:center center;'"></div>
		</div>
	</div>
</template>

<script>
export default{
	props: {
		slider: Object
	},
	data() {
		return {
			eu: null,
			newsStyle: 'none',
			newsStyleName: '图文',
			sliderStyle: {},
		}
	},
	computed: {
	},
	created: function() {
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		if (this.slider.tc == 3) {
			this.newsStyle = 'type0';
			this.newsStyleName = '视频';
		} else if (this.slider.tc == 4) {
			this.newsStyle = 'type1';
			this.newsStyleName = '直播';
		}
		this.sliderStyle = {
			'width': Math.round($(window).width() * 0.92) + 'px',
			'height': Math.round($(window).width() * 0.52) + 'px'
		};
	},
	methods: {
		toArticle: function(result){
			this.$router.push('/' + this.eu + '/article/' + result.au);
		}
	}
}
</script>

<style scoped>
.swiper-slide-vue {
	position: relative;
	font-size: 0;
}
.swiper-slide-active {
	z-index: 1;
}
.swiper-slide .desc {
	position: absolute;
	width: 100%;
	left: 0;
	bottom: 0;
	font-size: 15px;
	color: #FFF;
	z-index: 2;
}
.swiper-slide .title {
	line-height: 1.5;
	background: rgba(0,0,0,.4);
	padding: 7px 10px;
}
.swiper-slide .title span {
	display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.swiper-slide .tail {
	padding: 0 0 6px 10px;
	font-size: 12px;
}
.swiper-slide .tail .flag {
	padding: 2px 10px;
	background: #5caaf2;
}
.swiper-slide .tail .num {
	padding: 2px 10px;
	background: rgba(0,73,152,.8);
}
.swiper-slide .type1 .flag {
	background: #ff4c6a;
}
.swiper-slide .type1 .num {
	background: rgba(155,0,26,.8);
}
.swiper-slide .tail .num:before {
	content: '';
	position: relative;
	top: 1px;
	display: inline-block;
	width: 12px;
	height: 13px;
	margin-right: 4px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABKBAMAAAAbAFTyAAAAA3NCSVQICAjb4U/gAAAAMFBMVEX///////////////////////////////////////////////////////////////9Or7hAAAAAEHRSTlMAESIzRFVmd4iZqrvM3e7/dpUBFQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAKcSURBVEiJtVbNbtNAELYdk6SlVL2CgPbUW9O+ACRHLlV5AtoXQCl3BH2DAEJIgIR7RkhBQkJckKnEAamCIOAeQMANufy1tMT+mF2vHe/OOs0BvkPsmf28Ozu/cRwd555GX5+0nFHw7kEguTGC4wZQuF5OupBxkJwv49TF8uD+A/H4XUbq0uJNevri1E07ZzK3Rdh2YCfRyjv16veBazbOEbJnJhNOAr9spAawlQtuD8mchRQiLqgXgIfW034WRN963hSwUZQ7GHDSCuKZonwK4F4PsavJVYtRHvBBU7gRvpukqmGSMGrXJB0FlnRNE39M0jRiQ3MMiUlqYt/QTLC9nTazgKxcM1Qdzd8CPrsKJZx5YY8nXogd00zuzbFIPbw3SRGe/bfjgnFuN5afVrFnaGo86xZZNVKtzhmqaRZzrhHftXRNk1d6ldV1wDPTteT4N5NEaaBfr2brPk0kWt2d5okpK0EzKuB14DgVvfipNfzgJPq02Gwa9i5Gxf8mF7y+0RoUKKDDBrUAFnCJi9RXP2cWRfTFGucsyyb/KL1EKN7jlsk5rkbBYzpxPkzf9w2rKtST8UIOjO1XciL06OetTlol1XPnTD5b4iVfsLSso0DhCz2vZPNnnfKCjNfC2aExIQxwL0vO4JJQnoCW5WI8qQvP3325fUu5q60NK5I+cac4flToPuTrhKcF4WzB7xTMjzaO40XDoIclG8mtVKnXSsaWI7NqLz9to4REvlHndW2jRmFKlUPFnqgpssXJknGbIkjreNE+SBUaadvosFlQxER6qz4fWQVQv3stY2KZyEOEIjJ1PkI0tEUmkCdsBZZjVnhxdoQrBeQmK+X/giTqogVeLY1uCorxOkXu4PYo3BHRw+HY+Yek7uGkzb9yVnC5RAffQAAAAABJRU5ErkJggg==) no-repeat;
	background-size: 100% 100%;
}
.slider {
	width: 100%;
	height: calc(100vw * 0.52);
	height: -webkit-calc(100vw * 0.52);
    background: #FFF;

    -webkit-transition: -webkit-transform ease-out 400ms;
    transition: -webkit-transform ease-out 400ms;
}
.slider img {
	width: 100%;
	height: 185px;
}
.swiper-slide-active .slider {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    transform: scale(1);
    -webkit-transform: scale(1);
}
.sliderCover {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
</style>