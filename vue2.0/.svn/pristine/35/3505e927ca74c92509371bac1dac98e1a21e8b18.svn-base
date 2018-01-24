<template>
	<section>
		<my-likes-header></my-likes-header>
		<section v-if="items.length"  class="my-likes-vue">
			<h2>{{ total }}个喜欢<img src="/static/photo/icon-heart-active.png"></h2>
			<section class="list-wrapper">
				<multi-list v-for="item in items" v-bind:item="item" v-bind:tips="'喜欢了你的相册'" ></multi-list>
			</section>
		</section>
	</section>
</template>

<script>

import MyLikesHeader from './common/MyLikesHeader.vue'
import MultiList from './common/MultiList.vue'
import ListLabel from './common/ListLabel.vue'
import api from '../api/api'

export default{
	name: 'MyLikes',
	components: {
		'my-likes-header': MyLikesHeader,
		'multi-list': MultiList,
		'list-label' : ListLabel
	},

	data(){
		return {
			items: [],
			total: 0
		}
	},

	methods: {
		
		format: function(datas){
			var result = [];
			for(var i in datas){
				result.push({
					'src' : datas[i].headimgurl,
					'title' : datas[i].nickname,
					'name' : datas[i].atitle,
					'time' : datas[i].vt,
					'auuid' : datas[i].auuid
				});
			}
			return result;
		}

	},

	beforeRouteEnter : function (to, from, next) {
        setTitle('我的相册');
        next();
    },

	created: function(){
		var that = this;
		api.getAllLikes().then(function(result){
			that.total = result.data.total;
			that.items = that.format(result.data.prises);
		});
	}
}

</script>

<style scoped>


/**
 * 相册访客
 */
.my-likes-vue{
	padding-top: 45px;
	background: white;
}

.my-likes-vue h2{
	font-size: 18px;
	color: #646464;
	border-bottom: 1px solid rgba(220,220,220,0.5);
	height: 75px;
	line-height: 75px;
	text-align: center;
}
.my-likes-vue h2 img{
	height: 18px;
	position: relative;
	top: 2px;
	left: 3px;
}
</style>