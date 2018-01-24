<template>
	<section class='bar-alert-vue'>
		
	</section>
</template>

<script>

export default{
	name: 'BarAlert',
	data(){
		return {
			isShow: false
		}
	},

	methods: {
		close : function(){
			this.isShow = false;
		}
	},

	created: function(){
		var that = this;
		this.$on('showDialogShare', function(){
			that.isShow = true;
		});
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
	background: rgba(0,0,0,0.75);
}
.dialog-share-vue .dialog{
	position: absolute;
	width: 66%;
	right: 5%;
	top:2%;
	text-align: center;
}
</style>