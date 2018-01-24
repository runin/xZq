<template>
	<transition name="fadein">
		<section v-tap="{methods : close}" class="dialog-share-vue">
			<section class="dialog">
				<img src="/static/photo/qrcode.png" />
				<img class="light" src="/static/photo/qrcode-light.png" />
				<img class="light-ball-1" src="/static/photo/light-ball.png" />
				<img class="light-ball-2" src="/static/photo/light-ball.png" />
				<img class="light-ball-3" src="/static/photo/light-ball.png" />
				<img class="light-ball-4" src="/static/photo/light-ball.png" />
				<img class="light-ball-5" src="/static/photo/light-ball.png" />
			</section>
			<img class="light-left" src="/static/photo/light-left.png" />
			<img class="light-right" src="/static/photo/light-right.png" />
		</section>
	</transition>
</template>

<script>

export default{
	name: 'DialogQrcode',
	data(){
		return {
			isShow: false
		}
	},

	methods: {
		close : function(){
			this.isShow = false;
			this.$emit('close')
		}
	}
}

</script>

<style scoped>
.dialog-share-vue{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.90);
	z-index: 102;
}
.dialog-share-vue .dialog{
	position: absolute;
	width: 90%;
	left: 5%;
	top:5%;
	text-align: center;
	z-index: 2;
}
@keyframes qrlight{
	0%{
		transform: translate(0, -20px) scaleX(0.85);
		opacity: 0;
	}
	50%{
		transform: translate(0, 0) scaleX(0.85);
		opacity: 1;
	}
	100%{
		transform: translate(0, 20px) scaleX(0.85);
		opacity: 0;
	}
}
.light{
	position: absolute;
	z-index: 2;
	width: 24.46%;
	left: 36.8%;
	top: 78.5%;
	animation: qrlight 4s 0s infinite linear;
	opacity: 0;
}

@keyframes qrleftlight{
	0%{
		transform: rotate(0deg);
	}
	50%{
		transform: rotate(-15deg);
	}
	100%{
		transform: rotate(0deg);
	}
}
@keyframes qrrightlight{
	0%{
		transform: rotate(0deg);
	}
	50%{
		transform: rotate(15deg);
	}
	100%{
		transform: rotate(0deg);
	}
}
@keyframes ballflash{
	0%{
		opacity: 0;
	}
	50%{
		opacity: 1;
	}
	100%{
		opacity: 0;
	}
}

.light-left{
	position: absolute;
	z-index: 2;
	width: 32.4%;
	height: 34.9%;
	left: 23%;
	top: 0%;
	animation: qrleftlight 8s 3s infinite linear;
	transform-origin: 0% 0%;
}
.light-right{
	position: absolute;
	z-index: 2;
	width: 32.4%;
	height: 34.9%;
	right: 23%;
	top: 0%;
	animation: qrrightlight 8s 0s infinite ease;
	transform-origin: 100% 0%;
}
.light-ball-1{
	opacity: 0;
    position: absolute;
    z-index: 2;
    width: 9%;
    left: 8.5%;
    top: 4%;
    animation: ballflash 4s 0s infinite ease;
}
.light-ball-2{
	opacity: 0;
    position: absolute;
    z-index: 2;
    width: 12%;
    left: 22%;
    top: 1%;
    animation: ballflash 3s 3s infinite ease;
}
.light-ball-3{
	opacity: 0;
    position: absolute;
    z-index: 2;
    width: 10%;
    right: 8.5%;
    top: 3%;
    animation: ballflash 6s 1s infinite ease;
}
.light-ball-4{
	opacity: 0;
    position: absolute;
    z-index: 2;
    width: 8%;
    left: 11%;
    top: 86.5%;
    animation: ballflash 5s 4s infinite ease;
}
.light-ball-5{
	opacity: 0;
   	position: absolute;
    z-index: 2;
    width: 8%;
    right: 12.5%;
    top: 86%;
    animation: ballflash 2s 0s infinite ease;
}
</style>