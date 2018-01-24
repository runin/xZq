<template>
	<div class="comment-list-vue talk-list">
		<img :src="item.hi">
		<i class="time">{{item.tm}}</i>
		<div class="chat">
			<p class="user-name">{{item.nn}}</p>
			<p class="user-talk">{{item.ct}}</p>
		</div>
	</div>
</template>

<script>
export default{
	name: 'conmentlist',
	props: {
		item: Object
	},
	data() {
		return {
		}
	},
}
</script>

<style scoped>
.talk-list {
	position: relative;
	width: 100%;
	padding-left: 50px;
	font-size: 13px;
	color: #6b7b82;
	min-height: 50px;
	margin-bottom: 8px;
}
.talk-list img {
	position: absolute;
	top: 2px;
	left: 0;
	width: 38px;
	height: 38px;
	border-radius: 100%;
	overflow: hidden;
}
.talk-list .time {
	position: absolute;
	font-size: 12px;
	font-style: normal;
	top: 1px;
	right: 0;
}
.talk-list .user-name {
	width: calc(100% - 125px);
	width: -webkit-calc(100% - 125px);
	display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-bottom: 5px;
    font-size: 14px;
    white-space: nowrap;
}
.talk-list .user-talk {
	line-height: 1.4;
	word-break: break-word;
}
</style>