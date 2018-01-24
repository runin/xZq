(function($) {
    H.vote = {
        $voteCountdown: $("#vote-countdown"),
        nowTime: null,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        isTimeOver: false,
        periodUuid: null,
        $vote_info: $("#vote-info"),
        endType: 1,
        init: function(){
            var me = this;
            me.event();
            me.current_time();
            me.refreshDec();
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
                            H.vote.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        event: function(){
            var me = H.vote;

            me.$vote_info.tap(function(e) {
                e.preventDefault();
                var $this = $(this);
                me.btn_animate($(this));

                $(".support").removeClass("none");
                $(".heart-layer").removeClass("none");
                setTimeout(function(){
                    $(".support").addClass("heart").one("webkitAnimationEnd", function () {
                        $(this).removeClass("heart");
                        $(".heart-layer").addClass("none");
                    });
                },100);

                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: $this.attr("guid"),
                        pluids: $this.attr("pid")
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){

                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            });
        },
        current_time: function(){
            var me = H.vote;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/voteguess/inforoud' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        me.nowTime = timeTransform(parseInt(data.cud));
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - parseInt(data.cud);
                        me.periodUuid = data.pid;
                        me.currentPrizeAct(data);

                        /*测试-s*/
                        /*data = testData;
                         me.nowTime = timeTransform(parseInt(data.cud));
                         console.log(me.nowTime);
                         var nowTimeStemp = new Date().getTime();
                         me.dec = nowTimeStemp - parseInt(data.cud);
                         me.periodUuid = data.pid;
                         me.currentPrizeAct(data);*/
                        /*测试-e*/
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {}
            });
        },
        currentPrizeAct:function(data){
            var prizeLength = 0,
                nowTimeStr = H.vote.nowTime,
                prizeActList = data.items,
                me = H.vote;

            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeLength >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                    me.type = 3;
                    me.endType = 3;
                    me.change();
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].gst,nowTimeStr) < 0){
                    me.beforeShowCountdown(prizeActList[0]);
                    return;
                }
                for ( var i = 0; i < prizeLength; i++) {
                    var beginTimeStr = prizeActList[i].gst;
                    var endTimeStr = prizeActList[i].get;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <=0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList[i], true);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra, isSeparate) {
            var me = H.vote,
                beginTimeStr = pra.gst;
            me.type = 1;
            me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
            if(isSeparate && $("body").attr("data-type") == "vote"){
                toUrl("lottery.html");
            }
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            if($("body").attr("data-type") == "index"){
                toUrl("vote.html");
            }
            var me = H.vote,
                endTimeStr = pra.get;
            me.type = 2;
            me.countdown_domShow(endTimeStr,"距摇奖结束还有");
            me.index ++;
            me.spellDom(pra);
        },
        change: function(){
            var me = H.vote;
            me.type = 3;
            me.$voteCountdown.html('本期摇奖已结束，请等待下期!');
            //me.$voteCountdown.removeClass("none").html('本期摇奖已结束，请等待下期!');
            toUrl("lottery.html");
        },
        countdown_domShow: function(time, word){
            var me = H.vote,
                timeLong = timestamp(time);
            timeLong += me.dec;
            me.$voteCountdown.find('.detail-countdown').attr('etime',timeLong);
            me.$voteCountdown.find(".countdown-tip").html(word);
            me.count_down();
            //me.$voteCountdown.removeClass("none");
            me.isTimeOver = false;
        },
        spellDom: function(pra){
            var me = H.vote,
                guid = pra.guid,//选手姓名
                na = pra.pitems[0].na,//选手姓名
                im = pra.pitems[0].im || "images/test-vote.jpg",//选手头像
                pid = pra.pitems[0].pid;//竞猜选手id
            $(".support img").attr("src", im).parent().removeClass("none");
            me.$vote_info.attr("pid", pid).attr("guid", guid);
        },
        // 倒计时
        count_down : function() {
            var me = H.vote;
            me.$voteCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        if(!me.isTimeOver){
                            me.isTimeOver = true;

                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal[me.index]);
                            }else if(me.type == 2){
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                if(me.index >= me.pal.length){
                                    me.change();
                                    return;
                                }

                                var i = me.index - 1;
                                if(i < me.pal.length - 1){
                                    var endTimeStr = me.pal[i].get;
                                    var nextBeginTimeStr = me.pal[i + 1].gst;
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
                                        me.beforeShowCountdown(me.pal[me.index], true);
                                    } else {
                                        me.change();
                                    }
                                },1000);
                            }
                        }
                    },
                    sdCallback :function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };

})(Zepto);

$(function() {
    H.vote.init();
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
            "gst": "2016-01-15 10:30:00",
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
                    "na": "选手二",
                    "ni": "选手二昵称",
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
            "gst": "2016-01-15 10:30:40",
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
                    "na": "选手四",
                    "ni": "选手四昵称",
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