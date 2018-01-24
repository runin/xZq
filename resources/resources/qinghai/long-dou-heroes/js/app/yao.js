/**
 * 欢乐英雄转-首页
 */
(function($) {
    H.yao = {
        $home_box: $(".home-box"),
        $audio_a: $("#audio-a"),
        $textb: $(".textb"),
        $h3: $('.btn-box-b h3'),
        $name: $('.name'),
        $mobile: $('.mobile'),
        $btn_lq: $('#btn-lq'),
        $btn_back: $('#btn-back'),
        $outer: $(".outer"),
        $body: $('body'),
        $marquee: $(".marquee"),
        $yao_gift: $('#yao-gift'),
        $img_lh: $('.img-lh'),
        $lh_bg: $('.lh-bg'),
        $info: $('#info'),
        nowTime: null,
        isToLottey:true,
        isCanShake: true,
        isTimeOver:false,//有无倒计时标识
        isLotteryTime:false,//是否在抽奖时间段表识
        isSbtRed: false,
        isLastFlag: false,//最后一次抽奖标识
        times: 0,
        first: true,
        lotteryTime: getRandomArbitrary(3,6),
        yaoBg: [],
        init: function(){
            var me = this;
            me.event();
            me.resize();
            me.current_time();
            me.shake();
            me.jump();

            me.red_record();
            setInterval(function(){
                me.red_record();
            },10000);

            me.account_num();
            setInterval(function(){
                me.account_num();
            },5000);

        },
        resize: function(){
            var me = H.yao,
                win_h = $(window).height();
            me.$lh_bg.css({
                'top': (win_h - 260)/2+'px'
            });
            if(window.screen.height==480){
                me.$info.css({
                    'top': (win_h - 335)/2+'px'
                });
            }else{
                me.$info.css({
                    'top': (win_h - 389)/2+'px'
                });
            }

            me.$yao_gift.css({
                'height': win_h+'px'
            });
        },
        //查抽奖活动接口
        current_time: function(){
            getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler',true);
        },
        //查询最新20条中奖记录
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        //查询当前参与人数
        account_num: function(){
            getResult('log/serpv ', {}, 'callbackCountServicePvHander');
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
            recordUserOperate(openid, "龙斗之英雄传说摇手机", "ldzyxcs");
            recordUserPage(openid, "龙斗之英雄传说摇手机", 0);
            me.times++;

            if(!(me.times % me.lotteryTime == 0)){
                me.isToLottey = false;
            }
            if(!me.$home_box.hasClass("yao")) {
                me.$audio_a.get(0).play();
                me.imgMath();
                me.$textb.removeClass("yaonone-text");
                me.$home_box.addClass("yao");
            }
            if(!openid || openid=='null' || me.isToLottey == false){
                setTimeout(function(){
                    me.fill(null);//摇一摇
                }, 1500);
            }else{
                setTimeout(function(){
                    me.drawlottery();
                }, 1500);
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
                        if(i == prizeActList.length-1){
                            me.isLastFlag = true;
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
            toUrl('rank.html?pid='+$.fn.cookie("pid-"+openid));
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
                        var me = H.yao;
                        if(me.isLastFlag && !me.$yao_gift.hasClass('none')){
                            $(".countdown").html('本期摇奖已结束，请等待下期!');
                            $('.btn-close').click(function(e){
                                e.preventDefault();
                                toUrl('rank.html?pid='+$.fn.cookie("pid-"+openid));
                            });
                            $('#btn-back').click(function(e){
                                e.preventDefault();
                                $('.btn-close').trigger('click');
                            });
                        }else{
                            me.isTimeOver = true;
                            $(".countdown").html('加载中...');
                            shownewLoading();
                            var delay = Math.ceil(2500*Math.random() + 1700);
                            setTimeout(function(){
                                hideLoading();
                                console.log(1);
                                me.current_time();
                            }, delay);
                        }

                    },
                    sdCallback :function(){
                        H.yao.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery:function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: {
                    oi: openid
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
            }, 1500);
        },
        not_winning: function(){
            var me = H.yao;
            me.$audio_a.get(0).pause();
            //$("#audio-c").get(0).play();//不中奖声音
            $(".texta").addClass("none");
            me.textMath();
            me.$textb.removeClass("none");
            me.$textb.addClass("yaonone-text").show();
        },
        award_info: function(data){
            var me = H.yao;
            me.$info.find('h2').text(data.tt||'');
            me.$info.find('.gift-hongbao img').attr('src',data.pi||'');
            me.$info.find('.name').val(data.rn||'');
            me.$info.find('.mobile').val(data.ph||'');
            me.$info.find('.address').val(data.ad||'');
        },
        award_sucess: function(){
            var me = H.yao,
                name = me.$info.find('.name'),
                nameVal = name.val(),
                mobile = me.$info.find('.mobile'),
                mobileVal = mobile.val(),
                address = me.$info.find('.address');
                addressVal = address.val();
            console.log(nameVal);
            console.log(mobileVal);
            console.log(addressVal);

            me.$h3.text('以下是您的信息');
            $('input').attr('disabled', 'disabled').addClass('ded');
            name.val('姓名：'+nameVal);
            mobile.val('手机号码：'+mobileVal);
            address.val('收件地址：'+addressVal);
            me.$btn_lq.addClass('none');
            me.$btn_back.removeClass('none');
        },
        init_page: function(){
            var me = H.yao;
            me.$h3.text('请填写您的手机号，以便顺利领奖');
            $('input').removeAttr('disabled').removeClass('ded');
            me.$btn_back.addClass('none');
            me.$btn_lq.removeClass('none');
            me.$info.addClass('none');
            me.$yao_gift.addClass('none');
            me.isCanShake = true;
        },
        lottery_open: function(data){
            var me = H.yao;
            if(data){
                if(data.result == true){
                    switch (data.pt){
                        case 0:
                            me.not_winning();
                            break;
                        default:
                            me.$lh_bg.removeClass('none').addClass('swing');
                            me.$yao_gift.removeClass('none');
                            me.$img_lh.addClass('scale');
                            me.award_info(data);
                    }
                }
            }
        },
        scroll: function(options) {
            H.yao.$marquee.each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
                            $(me).find('ul li').eq(0).appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
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
            $('.btn-close').click(function(e){
                e.preventDefault();
                me.init_page();
            });
            $('#btn-back').click(function(e){
                e.preventDefault();
                $('.btn-close').trigger('click');
            });
            me.$img_lh.click(function(e){
                e.preventDefault();

                me.$lh_bg.addClass('none');
                me.$info.removeClass('none');

            });
            me.$btn_lq.click(function(e){
                e.preventDefault();

                var $mobile = $('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());

                if (name.length > 20 || name.length == 0) {
                    showTips('请输入您的姓名，不要超过20字哦！');
                    $name.focus();
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通...');
                    $mobile.focus();
                    return false;
                } else if (address.length < 5 || address.length > 60) {
                    showTips('地址长度为5~60个字符');
                    return false;
                }

                getResult('api/lottery/award', {
                    oi: openid,
                    rn: encodeURIComponent(name),
                    ph: mobile,
                    ad: encodeURIComponent(address)
                }, 'callbackLotteryAwardHandler', true);

            });
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
        }
    };
    W.commonApiPromotionHandler = function(data){
        var me = H.yao;
        if(data.code == 0){
            if(data.url && data.desc){
                me.$outer.attr('href', (data.url || '')).removeClass('none');
            }
        }
    };
    W.callbackLotteryAllRecordHandler = function(data){
        var me = H.yao;
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +="<li>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</li>";
                }
                var len = me.$marquee.find("li").length;
                if(len >= 500){
                    me.$marquee.find("ul").html(con);
                }else{
                    me.$marquee.find("ul").append(con);
                }
                if(me.first){
                    me.first = false;
                    me.scroll();
                }
                me.$marquee.removeClass("none");
            }
        }
    };
    W.callbackCountServicePvHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("hidden");
        }
    }
})(Zepto);

$(function() {
    H.yao.init();
});
