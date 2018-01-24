(function($) {
	H.index = {
		init: function() {
            var me = this;
            me.event();
            me.resize();
            me.prereserve();
		},
		resize: function() {
			var me = this , winW = $(window).width(), winH = $(window).height(), bgH = winW*1.6 ,resizes = document.querySelectorAll('.resize'), scaleW = window.innerWidth / 320, scaleH = window.innerHeight / 480;
            for (var j = 0; j < resizes.length; j++) {
                resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
                resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
                resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
                resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
            }
            if(bgH <= winH){bgH = winH}
            $("body").css({"background-size":"100% "+bgH+"px","background-position":"0 0"});
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
            $('body').delegate('#btn-reserve', 'click', function(e) {
                e.preventDefault();
                var that = this, reserveId = $(this).attr('data-reserveid'), date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                    tvid:yao_tv_id,
                    reserveid:reserveId,
                    date:date},
                function(d){
                    if(d.errorCode == 0){
                        $("#btn-reserve").addClass('none');
                    }
                });
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        $(that).removeClass('requesting');
                    }, 1000);
                };
            }).delegate('#btn-rule', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    H.dialog.rule.open();
                }
            }).delegate('#btn-in', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass("pulse")){
                    $(this).addClass("pulse");
                    toUrl("lottery.html");
                }
            });
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});