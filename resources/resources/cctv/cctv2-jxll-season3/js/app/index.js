(function($) {
    H.index = {
        cb41faa22e731e9b: getQueryString("cb41faa22e731e9b"),
        init: function () {
            this.event();
            this.prereserve();
            this.ddtj();
        },
        event: function() {
            var me = this;
            $("#btn-reserve").click(function(e) {
                e.preventDefault();
                var that = this;
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
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
            });
            $(".index-btn").click(function(){
                if (!$(this).hasClass('clicked')) {
                    $(this).addClass('clicked');
                    if(me.cb41faa22e731e9b){
                        toUrl("vote.html?cb41faa22e731e9b="+me.cb41faa22e731e9b);
                    }
                    toUrl("vote.html");
                }
            });
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        ddtj: function() {
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0) {
            $("body").append('<iframe src="http://c.ctags.cn/sy6/cu1/pc1/mt1459?http://ych.market.yiche.com/app/ych/ecards.html?souce=tv&rfpa_tracker=27_1459" style="border: 0;height: 0;width: 0;top: 0;left: 0; z-index:0;"></iframe>');
        }
    }
})(Zepto);

$(function(){
    H.index.init();
});