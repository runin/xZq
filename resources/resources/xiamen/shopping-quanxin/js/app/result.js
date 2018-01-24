(function($) {
	
	H.result = {
		quantity: getQueryString('q'),
		name: getQueryString('n'),
		price: getQueryString('p'),
		scn: getQueryString('scn'),
		ccn: getQueryString('ccn'),
		img: getQueryString('img'),
		$img_detail: $('#img-detail'),
		$content_detail: $('#content-detail'),
		init: function() {
			var height = $(window).height();
			$('.main').css('minHeight', height);
			
			this.img && this.$img_detail.html('<img src="'+ this.img +'" />');
			this.name && this.$content_detail.find('h2').text(this.name);
			this.quantity && this.$content_detail.find('span').text('x' + this.quantity);
			this.$content_detail.find('p').text([this.ccn || '', this.scn || ''].join(' '));
			
			$('#btn-share').click(function(e) {
				e.preventDefault();
				
				share();
			});
		}
	};
	
})(Zepto);

H.result.init();