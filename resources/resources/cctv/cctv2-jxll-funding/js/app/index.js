(function($){
    H.index = {
        isError: false,
        actUuid: "",
        puid: $.fn.cookie(openid + '_puid'),
        signNum: 0,
        expires_in: { expires: 7 },
        expires_act: { expires: 1 },
        checkid: getQueryString("checkid"),
        endDay: '',
        nowday: '',
        canSign: false,
        canLottery: true,
        isSigned: false,
        init: function(){
            this.event();
            this.getActivity();
        },
        event: function(){
            $(".tab").click(function(e){
                $(".tab").removeClass("selected");
                $(this).addClass("selected");
                var id = $(this).attr("data-attr");
                $(".tag").addClass("none");
                $("#"+id).removeClass("none");
            });
            $("#apply").click(function(){
                if($(this).hasClass("gray")){
                    $(this).addClass("shake");
                    setTimeout(function(){
                        $("#apply").removeClass("shake");
                    },1000);
                    return;
                }
                if($(this).hasClass("request")){
                    return;
                }
                $(this).addClass("request");
                shownewLoading(null, '请稍后...');
                var a = location.href.indexOf("?");
                var addr = "";
                if(a > 0){
                     addr = location.href.substring(0,a)+"?checkid="+hex_md5(openid);
                }else{
                    addr = location.href+"?checkid="+hex_md5(openid);
                }

                location.href = "http://fenxiao.jlfzb.cn/ApplyAgent/Default.aspx?father=ouL20jsqTrt5641Nr_HhNGn9Ncyk&cid=73&redirect_url="+encodeURIComponent(addr);
                //location.href = addr;
            });
            $("#lottery").click(function(){
                if($(this).hasClass("gray")){
                    $(this).addClass("shake");
                    setTimeout(function(){
                        $("#lottery").removeClass("shake");
                    },1000);
                    return;
                }
                H.index.drawlottery();
                $(this).addClass("none");
            });
        },
        sign: function(){
            var actuid = $.fn.cookie(openid+"_actuid");
            if(actuid){
                getResult('api/sign/signed', {
                    yoi: openid,
                    auid: actuid
                }, 'callbackSignSignedHandler', true);
            }
        },
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck' + dev,
                data: { oi: openid , sn : sn , sau : me.puid},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                    $.fn.cookie(me.puid + '_lottery',"lotteryed", me.expires_in);
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        sn = new Date().getTime()+'';
                        me.fill(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            me.fill(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        me.fill(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime()+'';
                    me.fill(null);
                }
            });
        },
        fill : function(data){
            if(data == null || data.result == false || data.pt == 0){
                H.dialog.thanks.open();
            }else if(data.pt == 4){
                //红包
                H.dialog.Redlottery.open(data);
            }

        },
        getActivity: function() {
            getResult('api/sign/round', {
            }, 'callbackSignRoundHandler', true);
        },
        getSignNum: function() {
            // 获取当前签到人数
            var me = this;
            getResult('api/sign/count/period', {
                periodUuid: me.puid
            }, 'callbackSignCountPeriodHandler', true);
        },
        isSign: function(){
            var me = this;
            var signCookie =  $.fn.cookie(me.puid + '_sign');
            if(signCookie && signCookie == "signed"){
                // 已经签过到
                // 判断是否到抽奖时间
                me.isSigned = true;
                if(H.index.endDay == H.index.nowday){
                    H.index.isLottery();
                }else{
                    $("#apply").removeClass("none");
                    $("#apply").addClass("gray");
                    $("#apply").text("已注册");
                }
            }else{
                // 调用接口判断是否签过到
                getResult('api/sign/mycount', {
                    yoi: openid,
                    puid: me.puid
                }, 'callbackSignMyRecordCountHandler', true);
            }
        },
        isLottery: function(){
            var me = this;
            //判断是否到抽奖时间
            if(me.nowday != me.endDay){
                if(me.isSigned){
                    $("#apply").removeClass("none");
                    $("#apply").addClass("gray");
                    $("#apply").text("已注册");
                }else{
                    $("#apply").removeClass("none");
                    $("#apply").addClass("gray");
                    $("#apply").text("活动结束");
                }
                return;
            }
            //判断参与人数是否满足
            if(!me.canLottery){
                // 上正式环境时解开注释
                $("#apply").removeClass("none");
                $("#apply").addClass("gray");
                $("#apply").text("条件不足");
                return;
            }
            var lotteryCookie =  $.fn.cookie(me.puid + '_lottery');
            if(lotteryCookie && lotteryCookie == "lotteryed"){
                // 已经抽过奖
                $("#apply").addClass("none");
                $("#lottery").removeClass("none");
                $("#lottery").addClass("gray");
                $("#lottery").text("已经参与");
            }else{
                // 调用接口判断是否抽过奖
                getResult('api/lottery/leftChance', {
                    oi: openid,
                    pu: me.puid
                }, 'callbackLotteryLeftChanceHandler', true);
            }
        },
        //计算天数差的函数，通用
        DateDiff: function(sDate1,  sDate2){
            var iDays  =  parseInt((sDate2  -  sDate1)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
            return  iDays
        },
        check: function () {
            var me = this;
            if(me.checkid && me.checkid == hex_md5(openid)){
                var puid = $.fn.cookie(openid + '_puid');
                var signCookie = $.fn.cookie(puid + '_sign');
                if(signCookie && signCookie == "signed"){
                }else{
                    me.sign();
                }
            }
        }
    };
    W.callbackSignRoundHandler = function(data){
        if(data.code == 0){
            H.index.puid = data.puid;
            $.fn.cookie(openid + '_puid', H.index.puid, H.index.expires_act);
            H.index.endDay = data.pet.split(" ")[0];
            var nowTimeStr = timeTransform(data.cud*1);
            var nowday = nowTimeStr.split(" ")[0];
            H.index.nowday = nowday;
            var decDay = H.index.DateDiff(data.cud*1,timestamp("2015-10-05 10:00:00"));
            if(isNaN(decDay)){
                $("#shengyu").addClass("none");
            }else{
                $("#day").text(decDay + 1);
            }
            H.index.check();
            if(data.items){
                var items = data.items;
                for(var i = 0;i < items.length;i ++){
                    if(comptime(nowTimeStr,items[i].st) <0 && comptime(nowTimeStr,items[i].et) >=0){
                        H.index.actUuid = items[i].uid;
                        $.fn.cookie(openid + '_actuid', H.index.actUuid, H.index.expires_act);
                        H.index.canSign = true;
                    }
                }
            }
            H.index.getSignNum();
            // 判断签到cookie
            H.index.isSign();
        }
    };

    W.callbackSignMyRecordCountHandler = function(data){
        // 判断是否签到
        if(data.code == 0){
            if(data.count > 0){
                // 已经签到，判断能否抽奖
                H.index.isSigned = true;
                H.index.isLottery();
            }else{
                // 没有签到
                if(H.index.canSign){
                    $("#apply").removeClass("none");
                }
            }
        }
    };

    W.callbackSignCountPeriodHandler = function(data){
        if(data.code == 0){
            $("#pernum").text(data.ct);
            if(data.ct <= 10000){
                $(".price").text(data.ct);
                H.index.canLottery = false;
            }else if(data.ct > 10000 && data.ct <= 20000){
                $(".price").text(data.ct*2);

            }else if(data.ct > 20000 && data.ct <= 50000){
                $(".price").text(data.ct*3);

            }else if(data.ct > 50000 && data.ct <= 100000){
                $(".price").text(data.ct*5);

            }else if(data.ct > 100000){
                $(".price").text(data.ct*5);
            }
        }
    };

    W.callbackLotteryLeftChanceHandler = function(data){
        if(data.result){
            if(data.lc > 0){
                // 可以抽奖
                $("#lottery").removeClass("none");
            }else{
                if(H.index.isSigned){
                    // 已经抽过奖，不能抽奖
                    $("#apply").addClass("none");
                    $("#lottery").removeClass("none");
                    $("#lottery").addClass("gray");
                    $("#lottery").text("已经参与");
                }else{
                    // 没有抽过奖且没有签到，不能抽奖
                    $("#apply").addClass("none");
                    $("#lottery").removeClass("none");
                    $("#lottery").addClass("gray");
                    $("#lottery").text("活动结束");
                }
            }
        }
    };

    W.callbackSignSignedHandler = function(data){
        if(data.code == 0){
            $.fn.cookie(H.index.puid + '_sign',"signed", H.index.expires_in);
        }
        H.index.getActivity();
    };
})(Zepto);

$(function(){
    //执行业务代码
    H.index.init();
});