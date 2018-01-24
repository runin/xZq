(function($) {
    H.talk = {
        dec: 0,
        nowTime: null,
        roundData: null,
        isTimeOver: false,
        repeat_load: true,
        init: function(){
            this.event();
            this.resize();
            this.lotteryRound_port();
        },
        resize: function() {
            var winW = $(window).width(), winH = $(window).height();
            $('body').css({'width': winW, 'height': winH});
            $('.container, article').css('min-height', Math.ceil(winH - 150));
            $('#comments').css('height', Math.ceil(winH - 180));
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-comment', 'tap', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                var comment = $.trim($("#input-comment").val()) || '', comment = comment.replace(/<[^>]+>/g, ''), len = comment.length;
                if (len < 1) {
                    showTips('说说你的看法吧~');
                    $("#input-comment").focus();
                    return;
                } else if (len > 21) {
                    showTips('看法不能超过20字哦~');
                    $("#input-comment").focus();
                    return;
                }
                $(this).addClass('requesting');
                shownewLoading(null, '发射中...');
                setTimeout(function(){
                    $("#btn-comment").removeClass('requesting');
                    showTips('发射成功');
                    var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                    barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                    $('.isme').parent('div').addClass('me');
                    $("#input-comment").removeClass('error').val('');
                    hidenewLoading();
                }, 300);
                // shownewLoading();
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : '',
                        headimgurl: headimgurl ? headimgurl : ''
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function() {
                    },
                    success : function(data) {
                    }
                });
            });
        },
        lotteryRound_port: function(){
            shownewLoading();
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
                        H.talk.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.talk.dec = nowTimeStemp - data.sctm;
                        H.talk.roundData = data;
                        H.talk.currentPrizeAct(data);
                    } else {
                        if(H.talk.repeat_load){
                            H.talk.repeat_load = false;
                            setTimeout(function(){
                                H.talk.lotteryRound_port();
                            },500);
                        }else{
                            toUrl('over.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    toUrl('yaoyiyao.html');
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.talk.nowTime,
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
                    cookie4toUrl('over.html');
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        $.fn.cookie('jumpNum', 0, {expires: -1});
                        $(".countdown-tip").html('请稍后');
                        cookie4toUrl('lottery.html');
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        $.fn.cookie('jumpNum', 0, {expires: -1});
                        H.talk.beforeShowCountdown(prizeActList[i]);
                        H.comment.init();
                        H.talk.tttj();
                        return;
                    }
                }
            }else{
                toUrl('yaoyiyao.html');
                return;
            }
        },
        beforeShowCountdown: function(pra) {
            var beginTimeStr = pra.pd + " " + pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.talk.dec;
            $(".countdown-tip").html('距离摇奖开始还有');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.talk.count_down();
            $('.countdown').removeClass('none');
            $(".icon-zantips").removeClass("none");
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%' + '<i>时</i></span>' + '%M%' + '<i>分</i>' + '%S%' + '<i>秒</i>', // 还有...结束
                    stpl : '<span class="fetal-H">%H%' + ':<i>时</i></span>' + '%M%' + '<i>分</i>' + '%S%' + '<i>秒</i>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(!H.talk.isTimeOver) {
                            H.talk.isTimeOver = true;
                            $(".countdown-tip").html('请稍后');
                            shownewLoading(null,'请稍后...');
                            toUrl('lottery.html');
                        }
                    },
                    sdCallback :function(){
                        H.talk.isTimeOver = false;
                    }
                });
            });
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 50,
        $comments: $('#comments'),  
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
            $('.container, .ctrls').animate({'opacity': '1'}, 500);
        },
        flash: function() {
            var me = this;
            getResult('api/comments/room?temp=' + new Date().getTime(), {
                ps: me.pageSize,
                maxid: me.maxid
            }, 'callbackCommentsRoom');
        }
    };

    W.callbackCommentsRoom = function(data) {
        if (data.code == 0) {
            H.comment.maxid = data.maxid;
            var items = data.items || [];
            for (var i = 0, len = items.length; i < len; i++) {
                var hmode = "<div class='c_head_img'><img src='./images/avatar/default-avatar.jpg' class='c_head_img_img'></div>";
                if (items[i].hu) {
                    if (items[i].hu.indexOf('.jpg') || items[i].hu.indexOf('.jepg') || items[i].hu.indexOf('.png')) {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + " class='c_head_img_img'></div>";
                    } else {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img'></div>";
                    }
                }
                barrage.pushMsg(hmode + items[i].co);
            };
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').removeClass('none').find('p').text(data.desc || '');
            $('#tttj').click(function(e) {
                e.preventDefault();
                if ($("#btn-rule").hasClass('requesting')) {
                    return;
                }
                $("#btn-rule").addClass('requesting');
                shownewLoading(null, '请稍后...');
                location.href = data.url
            });
        } else {
            $('#tttj').remove();
        };
    };
})(Zepto);

$(function() {
    H.talk.init();
});