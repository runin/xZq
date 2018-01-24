(function($) {
    H.index = {
        init: function () {
            this.event();
            this.prereserve();
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
            $("#btn-rule").click(function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        location.href = 'http://mp.weixin.qq.com/s?__biz=MzI0NDAzNjk5Mw==&mid=401495165&idx=1&sn=962fa974cdc9f94611d30056a54664f8#rd';
                    }, 1000);
                }
            });
            $(".click-in").click(function(){
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
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
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});