<template>
	<transition name="fadein">
		<section v-tap="{methods : close}" class="dialog-share-vue">
			<section class="dialog">
				<img src="/static/photo/tips-share-simple.png" />
			</section>
		</section>
	</transition>
</template>

<script>

export default{
	name: 'DialogShare',
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
	background: rgba(0,0,0,0.75);
	z-index: 102;
}
.dialog-share-vue .dialog{
	position: absolute;
	width: 66%;
	right: 5%;
	top:2%;
	text-align: center;
	z-index: 2;
}
</style>