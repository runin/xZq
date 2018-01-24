<template>
	<section transition="fade" v-if="isShow" class="dialog-del">
		<section v-bind:style="dialogStyle" class="dialog">
			<section class="content">
				是否删除相册
			</section>
			<section class="control">
				<a v-tap="{methods : cancel}"  href="javascript:void(0)">取消</a>
				<a v-tap="{methods : confirm}"  href="javascript:void(0)">确定</a>
			</section>
		</section>
	</section>
</template>

<script>

export default{
	name: 'DialogDel',
	props: {
		isShow: Boolean,
	},

	data(){
		return {
			dialogStyle: {}
		}
	},

	methods: {
		
		cancel: function(){
			this.$emit('cancel');
		},

		confirm: function(){
			this.$emit('confirm');
		}
	},

	created: function(){
		var height = $(window).height();
		this.dialogStyle = {
			'top' : (height - 132) / 2 + 'px'
		}
	}
}

</script>

<style scoped>
.dialog-del{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.75);
	z-index: 2
}
.dialog-del .dialog{
	position: absolute;
	background: white url(/static/photo/bg-main.jpg) no-repeat;
	background-size: 100% 100%;
	width: 80%;
	left: 10%;
	border-radius: 5px;
	top: 50%;
	text-align: center;
}
.dialog-del .content{
	height: 85px;
	line-height: 85px;
	color: #646464;
	font-size: 16px;
}
.dialog-del .control{
	overflow: hidden;
	border-top: 1px solid rgba(220,220,220,0.5);
}
.dialog-del .control a{
	display: block;
	float: left;
	width: 50%;
	height: 46px;
	line-height: 46px;
	font-size: 16px;
	color: #f64d30;
}
.dialog-del .control a:active{
	background-color: rgba(220,220,220,0.2)
}
.dialog-del .control a:first-child{
	color: #646464;
	border-right: 1px solid rgba(220,220,220,0.5);
}

</style>