(function($) {
	
	H.page = {
		$pages: $('#pages'),
		init: function() {
			var parallax = this.$pages.parallax({
				direction: 'horizontal',	// vertical (垂直翻页)
				swipeAnim: 'default', 		// cover (切换效果)
				drag:      true,			// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,			// 有无加载页
				indicator: false,			// 有无指示点
				arrow:     true,			// 有无指示箭头
				onchange: function(index, element, direction) {}
			});
		}
	};
	
})(Zepto);

$(function() {
	H.page.init();
});