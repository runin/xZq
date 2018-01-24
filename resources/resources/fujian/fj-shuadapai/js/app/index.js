/**
 * 我要找到你-首页
 */
(function($) {
    H.index = {
        from: getQueryString('from'),
        now_time : null,
        istrue : true,
        $btnReserve:$("#btn-reserve"),
        init: function () {
            this.event_handler();
            this.current_time();
            this.prereserve();
        },
        event_handler : function() {
            var me = this;
            $('#btn-join').click(function(e) {
                e.preventDefault();
                if($(this).hasClass("gray")){
                    $(".countdown").addClass("shake")
                    setTimeout(function() {
                        $('.countdown').removeClass('shake')
                    }, 1000);
                }
                return;
            });
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
            this.$btnReserve.click(function(e) {
                e.preventDefault();
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
                            H.index.$btnReserve.addClass('none');
                        }
                    });
            });

        },
        current_time: function(){
            getResult('api/lottery/round','callbackLotteryRoundHandler',true);
        },
        // 检查该互动是否配置了预约功能
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get',
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
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
        },
        change:function(){
            $("#join").removeClass("none");
            $(".countdown-tip").html("今日摇奖已结束，请明天再来");
        },
        currentPrizeAct:function(data){

            //获取抽奖活动
            var prizeActListAll = data.la,
                nowTimeStr = H.index.now_time,
                $tips = $(".countdown-tip"),
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
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        $tips.html('抽奖开启');
                        toUrl("yaoyiyao.html");
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        var beginTimeLong = timestamp(beginTimeStr);
                        var nowTime = Date.parse(new Date())/1000;
                        var serverTime = timestamp(nowTimeStr);
                        if(nowTime > serverTime){
                            beginTimeLong += (nowTime - serverTime);
                        }else if(nowTime < serverTime){
                            beginTimeLong -= (serverTime - nowTime);
                        }
                        $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
                        $("#join").removeClass("none");
                        $(".countdown").removeClass("none");
                        H.index.count_down();
                        return;
                    }

                }
            }else{
                me.change();
                return;
            }
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.index.istrue){
                            H.index.istrue = false;
                            $(".detail-countdown").addClass("none");
                            $("#btn-join").removeClass("gray");
                            $(".countdown-tip").html('抽奖开启');
                            toUrl("yaoyiyao.html");
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        }
    }

    W.callbackLotteryRoundHandler = function(data){
        if(data.result == true){
            H.index.now_time = timeTransform(data.sctm);
            H.index.currentPrizeAct(data);
        }else{
            H.index.change();
        }
    }


})(Zepto);

$(function(){
    H.index.init();
});


