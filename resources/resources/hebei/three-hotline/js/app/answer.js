/**
 * 老三热线--答题页
 */
(function($){
    H.answer = {
        $confirm: $("#confirm"),
        nowTime: null,
        dec: 0,//服务器时间与本地时间的差值
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前答题活动在 list 中的下标
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        pal: [],// 抽奖活动list
        repeatCheck: true,
        quid: '',
        init: function(){
            this.event();
            this.current_time();
            var height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
        },
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.answer.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        question_record: function(){
            getResult("api/question/record",{yoi: openid, quid: H.answer.quid},'callbackQuestionRecordHandler',true);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.answer;
            $(".back-btn").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('yao.html');
            });
            $("dl").delegate('dd', 'click', function(e) {
                e.preventDefault();

                if(me.$confirm.hasClass('disabled')){
                    return;
                }

                me.checkedParams = $(this).attr('data-auid');
                $(this).addClass("selected").siblings("dd").removeClass("selected");
            });
            me.$confirm.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if($(this).hasClass('disabled')){
                    return;
                }

                if(me.checkedParams){
                    getResult("api/question/answer",{
                        yoi: openid,
                        suid: me.quid,
                        auid: me.checkedParams
                    },'callbackQuestionAnswerHandler',true);
                }else{
                    showTips("请选择您赞同的观点");
                }
            });
        },
        //查询题目信息
        current_time: function(){
            var me = H.answer;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/question/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionRoundHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    //test
                    //data = callbackQuestionRoundHandlerData;
                    if(data.code == 0){
                        me.nowTime = timeTransform(parseInt(data.cud));
                        var nowTime = new Date().getTime();
                        var serverTime = parseInt(data.cud);
                        me.dec = nowTime - serverTime;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeLength = 0,
                nowTimeStr = H.answer.nowTime,
                prizeActList = data.qitems,
                me = H.answer;
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].qet,nowTimeStr) >= 0){
                    me.index = prizeLength-1;
                    me.type = 3;
                    me.change(prizeActList[prizeLength-1], prizeLength-1);
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].qst,nowTimeStr) < 0){
                    me.index = 0;
                    me.spellQuestion(prizeActList[0], 0);
                    me.beforeShowCountdown(prizeActList[0], 0);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].qst;
                    var endTimeStr = prizeActList[i].qet;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.nowCountdown(prizeActList[i], i);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList[i], i);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra, index) {
            var me = H.answer,
                beginTimeStr = pra.qst;
            me.type = 1;
            me.repeatCheck = true;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.$confirm.addClass('disabled');
            me.countdown_domShow(beginTimeStr,"距答题开启还有", pra, index);
            toUrl('yao.html');
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra, index){
            var me = H.answer,
                endTimeStr = pra.qet;

            me.type = 2;
            me.$confirm.removeClass('disabled');
            //me.countdown_domShow(endTimeStr,"距答题结束还有", pra, index);
            me.countdown_domShow(endTimeStr,"距下轮摇奖开始还有", pra, index);
            me.index ++;
        },
        countdown_domShow: function(time, word, pra, index){
            var me = H.answer,
                timeLong = timestamp(time);
            timeLong += me.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            $('.items-count').removeClass('none');
            $('.loading').addClass('none');
            $(".countdown").removeClass("none");
            me.repeatCheck = true;
            me.spellQuestion(pra, index);
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.answer;
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // repeatCheck 用来进行重复判断默认为true，第一次进入之后变为false
                        var $loading = $(".loading"),
                            $items_count = $('.items-count');

                        if(me.repeatCheck){
                            me.repeatCheck = false;
                            $items_count.addClass('none');
                            $loading.removeClass('none');
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal[me.index], me.index);
                            }else if(me.type == 2){
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                if(me.index >= me.pal.length){
                                    me.change(me.pal[me.pal.length-1], me.pal.length-1);
                                    me.type = 3;
                                    return;
                                }
                                me.beforeShowCountdown(me.pal[me.index], me.index);
                            }
                        }
                    },
                    sdCallback :function(){
                        me.repeatCheck = true;
                    }
                });
            });
        },
        change: function(list, index){
            var me = H.answer;
            me.spellQuestion(list, index);
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
            me.$confirm.addClass('disabled');
            toUrl('yao.html');
        },
        spellQuestion: function(qitems, index){
            var me = H.answer; t = simpleTpl();
            me.quid = qitems.quid;
            t._('<dt data-quid="'+ qitems.quid +'">'+ qitems.qt +'</dt>');
                $.each(qitems.aitems, function(i,aitem){
                    t._('<dd data-auid="'+ aitem.auid +'" class="">'+ aitem.at +'</dd>');
                });
            $('dl').html(t.toString());
            me.question_record();
        },
        drawlottery: function(){
            var me = H.answer;
            var sn = new Date().getTime()+'';
            recordUserOperate(openid, "调用投票抽奖接口", "doVoteLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: {
                    matk: matk,
                    sn: sn
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 11000,
                complete: function() {
                    sn = new Date().getTime()+'';
                },
                success : function(data) {
                    if(data && data.result){
                        if(data.sn == sn){
                            showTips(data.tt, 2, 2000);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        }
    };
    W.callbackQuestionRecordHandler = function(data) {
        var me = H.answer;
        if (data.code == 0) {
            if (data.anws) {
                me.$confirm.addClass('disabled').text("亲，您已经答过题了");
            } else {
                me.$confirm.removeClass('disabled');
            }
            $('#question').removeClass('none');
        }
    };
    W.callbackQuestionAnswerHandler = function (data){
        var me = H.answer;
        if (data.code == 0) {
            if(data.rs == 1){//答错题
                showTips("抱歉！答错了", 2, 2000);
            }else if(data.rs == 2){//答对题
                me.drawlottery();
            }
            me.$confirm.addClass('disabled').text("亲，您已经答过题了");
        }
    };
})(Zepto);
$(function(){
    H.answer.init();
});