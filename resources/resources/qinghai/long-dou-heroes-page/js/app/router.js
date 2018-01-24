(function($) {
    H.router = {
        $vote_btn: $('#vote-btn'),
        $lottery_btn: $('#lottery-btn'),
        $vote_go2index: $('#vote-go2index'),
        nowTime: null,
        isGo: false,
        init: function(){
            this.current_time();
            this.event();
        },
        //查抽奖活动接口
        current_time: function(){
            getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler',true);
        },
        event: function(){
            var me = H.router;
            me.$vote_btn.click(function(e){
                e.preventDefault();
                toUrl('rank.html?pid='+ H.vote.uuid);
            });
            me.$vote_go2index.click(function(e){
                e.preventDefault();
                toUrl('index.html');
            });
            me.$lottery_btn.click(function(e){
                e.preventDefault();
                if($('ul li a').hasClass('tped') || $('ul li .baby-vote').hasClass('voted')){
                    me.current_time();
                    me.isGo = true;
                }else{
                    showTips('投票之后，才能进行抽奖！');
                }
            });
        },
        go_rank: function(){
            toUrl('rank.html?pid='+ H.vote.uuid);
        },
        go_yao: function(){
            toUrl('yao.html');

        },
        currentPrizeAct: function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.router.nowTime,
                prizeActList = [],
                me = H.router;
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
                        me.do_count_down(endTimeStr,nowTimeStr,true);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.do_count_down(beginTimeStr,nowTimeStr,false);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        change: function(){
            var me = H.router;
            if(me.isGo){
                me.go_rank();
                return;
            }
            me.$vote_btn.removeClass('none');
            me.$vote_go2index.removeClass('none');
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
            var me = H.router;
            if(isStart){
                if(me.isGo){
                    me.go_yao();
                    return;
                }
                me.$lottery_btn.removeClass('none');
                $(".countdown").html('距离摇奖结束还有<span class="detail-countdown"></span>');
            }else{
                if(me.isGo){
                    me.go_rank();
                    return;
                }
                me.$vote_btn.removeClass('none');
                me.$vote_go2index.removeClass('none');
                $(".countdown").html('距离摇奖开启还有<span class="detail-countdown"></span>');
            }
            var endTimeLong = timestamp(endTimeStr);
            var nowTime = Date.parse(new Date())/1000;
            var serverTime = timestamp(nowTimeStr);
            if(nowTime > serverTime){
                endTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                endTimeLong -= (serverTime - nowTime);
            }
            $('.detail-countdown').attr('etime',endTimeLong);
            me.count_down();
            $(".countdown").removeClass("none");
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
                        var me = H.router;
                        $(".countdown").html('加载中...');
                        if(!me.$lottery_btn.hasClass('none')){
                            me.$lottery_btn.addClass('none');
                        }
                        if(!me.$vote_btn.hasClass('none')){
                            me.$vote_btn.addClass('none');
                        }
                        if(!me.$vote_go2index.hasClass('none')){
                            me.$vote_go2index.addClass('none');
                        }
                        shownewLoading();
                        var delay = Math.ceil(2500*Math.random() + 1700);
                        setTimeout(function(){
                            hidenewLoading();
                            me.current_time();
                        }, delay);
                    },
                    sdCallback :function(){
                    }
                });
            });
        }
    };

    W.callbackLotteryRoundHandler = function(data){
        var me = H.router;
        if(data.result == true){
            me.nowTime = timeTransform(data.sctm);
            me.currentPrizeAct(data);
        }else{
            me.change();
        }
    };
})(Zepto);
$(function(){
    H.router.init();
});