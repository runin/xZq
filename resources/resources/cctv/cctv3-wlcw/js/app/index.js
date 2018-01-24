(function($) {
	H.index = {
        mySwiper:null,
        rp:getQueryString("rp"),
        activeIndex:0,
        myVedio:document.getElementById("video"),
		init: function() {
            if(is_android()){
                $(".play").css({opacity:0});
            }
            var me = this;
            me.event();
            me.swiperInit();
            me.prereserve();
            if(me.rp){
                me.mySwiper.slideTo(1, 1000, true);
                showTips("领取成功");
            }
		},
        swiperInit: function() {
            var me = this, resizes = document.querySelectorAll('.resize'), scaleW = window.innerWidth / 320, scaleH = window.innerHeight / 480;
            for (var j = 0; j < resizes.length; j++) {
                resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
                resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
                resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
                resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
            };
            me.mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                parallax: true,
                speed: 600,
                onSlideChangeEnd: function(swiper) {
                    me.activeIndex = swiper.activeIndex;
                }
            });
        },
        prereserve: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/program/reserve/get' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackProgramReserveHandler',
                success: function(data) {
                    if (!data.reserveId) {
                        $("#btn-reserve").addClass('none');
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        } else {
                            $("#btn-reserve").addClass('none');
                        }
                    });
                }
            });
        },
		event: function() {
			var me = this;
            $('body').delegate('#video,.play', 'click', function(e) {
                e.preventDefault();
                if (me.myVedio.paused){
                    me.myVedio.play();
                    $(".play").animate({opacity:0},500);
                }else{
                    me.myVedio.pause();
                    $(".play").animate({opacity:1},500);
                }
            });
            me.videoEvent("ended");
		},
        videoEvent:function(e){
            var me = this;
            me.myVedio.addEventListener(e,function(){
                if(e == "ended"){
                    $(".play").animate({opacity:1},500);
                }
            });
        }
	};
})(Zepto);

$(function() {
	H.index.init();
});