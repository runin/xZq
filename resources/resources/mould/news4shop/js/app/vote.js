(function($){
    H.vote = {
        dec: 0,
        type: 2,
        index: 0,
        quid: '',
        rightParams: '',
        supportData: '',
        checkedParams: '',
        nowTime: null,
        roundList: null,
        repeatCheck: true,
        questionRoundPortFlag: true,
        $question: $("#question"),
        init: function(){
            this.event();
            this.touchSystem('.touchMe');
            this.questionRoundPort();
            this.selfIntegralPort();
        },
        event: function(){
            var me = this;
            $('#J_cover .avatar').tap(function(e) {
                e.preventDefault();
                if ($('#J_cover').hasClass('moveTransIn') == false) {
                    $('#J_cover .avatar').addClass('touch-none');
                    $('#J_cover').removeClass('moveTransOut').addClass('moveTransIn');
                    $('#J_userControl').removeClass('hide');
                }
            });

            $("dl").delegate('dd.item', 'tap', function(e) {
                e.preventDefault();
                if(me.$question.find("dl").hasClass('disabled')) return;
                $(this).addClass("selected wrong").closest('dl').addClass('disabled');
                me.questionEachsupportPort();
                me.checkedParams = $(this).attr('data-auid');
                getResult("api/question/answer",{
                    yoi: openid,
                    suid: me.quid,
                    auid: me.checkedParams
                },'callbackQuestionAnswerHandler');
            });

            $('.btn-sign').click(function(e) {
                e.preventDefault();
                toUrl('sign.html');
            });

            $('.btn-coin').click(function(e) {
                e.preventDefault();
            });

            $('.btn-shop').click(function(e) {
                e.preventDefault();
                toUrl('shop.html');
            });

            $('.btn-my').click(function(e) {
                e.preventDefault();
                toUrl('my.html');
            });

            $('.btn-talk').tap(function(e) {
                e.preventDefault();
                if ($(this).hasClass('on')) {
                    $(this).removeClass('on').addClass('off');
                    $('#J_biliControl').removeClass('on');
                    $('.copyright').removeClass('none');
                } else {
                    $(this).removeClass('off').addClass('on');
                    $('#J_biliControl').addClass('on');
                    $('.copyright').addClass('none');
                }
            });
        },
        selfIntegralPort: function() {
            getResult('api/lottery/integral/rank/self', {
                oi: openid
            }, 'callbackIntegralRankSelfRoundHandler');
        },
        questionRoundPort: function(){
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/question/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionRoundHandler',
                timeout: 5000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        me.nowTime = timeTransform(parseInt(data.cud));
                        me.dec = new Date().getTime() - parseInt(data.cud);
                        me.questionFilter(data);
                    }else{
                        if(me.questionRoundPortFlag){
                            me.questionRoundPortFlag = false;
                            setTimeout(function(){
                                me.questionRoundPort();
                            }, 1000);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        },
        questionRecordPort: function(){
            getResult("api/question/record",{yoi: openid, quid: H.vote.quid},'callbackQuestionRecordHandler');
        },
        questionEachsupportPort: function(){
            getResult("api/question/eachsupport",{quid: H.vote.quid},'callbackQuestionSupportHandler');
        },
        questionFilter: function(data){
            var me = this, roundList = data.qitems, roundLength = data.qitems.length, nowTimeStr = H.vote.nowTime;
            me.roundList = roundList;
            if(roundList.length > 0) {
                if(comptime(roundList[roundLength-1].qet, nowTimeStr) >= 0){
                    me.index = roundLength-1;
                    me.type = 3;
                    me.fillContent(roundList, roundLength-1);
                    me.change();
                    return;
                }
                if(comptime(roundList[0].qst,nowTimeStr) < 0){
                    me.index = 0;
                    me.fillContent(roundList, 0);
                    me.beforeCountdown(roundList, 0);
                    return;
                }
                for (var i = 0; i < roundList.length; i++) {
                    var beginTimeStr = roundList[i].qst, endTimeStr = roundList[i].qet;
                    me.index = i;
                    if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){
                        me.nowCountdown(roundList, i);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeCountdown(roundList, i);
                        return;
                    }
                };
            }else{
                me.change();
                return;
            }
        },
        beforeCountdown: function(pra, index) {
            var beginTimeStr = pra[index].qst;
            this.$question.find("dl").addClass('disabled');
            this.type = 1;
            this.repeatCheck = true;
            this.doCountdown(beginTimeStr,"距本轮答题开启还有", pra, index);
        },
        nowCountdown: function(pra, index){
            var endTimeStr = pra[index].qet;
            this.type = 2;
            this.$question.find("dl").removeClass('disabled');
            this.doCountdown(endTimeStr,"距本轮答题结束还有", pra, index);
            this.index++;
        },
        doCountdown: function(time, word, pra, index){
            var timeLong = timestamp(time);
            timeLong += this.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            this.count_down();
            $('.items-count').removeClass('none');
            $('.loading').addClass('none');
            $(".countdown").removeClass("none");
            this.repeatCheck = true;
            this.fillContent(pra, index);
        },
        count_down : function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '<label class="hour">%H%</label>' + '<span>时</span>' + '<label>%M%</label>' + '<span>分</span>' + '<label>%S%</label>' + '<span>秒</span>' , // 还有...结束
                    stpl : '<label class="hour">%H%</label>' + '时:' + '<label>%M%</label>' + '分' + '<label>%S%</label>'+ '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(me.repeatCheck){
                            me.repeatCheck = false;
                            if(me.type == 1){
                                me.nowCountdown(me.roundList, me.index);
                            }else if(me.type == 2){
                                if(me.index >= me.roundList.length){
                                    me.type = 3;
                                     me.change();
                                    return;
                                }
                                me.beforeCountdown(me.roundList, me.index);
                            }
                        }
                    },
                    sdCallback :function(){
                        me.repeatCheck = true;
                    }
                });
            });
        },
        fillContent: function(qitems, index){
            var t = simpleTpl();
            this.quid = qitems[index].quid;
            this.rightParams = qitems[index].qriu;
            t._('<dt data-quid="'+ qitems[index].quid +'">'+ qitems[index].qt +'</dt>');
            $.each(qitems[index].aitems, function(i,aitem){
                t._('<dd data-auid="'+ aitem.auid +'" class="item item-'+aitem.auid+'">'+ aitem.at +'</dd>');
                t._('<p data-auid="'+ aitem.auid +'" class="precent precent-'+aitem.auid+' hide"><i style="width:0;"></i><span></span></p>');
            });
            $('dl').html(t.toString());
            this.questionRecordPort();
            if (this.type == 3) {
                this.questionEachsupportPort();
            }
        },
        fillSupport: function(data, flag) {
            var me = this, aitems = data.aitems, length = data.aitems.length, total = 0, totalPrecent = 0;
            for (var i = 0; i < length; i++) {
                total += aitems[i].supc;
            };
            if (flag != '') total += 1;
            for (var i = 0; i < length; i++) {
                if (i == length - 1) {
                    var precent = (100.00 - totalPrecent).toFixed(1) * 1;
                    $('.precent').removeClass('hide');
                    me.checkedParams = '';
                } else {
                    if (flag == aitems[i].auid) {
                        var precent = ((aitems[i].supc + 1) / total * 100).toFixed(1) * 1;
                    } else {
                        var precent = (aitems[i].supc / total * 100).toFixed(1) * 1;
                    }
                    totalPrecent += precent;
                }
                if (total == 0) {
                    $('.precent-' + aitems[i].auid).addClass('hidden');
                } else {
                    $('.precent-' + aitems[i].auid).find('i').css('width', precent + '%');
                    $('.precent-' + aitems[i].auid).find('span').text(precent + '%');
                }
            };
        },
        change: function(){
            var me = H.vote;
            $(".countdown").removeClass("none").html('本期答题抽奖已结束，请等待下期!');
            me.$question.find("dl").addClass('disabled');
        },
        touchSystem: function(dom, unBingFlag) {
            var startPosition, endPosition, deltaX, deltaY, moveLength, touchLength = 50,
                el = document.querySelector(dom);
            el.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                startPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                $('.debug section').append('<p>console: touchstart</p>');
                $('.debug').scrollToTop($('.debug section').height());
            });
            el.addEventListener('touchmove', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                endPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                deltaX = endPosition.x - startPosition.x;
                deltaY = endPosition.y - startPosition.y;
                deltaY = 0;
                if(deltaX < 0) {
                    moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
                    // moveLength = 0;
                } else if (deltaX > 0) {
                    moveLength = -(Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2)));
                    // moveLength = 0;
                };
                // $('.debug section').append('<p>moveLength: ' + moveLength + '</p>');
            });
            el.addEventListener('touchend', function (e) {
                e.preventDefault();
                if (moveLength >= touchLength) {
                    $('#J_cover').removeClass('moveTransIn').addClass('moveTransOut');
                    $('#J_cover .avatar').removeClass('touch-none');
                    $('.debug section').append('<p>浮层关闭</p>');

                } else if (moveLength <= -touchLength) {
                    $('#J_cover').removeClass('moveTransOut').addClass('moveTransIn');
                    $('#J_userControl').removeClass('hide');
                    $('#J_cover .avatar').addClass('touch-none');
                    $('.debug section').append('<p>浮层打开</p>');
                } else {
                    $('.debug section').append('<p>点击-关闭浮层</p>');
                    // if (moveLength < minTouchLength && moveLength > -minTouchLength) {
                        if ($('#J_cover').hasClass('moveTransIn')) {
                            $('#J_cover').removeClass('moveTransIn').addClass('moveTransOut');
                            $('#J_cover .avatar').removeClass('touch-none');
                        } else {

                        }
                    // }
                }
                $('.debug section').append('<p>console: touchend</p>');
                $('.debug').scrollToTop($('.debug section').height());
                moveLength = 0;
            });
        }
    };

    W.callbackQuestionRecordHandler = function(data) {
        var me = H.vote;
        if (data.code == 0) {
            if (data.anws) {
                if(data.rs&&data.rs == 2){
                    me.$question.find("dd.item-" + data.anws).addClass("right");
                }else{
                    me.$question.find("dd.item-" + me.rightParams).addClass("right");
                    me.$question.find("dd.item-" + data.anws).addClass("wrong");
                    me.$question.find("dl").addClass('disabled');
                }
                me.questionEachsupportPort();
                me.$question.find("dl").addClass('disabled');
            }else{
                if(me.type == 2) me.$question.find("dl").removeClass('disabled');
            }
        }else {
            if(me.type == 2) me.$question.find("dl").removeClass('disabled');
        }   
        $('#question').removeClass('none');
        hidenewLoading();
    };

    W.callbackQuestionSupportHandler = function(data) {
        var me = H.vote;
        if (data.code == 0) {
            me.supportData = data;
            me.fillSupport(data, me.checkedParams);
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        var me = H.detail;
        if (data.result) {
            $('.btn-coin span').text(data.in * 1 + '金币');
        }
    };

    W.callbackQuestionAnswerHandler = function (data){};
})(Zepto);

$(function(){
    H.vote.init();
});