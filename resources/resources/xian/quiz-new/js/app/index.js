/**
 *  这里是西安-首页
 */
(function($) {
    H.index = {
        from: getQueryString('from'),
        now_time : null,
        istrue : true,
        leftCount:0,//本次活动用户剩余抽奖次数
        canLottery: false,
        time: 0,
        interval: null,
        init: function () {
            this.event_handler();
            this.leftActivityCount();
            this.service_rule();
            this.self_integral();
        },
        event_handler : function() {

            $('#avatar').click(function(e) {
                e.preventDefault();

                var $this = $(this),
                    $info_tips = $('#info-tips'),
                    $tip = $info_tips.find('.tip'),
                    width = $('.user-info').outerWidth();

                if ($this.hasClass('avatar-curr')) {
                    $tip.addClass('none');
                    $info_tips.stop().animate({width: width * 0.13}, 100, function() {
                        $info_tips.addClass('none');
                        $this.removeClass('avatar-curr');
                    });
                } else {
                    $this.addClass('avatar-curr');
                    $info_tips.removeClass('none').stop().animate({width: width * 0.9}, 200, function() {
                        $tip.removeClass('none');
                    });
                }
            });

            $("#toQuiz_btn").click(function(e){
                e.preventDefault();
                if(H.index.canLottery){
                    location.href = "win.html";
                }
            });
        },
        current_time: function(){
            getResult('api/lottery/round','callbackLotteryRoundHandler',true);
        },
        self_integral: function(){
            getResult('api/lottery/integral/rank/self', {
                oi: openid
            }, 'callbackIntegralRankSelfRoundHandler', true);
        },
        service_rule: function(){
            getResult('quiz/serviceRule','callbackRuleHandler',true);
        },
        //检查用户在当前活动中的剩余抽奖次数
        leftActivityCount:function(){
            getResult('api/lottery/leftLotteryCount',{oi:openid},'callbackLotteryleftLotteryCountHandler',true);
        },
        lottery : function(){
            H.index.canLottery = true;
            $("#toQuiz_btn").attr('class', 'btn as-now-btn');
            $("#toQuiz_btn").html("立即抽奖");
        },
        count : function(){
            H.index.canLottery = false;
            $("#toQuiz_btn").attr('class', 'btned as-now-btn');
            $("#toQuiz_btn").html("抽奖未开始");
        },
        end : function(){
            H.index.canLottery = false;
            $("#toQuiz_btn").attr('class', 'btned as-now-btn');
            $("#toQuiz_btn").html("抽奖已结束");
        },

        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.index.now_time,
                $tips = $(".time-tips"),
                prizeActList = [];
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
                    H.index.end();
                    return;
                }
                //如果最后一轮还没结束但是抽奖次数没了
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,nowTimeStr) >= 0&&comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr)<= 0&&H.index.leftCount<=0){
                    H.index.end();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0&&(H.index.leftCount>0)){
                        H.index.lottery();
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.index.count();
                        return;
                    }

                }
            }else{
                H.index.end();
                return;
            }
        }
    }

    W.callbackLotteryleftLotteryCountHandler = function(data){
        if(data.result == true){
            H.index.leftCount = data.lc;
            H.index.current_time();//档查询抽奖剩余次数回调成功后,再执行抽奖活动
        }
    }

    W.callbackLotteryRoundHandler = function(data){
        if(data.result == true){
            H.index.now_time = timeTransform(data.sctm);
            H.index.currentPrizeAct(data);
        }else{
            H.index.end();
        }
    }

    W.callbackRuleHandler = function(data){
        $('.action-rule').append(data.rule);
        $('#quiz-loading').addClass('none');
        $('.rule').removeClass('none');
        var height = $('.main').height();
        $('body').css('minHeight', height+50);
    }

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            $("#jf_val").text(data.in);
        };
    };
})(Zepto);

$(function(){
    H.index.init();
});






