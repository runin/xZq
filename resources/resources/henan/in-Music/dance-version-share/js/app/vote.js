(function($){
    H.vote={
        periodUuid: '',
        init: function(){
            var me = this;
            me.loadImg();
            me.event();
        },
        loadImg: function(){
            var imgs = [
                "images/item-bg.jpg"
            ];
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        $("body").animate({'opacity':'1'}, 100);
                    }
                }

            };
            loadImg();
        },
        barrage: function(){
            var dy = 65, numlines = 5 ,y0= 5;
            if(W.screen.height === 480){
                dy = 55;
                numlines = 3;
            }else if(W.screen.height === 568){
                dy = 65;
                numlines = 5;
            }else if(W.screen.height === 667){
                dy = 85;
                numlines = 5;
                y0= 20;
            }else if(W.screen.height === 736){
                dy = 85;
                numlines = 5;
                y0= 30;
            }
            var barrage = new Barrage($('#player'), {
                numlines: numlines,
                // velocities: [-1, -1.5, -2.2, -3.3, -1.3],
                velocities: [-0.8, -1.3, -1.9, -2.8, -1, -2, -1.5],
                x0: $(window).width(),
                dx: 20,
                y0: y0,
                dy: dy
            });

            barrage.start();
        },
        resize:function(){
            var w_height = $(window).height();
            $('#player').css({
                "height": w_height- 220
            });
        },
        tpl: function(data){
            var me = H.vote,
                t = simpleTpl(),
                periodUuid = data.pid,//期uuid
                guid = data.items[0].guid,//组uuid
                attrs = data.items[0].pitems || [],
                index = 0;

            $.each(attrs, function(i, item){
                var pid = item.pid; //选手uuid
                index ++;
                if(index == 6){
                    index = 1;
                }
                t._('<div class="items player-li'+ index +'" data-periodUuid="'+ periodUuid +'" data-guid="'+ guid +'" data-pid="'+ pid +'" data-collect="true" data-collect-flag="vote-gift-'+ i +'" data-collect-desc="进入选手页投票">')
                    ._('<img src="'+ item.im +'" />')
                    ._('<div class="info-con">')
                        ._('<h1>'+ filterXSS(item.na) +'</h1>')
                        ._('<h2>'+ filterXSS(item.ni) +'</h2>')
                    ._('</div>')
                ._('</div>')
            });
            $('#player').append(t.toString());
            me.barrage();
        },
        event: function(){
            $('#player').delegate('.items', 'click', function(e) {
                e.preventDefault();
                /*if(H.voteCountDown.voteFlag){
                    toUrl('details.html?periodUuid='+ $(this).attr("data-periodUuid") +'&guid='+ $(this).attr("data-guid") +'&pid='+ $(this).attr("data-pid"));
                }else{
                    showTips("未开始，请稍等~")
                }*/
                toUrl('details.html?periodUuid='+ $(this).attr("data-periodUuid") +'&guid='+ $(this).attr("data-guid") +'&pid='+ $(this).attr("data-pid"));
            });

            var $layer = $("#layer"),storage = W.localStorage;

            if(storage.getItem("go-"+ openid)){
                $layer.addClass("none");
                storage.setItem("go-"+ openid, false);
            }else{
                $layer.removeClass("none").tap(function(e){
                    e.preventDefault();
                    $layer.animate({'opacity':'0'}, function(){
                        $layer.addClass("none");
                    },100);
                });
                storage.setItem("go-"+ openid, true);
            }
        }
    };
    H.voteCountDown = {
        $voteCountdownOut: $("#vote-countdown-out"),
        $voteCountdown: $("#vote-countdown"),
        nowTime: null,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        isTimeOver: false,
        voteFlag: false,//false 不能投票标识
        init: function() {
            var me = this;
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
                            H.voteCountDown.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        //获取竞猜信息（最新）
        current_time: function(){
            var me = H.voteCountDown;
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
                    // put：结果公布时间
                    if(data.code == 0){
                        H.vote.periodUuid = data.pid;
                        H.vote.tpl(data);
                        me.pal = data;
                        if(comptime(data.put, data.pst) < 0){
                            me.beforeShowCountdown(data.put, true);
                        }else{
                            me.nowTime = timeTransform(parseInt(data.cud));
                            var nowTimeStemp = new Date().getTime();
                            me.dec = nowTimeStemp - parseInt(data.cud);
                            me.currentPrizeAct(data);
                        }
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
            var nowTimeStr = H.voteCountDown.nowTime,
                me = H.voteCountDown;

            me.pal = data;
            //如果最后一轮结束
            if(comptime(data.pet,nowTimeStr) >= 0){
                me.type = 3;
                me.change();
                return;
            }
            //如果第一轮未开始
            if(comptime(data.pst,nowTimeStr) < 0){
                me.beforeShowCountdown(data);
                return;
            }

            var beginTimeStr = data.pst;
            var endTimeStr = data.pet;
            hidenewLoading();
            //在活动时间段内且可以抽奖
            if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                me.nowCountdown(data);
                return;
            }
        },
        // 投票开启倒计时
        beforeShowCountdown: function(pra, flagDay) {
            var me = H.voteCountDown,
                beginTimeStr = pra.pst;
            me.type = 1;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            if(flagDay){
                beginTimeStr = pra;
            }
            me.countdown_domShow(beginTimeStr,"距演唱会直播开始还有");
        },
        // 投票结束倒计时
        nowCountdown: function(pra){
            var me = H.voteCountDown,
                endTimeStr = pra.pet;
            me.type = 2;
            me.countdown_domShow(endTimeStr,"距演唱会直播结束还有");
            me.voteFlag = true;
        },
        change: function(){
            var me = H.voteCountDown;
            toUrl("rank.html?periodUuid="+ H.vote.periodUuid + '&showMode=1');
            me.type = 3;
            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.$voteCountdown.removeClass("none").html('本期演唱会直播已结束!');
        },
        countdown_domShow: function(time, word){
            console.log("time="+time);
            var me = H.voteCountDown,
                timeLong = timestamp(time);
            timeLong += me.dec;
            me.$voteCountdownOut.find('.detail-countdown').attr('etime',timeLong);
            me.$voteCountdownOut.find(".countdown-tip").html(word);
            me.count_down();
            me.$voteCountdownOut.find('.items-count').removeClass('none');
            me.$voteCountdownOut.find('.loading').addClass('none');
            me.$voteCountdown.removeClass("none");
            me.isTimeOver = false;
        },
        // 倒计时
        count_down : function() {
            var me = H.voteCountDown;
            me.$voteCountdownOut.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '<span class="fetal-D">%D%' + '天</span>' + '<span class="fetal-H">%H%' + ' 时 </span>' + '%M%' + '分 ' + '%S%' + '秒', // 还有...结束
                    stpl : '<span class="fetal-D">%D%' + '天</span>' + '<span class="fetal-H">%H%' + ' 时 </span>' + '%M%' + '分 ' + '%S%' + '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        var $loading =  me.$voteCountdownOut.find(".loading"),
                            $items_count = me.$voteCountdownOut.find('.items-count');
                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            $items_count.addClass('none');
                            $loading.removeClass('none');

                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal);
                            }else if(me.type == 2){
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                me.change();
                            }
                        }
                    },
                    sdCallback :function(){
                        me.isTimeOver = false;
                    }
                });
            });
        }
    };
})(Zepto);


$(function(){
    H.vote.init();
    H.voteCountDown.init();
});