(function($) {
	H.index = {
		init: function() {
            var me = this;
            me.event();
		},
        event: function(){
            $(".index-btn").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("requesting")){
                    $(this).addClass("requesting");
                    toUrl("praise.html");
                }
            });
            $(".btn-welfare").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("requesting")){
                    $(this).addClass("requesting");
                    location.href = 'http://i.eqxiu.com/s/EgZLyuO2?eqrcode=1&from=groupmessage&isappinstalled=0';
                }
            });
            $(".btn-rule").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("requesting")){
                    $(this).addClass("requesting");
                    H.dialog.rule.open();
                    setTimeout(function(){
                        $(".btn-rule").removeClass("requesting");
                    },2000);
                }
            });
            $('#btn-reserve').click(function(e) {
                e.preventDefault();
                var that = this, reserveId = $(this).attr('data-reserveid'), date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                }
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
        }
	};
})(Zepto);

$(function() {
	H.index.init();
});