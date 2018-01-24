(function($) {
    H.index = {
        nowTime: null,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        index: 0, // 当前抽奖活动在 list 中的下标
        pal: [],// 抽奖活动list
        dec: 0,//服务器时间与本地时间的差值
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        isTimeOver: false,
        $copyright: $('.copyright'),
        $wait: $(".wait"),
        $vote_info: $(".vote-info"),
        guid: '',
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
                            H.index.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        event: function(){
            var me = H.index;
            $("#sign").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("sign.html");
            });
            me.$vote_info.delegate('a.not-zc', 'click', function(e) {
                e.preventDefault();
                toUrl("yao.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            me.$vote_info.delegate('a.zc', 'click', function(e) {
                e.preventDefault();
                var $this = $(this);
                me.btn_animate($(this));
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: me.guid,
                        pluids: $this.attr("id")
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){
                            var $num = $this.parent().siblings("p.num").find('label');
                            $num.text($num.text()*1+1);
                            $num.addClass('zan');
                            setTimeout(function(){
                                $num.removeClass('zan');
                                toUrl("yao.html?cb41faa22e731e9b="+cb41faa22e731e9b);
                            },500)
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            });
        },
        current_time: function(){
            var me = H.index;
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
                        me.currentPrizeAct(data);
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
                nowTimeStr = H.index.nowTime,
                prizeActList = data.items,
                me = H.index;

            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                    me.type = 3;
                    me.change();
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].gst,nowTimeStr) < 0){
                    me.beforeShowCountdown(prizeActList[0]);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
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
            var me = H.index,
                beginTimeStr = pra.gst;
            me.type = 1;
            me.$wait.removeClass("none");
            me.$copyright.removeClass('vote-copy').addClass('wait-copy');
            me.$vote_info.addClass("none").empty();

            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            me.countdown_domShow(beginTimeStr,"距摇奖开启还有");
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.index,
                endTimeStr = pra.get;
            me.type = 2;
            me.spellDom(pra);
            me.countdown_domShow(endTimeStr,"距摇奖结束还有");
            me.index ++;
        },
        countdown_domShow: function(time, word){
            var me = H.index,
                timeLong = timestamp(time);
            timeLong += me.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            $('.items-count').removeClass('none');
            $('.loading').addClass('none');
            $(".countdown").removeClass("none");
            me.isTimeOver = false;
        },
        spellDom: function(pra){
            var me = H.index,
                t = simpleTpl(),
                xsName = pra.pitems[0].na,//选手姓名
                xsHeadimgurl = pra.pitems[0].im,//选手头像
                bwName = pra.pitems[0].ni,//宝物名
                bwImg = pra.pitems[0].im2,//宝物图
                pid = pra.pitems[0].pid;//竞猜选手id

            me.guid = pra.guid;//当前组guid
            me.$wait.addClass("none");
            me.$copyright.removeClass('wait-copy').addClass("vote-copy");
            t._('<div class="group" data-guid="'+ me.guid +'">')
                ._('<img class="xw-headimgurl" src="'+ xsHeadimgurl +'" />')
                ._('<label class="xw-name">'+ xsName +'</label>')
                ._(' <img class="bw-img" src="'+ bwImg +'" />')
                ._('<label class="bw-name">'+ bwName +'</label>')
            ._('</div>')
            ._('<div class="button">')
                ._('<a class="zc" id="'+ pid +'" ><img src="images/zc.png" /></a>')
                ._('<a class="not-zc"><img src="images/pg.png" /></a>')
            ._('</div>')
            ._('<h2>参与投票，即刻摇大奖！</h2>')
            ._('<p class="num" id="num-'+ pid +'">共有 <label>0</label> 人支持</p>')
            ._('<img class="cz-hb" src="images/cz-hb.png" />');
            me.$vote_info.html(t.toString()).removeClass("none");
            me.voteSupport();
        },
        voteSupport: function() {
            var me =  H.index;
            getResult('api/voteguess/groupplayertickets', { groupUuid: me.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.index;
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                        var $loading = $(".loading"),
                            $items_count = $('.items-count');
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
                                        me.type = 3;
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
        change: function(){
            var me = H.index;
            console.log("change");
            me.$wait.removeClass("none");
            me.$copyright.removeClass('vote-copy').addClass('wait-copy');
            me.$vote_info.addClass("none");

            $('.items-count').addClass('none');
            $('.loading').removeClass('none');
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        var me = H.index;
        if (data.code == 0 && data.items) {
            $.each(data.items, function(i,item){
                $('#num-'+item.puid).find('label').text(item.cunt);
            });
        }
    };

})(Zepto);

$(function() {
    H.index.init();
});
