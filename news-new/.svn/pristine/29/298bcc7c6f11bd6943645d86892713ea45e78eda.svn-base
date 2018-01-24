<template>
	<section class="head-nav-vue" v-if="isAPP">
		<a href="javascript:;" class="head-back" v-tap="{ methods:toBack }" v-if="item.s"></a>
		<p class="title">{{ item.t }}</p>
	</section>
</template>

<script>
export default{
	props: {
		item: Object,
	},
	data() {
		return {
			isAPP: ($.fn.cookie('useId') == 'holdfun') ? true : false,
		}
	},
	methods: {
		toBack: function(result){
			this.$router.back();
		}
	}
}
</script>

<style scoped>
.head-nav-vue {
	position: fixed;
	background: #22292c;
	color: #333;
	padding-top: 20px;
	height: 64px;
    background: #F8F8F8;
    border-bottom: 1px solid #d5d4d4;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}
.title {
	position: absolute;
	width: 60%;
	top: 20px;
	left: 20%;
	height: 44px;
	line-height: 44px;
	font-size: 18px;
	text-align: center;
	overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.head-back {
	position: absolute;
	display: block;
	width: 26px;
	height: 26px;
	border: 1px solid #d5d4d4;
	border-radius: 100%;
	top: 30px;
	left: 10px;
}
.head-back:after {
	content: '';
	display: block;
	position: absolute;
	width: 6px;
	height: 12px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAACxSURBVCiRjdKxDcIwEIXhP44oXDEBFMwRIRagYRkXaZBASIfEMNBawjReIw0D0KQPjRMFiLGvu9OnV9xd0XUdsRKRFSCAK2IwIAcsgVZlIIDLT+IEOhljapWDAFQOGmAKAZRa6yTqE28p1MNi1Ee3r4At8Ax9LSLHKVhaa1/e+yuwA+bA2ns/q6rq/p2IMaYBNv+Shz2m8MdlIvgAMPk94QAPYBFG+9Sb9biNwhE+A+4NxD9hexL7fc4AAAAASUVORK5CYII=) no-repeat;
	background-size: 100% 100%;
	top: 6px;
	left: 8px;
}
</style>