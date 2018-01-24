<template>
	<section class="foot-nav-vue">
		<a href="javascript:void(0);" class="nav-jx active" v-tap="{ methods:toNav, nav:'' }">读</a>
		<a href="http://statics.holdfun.cn/audio/video.html" class="nav-dt" >看</a>
		<a href="http://statics.holdfun.cn/audio/index.html" class="nav-jz" >听</a>
		<a href="http://statics.holdfun.cn/audio/live.html" class="nav-xs" >玩</a>
	</section>
</template>

<script>
export default{
	data() {
		return {
			eu: null,
			isHome: false,
			isMap: false,
			isMatrix: false,
			isClue: false
		}
	},
	created: function() {
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3);
    }else {
      this.eu = this.$route.params.eu;
    }
		if (this.$route.path.indexOf('/map') >= 0) {
			this.isMap = true;
		} else if (this.$route.path.indexOf('/matrix') >= 0) {
			this.isMatrix = true;
		} else if (this.$route.path.indexOf('/clue') >= 0) {
			this.isClue = true;
		} else {
			this.isHome = true;
		}
	},
	methods: {
		toNav: function(result){
			this.$router.push('/' + this.eu + '/' + result.nav);
		}
	}
}
</script>

<style scoped>
.foot-nav-vue {
	position: fixed;
	width: 100%;
	left: 0;
	bottom: 0;
	font-size: 0;
	padding: 8px 0 5px;
	background: #f6f6f6;
	border-top: 1px solid #d5d4d4;
	z-index: 999;
}
.foot-nav-vue a {
	position: relative;
	width: 25%;
	text-align: center;
	font-size: 12px;
	display: inline-block;
	padding-top: 25px;
	color: #9a9a9a;
}
/*.foot-nav-vue a:hover, */
.foot-nav-vue a.active {
	color: #5caaf2;
}
.foot-nav-vue a:before {
	content: '';
	position: absolute;
	top: 0;
	left: 50%;
	margin-left: -10px;
	width: 22px;
	height: 22px;
    background: url(http://statics.holdfun.cn/audio/images/icon-nav.png) no-repeat transparent;
    background-size: 88px auto;
}
.foot-nav-vue .nav-jx:before {
    background-position: 0 0;
}
.foot-nav-vue .nav-dt:before {
    background-position: -22px 0;
}
.foot-nav-vue .nav-jz:before {
    background-position: -44px 0;
}
.foot-nav-vue .nav-xs:before {
    background-position: -66px 0;
}
/*.foot-nav-vue .nav-jx:hover:before, */
.foot-nav-vue .nav-jx.active:before {
    background-position: 0 -22px;
}
/*.foot-nav-vue .nav-dt:hover:before, */
.foot-nav-vue .nav-dt.active:before {
    background-position: -22px -22px;
}
/*.foot-nav-vue .nav-jz:hover:before, */
.foot-nav-vue .nav-jz.active:before {
    background-position: -44px -22px;
}
/*.foot-nav-vue .nav-xs:hover:before, */
.foot-nav-vue .nav-xs.active:before {
    background-position: -66px -22px;
}
</style>