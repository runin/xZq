(function($){
    H.answer = {
        $tlt: $("#tlt"),
        $spell: $(".spell"),
        $voteCountdown: $("#vote-countdown"),
        nowTime: null,
        dec: 0,//服务器时间与本地时间的差值
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前答题活动在 list 中的下标
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        pal: [],// 抽奖活动list
        repeatCheck: true,
        quid: '',
        wan: 0,
        RIGHT: 'right',
        NOTSTART: 'notstart',
        checkedParams:[],
        $lotteryCountdownAnswerPage:$('#lottery-answerPage'),
        $progressBarAnswerPage:$('#progress-bar'),
        $giftAnswerPage:$('#gift'),
        init: function(){
            this.current_time();
            this.event();
            this.account_num();
            this.jump();
        },
        event: function(){
            var me = this;

            me.$giftAnswerPage.tap(function(e){
                if($(this).hasClass("yao")){
                    toUrl("lottery.html");
                }
            });

            $("dl").delegate('dd', 'click',function(e) {
                e.preventDefault();

                if(me.$spell.hasClass(me.RIGHT) || me.$spell.hasClass(me.NOTSTART)){
                    return;
                }

                var $span = $(this).parent().siblings('div').find('span'),
                    $dd = $("dl").find('dd');
                dd_len = $dd.size();
                len = $span.length;

                if(me.wan < len && !$(this).hasClass('selected')){
                    for(var i = 0; i < len; i++){
                        if(!Boolean($span.eq(i).text())){
                            $span.eq(i).text($(this).text()).attr("id",$(this).attr('data-au')).addClass('not-select');
                            $(this).addClass('selected');
                            me.wan++;
                            if(len == me.wan){
                                setTimeout(function(){
                                    var isRight = 0, isError = false;
                                    for(var j = 0; j < len; j++){
                                        var span_index = $span.eq(j);
                                        if(span_index.attr('data-au') != span_index.attr('id')){
                                            isError = true;
                                            console.log('你答错了。请从新输入');
                                            showTips('你答错了。请从新输入');
                                        }else{
                                            isRight ++;
                                        }

                                        if(isError){
                                            setTimeout(function(){
                                                $span.text("").attr("id","").removeClass('not-select');
                                                $dd.removeClass("selected");
                                            },2000);
                                            me.wan = 0;
                                        }
                                    }
                                    if(len == isRight){
                                        me.$spell.addClass(me.RIGHT);
                                        console.log('正确');
                                        getResult("api/question/answer",{
                                            yoi: openid,
                                            suid: me.quid,
                                            auid: me.checkedParams
                                        },'  callbackQuestionAnswerHandler ',true);
                                    }
                                },500);
                            }
                            return;
                        }
                    }
                }

            });

            $(".answer-box").delegate('span', 'click',function(e) {
                e.preventDefault();

                if(me.$spell.hasClass(me.RIGHT) || me.$spell.hasClass(me.NOTSTART)){
                    return;
                }

                var $dd = $(this).parent().siblings('dl').find('dd');
                len = $dd.length;

                if(!Boolean($(this).text())){
                    showTips('此处你还未填写答案！');
                }else{
                    for(var i = 0; i < len; i++){
                        if($(this).attr('id') == $dd.eq(i).attr('data-au')){
                            $dd.eq(i).removeClass("selected");
                            $(this).text('').removeClass('not-select');
                            me.wan--;
                            return;
                        }
                    }
                }

            });
        },
        question_record: function(){
            getResult("api/question/record",{quid: H.answer.quid, yoi: openid},'callbackQuestionRecordHandler',true);
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
                    if(data.code == 0){
                        /*测试*/
                        /*data = testData;
                        me.nowTime = timeTransform(parseInt(data.cud));
                        var nowTime = new Date().getTime();
                        var serverTime = parseInt(data.cud);
                        me.dec = nowTime - serverTime;
                        me.currentPrizeAct(data);*/

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
            me.$spell.addClass(me.NOTSTART);
            var word = '';
            if(index == 0){
                word = "距答题开始还有";
            }else{
                word = "距下题开始还有";
            }
            me.countdown_domShow(beginTimeStr, word, pra, index);
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra, index){
            var me = H.answer,
                endTimeStr = pra.qet;

            me.type = 2;
            me.$spell.removeClass(me.NOTSTART);
            me.countdown_domShow(endTimeStr,"距答题结束还有", pra, index);
            me.index ++;
        },
        countdown_domShow: function(time, word, pra, index){
            var me = H.answer,
                timeLong = timestamp(time);
            timeLong += me.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            if(word == "距答题开始还有" || word == "距下题开始还有"){
                me.$voteCountdown.find('.detail-countdown').removeClass("none");
                me.$voteCountdown.removeClass("none");
                me.$tlt.addClass("none");
            }else{
                me.$voteCountdown.addClass("none");
                me.$tlt.removeClass("none");
            }

            me.repeatCheck = true;
            me.quid = pra.quid; //题目uuid

            me.question_record();
            me.spellQuestion(pra, index);console.log("index="+index);
        },
        // 倒计时
        count_down : function() {
            var me = H.answer;
            me.$voteCountdown.find('.detail-countdown').each(function() {
                var me = H.answer;
                $(this).countDown({
                    etpl: '<span class="fetal-H"><img src="images/dian.png" />%H%' + '<img src="images/dian.png" /></span>' + '%M%' + '<img src="images/dian.png" />' + '%S%<img src="images/dian.png" />', // 还有...结束
                    stpl: '<span class="fetal-H"><img src="images/dian.png" />%H%' + '<img src="images/dian.png" /></span>' + '%M%' + '<img src="images/dian.png" />' + '%S%<img src="images/dian.png" />', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // repeatCheck 用来进行重复判断默认为true，第一次进入之后变为false

                        if(me.repeatCheck){
                            me.repeatCheck = false;
                            me.$voteCountdown.find('.countdown-tip').html('请稍后');
                            me.$voteCountdown.find('.detail-countdown').addClass("none");
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
            me.$tlt.addClass("none");
            $(".countdown").removeClass("none").html('本期答题已结束，请等待下期!');
            me.$spell.addClass(me.NOTSTART);
        },
        initialize: function(){
            var me = H.answer;
            me.$spell.removeClass(me.RIGHT);
            me.wan = 0;
        },
        nextAnswer: function(){
            var me = H.answer;
            if(me.index >= me.pal.length){
                me.change(me.pal[me.pal.length-1], me.pal.length-1);
                me.type = 3;
                return;
            }
            me.beforeShowCountdown(me.pal[me.index], me.index);
        },
        spellQuestion: function(qitems, index){
            var me = H.answer;
            me.initialize();

            $("#tlt").attr("data-quid", qitems.quid).text(qitems.qt);
            $("#img").attr("src", qitems.bi);

            var t = simpleTpl(),
                qrArry = qitems.qriu.split(",");
            if(qrArry.length > 3){//正确答案最多三个字
                qrArry.splice(3,qrArry.length-1);
            }
            me.checkedParams = qrArry.join(",");
            $.each(qrArry, function(i,aitem){
                t._('<span data-au="'+ qrArry[i] +'" data-collect="true" data-collect-flag="answer-right" data-collect-desc="答案按钮"></span>');
            });
            $('.answer-box').empty().append(t.toString());

            var m = simpleTpl(),
                aitems = qitems.aitems;
            if(aitems.length > 15){//答案选项最多配置15个字
                aitems.splice(15,aitems.length-1);
            }
            aitems.sort(function(){ return 0.5 - Math.random() });
            $.each(aitems, function(i,aitem){
                m._('<dd class="not-select" data-collect="true" data-collect-flag="answer-right" data-collect-desc="答案选项按钮" data-au="'+ aitem.auid +'" class="">'+ aitem.at +'</dd>');
            });
            $('dl').empty().append(m.toString());
            me.$spell.removeClass("none");
            me.resize();
        },
        resize: function(){
            var winW = $(window).width(),
                winH = $(window).height(),
                spellH = $(".spell").height();

            var itemH = winH - spellH - 185;
            var itemW = (400/450)*itemH;
            $(".answer .item").css({
                "width": itemW,
                "height": itemH
            }).removeClass("none");
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        //查询当前参与人数
        account_num: function(){
            var me = this,
                PVTime = Math.ceil(20000*Math.random() + 10000);
            setTimeout(function() {
                getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
            }, me.PVTime);
        }
    };
    W.commonApiSDPVHander = function(data){
        if(data.code == 0){
            if (data.c*1 != 0) {
                $(".count label").html(data.c);
                $(".count").removeClass("hidden");
                setInterval(function(){
                    var pv = getRandomArbitrary(33,99);
                    pv = $(".count label").html()*1 + pv;
                    $(".count label").html(pv);
                },3000);
            }
        }
    };
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.url) {
            $("#ddtj").click(function(){
                showLoading();
                location.href = data.url;
            });
            $('#ddtj').removeClass("visibility");
        } else {
            $('#ddtj').remove();
        }
    };
    W.callbackQuestionRecordHandler = function(data) {
        var me = H.answer;
        if (data.code == 0) {
            if (data.anws) {
                console.log("亲，您已经答过题了");
                me.nextAnswer();
            } else {
                console.log("当前题目未作答");
            }
        }
    };
    W.callbackQuestionAnswerHandler = function (data){
        var me = H.answer;
        if (data.code == 0) {
            if(data.rs == 2){//答对题
                H.dialog.right.open();
            }
        }
    };
})(Zepto);
$(function(){
    H.answer.init();
});

var testData = {
    "code": 0,
    "cud": "1452825000000", //2016-01-15 10:30:00
    "tid": "0cd409d175614844b2eecb6c0b29bac4",
    "t": "今天节目中给老三打电话求助的 是谁？",
    "bm": "",
    "pst": "2015-12-10 18:32:11",
    "pet": "2016-12-11 23:13:29",
    "nex": "2015-10-23 14:47:04",
    "qitems": [
        {
            "quid": "1",
            "qt": "第一题",
            "ty": 2,
            "bi": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/question/subject/images/2016418/ff9af32f1de14de686ad30abc1cefd22.jpg",
            "dc": "",
            "qst": "2016-01-15 10:30:10",
            "qet": "2016-01-15 10:30:20",
            "qriu": "e705fe176a614f4fbe7885a748490613,8151660ec6ea47fca77d88ae74151ba2,8380b347021a48bfbe017ce930627c44,0adbffaa9fca457494264aeba1061b62",
            "aitems": [
                {
                    "auid": "d78e2a4547984f63a5db12f118aa89d4",
                    "at": "这"
                },
                {
                    "auid": "227b2fa4e0054f808c2c7811b81812c2",
                    "at": "是"
                },
                {
                    "auid": "e705fe176a614f4fbe7885a748490613",
                    "at": "答"
                },
                {
                    "auid": "8151660ec6ea47fca77d88ae74151ba2",
                    "at": "案"
                },
                {
                    "auid": "8380b347021a48bfbe017ce930627c44",
                    "at": "吗"
                },
                {
                    "auid": "0adbffaa9fca457494264aeba1061b62",
                    "at": "和"
                },
                {
                    "auid": "f2ff707dbd104b989295ea45f14b3945",
                    "at": "黑"
                },
                {
                    "auid": "9774d773907748ce887428ba6fe48479",
                    "at": "我"
                },
                {
                    "auid": "d34f80420b114cd58ab236e42d21112b",
                    "at": "天"
                },
                {
                    "auid": "3140f2d8751c4d13b1e1232f8bf0a5b1",
                    "at": "个"
                },
                {
                    "auid": "fc107630eb05485caf987e56df345de5",
                    "at": "娃"
                },
                {
                    "auid": "c928db4508ce41c58e8d9ac5ddb44135",
                    "at": "哎"
                },
                {
                    "auid": "d393c9f75fae4b05b674aa03feb33fbb",
                    "at": "爱"
                },
                {
                    "auid": "0eafe18ab6ca4997a285670d3941c449",
                    "at": "额"
                },
                {
                    "auid": "435d205679ce414a9b1b1e958c3825a1",
                    "at": "爬"
                }
            ]
        },
        {
            "quid": "2",
            "qt": "第二题",
            "ty": 2,
            "bi": "",
            "dc": "",
            "qst": "2016-01-15 10:30:30",
            "qet": "2016-01-15 10:30:40",
            "qriu": "65a18326bab04fc5aa2d70541cbc3786,f2a8e54a6db047e6b6550ada2c2f5149",
            "aitems": [
                {
                    "auid": "2c993af995294713b3ef16d01b442bda",
                    "at": "这"
                },
                {
                    "auid": "42d21350867f4030bcf395a7df5ed8d9",
                    "at": "是"
                },
                {
                    "auid": "65a18326bab04fc5aa2d70541cbc3786",
                    "at": "答"
                },
                {
                    "auid": "f2a8e54a6db047e6b6550ada2c2f5149",
                    "at": "案"
                },
                {
                    "auid": "4449c1d35e3245d9977fb3167014b733",
                    "at": "吗"
                }
            ]
        },
        {
            "quid": "3",
            "qt": "第三题",
            "ty": 2,
            "bi": "",
            "dc": "",
            "qst": "2016-01-15 10:30:50",
            "qet": "2016-01-15 10:31:00",
            "qriu": "7d919176b3fb4583a062c1304dda9e5b,98ea096314d44f6280567a13989e5f72",
            "aitems": [
                {
                    "auid": "273bf711f0cb4686b3701c242c74c7eb",
                    "at": "这"
                },
                {
                    "auid": "979f37f64ac7437ab7a15ffd248b7d19",
                    "at": "是"
                },
                {
                    "auid": "7d919176b3fb4583a062c1304dda9e5b",
                    "at": "答"
                },
                {
                    "auid": "98ea096314d44f6280567a13989e5f72",
                    "at": "案"
                },
                {
                    "auid": "40708ab83d8a46328240758c2d5d6180",
                    "at": "吗"
                }
            ]
        }
    ]
};