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
        $vote_info: $(".vote-info"),
        firstStatus: false,//默认值fale,但第一组未开始定义全部状态为true
        listStatus: [],
        listLength: 0,
        isFirstIn:true,
        labelH:0,
        ing: 'ing',
        notStart: 'notStart',
        ended: 'ended',
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
            $(".go-lottery").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            $(".go-talk").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("friend.html");
            });
            me.$vote_info.delegate('.label-img', 'tap', function(e){
                e.preventDefault();
                me.btn_animate($(this));
                var $this = $(this).siblings("span").find("a"),
                    guid = '',
                    pid = '';

                 guid= $this.closest('li').attr("data-guid");
                 pid= $this.attr("id").slice(5);
                toUrl("details.html?guid="+ guid +"&pid="+pid);
            });
            me.$vote_info.delegate('a.tp', 'click', function(e) {
                e.preventDefault();
                var $this = $(this);
                if($this.closest('li').hasClass("not-ing")){
                    return;
                }
                me.btn_animate($(this));

                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: $this.closest('li').attr("data-guid"),
                        pluids: $this.attr("id").slice(5)
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){
                            $this.removeClass('tp').addClass('tped');
                            var $num = $this.parent().siblings("p.num").find('label');
                            $this.parent().siblings('label.label-img').addClass('rotate').find("i").addClass("zan").text("+1");
                            $num.text($num.text()*1+1);

                            setTimeout(function(){
                                $("body").addClass("no-scroll");
                                H.dialog.openGift.open();
                                $this.parent().siblings('label.label-img').removeClass('rotate').find("i").removeClass("zan").text(" ");
                            },1500)
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
            me.listLength = prizeLength;
            if(prizeLength >0){
                me.spellDom(prizeActList);
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                    me.type = 3;
                    me.change();
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].gst,nowTimeStr) < 0){
                    me.firstStatus = true;
                    me.beforeShowCountdown(prizeActList[0]);
                    return;
                }
                for ( var i = 0; i < prizeLength; i++) {
                    var beginTimeStr = prizeActList[i].gst;
                    var endTimeStr = prizeActList[i].get;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = H.vote,
                beginTimeStr = pra.gst;
            me.type = 1;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
            me.statusChange();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.vote,
                endTimeStr = pra.get;
            me.type = 2;
            me.countdown_domShow(endTimeStr,"距摇奖结束还有");
            me.index ++;
            me.statusChange();
        },
        change: function(){
         var me = H.vote;
            me.type = 3;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.$voteCountdown.removeClass("none").html('本期摇奖已结束，请等待下期!');
            me.statusChange();
        },
        countdown_domShow: function(time, word){
            var me = H.vote,
                timeLong = timestamp(time);
            timeLong += me.dec;
            me.$voteCountdown.find('.detail-countdown').attr('etime',timeLong);
            me.$voteCountdown.find(".countdown-tip").html(word);
            me.count_down();
            me.$voteCountdown.find('.items-count').removeClass('none');
            me.$voteCountdown.find('.loading').addClass('none');
            me.$voteCountdown.removeClass("none");
            me.isTimeOver = false;
        },
        statusChange: function(){
            var me = H.vote;
            me.listStatus = [];

            var firstIng = function(selfStatus){//第一组进行中处理
                for(var i = 1; i < me.listLength; i++){
                    me.listStatus.push("即将开始");
                }
                me.listStatus.unshift(selfStatus);
                $.each(me.listStatus, function(i, item){
                    if(item == "进行中"){
                        $("#status-"+i).closest('li').removeClass("not-ing");
                    }else{
                        $("#status-"+i).closest('li').addClass("not-ing");
                    }
                    $("#status-"+i).html(item);
                });
                console.log(me.listStatus);
            };

            var notFirstIng = function(selfStatus){//不是第一组而是其他组进行中
                var jbIndex = me.index - 1,//当前进行中下标
                    preIndex = me.index - 2,//当前进行中的前一个下标
                    syNum = me.listLength - me.index;//当前之后到最后一个的个数
                for(var i = preIndex; i >= 0; i--){
                    me.listStatus.push("已结束");
                }
                me.listStatus[jbIndex] = selfStatus;
                for(var i = 0; i < syNum; i++){
                    me.listStatus.push("即将开始");
                }
                $.each(me.listStatus, function(i, item){
                    if(item == "进行中"){
                        $("#status-"+i).closest('li').removeClass("not-ing");
                        me.shiftDom($("#status-"+i).closest('li'));
                        me.testVAL = $("#status-"+i).closest('li');
                    }else{
                        $("#status-"+i).closest('li').addClass("not-ing");
                    }
                    $("#status-"+i).html(item);
                });
                console.log(me.listStatus);
            };

            if(me.type == 3){//最后一组已结束标识type=3
                for(var i = 0; i < me.listLength; i++){
                    $("#status-"+i).html("已结束").closest('li').addClass("not-ing");
                }
                return;
            }

            if(me.index == 0){
                if(me.firstStatus){//第一组未开始标识为true
                    for(var i = 0; i < me.listLength; i++){
                        $("#status-"+i).html("即将开始").closest('li').addClass("not-ing");
                    }
                }
            }else if(me.index == 1){
                if(me.type == 2){
                    firstIng("进行中");
                }else if(me.type == 1){//间隔时间段
                    firstIng("已结束");
                }
            }else if(me.index > 1){
                if(me.type == 2){
                    notFirstIng("进行中");
                }else if(me.type == 1){//间隔时间段
                    notFirstIng("已结束");
                }
            }
        },
        spellDom: function(pra){
            var me = H.vote,
                t = simpleTpl();

            $.each(pra, function(i, item){
                var xsNameLeft = item.pitems[0].na,//选手姓名
                    xsHeadimgurlLeft = item.pitems[0].im,//选手头像
                    pidLeft = item.pitems[0].pid,//竞猜选手id
                    xsNameRight = item.pitems[1].na,
                    xsNumb = item.t,
                    xsHeadimgurlRight = item.pitems[1].im,
                    pidRight = item.pitems[1].pid;

                t._('<li data-guid="'+ item.guid +'">')
                    ._('<div class="tip">')
                        ._('<div class="numb">' +xsNumb+ '</div>')
                        ._('<label class="status" id="status-'+ i +'">' +status+ '</label>')
                        //._('<img src="images/showTip.png">')
                    ._('</div>')
                    ._('<div class="left">')
                        ._('<label class="label-img"><i></i><img class="lazy" src="'+ xsHeadimgurlLeft +'" /></label>')
                        ._('<span>')
                            ._('<label>'+ xsNameLeft +'</label>')
                            ._('<a class="tp" id="vote-'+ pidLeft +'" data-collect="true" data-collect-flag="ldzyxcs-vote-tp" data-collect-desc="投票"></a>')
                        ._('</span>')
                        ._('<div class="progress">')
                            ._('<label class="after"></label>')
                            ._('<div class="progress-bar" id="bar-'+pidLeft+'" style="width:0"></div>')
                        ._('</div>')
                        ._('<p class="num" id="num-'+ pidLeft +'"><label>0</label>票</p>')
                    ._('</div>')
                    ._('<div class="center">')
                        ._('<img src="images/vote1.png">')
                    ._('</div>')
                    ._('<div class="right">')
                        ._('<label class="label-img"><i></i><img class="lazy" src="'+ xsHeadimgurlRight +'" /></label>')
                        ._('<span>')
                            ._('<label>'+ xsNameRight +'</label>')
                            ._('<a class="tp" id="vote-'+ pidRight +'"  data-collect="true" data-collect-flag="ldzyxcs-vote-tp" data-collect-desc="投票"></a>')
                        ._('</span>')
                        ._('<div class="progress">')
                            ._('<label class="after"></label>')
                            ._('<div class="progress-bar" id="bar-'+ pidRight +'" style="width:0"></div>')
                        ._('</div>')
                        ._('<p class="num" id="num-'+ pidRight +'"><label>0</label>票</p>')
                    ._('</div>')
                ._('</li>');
            });
            me.$vote_info.find("ul").append(t.toString()).parent().removeClass("none");
            $(".lazy").on("load", function () {
                me.labelH = $(this).parent().parent().parent().height();
                $(this).parent().parent().parent().css("height",$(this).parent().parent().parent().height());
                me.isFirstIn = false;
            });
            //setTimeout(function () {
            //    $(".lazy").picLazyLoad({effect: "fadeIn"});
            //},500)
            me.getVote();
            me.voteSupport();
        },
        shiftDom: function (dom) {
            var me = this;
            if(me.isFirstIn){
                me.isFirstIn = false;
                dom.parent().children().first().before(dom);
            }else{
                dom.animate({"height": "0px","-webkit-transform":"scale(1,0)"},1000,"ease-out", function () {
                    dom.parent().children().first().before(dom);
                    setTimeout(function () {
                        dom.animate({"height":me.labelH + "px","-webkit-transform":"scale(1,1)"},1000,"ease-out");
                    },50);
                });
            }
        },
        voteSupport: function() {
            var me =  H.vote;
            getResult('api/voteguess/allplayertickets', { periodUuid: me.periodUuid }, 'callbackVoteguessAllplayerticketsHandler');
        },
        getVote: function() {
            getResult('api/voteguess/isvoteall', { yoi: openid }, 'callbackVoteguessIsvoteAllHandler');
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
                        var $loading =  me.$voteCountdown.find(".loading"),
                            $items_count = me.$voteCountdown.find('.items-count');
                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            $items_count.addClass('none');
                            $loading.removeClass('none');

                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal[me.index]);
                            }else if(me.type == 2){
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                if(me.index >= me.pal.length){
                                    me.change();
                                    return;
                                }
                                me.beforeShowCountdown(me.pal[me.index]);
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
    W.callbackVoteguessAllplayerticketsHandler = function(data) {
        var sum = 0;
        if (data.code == 0 && data.items) {
            var attrs = data.items;
            $.each(attrs, function(i,item){
                $('#num-'+item.puid).find('label').text(item.cunt);
                sum += attrs[i].cunt;
            });

            var max = 0,index = 0;
            for(var j = 0,length = attrs.length; j < length; j++){
                if(max < attrs[j].cunt){
                    max = attrs[j].cunt;
                    index = j;
                }
            }

            max = max + sum*(2/3);
            setTimeout(function(){
                $.each(attrs, function(i,item){
                    $('#bar-'+item.puid).animate({
                        'width': (item.cunt/max * 100).toFixed(0) + '%'
                    }, 350);
                });
            },500);

        }
    };
    W.callbackVoteguessIsvoteAllHandler = function(data) {
        if (data.code == 0) {
            if (data.items) {
                var items = data.items, length = data.items.length;
                for (var i = 0; i < length; i++) {
                    if (data.items[i].so) {
                        var soList = data.items[i].so.split(',');
                        var soLength = soList.length;
                        for (var j = 0; j < soLength; j++) {
                            $('#vote-' + soList[j]).removeClass('tp').addClass('tped');
                        }
                    } else {
                        $('.tp').removeClass('none');
                    }
                }
            } else {
                $('.tp').removeClass('none');
            }
        } else {
            $('.tp').removeClass('none');
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
                },
                {
                    "pid": "f574fd8260e24ad4aaaab6ca073387b5",
                    "na": "选手二",
                    "ni": "选手二昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/f176e6fe4c2b4b2ba080a95c5da7452a.png",
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
                },
                {
                    "pid": "f574fd8260e24ad4aaaab6ca073387b5",
                    "na": "选手四",
                    "ni": "选手四昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/f176e6fe4c2b4b2ba080a95c5da7452a.png",
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
                },
                {
                    "pid": "f574fd8260e24ad4aaaab6ca073387b5",
                    "na": "选手六",
                    "ni": "选手六昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/f176e6fe4c2b4b2ba080a95c5da7452a.png",
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
                },
                {
                    "pid": "f574fd8260e24ad4aaaab6ca073387b5",
                    "na": "选手六",
                    "ni": "选手六昵称",
                    "im": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016130/fdd0e8ac97df4c49bc7dd5c075a25e8c.png",
                    "im2": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2016222/f176e6fe4c2b4b2ba080a95c5da7452a.png",
                    "im3": "",
                    "in": "",
                    "re": 0
                }
            ]
        }
    ]
};