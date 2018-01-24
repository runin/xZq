(function($) {
    H.index = {
        init: function() {
            this.prereserve();
            this.event();
            var cb41faa22e731e9b = getQueryString('cb41faa22e731e9b');
            if(cb41faa22e731e9b && cb41faa22e731e9b.length > 0){
                localStorage.setItem("cb41faa22e731e9b",cb41faa22e731e9b);
            }else{
                localStorage.removeItem("cb41faa22e731e9b");
            }
            this.autoJump();
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-rule', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    H.dialog.rule.open();
                }
            }).delegate('#btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    toUrl('lottery.html?cb41faa22e731e9b='+localStorage.getItem("cb41faa22e731e9b"));
                }
            }).delegate('#btn-reserve', 'click', function(e) {
                e.preventDefault();
                $(this).addClass("bounce");
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
        autoJump:function()
        {
            var n = 3
            var intval =setInterval(function(){
                if(n>=0){
                    $(".jump").html(n+"s");
                }else{
                    clearInterval(intval);
                    recordUserOperate(openid, "首页自动进入", "index_auto_in");
                     toUrl('lottery.html?cb41faa22e731e9b='+localStorage.getItem("cb41faa22e731e9b"));
                }
                n--;
            },1000);
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});