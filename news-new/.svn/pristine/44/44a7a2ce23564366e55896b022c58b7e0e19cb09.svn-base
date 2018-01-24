<template>
	<div class="news-list-vue" v-tap="{ methods:toArticle, au:item.uu }">
		<div class="cover">
			<img :src="item.pt">
			<p class="flag" :class="newsStyle" >{{ newsStyleName }}</p>
		</div>
		<h1 class="title">{{ item.tt }}</h1>
		<p class="tail">
			<span class="tvname">{{ item.an }}</span>
			<span class="num">{{ item.pn }}</span>
		</p>
	</div>
</template>

<script>
export default{
	props: {
		item: Object
	},
	data() {
		return {
			eu: null,
			newsStyle: 'none',
			newsStyleName: '图文',
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
		if (this.item.tc == 3) {
			this.newsStyle = 'type0';
			this.newsStyleName = '视频';
		} else if (this.item.tc == 4) {
			this.newsStyle = 'type1';
			this.newsStyleName = '直播';
		}
	},
	methods: {
		toArticle: function(result){
			this.$router.push('/' + this.eu + '/article/' + result.au);
		}
	}
}
</script>

<style scoped>
.news-list-vue {
	position: relative;
	width: 100%;
	height: 88px;
	padding: 10px 0 8px 85px;
	font-size: 14px;
	color: #888;
	border-bottom: 1px solid #ccc;
}
.news-list-vue:nth-last-of-type(1) {
	border-bottom: 0;
}
.news-list-vue .cover {
	position: absolute;
	width: 70px;
	height: 70px;
	top: 8px;
	left: 0;
	overflow: hidden;
}
.news-list-vue .cover img {
	position: relative;
	left: -57%;
	width: auto;
	max-width: initial;
	height: 85px;
}
.news-list-vue .cover .flag {
	position: absolute;
	top: 0;
	left: 0;
	color: #FFF;
	font-size: 12px;
	padding: 0 4px;
	background: #5caaf2;
}
.news-list-vue  .cover .type1 {
	background: #ff4c6a;
}
.news-list-vue .title {
	display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-word;
    line-height: 1.3;
}
.news-list-vue .tail {
	position: absolute;
	bottom: 12px;
	font-size: 12px;
}
.news-list-vue .tail .num {
	padding: 2px 10px;
}
.news-list-vue .tail .num:before {
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
</style>