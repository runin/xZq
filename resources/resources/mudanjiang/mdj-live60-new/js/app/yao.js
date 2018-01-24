(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $h2: $('.btn-box-b h2'),
        $name: $('.name'),
        $mobile: $('.mobile'),
        $btn_jf: $('#btn-jf'),
        $btn_back: $('.btn-back'),
        $djm: $('.djm'),
        $btn_backId: $('#btn-back'),
        $btnBoxc: $('#btnBoxc'),
        $outer: $(".outer"),
        $input: $('input'),
        $copyright: $(".copyright"),
        $body: $('body'),
        $adver: $('.adver'),
        nowTime: null,
        redpack: '',
        isToLottey:true,
        isCanShake: true,
        isTimeOver:false,//有无倒计时标识
        isLotteryTime:false,//是否在抽奖时间段表识
        isSbtRed: false,
        times: 0,
        lotteryTime: getRandomArbitrary(1,3),
        yaoBg: [],
        init: function(){
            this.event();
            this.rule();
            this.current_time();
            this.shake();
            this.jump();
            this.get_gg();
        },
        get_gg: function(){
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
        },
        rule: function(){
            getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
        },
        //查抽奖活动接口
        current_time: function(){
            getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler',true);
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        downloadImg: function(){
            var t = simpleTpl(),me = H.yao;
            for(var i = 0;i < me.yaoBg.length;i++){
                t._('<img src="'+me.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        imgMath: function() {//随机背景
            var me = H.yao;
            if(me.yaoBg.length >0){
                var i = Math.floor((Math.random()*me.yaoBg.length));
                $("body").css("backgroundImage","url('"+me.yaoBg[i]+"')");
            }
        },
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));
                H.yao.$textb.text(textList[i]);
            }
        },
        shake_listener: function() {
            var me = H.yao;
            if (me.isTimeOver) {
                //没有倒计时在进行，不能摇
                return;
            }
            if (!me.isLotteryTime) {
                //非摇奖时间，不能摇
                return;
            }

            if(me.isCanShake){
                me.isCanShake = false;
            }else{
                return;
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            recordUserPage(openid, "摇奖", 0);
            me.times++;

            if(!(me.times % me.lotteryTime == 0)){
                me.isToLottey = false;
            }
            if(!me.$home_box.hasClass("yao")) {
                me.$audio_a.get(0).play();
                me.imgMath();
                me.$textb.removeClass("yaonone-text");
                me.$home_box.addClass("yao");
                me.$copyright.addClass('none');
            }
            if(!openid || openid=='null' || me.isToLottey == false){
                setTimeout(function(){
                    me.fill(null);//摇一摇
                }, 1800);
            }else{
                setTimeout(function(){
                    me.drawlottery();
                }, 1800);
            }
            me.isToLottey = true;
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.yao.nowTime,
                $tips = $(".time-tips"),
                prizeActList = [],
                me = H.yao;
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
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
                        me.do_count_down(endTimeStr,nowTimeStr,true);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.do_count_down(beginTimeStr,nowTimeStr,false);
                        return;
                    }

                }
            }else{
                me.change();
                return;
            }
        },
        change: function(){
            H.yao.isCanShake = false;
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
            $(".texta").removeClass("none");
            H.yao.$textb.addClass("none");
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
            var me = H.yao;
            if(isStart){
                me.downloadImg();
                me.isLotteryTime = true;
                $(".countdown").html('距离摇奖结束还有<span class="detail-countdown"></span>');
            }else{
                me.isLotteryTime = false;
                $(".texta").removeClass("none");
                me.$textb.addClass("none");
                $(".countdown").html('距离摇奖开启还有<span class="detail-countdown"></span>');
            }
            var endTimeLong = timestamp(endTimeStr);
            var nowTime = Date.parse(new Date())/1000;
            var serverTime = timestamp(nowTimeStr);
            if(nowTime > serverTime){
                endTimeLong += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                endTimeLong -= (serverTime - nowTime);
            }
            $('.detail-countdown').attr('etime',endTimeLong);
            H.yao.count_down();
            $(".countdown").removeClass("none");
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        H.yao.isTimeOver = true;
                        $(".countdown").html('加载中...');
                        showLoading();
                        var delay = Math.ceil(2500*Math.random() + 1700);
                        setTimeout(function(){
                            hideLoading();
                            H.yao.current_time();
                        }, delay);
                    },
                    sdCallback :function(){
                        H.yao.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery:function(){
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck'+dev,
                data: {
                    matk: matk
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    H.yao.lottery_point(data);
                },
                error : function() {
                    H.yao.lottery_point(null);
                }
            });
        },
        fill : function(data){
            var me = H.yao;
            me.$copyright.removeClass('none');
            setTimeout(function() {
                me.$home_box.removeClass("yao");
            },300);
            if(data == null || data.result == false || data.pt == 0){
                me.not_winning();
                me.isCanShake = true;
                return;
            }else{
                me.$audio_a.get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }
            me.lottery_open(data);
        },
        lottery_point : function(data){
            setTimeout(function(){
                H.yao.fill(data);
            }, 1800);
        },
        not_winning: function(){
            var me = H.yao;
            me.$audio_a.get(0).pause();
            //$("#audio-c").get(0).play();//不中奖声音
            $(".texta").addClass("none");
            me.textMath();
            me.$textb.removeClass("none").addClass("yaonone-text").show();
        },
        lottery_open: function(data){
            var me = H.yao;
            if(data){
                if(data.result == true){
                    me.$home_box.addClass('none');
                    me.$body.addClass('change-bg');
                    switch (data.pt){
                        case 0:
                            me.not_winning();
                            break;
                        case 4:
                            me.award_red(data);
                            break;
                        case 5:
                            me.award_red(data);
                            break;
                        default:
                            me.award_info(data);
                    }
                }
            }
        },
        award_red: function(data){
            var me = H.yao,
                $red_pack = $('#red-pack');
            if(data.pt == 4){
                me.redpack = data.rp;
            }else if(data.pt == 5){
                if(data.cc){
                    me.$djm.html('兑奖码：'+ (data.cc||'')).removeClass('none');
                }
                me.$btn_backId.removeClass('none');
                me.$btnBoxc.addClass('none');
            }
            $red_pack.find('img.pi').attr('src',data.pi||'');
            $red_pack.find('h3').empty().text(data.tt||'');
            $red_pack.find('.adver img').attr('src',data.qc||'');
            $red_pack.removeClass('none');
        },
        award_info: function(data){
            var me = H.yao,
                $jf = $('#jf');
            $jf.find('img.pi').attr('src',data.pi||'');
            $jf.find('h3').empty().text(data.tt||'');
            $jf.find('.adver img').attr('src',data.qc||'');
            $jf.find('.name').val(data.rn||'');
            $jf.find('.mobile').val(data.ph||'');
            $jf.removeClass('none');
        },
        award_sucess: function(){
            var me = H.yao;
            me.$h2.text('以下是您的信息');
            me.$input.attr('disabled', 'disabled');
            me.$btn_jf.addClass('none');
            me.$btn_back.removeClass('none');
        },
        init_page: function(){
            var me = H.yao;
            me.$body.removeClass('change-bg');
            $('.zj-items').addClass('none');
            me.$h2.text('请填写您的手机号，以便顺利领奖');
            me.$input.removeAttr('disabled');
            me.$btn_jf.removeClass('none');
            me.$btn_back.addClass('none');
            me.$home_box.removeClass('none');
            if(!me.$djm.hasClass('none')){
                me.$djm.addClass('none');
            }
            if(!me.$btn_backId.hasClass('none')){
                me.$btn_backId.addClass('none');
            }
            if(me.$btnBoxc.hasClass('none')){
                me.$btnBoxc.removeClass('none');
            }
            me.isCanShake = true;
        },
        event: function(){
            var me = H.yao;
            $('.back-home').click(function(e){
                e.preventDefault();
                toUrl('index.html');
            });
            $("#test").click(function(e){
                e.preventDefault();
                me.shake_listener();
            });
            me.$btnBoxc.click(function(e){
                e.preventDefault();
                if(me.isSbtRed){
                    return;
                }
                me.isSbtRed = true;
                showLoading();
                location.href = me.redpack;
            });
            me.$input.focus(function(e){
                e.preventDefault();
                me.$copyright.addClass('none');
            }).blur(function(e){
                e.preventDefault();
                me.$copyright.removeClass('none');
            });
            me.$btn_jf.click(function(e){
                e.preventDefault();

                var $mobile = $('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val());

                if (name.length > 20 || name.length == 0) {
                    showTips('请输入您的姓名，不要超过20字哦！');
                    $name.focus();
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通...');
                    $mobile.focus();
                    return false;
                }

                getResult('api/lottery/award', {
                    oi: openid,
                    rn: encodeURIComponent(name),
                    ph: mobile
                }, 'callbackLotteryAwardHandler', true);

            });
            me.$btn_back.click(function(e){
                e.preventDefault();
                H.yao.init_page();
            });
        }
    };
    W.commonApiRuleHandler = function(data) {
        if (data.code == 0) {
            $('.con-htm').html(data.rule);
        }
    };
    W.callbackLotteryRoundHandler = function(data){
        var me = H.yao;
        if(data.result == true){
            me.nowTime = timeTransform(data.sctm);
            me.currentPrizeAct(data);
        }else{
            me.change();
        }
    };
    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            H.yao.award_sucess();
            return;
        } else {
            showTips('亲，服务君繁忙！稍后再试哦！');
        }
    };
    W.commonApiPromotionHandler = function(data){
        var me = H.yao;
        if(data.code == 0){
            if(data.url && data.desc){
                me.$outer.text(data.desc).attr('href', data.url).removeClass('none');
            }
        }
    };
    W.callbackLinesDiyInfoHandler = function(data) {
        if(data.code == 0 && data.gitems[2] && data.gitems[2].ib){
            H.yao.$adver.removeClass('none').find('img').attr('src',data.gitems[2].ib);
        }
    }
})(Zepto);

$(function() {
    H.yao.init();
});
