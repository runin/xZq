(function($) {
    H.answer = {
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        REQUEST_CLS: 'requesting',
        $btnFunny: $('.funny-box img'),
        tid: '',

        init: function() {
            H.utils.resize();
            H.comment.init();
            this.event();
        },
        event: function(){
            var me = H.answer;
            $(".btn-back").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html");
            });
            this.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    showTips('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                } else if (len > 25) {
                    showTips('观点字数超出了25字');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }
                $(this).addClass(me.REQUEST_CLS);
                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save?'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            showTips('发射成功', null, 800);
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>'+comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });

            });


            this.$btnFunny.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var time = new Date().getTime();
                if(H.answer.sendFunnyTime != null && time - H.answer.sendFunnyTime < sendTime){
                    showTips('点的太快啦~ 休息下吧!');
                    return;
                }else{
                    H.answer.sendFunnyTime = time;
                    $('.funny-box img').css('-webkit-filter', 'grayscale(100%)');
                    setTimeout(function(){
                        $('.funny-box img').css('-webkit-filter', 'grayscale(0%)');
                    }, sendTime);
                }
                $(this).addClass(me.REQUEST_CLS);
                var funny = $(this).attr('data-item') || '/:funny1';
                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(funny),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? $.fn.cookie(mpappid + '_headimgurl') : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnFunny.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            showTips('发射成功', null, 800);
                            var nfunny = funny.replace('/:','');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img menow"><img class="c_head_img_img" src="' + h + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
                            $('.menow').parent('div').addClass('me').css({'height': '41px'});
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });
            });
        },
        outlink: function (self) {
            shownewLoading();
            setTimeout(function () {
                window.location.href = $(self).attr("data-link");
            },500);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };

    // 弹幕_S
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
        },
        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime()+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code == 0) {
                        me.maxid = data.maxid;
                        var items = data.items || [], umoReg = '/:';
                        for (var i = 0, len = items.length; i < len; i++) {
                            if ((items[i].co).indexOf(umoReg) >= 0) {
                                var funny = items[i].co;
                                var nfunny = funny.replace('/:','');
                                barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
                            }else{
                                var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
                                if (items[i].hu) {
                                    hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
                                }
                                if (i < 5) {
                                    $.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
                                }
                                barrage.pushMsg(hmode + items[i].co);
                            }
                        }
                    } else {
                        return;
                    }
                }
            });
        }
    };
    // 弹幕_E

    H.utils = {
        $header: $('header'),
        $wrapper: $('article'),
        $comments: $('#comments'),
        resize: function() {
            var height = $(window).height(),width = $(window).width();
            var outHeight = width*0.90/(580/222);
            var outboxh = width / 3;
            this.$wrapper.css({'height': Math.round(height - 225)});
            this.$comments.css({'height': Math.round(height - (outHeight))});
        }
    };

    H.talk = {
        dec: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        lastRound: false,
        isToLottey: true,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        $voteCountdown: $("#vote-countdown"),//投票倒计时标签
        lotteryImg: null,
        init: function () {
            this.event();
            this.voteInforoud();
        },
        event: function(){
            var me = this;
            $("#go-lottery").tap(function(e){
                me.btn_animate($(this));
                toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        voteInforoud: function () {
            var me = this;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        $("#pen").attr("src", data.items[0].pitems[0].im);
                        /*me.nowTime = timeTransform(parseInt(data.cud));
                        console.log(me.nowTime);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - parseInt(data.cud);
                        me.roundData = data;
                        me.currentPrizeAct(data);*/


                        /*测试-s*/
                        /*data = testData;
                         me.nowTime = timeTransform(parseInt(data.cud));
                         console.log(me.nowTime);
                         var nowTimeStemp = new Date().getTime();
                         me.dec = nowTimeStemp - parseInt(data.cud);
                         me.roundData = data;
                         me.currentPrizeAct(data);*/
                        /*测试-e*/
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.voteInforoud();
                            },500);
                        }else{
                            me.isToLottey = false;
                            me.change();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        }/*,
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this,
                nowTimeStr = this.nowTime,
                prizeActList = data.items,
                prizeLength = 0,
                day = nowTimeStr.split(" ")[0];

            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                    me.type = 3;
                    me.endType = 3;
                    me.change();
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].gst,nowTimeStr) < 0){
                    me.beforeCountdown(prizeActList[0]);
                    return;
                }
                //config微信jssdk
                me.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].gst;
                    var endTimeStr = prizeActList[i].get;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].gst;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.type = 1;
            var beginTimeStr = prizeActList.gst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            me.$voteCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$voteCountdown.find(".countdown-tip").html('距离投票开始还有');
            me.count_down();
            me.$voteCountdown.removeClass('none');
            me.lotteryImg = prizeActList.pitems.im;
            hidenewLoading();
            //me.$showTips.text("摇奖即将开始，请等待主持人提示开始摇奖");
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.type = 2;
            var endTimeStr = prizeActList.get;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            me.$voteCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$voteCountdown.find(".countdown-tip").html("距投票结束还有");
            me.count_down();
            me.$voteCountdown.removeClass('none');
            me.index++;
            me.canJump = true;
            me.lotteryImg = prizeActList.pitems.im;

            hidenewLoading();
            console.log(prizeActList.t);
            console.log(prizeActList.pitems[0].im);
        },
        change: function() {
            var me = this;
            me.$voteCountdown.removeClass('none').find(".countdown-tip").html('本期投票已结束，下期再战！');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$voteCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + '</span><label>时</label><span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + '</span><label>时</label><span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                                if(me.type == 1){
                                    //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        me.$voteCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        setTimeout(function() {
                                            me.nowCountdown(me.pal[me.index]);
                                        }, 1000);
                                    }
                                }else if(me.type == 2){
                                    //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        if(me.index >= me.pal.length){
                                            me.type = 3;
                                            me.change();
                                            return;
                                        }
                                        me.$voteCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        var i = me.index - 1;
                                        if(i < me.pal.length - 1){
                                            var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                            var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                            if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                                me.endType = 2;
                                            } else {
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                                me.endType = 1;
                                            }
                                        }
                                        setTimeout(function(){
                                            if(me.endType == 2){
                                                me.nowCountdown(me.pal[me.index]);
                                            }else if(me.endType == 1){
                                                me.beforeCountdown(me.pal[me.index]);
                                            } else {
                                                me.change();
                                            }
                                        },1000);
                                    }
                                }
                        }else{
                            me.$voteCountdown.find('.countdown-tip').html('请稍后');
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        }*/
    }

})(Zepto);

$(function() {
    H.answer.init();
    H.talk.init();
    H.jssdk.init();
});


var testData = {
    "code": 0,
    "cud": "1452825000000", //2016-01-15 10:30:00
    "pid": "3e1f82b0ed6f41509224531db3988f0e",
    "iul": "",
    "pst": "2016-01-15 14:37:31",
    "pet": "2016-01-15 23:37:32",
    "nex": "2016-01-15 14:37:36",
    "put": "",
    "items": [
        {
            "t": "第一组",
            "guid": "b288607e601b48fcb2b965623c93fb0d",
            "hlo": 0,
            "gst": "2016-01-15 10:30:10",
            "get": "2016-01-15 10:30:20",
            "put": "",
            "img": "",
            "img2": "",
            "put2": "",
            "sp": 0,
            "fp": 0,
            "ms": 1,
            "gt": 1,
            "pitems": [
                {
                    "pid": "0d97cd8518754b74b46105f2ee6aa37b",
                    "na": "选手一",
                    "ni": "选手一昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/6f083485b353484daeab6929c6842c51.png",
                    "im3": "",
                    "in": "",
                    "re": 0
                }
            ]
        },
        {
            "t": "第二组",
            "guid": "f960fd1379374dff856e3d0257f475e3",
            "hlo": 0,
            "gst": "2016-01-15 10:30:30",
            "get": "2016-01-15 10:30:40",
            "put": "",
            "img": "",
            "img2": "",
            "put2": "",
            "sp": 0,
            "fp": 0,
            "ms": 1,
            "gt": 1,
            "pitems": [
                {
                    "pid": "0d97cd8518754b74b46105f2ee6aa37b",
                    "na": "选手三",
                    "ni": "选手三昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/6f083485b353484daeab6929c6842c51.png",
                    "im3": "",
                    "in": "",
                    "re": 0
                }
            ]
        },
        {
            "t": "第三组",
            "guid": "b41c12102fcd41148001d93ff38ee225",
            "hlo": 0,
            "gst": "2016-01-15 10:30:50",
            "get": "2016-01-15 10:31:00",
            "put": "",
            "img": "",
            "img2": "",
            "put2": "",
            "sp": 0,
            "fp": 0,
            "ms": 1,
            "gt": 1,
            "pitems": [
                {
                    "pid": "0d97cd8518754b74b46105f2ee6aa37b",
                    "na": "选手五",
                    "ni": "选手五昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/6f083485b353484daeab6929c6842c51.png",
                    "im3": "",
                    "in": "",
                    "re": 0
                }
            ]
        },
        {
            "t": "第四组",
            "guid": "b41c12102fcd41148001d93ff38ee225",
            "hlo": 0,
            "gst": "2016-01-15 10:31:10",
            "get": "2016-01-15 10:31:20",
            "put": "",
            "img": "",
            "img2": "",
            "put2": "",
            "sp": 0,
            "fp": 0,
            "ms": 1,
            "gt": 1,
            "pitems": [
                {
                    "pid": "0d97cd8518754b74b46105f2ee6aa37b",
                    "na": "选手五",
                    "ni": "选手五昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/6f083485b353484daeab6929c6842c51.png",
                    "im3": "",
                    "in": "",
                    "re": 0
                }
            ]
        }
    ]
};