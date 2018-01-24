(function($) {
    H.index = {
        init: function () {
            this.event();
            this.rule();
            this.prereserve();
            $.fn.cookie('jumpNum', 0, {expires: -1});
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
        rule: function() {
            var btnin, black, rltext, rlbtncls, rl, isbtnrl = false;
            btnin = $(".btnin");
            black = $(".black");
            rltext = $(".rl");
            rlbtncls = $(".index-rl .btn-rule2");
            rl = $(".index-rl");
            btnin.on("click", function () {
                btnin.css({"-webkit-animation":"scl 0.8s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
            }).on("webkitAnimationEnd", function () {
                toUrl('vote.html');
            },false);
            anictrl(".btn-rule",".index-rl>p",".index-rl","ft","disp", function () {
                black.css("display","block");
            }, function () {
                black.css("display","none");
            });
            rlbtncls.on("click", function () {
                isbtnrl = true;
                rl.css({"-webkit-animation":"disphide 0.8s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
            });
            rl.on("webkitAnimationEnd", function () {
                if(isbtnrl == true){
                    rl.css("display","none");
                    black.css("display","none");
                    isbtnrl = false;
                }
            });
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});