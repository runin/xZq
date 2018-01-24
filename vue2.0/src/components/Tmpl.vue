<template>
	<transition name="bottom">
		<section class="tmpl-vue">
			<header>
				<h2>换主题</h2>
				<a v-tap="{methods : back}" href="javascript:void(0);">
					<img src="/static/photo/icon-arrow.png" />
				</a>
			</header>
			<section class="tmpls">
				<section v-for="item in items" v-tap="{methods : selectTmpl, item: item}" v-bind:class="{ 'current' : item.isCurrent }" class="tmpl" v-bind:style="imageStyle">
					<section class="cover">
						<img v-bind:src="item.src" onerror="this.src='/static/photo/default.jpg'" />
						<section class="mask"></section>
					</section>
				</section>
			</section>
		</section>
	</transition>
</template>

<script>

import api from '../api/api'

export default{
	name: 'Tmpl',
	props: {
		tmpls: Array,
		tmpl: Object
	},

	data(){
		return {
			imageStyle: {},
			items: [],
		}
	},

	methods: {
		back: function(){
			this.$emit('close');
			return false;
		},

		selectTmpl: function(params){
			this.$emit('select', params.item);
			return false;
		},

		format: function(data){
			var items = [];
			for(var i in data){
				items.push({
					url : data[i].url,
					uuid : data[i].uuid,
					src : data[i].listImg,
					isCurrent : (data[i].uuid == this.tmpl.uuid) ? true : false
				});
			}
			return items;
		},
	},

	created: function(){
		var imageRatio = 0.27;
		var widthHeightRatio = 170 / 260;
		var width = $(window).width();
		this.imageStyle = {
			'width' : width * imageRatio + 'px',
			'height': width * imageRatio / widthHeightRatio + 'px',
			'margin-left': width * ( 1 - imageRatio * 3 ) / 4 + 'px',
			'margin-top': width * ( 1 - imageRatio * 3 ) / 4 + 'px'
		}

		this.items = this.format(this.tmpls);
		
	}
}

</script>

<style scoped>
.tmpl-vue{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	min-height: 100%;
	background: #fafbfd;
	z-index: 101;
}
/**
 * 顶部
 */
.tmpl-vue header{
	height: 50px;
	font-size: 14px;
	line-height: 50px;
	color: #646464;
	position: fixed;
	width: 100%;
	border-bottom: 1px solid rgb(255,255,255);
	z-index: 1;
}
.tmpl-vue header h2{
	padding-left: 12px;
	letter-spacing: 1px;
	width: 100%;
	background: white;
	box-shadow: 0px 1px 5px rgba(66,66,66,0.3);
}
.tmpl-vue header a{
	display: block;
	width: 50px;
	height: 50px;
	position: absolute;
	right: 0px;
	top: 0px;
	line-height: 12px;
	padding: 16px;
}
.tmpl-vue header a img{
	position: relative;
	top: 1px;
}

/**
 * END OF 顶部
 */

/**
 * 模板列表
 */
.tmpl-vue .tmpls{
	padding-top: 50px;
	overflow: hidden;
	padding-bottom: 50px;
}
.tmpl-vue .tmpls .tmpl{
	float: left;
	position: relative;
	-webkit-user-select:none;
	user-select:none;
}
.tmpl-vue .tmpls .tmpl.current{
	border: 1px solid rgba(246,77,48,0.5);
	box-shadow: 0px 1px 5px rgba(246,77,48,0.5);
}
.tmpl-vue .tmpls .tmpl .cover{
	width: 100%;
	height: 100%;
}
.tmpl-vue .tmpls .tmpl .cover img{
	width: 100%;
	height: 100%;
	object-fit:cover;
}
.tmpl-vue .tmpls .tmpl .mask{
	position: absolute;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.4);
	left: 0px;
	top: 0px;
}

.tmpl-vue .tmpls .tmpl:active{
	box-shadow: 0px 1px 5px rgba(246,77,48,0.5);
}
.tmpl-vue .tmpls .tmpl:active .mask,
.tmpl-vue .tmpls .tmpl.current .mask{
	display: none;
}

/**
 * END OF 模板列表
 */
</style>