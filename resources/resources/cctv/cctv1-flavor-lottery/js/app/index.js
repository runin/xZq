(function($) {
    H.index = {
        dec: 0,
        nowTime: null,
        isTimeOver: false,
        repeat_load: true,
        init: function () {
            this.event();
            this.lotteryRound_port();
            this.prereserve();
            $.fn.cookie('jumpNum', 0, {expires: -1});
        },
        event: function() {
            var me = this;
            $('.btn-play').tap(function(e){
                e.preventDefault();
                if(!$('.btn-play').hasClass('requesting')){
                    $('.btn-play').addClass('requesting');
                    // if ($('.btn-play').hasClass('over')) {
                    //     toUrl('over.html');
                    // } else {
                    //     if ($('.btn-play').hasClass('lottery')) {
                    //         toUrl('lottery.html');
                    //     } else if ($('.btn-play').hasClass('talk')) {
                    //         toUrl('talk.html');
                    //     } else {
                    //         toUrl('talk.html');
                    //     }
                    // }
                    toUrl('talk.html');
                }
            });
            $("#btn-rule").tap(function(e) {
                e.preventDefault();
                if(!$(this).hasClass('flag')){
                    $(this).addClass('flag');
                    shownewLoading();
                    H.dialog.rule.open();
                }
            });
            $("#btn-reserve").tap(function(e) {
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
        lotteryRound_port: function(){
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.index.nowTime = timeTransform(data.sctm);
                        H.index.dec = new Date().getTime() - data.sctm;
                        H.index.currentPrizeAct(data);
                    }else{
                        if(H.index.repeat_load){
                            H.index.repeat_load = false;
                            setTimeout(function(){
                                H.index.lotteryRound_port();
                            },500);
                        }else{
                            $('.btn-play').removeClass('talk lottery').addClass('over');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    $('.btn-play').removeClass('talk lottery');
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.index.nowTime,
                prizeActList = [],
                me = this;
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    $('.btn-play').removeClass('talk lottery').addClass('over');
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        $('.btn-play').removeClass('talk over').addClass('lottery');
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        $('.btn-play').removeClass('lottery over').addClass('talk');
                        return;
                    }
                }
            }else{
                $('.btn-play').removeClass('talk lottery');
                return;
            }
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});