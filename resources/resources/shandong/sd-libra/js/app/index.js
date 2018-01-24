(function($) {
    H.index = {
        init: function () {
            this.initIndex();
            this.event();
            this.prereserve();
        },
        event: function() {
            var me = this;
            $('.go-btn').click(function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('talk.html');
                }
            });
           $('#btn-reserve').click(function(e) {
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
                if (!$(this).hasClass('flag')) {
                    $(this).addClass('flag');
                    setTimeout(function(){
                        $(that).removeClass('flag');
                    }, 1000);
                };
            });
        },
        initIndex:function(){
            getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",true);
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
                        } else {
                            $("#btn-reserve").addClass('none');
                        }
                    });
                }
            });
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var items = data.gitems;
            if(items && items.length > 0){
                $("body").css({
                    "background": "url("+items[0].ib+") 0 0 no-repeat",
                    "background-size" : "100% 100%;"
                });
                return;
            }
        }
        $("body").css({
            "background": "url(\"images/bg.jpg\") 0 0 no-repeat",
            "background-size" : "100% 100%;"
        });
    };
})(Zepto);

$(function(){
    H.index.init();
});