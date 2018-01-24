<template>
	<section>
		<likes-header v-bind:id="id"></likes-header>
		<section class="visits-vue">
			<list-label v-bind:text="visitsTips"></list-label>
			<section class="list-wrapper">
				<single-list v-for="item in items" v-bind:item="item"></single-list>
			</section>
		</section>
	</section>
</template>

<script>

import LikesHeader from './common/LikesHeader.vue'
import SingleList from './common/SingleList.vue'
import ListLabel from './common/ListLabel.vue'
import api from '../api/api'

export default{
	name: 'Visits',
	components: {
		'likes-header': LikesHeader,
		'single-list': SingleList,
		'list-label' : ListLabel
	},

	data(){
		return {
			id: null,
			items: [],
			visitsTips: '0个访客'
		}
	},

	methods: {
		
		format: function(datas){
			var result = [];
			for(var i in datas){
				result.push({
					'src' : datas[i].nickname,
					'content' : datas[i].headimgurl,
					'time' : datas[i].vt
				});
			}
			return result;
		}

	},

	created: function(){
		this.id = this.$route.params.id;
		var that = this;
		api.getAlbumVisits(this.id).then(function(result){
			that.visitsTips = result.data.total + '个访客';
			that.items = that.format(result.data.visitors);
		}, function(){

		});
	}

}

</script>

<style scoped>


/**
 * 相册访客
 */
.visits-vue{
	padding-top: 45px;
}
</style>