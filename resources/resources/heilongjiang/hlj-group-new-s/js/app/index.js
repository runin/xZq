/**
 * 欢乐英雄转-首页
 */
(function($) {
    H.index = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $h2: $('.btn-box-b h2'),
        $name: $('.name'),
        $mobile: $('.mobile'),
        $btn_jf: $('#btn-jf'),
        $btn_back: $('#btn-back'),
        $outer: $(".outer"),
        $copyright: $(".copyright"),
        $body: $('body'),
        nowTime: null,
        redpack: '',
        isToLottey:true,
        isCanShake: true,
        isTimeOver:false,//有无倒计时标识
        isLotteryTime:false,//是否在抽奖时间段表识
        isSbtRed: false,
        times: 0,
        thank_times: 0,
        lotteryTime: getRandomArbitrary(3,6),
        yaoBg: [],
        init: function(){
            this.resize();
            this.event();
            this.rule();
            this.current_time();
            this.shake();
            this.jump();
        },
        resize: function(){
            H.index.$body.css('height',$(window).height());
            H.dialog.mytry.open("龙视公共频道《欢乐英雄转》<br/>每天18:20~19:25<br/>现金红包  回馈观众<br/>唱响黑土  转遍龙江");
            $('#tab').removeClass('none').addClass('bounce-in-up');
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
            W.addEventListener('shake', H.index.shake_listener, false);
        },
        downloadImg: function(){
            var t = simpleTpl(),me = H.index;
            for(var i = 0;i < me.yaoBg.length;i++){
                t._('<img src="'+me.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        imgMath: function() {//随机背景
            var me = H.index;
            if(me.yaoBg.length >0){
                var i = Math.floor((Math.random()*me.yaoBg.length));;
                $("body").css("backgroundImage","url('"+me.yaoBg[i]+"')");
            }
        },
        shake_listener: function() {
            var me = H.index;
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
            recordUserOperate(openid, "欢乐英雄传摇手机", "hlj-group-new");
            recordUserPage(openid, "欢乐英雄传摇手机", 0);
            me.times++;

            if(!(me.times % me.lotteryTime == 0)){
                me.isToLottey = false;
            }
            if(me.thank_times >= 10){
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
                }, 1500);
            }else{
                me.drawlottery();
            }
            me.isToLottey = true;
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.index.nowTime,
                $tips = $(".time-tips"),
                prizeActList = [],
                me = H.index;
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
            H.index.isCanShake = false;
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
            $(".texta").removeClass("none");
            H.index.$textb.addClass("none");
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
            var me = H.index;
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
            H.index.count_down();
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
                        H.index.isTimeOver = true;
                        $(".countdown").html('加载中...');
                        showLoading();
                        var delay = Math.ceil(2500*Math.random() + 1700);
                        setTimeout(function(){
                            hideLoading();
                            console.log(1);
                            H.index.current_time();
                        }, delay);
                    },
                    sdCallback :function(){
                        H.index.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery:function(){
            showLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hideLoading();
                },
                success : function(data) {
                    H.index.lottery_point(data);
                },
                error : function() {
                    H.index.lottery_point(null);
                }
            });
        },
        fill : function(data){
            var me = H.index;
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
                H.index.fill(data);
            }, 1500);
        },
        not_winning: function(){
            var me = H.index;
            me.$audio_a.get(0).pause();
            $("#audio-c").get(0).play();//不中奖声音
            $(".texta").addClass("none");
            me.$textb.removeClass("none");
            me.$textb.addClass("yaonone-text").show();
        },
        award_info: function(data){
            var me = H.index,
                $jf = $('#jf');
            me.$home_box.addClass('none');
            me.$body.addClass('change-bg');
            $jf.find('img').attr('src',data.pi||'');
            $jf.find('.name').val(data.rn||'');
            $jf.find('.mobile').val(data.ph||'');
            $jf.removeClass('none');
        },
        lottery_open: function(data){
            var me = H.index,
                $red_pack = $('#red-pack');
            if(data){
                if(data.result == true){
                    switch (data.pt){
                        case 0:
                            me.not_winning();
                            me.thank_times ++;
                            break;
                        case 4:
                            me.redpack = data.rp;
                            me.$home_box.addClass('none');
                            me.$body.addClass('change-bg');
                            $red_pack.find('img').attr('src',data.pi||'');
                            $red_pack.removeClass('none');
                            break;
                        case 5:
                            me.award_info(data);
                            break;
                        default:
                            me.award_info(data);
                    }
                }
            }
        },
        award_sucess: function(){
            var me = H.index;
            me.$h2.text('以下是您的信息');
            me.$name.attr('disabled', 'disabled');
            me.$mobile.attr('disabled', 'disabled');
            me.$btn_jf.addClass('none');
            me.$btn_back.removeClass('none');
        },
        init_page: function(){
            var me = H.index;
            me.$body.removeClass('change-bg');
            $('.redhongbao').addClass('none');
            me.$h2.text('请填写您的手机号，以便顺利领奖');
            me.$name.removeAttr('disabled');
            me.$mobile.removeAttr('disabled');
            me.$btn_jf.removeClass('none');
            me.$btn_back.addClass('none');
            me.$home_box.removeClass('none');
            me.$outer.addClass('none');
            me.isCanShake = true;
        },
        event: function(){
            var me = H.index, $rule = $(".rule");
            $rule.click(function(e){
                e.preventDefault();
                $('.rule-section').removeClass('none');
            });
            $(".rule-close").click(function(e){
                e.preventDefault();
                $('.rule-section').addClass('none');
            });
            if(openid){
                $('#jifen').attr('href', 'mall.html');
            }
            $("#test").click(function(e){
                e.preventDefault();
                me.shake_listener();
            });
            $("#btnBoxc").click(function(e){
                e.preventDefault();
                if(me.isSbtRed){
                    return;
                }
                me.isSbtRed = true;
                showLoading();
                location.href = me.redpack;
            });
            $('input').focus(function(e){
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
            $('#btn-back').click(function(e){
                e.preventDefault();
                H.index.init_page();
            });
        }
    };
    W.commonApiRuleHandler = function(data) {
        if (data.code == 0) {
            $('.con-htm').html(data.rule);
        }
    };
    W.callbackLotteryRoundHandler = function(data){
        var me = H.index;
        if(data.result == true){
            me.nowTime = timeTransform(data.sctm);
            me.currentPrizeAct(data);
        }else{
            me.change();
        }
    };
    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            H.index.award_sucess();
            return;
        } else {
            showTips('亲，服务君繁忙！稍后再试哦！');
        }
    };
    W.commonApiPromotionHandler = function(data){
        var me = H.index;
        if(data.code == 0){
            if(data.url && data.desc){
                me.$outer.text(data.desc).attr('href', data.url).removeClass('none');
            }
        }
    }
})(Zepto);

$(function() {
    H.index.init();
});
