<template>
	<section class="wrapper">
		<p class="slogon" v-bind:style="textStyle">
			<transition name="coverfade">
				<img v-if="isCover1" src="/static/photo/cover1/slogon.png" />
			</transition>
			<transition name="coverfade">
				<img v-if="isCover2" src="/static/photo/cover2/slogon.png" />
			</transition>
		</p>
		<section class="cover-wrapper" v-bind:style="coverStyle">
			<transition name="coverfade">
				<section v-if="isCover1" v-bind:class="{'animate': isCover1Animate}" class="cover1">
					<img class="bg" src="/static/photo/cover1/camera.jpg" />
					<img class="bg-finish" src="/static/photo/cover1/camera-finish.jpg" />
					<img class="finger" src="/static/photo/cover1/finger.png" />
					<img class="flash" src="/static/photo/cover1/flash.png" />
					<img class="birds" src="/static/photo/cover1/birds.png" />

					<img class="flower1" src="/static/photo/cover1/flower1.png" />
					<img class="flower2" src="/static/photo/cover1/flower2.png" />
					<img class="flower3" src="/static/photo/cover1/flower3.png" />
					<img class="flower4" src="/static/photo/cover1/flower4.png" />
					<img class="flower5" src="/static/photo/cover1/flower5.png" />
				</section>
			</transition>
			<transition name="coverfade">
				<section v-if="isCover2" v-bind:class="{'animate': isCover2Animate}" class="cover2">
					<img class="bg" src="/static/photo/cover2/baby.jpg" />
					<img class="flower" src="/static/photo/cover2/flower.png" />
					<img class="leave-top" src="/static/photo/cover2/leave-top.png" />
					<img class="leave" src="/static/photo/cover2/leave.png" />
					<img class="leave-shadow" src="/static/photo/cover2/leave-shadow.png" />
					<img class="light" src="/static/photo/cover2/light.png" />
					<img class="light2" src="/static/photo/cover2/light.png" />
				</section>
			</transition>
		</section>

		<section v-bind:style="btnStyle">
			<a class="btn" v-tap="{ methods : toUpload }"  href="javascript:void(0);">
				开始制作
			</a>
		</section>
	</section>
</template>

<script>

import imgReady from 'img-ready'

export default{
	name: 'Create',

	data(){
		return {
			textStyle: null,
			coverStyle: null,
			btnStyle: null,
			isCover1: true,
			isCover2: false,
			isCover1Animate: false,
			isCover2Animate: false
		}
	},

	methods: {
		toUpload: function(){
			this.$router.replace('/upload');
			return false;
		},

		playCover1: function(){
			this.isCover1 = true;
		},
		playCover2: function(){
			this.isCover2 = true;
		},

		playCover: function(i){
			var that = this;
			if(i == 1){
				imgReady('/static/photo/cover1/camera.jpg', function(e) {
					imgReady('/static/photo/cover1/finger.png', function(e) {
						that.isCover1Animate = false;
						that.isCover2 = false;
						that.isCover1 = true;
						setTimeout(function(){
							that.isCover1Animate = true;
						}, 1500);
						setTimeout(function(){
							that.playCover(2);
						}, 7000);
					});
				});
			}else{
				imgReady('/static/photo/cover2/baby.jpg', function(e) {
					imgReady('/static/photo/cover2/flower.png', function(e) {
						that.isCover2Animate = false;
						that.isCover1 = false;
						that.isCover2 = true;
						setTimeout(function(){
							that.isCover2Animate = true;
						}, 1500);
						setTimeout(function(){
							that.playCover(1);
						}, 7000);
					});
				});
			}
		}
	},

    beforeRouteEnter : function (to, from, next) {
        setTitle('创建相册');
        next();
    },

	created: function(){
		var coverRatio = 640 / 501;
		var textRatio = 415 / 594;
		var btnRatio = 179 / 594;
		
		var width = $(window).width();
		var height = $(window).height();

		var coverHeight = width / coverRatio;
		var restHeight = height - coverHeight;

		this.textStyle = {
			'height' : textRatio * restHeight + 'px'
		}

		this.coverStyle = {
			'height' : coverHeight + 'px'
		}

		this.btnStyle = {
			'height' : btnRatio * restHeight + 'px'
		}

		
		this.playCover(1);
	}
}

</script>

<style scoped>
.wrapper{
	background: #f1f5f8;
}
.slogon{
	text-align: center;
	position: relative;
}
.slogon img{
	width: 20%;
	left: 40%;
	position: absolute;
	top: 10%;
	z-index: 1;
}
.btn{
	margin-top: 10px;
	display: block;
	font-size: 16px;
	text-align: center;
	line-height: 42px;
	color: rgb(246,77,48);
	border: 1px solid rgba(246, 77, 48, 0.5);
	width: 40%;
	margin: 0 auto;
	border-radius: 5px;
	position: relative;
	z-index: 1;
}
.btn:active{
	background: rgba(246, 77, 48, 0.2);
}
.cover-wrapper{
	position: relative;
}
/**
 * cover1
 */
.cover1{
	position: absolute;
	height: 100%;
	width: 100%;
	left: 0px;
	top: 0px;
}
.cover1 .bg{
	display: block;
	width: 100%;
	height: 100%;
	position: relative;
	top: 5%;
}
.cover1 img{
	position: absolute;
}
.cover1 .bg-finish{
    width: 100%;
    top: 5%;
    left: 0;
    opacity: 0;
}
.cover1 .finger{
    width: 20%;
    top: 16%;
    right: 21%;
    transform-origin: right;
}
.cover1 .flash{
    width: 25%;
    top: 33.5%;
    right: 35.5%;
    opacity: 0;
}
.cover1 .birds{
    width: 10%;
    top: 25%;
    left: 18%;
    transform: scale(1.8);
    opacity: 0;
}
.cover1 .flower1{
	width: 9%;
    top: 5%;
    right: 13%;
    opacity: 0;
}
.cover1 .flower2{
	width: 4.7%;
    top: 51%;
    right: 39%;
    opacity: 0;
}
.cover1 .flower3{
    width: 6.7%;
    top: 30.5%;
    right: 28%;
    opacity: 0;
}
.cover1 .flower4{
    width: 3.2%;
    top: 39%;
    left: 17%;
    opacity: 0;
}
.cover1 .flower5{
	width: 14.7%;
    top: 13.5%;
    right: 42%;
    opacity: 0;
}
.cover1.animate .finger{
	-webkit-animation: finger-touch 1.5s ease 1s;
}
.cover1.animate .flash{
	-webkit-animation: flash 2.1s ease 1.4s;
}
.cover1.animate .bg-finish{
	-webkit-animation: cover-show 1.5s ease 2.5s both;
}
.cover1.animate .birds{
	-webkit-animation: birds-fly 4s linear 0s both;
}
.cover1.animate .flower5{
	-webkit-animation: flower5 3s linear 1s both;
}
.cover1.animate .flower4{
	-webkit-animation: flower4 3.8s linear 0.4s both;
}
.cover1.animate .flower3{
	-webkit-animation: flower3 2.4s linear 1.8s both;
}
.cover1.animate .flower2{
	-webkit-animation: flower2 2.4s linear 1.3s both;
}
.cover1.animate .flower1{
	-webkit-animation: flower1 3.5s linear 0.3s both;
}
/**
 * END OF cover1
 */

/**
 * cover2
 */
.cover2{
	position: absolute;
	height: 100%;
	width: 100%;
	left: 0px;
	top: 0px;
}
.cover2 .bg{
	display: block;
	width: 100%;
	height: 100%;
	position: relative;
	top: 5%;
}
.cover2 img{
	position: absolute;
}
.cover2 .flower{
    width: 19.5%;
    top: 19%;
    right: 13.5%;
    transform-origin: bottom;
}
.cover2 .leave-top{
	width: 10.9%;
    top: 32%;
    right: 15.5%;
}
.cover2 .leave{
    width: 10.7%;
    top: 34%;
    right: 4%;
    opacity: 0;
}
.cover2 .leave-shadow{
	width: 11.6%;
    top: 75%;
    right: 12%;
    transform: scale(0.1);
}
.cover2 .light{
    width: 55.3%;
    top: 16%;
    right: 25%;
    opacity: 0;
}
.cover2 .light2{
	width: 55.3%;
    top: 15%;
    left: 2%;
    opacity: 0;
}
.cover2.animate .light2{
	-webkit-animation: light-show 2s linear 0s both;
}
.cover2.animate .light{
	-webkit-animation: light-show 1.8s linear 1.8s both;
}
.cover2.animate .flower{
	-webkit-animation: flower-swing 4s ease-in-out 0s both 2;
}
.cover2.animate .leave-top{
	-webkit-animation: leave-fade 3s linear 0s both;
}
.cover2.animate .leave{
	-webkit-animation: leave-drop 3s ease 1s both;
}
.cover2.animate .leave-shadow{
	-webkit-animation: leave-shadow 3s ease 1s both;
}
/**
 * END OF cover2
 */

.coverfade-enter-active, .coverfade-leave-active {
  transition: opacity 1.5s
}
.coverfade-enter, .coverfade-leave-active {
  opacity: 0
}
</style>