<template>
	<section class="news-block-vue" v-tap="{ methods:toArticle, au:item.uu }">
		<div class="card-img" :style="'background:url(' + item.pt + ') no-repeat;background-size:cover;'">
			<span :class="newsStyle" >{{ newsStyleName }}</span>
		</div>
		<div class="title-content"><p class="card-title">{{ item.tt }}</p></div>
		<div class="card-info">
			<p class="pname">{{ item.an }}</p>
			<i>|</i>
			<p class="pnum">{{ item.pn }}</p>
		</div>
	</section>
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
.news-block-vue {
	position: relative;
	display: block;
	width: calc((100% - 6px) / 2);
	width: -webkit-calc((100% - 6px) / 2);
	float: left;
	margin-bottom: 6px;
	border: 1px solid #e5e5e5;
}
.news-block-vue:nth-child(odd) {
	margin-right: 6px;
}
.news-block-vue .card-img {
	position: relative;
	height: 0;
	padding-bottom: 57%;
}
.news-block-vue .card-img .type1 {
	background: #ff5353;
}
.news-block-vue .card-img span {
	position: absolute;
	top: 0;
	left: 0;
	padding: 2px 8px;
	font-size: 12px;
	color: #FFF;
	background: #5caaf2;
}
.news-block-vue .card-img img {
	width: 100%;
	height: 94px;
}
.title-content {
	padding: 0 5px;
	margin: 5px auto 8px;
	height: 40px;
}
.news-block-vue .card-title {
	width: 100%;
	font-size: 13px;
	color: #111;
	display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.news-block-vue .card-info {
	/*position: absolute;*/
	font-size: 12px;
	color: #757575;
	padding: 5px;
	width: 100%;
	/*bottom: 0;*/
	/*left: 0;*/
}
.news-block-vue .card-info p {
	display: inline-block;
}
.news-block-vue .card-info .pname {
	max-width: 50%;
	/*display: -webkit-box;*/
	display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    /*float: left;*/
    vertical-align: bottom;
    height: 16px;
    white-space: nowrap;
}
.news-block-vue .card-info i {
	position: relative;
	top: -1px;
	font-style: normal;
	font-size: 12px;
	color: #222;
	padding: 0 3px;
    vertical-align: bottom;
}
.news-block-vue .card-info .pnum:before {
	content: '';
	position: relative;
	top: 1px;
	display: inline-block;
	width: 13px;
	height: 13px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABKBAMAAAAbAFTyAAAAA3NCSVQICAjb4U/gAAAAMFBMVEX///91dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXXGulhdAAAAEHRSTlMAESIzRFVmd4iZqrvM3e7/dpUBFQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAKcSURBVEiJtVbNbtNAELYdk6SlVL2CgPbUW9O+ACRHLlV5AtoXQCl3BH2DAEJIgIR7RkhBQkJckKnEAamCIOAeQMANufy1tMT+mF2vHe/OOs0BvkPsmf28Ozu/cRwd555GX5+0nFHw7kEguTGC4wZQuF5OupBxkJwv49TF8uD+A/H4XUbq0uJNevri1E07ZzK3Rdh2YCfRyjv16veBazbOEbJnJhNOAr9spAawlQtuD8mchRQiLqgXgIfW034WRN963hSwUZQ7GHDSCuKZonwK4F4PsavJVYtRHvBBU7gRvpukqmGSMGrXJB0FlnRNE39M0jRiQ3MMiUlqYt/QTLC9nTazgKxcM1Qdzd8CPrsKJZx5YY8nXogd00zuzbFIPbw3SRGe/bfjgnFuN5afVrFnaGo86xZZNVKtzhmqaRZzrhHftXRNk1d6ldV1wDPTteT4N5NEaaBfr2brPk0kWt2d5okpK0EzKuB14DgVvfipNfzgJPq02Gwa9i5Gxf8mF7y+0RoUKKDDBrUAFnCJi9RXP2cWRfTFGucsyyb/KL1EKN7jlsk5rkbBYzpxPkzf9w2rKtST8UIOjO1XciL06OetTlol1XPnTD5b4iVfsLSso0DhCz2vZPNnnfKCjNfC2aExIQxwL0vO4JJQnoCW5WI8qQvP3325fUu5q60NK5I+cac4flToPuTrhKcF4WzB7xTMjzaO40XDoIclG8mtVKnXSsaWI7NqLz9to4REvlHndW2jRmFKlUPFnqgpssXJknGbIkjreNE+SBUaadvosFlQxER6qz4fWQVQv3stY2KZyEOEIjJ1PkI0tEUmkCdsBZZjVnhxdoQrBeQmK+X/giTqogVeLY1uCorxOkXu4PYo3BHRw+HY+Yek7uGkzb9yVnC5RAffQAAAAABJRU5ErkJggg==) no-repeat;
	background-size: 100%;
	margin-right: 3px;
}
</style>