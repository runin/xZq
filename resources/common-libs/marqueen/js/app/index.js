(function($) {
	H.index = {
		init: function () {
			// 上滚动
            $("#marqueen").marqueen({
            	mode: "top",	//滚动模式，top是向上滚动，left是朝左滚动
				container: "#marqueen ul",	//包含的容器
            	row: 2,	//滚动行数
            	speed: 20	//轮播速度，单位ms
            });

            // 左滚动
            $("#marqueen1").marqueen({
            	mode: "left",	//滚动模式，top是向上滚动，left是朝左滚动
				container: "#marqueen1 ul",	//包含的容器
            	row: 1,	//滚动行数
            	speed: 20,	//轮播速度，单位ms
            	fixWidth: 20	//解决Zepto无法计算元素margin，padding在内的width，只有mode=left时有效
            });
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});