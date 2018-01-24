/**
 * 天津新闻网罗天下-答题页
 */
(function($) {
	H.question = {
        quid:null,
        qriu:null,
        ty:null,
        countDownType:2,
        dec:0,
        index:0,
        questionList:null,
        init : function(){
            var me = this;
            me.event();
            me.getQuestion();
            me.ddtj();
        },
        event : function(){
            $('#back-btn').click(function(){
                $(this).addClass("pulse");
                setTimeout(function(){
                    toUrl("index.html");
                },1000);
            });
            $('#submit').click(function(){
                if($(this).hasClass("disabled")){
                    return;
                }
                $(this).addClass("pulse");
                var input = $(".sel-r");
                var result = "";
                for(var i = 0; i < input.length; i ++){
                    if(input[i].type == "checkbox"){
                        if (input[i].checked){
                            if(result.length == 0){
                                result += input[i].value;
                            }else{
                                result +="," + input[i].value;
                            }
                        }
                    }else if(input[i].type == "radio"){
                        if (input[i].checked){
                            result = input[i].value;
                        }
                    }
                }
                getResult('api/question/answer', {
                    yoi : openid,
                    suid : H.question.quid,
                    auid : result
                }, 'callbackQuestionAnswerHandler', true);
            });
        },
        getQuestion : function(){
            getResult('api/question/round', {}, 'callbackQuestionRoundHandler', true);
        },
        questionTpl : function(data,type){
            // type = 1 距离下一轮答题开始
            // type = 2 在答题时间段内
            // type = 3 最后一轮结束
            var me = this;
            if(data){
                me.quid = data.quid;
                me.qriu = data.qriu;
                me.ty = data.ty;
                var aitems = data.aitems;
                var isDisabled = type == 2? "" : "disabled";
                $("#comm-title").html(data.qt);
                var t = simpleTpl();
                for(var i = 0;i < aitems.length;i ++){
                    t._('<a class="support" data-uuid = "'+ aitems[i].auid +'">');
                        if(me.ty == 2){
                            //多选
                            t._('<input id="'+aitems[i].auid+'" type="checkbox" name="sel-r" class="sel-r" value="'+aitems[i].auid+'" '+isDisabled+'>');
                        }else{
                            t._('<input id="'+aitems[i].auid+'" type="radio" name="sel-r" class="sel-r" value="'+aitems[i].auid+'" '+isDisabled+'>');
                        }
                        t._('<span class="letter" for="'+aitems[i].auid+'">&nbsp;&nbsp;'+letter[i]+'.&nbsp;&nbsp;</span>')
                        ._('<label for="'+aitems[i].auid+'">'+ aitems[i].at +'</label>')
                    ._('</a>');
                }
                $("#sup").html(t.toString());
                if(type == 1){
                    $("#submit").addClass("disabled");
                }else if(type == 2){
                    $("#submit").removeClass("disabled");
                }else if(type == 3){
                    $("#submit").addClass("disabled");
                }
                $(".index-btn").removeClass("none");
                $("#main").animate({"opacity":1},800);
            }
        },
        end:function(data){
            H.question.questionTpl(data,3);
            $(".countdown-tip").html('今日答题结束');
            $('.detail-countdown').addClass("none");
            $('.countdown').removeClass('none');
        },
        endTpl:function(){
            $("#submit").addClass("disabled");
            $(".sel-r").attr("disabled","disabled");
            $(".countdown-tip").html('今日答题结束');
            $('.detail-countdown').addClass("none");
            $('.countdown').removeClass('none');
        },
        // 距第一轮摇奖开启倒计时
        beforeShowCountdown: function(data) {
            H.question.questionTpl(data,1);
            H.question.countDownType = 1;
            var beginTimeStr = data.qst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.question.dec;
            $(".countdown-tip").html('距下轮答题开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.question.count_down();
            $('.countdown').removeClass('none');
            H.question.repeatCheck = true;
        },
        // 距下次摇奖开启倒计时
        nextCountdown: function(id) {
            $("#submit").addClass("disabled");
            $(".sel-r").attr("disabled","disabled");
            var data = H.question.questionList[id];
            H.question.countDownType = 1;
            var beginTimeStr = data.qst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.question.dec;
            $(".countdown-tip").html('距下轮答题开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.question.count_down();
            $('.countdown').removeClass('none');
            H.question.repeatCheck = true;
            H.question.countDownType = 1;
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(data){
            H.question.questionTpl(data,2);
            H.question.countDownType = 2;
            var endTimeStr = data.qet;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.question.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距本轮答题结束还有");
            H.question.count_down();
            $(".countdown").removeClass("none");
            H.question.repeatCheck = true;
        },
        isAnswer: function(quid){
            $("#main").animate({"opacity":0},800);
            getResult('api/question/record', {
                quid:quid,
                yoi:openid
            }, 'callbackQuestionRecordHandler');
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.question.repeatCheck){
                            H.question.repeatCheck = false;
                            if(H.question.countDownType == 1){
                                //距下次答题开始倒计时结束后显示距离本轮答题结束倒计时
                                H.question.nowCountdown(H.question.questionList[H.question.index]);
                            }else if(H.question.countDownType == 2){
                                //距本轮答题结束倒计时结束后显示距离下次答题开始倒计时
                                if(H.question.index >= H.question.questionList.length - 1){
                                    // 如果已经是最后一轮答题倒计时结束 则显示 今日答题结束
                                    H.question.endTpl();
                                    H.question.countDownType = 3;
                                    return;
                                }
                                H.question.index ++;
                                H.question.isAnswer(H.question.questionList[H.question.index].quid);
                            }
                        }
                    },
                    sdCallback :function(){
                        H.question.repeatCheck = true;
                    }
                });
            });
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.callbackQuestionRoundHandler = function(data){
        if(data.code == 0){
            var nowTimeStr = timeTransform(data.cud*1);
            var qitems = data.qitems;
            if(qitems && qitems.length > 0){
                H.question.questionList = qitems;
                var questionLength = qitems.length;
                //如果第一轮未开始
                if(comptime(qitems[0].qst,nowTimeStr) < 0){
                    H.question.countDownType = 1;
                    H.question.index = 0;
                    H.question.beforeShowCountdown(qitems[0]);
                    return;
                }
                //如果最后一轮结束
                if(comptime(qitems[questionLength-1].qet,nowTimeStr) >= 0){
                    H.question.countDownType = 3;
                    H.question.index = questionLength-1;
                    H.question.isAnswer(qitems[questionLength-1].quid);
                    return;
                }
                for(var i = 0;i < qitems.length;i ++){
                    var beginTimeStr = qitems[i].qst;
                    var endTimeStr = qitems[i].qet;
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        //在答题时间段内
                        H.question.index = i;
                        if(i == questionLength - 1){
                            H.question.countDownType = 3;
                        }else{
                            H.question.countDownType = 2;
                        }
                        H.question.isAnswer(qitems[i].quid);
                        return;
                    }
                }
            }
        }
    };

    W.callbackQuestionAnswerHandler = function(data){
        if(data.code == 0){
            if(data.rs == 2){
                // 答对
                H.dialog.answer.open(1);
            }else{
                // 答错
                H.dialog.answer.open(2);
            }
        }else{
            // 答错
            H.dialog.answer.open(2);
        }
        H.question.index ++;
        if(H.question.index > H.question.questionList.length - 1){
            // 如果已经是最后一轮答题倒计时结束 则显示 今日答题结束
            H.question.endTpl();
            H.question.countDownType = 3;
            return;
        }else{
            H.question.nextCountdown(H.question.index);
        }
    }

    W.callbackQuestionRecordHandler = function(data){
        if(data.code == 0){
            if(data.anws){
                if(H.question.countDownType == 3){
                    H.question.end(H.question.questionList[H.question.index]);
                }else{
                    H.question.questionTpl(H.question.questionList[H.question.index]);
                    H.question.index ++;
                    H.question.nextCountdown(H.question.index);
                }
                var anws = data.anws.split(",");
                for(var i = 0;i < anws.length;i ++){
                    $("#" + anws[i]).attr("checked","checked");
                }
                $("#submit").addClass("disabled");
            }else{
                H.question.nowCountdown(H.question.questionList[H.question.index]);
            }
        }else{
            H.question.nowCountdown(H.question.questionList[H.question.index]);
        }
    }

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
})(Zepto);
$(function(){
	H.question.init();
});