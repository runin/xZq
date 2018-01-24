<template>
	<section>
		<my-likes-header></my-likes-header>
		<section v-if="items.length" class="my-visits-vue">
			<h2>
				<p>{{ total }}</p>
				<label>累积访客</label>
			</h2>
			<section class="list-wrapper">
				<multi-list v-for="item in items" v-bind:item="item"  v-bind:tips="'查看了相册'" ></multi-list>
				<section class="empty-tips" v-if="isEmpty">暂无访客</section>
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
	name: 'MyVisits',
	components: {
		'my-likes-header': MyLikesHeader,
		'multi-list': MultiList,
		'list-label' : ListLabel
	},

	data(){
		return {
			isEmpty: false,
			items: [],
			visitsTips: '0个访客',
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
        	that.isEmpty = false;
        	that.total = result.data.total;
			that.items = that.format(result.data.prises);
        }, function(){
        	that.isEmpty = true;
        });
	}

}

</script>

<style scoped>


/**
 * 相册访客
 */
.my-visits-vue{
	padding-top: 45px;
	background: white;
}

.my-visits-vue h2{
	border-bottom: 1px solid rgba(220,220,220,0.5);
	height: 75px;
	text-align: center;
	padding-top: 18px;
}
.my-visits-vue h2 p{
	font-size: 18px;
	color: #646464;
	line-height: 20px;
}
.my-visits-vue h2 label{
	font-size: 12px;
	color: #999999;
	line-height: 20px;
}
</style>