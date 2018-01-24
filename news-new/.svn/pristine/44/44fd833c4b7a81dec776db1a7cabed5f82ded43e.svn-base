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
    console.log('this.eufrg',this.eu)
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
</style>