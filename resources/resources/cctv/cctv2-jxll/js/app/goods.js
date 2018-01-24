(function($) {
	H.vote = {
		init: function () {
            var me = this, winW = $(window).width(), winH = $(window).height(),goodsW = $('.goods-img-box').width() ;
            $('.detail-box').css({
                'width': winW,
                'height': winH
            });
             $('.goods-img-box').css({
                'height': goodsW
            });
            this.event();
		},
		event: function() {
			var me = this;
            $('.goods-img-box').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('flag')) {
                    return;
                }
                $(this).addClass('flag');
                $("#detailName").html($(this).attr("data-detailName"));
                $("#detailContent").html($(this).attr("data-detailContent"));
                $('.detail-box').removeClass('none').animate({'opacity':'1'}, 300);
                $('.detail').removeClass('none').addClass('bounceIn');
                setTimeout(function(){
                    $('.detail').removeClass('bounceIn');
                }, 1000);
            });
             $('.btn-detail-close').click(function(e) {
                e.preventDefault();
                var me = this;
                 $('.detail').addClass('bounceOut');
                $('.detail-box').animate({'opacity':'0'}, 1000, function() {
                	$('.detail').removeClass('bounceOut');
                    $('.detail-box').addClass('none');
                    $('.goods-img-box').removeClass('flag');
                });
            });
            $('#goods-btn-back').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');
                toUrl('vote.html');
            });
		}
	};

    
})(Zepto);

$(function(){
	H.vote.init();
});