(function($) {
    H.secKill = {
            isTimeOver: false,
            type: 1,
            dec: 0,
            pid:getQueryString("data_uuid"),
            $sectionSeckill: $(".section-seckill"),
            $seckillTitle: $(".seckill-title"),
           
            $skillCountdown: $(".countdown-show").find(".skill-countdown"),
            $countdownShow: $(".countdown-show"),
            $skillTip: $(".skill-countdown-tip"),
            startTime: 0,
            endTime: 0,
            $body: $("body"),
            requestFlag: true,
            orderFlag: 3,
            dataStartTime:null,
            $seckillGoods: $(".seckill-goods").find("ul"),

            styleList: [{ style: "seckill-state-before", text: "秒杀提醒" }, { style: "seckill-state-ing", text: "秒杀进行中" }, { style: "seckill-state-over", text: "秒杀已结束" }],
            init: function() {
                var me = this;
                //me.secDetail();
                //me.nowCountdown();
                me.seckillDetail();
            },
            secKillOrder: function(uuid) {
                getResult("seckill/orderwarn", { appId: busiAppId, openid: openid, pid: uuid }, "seckillOrderWarnCallBackHandler");
            },
            seckillDetail:function()
            {
                getResult("seckill/info", { size:3,appid:busiAppId}, "callBackSeckillInfoHandler"); 
            },

            secDetail: function(data) {
                var me = this;
                var t = simpleTpl();
                me.$seckillGoods.empty();
                var sectxt = ["", "seckill-state-ing", "seckill-state-after"];
                for (var i = 0; i < data.infos.length; i++) {
                    item = data.infos[i];
                    t._('<li data_state="' + item.state + '" data_beginTime="' + data.stime + '" class="grey-click-bg">')
                        ._('<div class = "seckill-box" >')
                        ._('<div class = "w-goods-pic" data-uuid = "' + item.infouid + '">')
                        ._('<img src = "' + item.smallimg + '" >')
                        ._('</div>')
                        ._('<div class="w-seckill-state ' + me.styleList[item.state].style + '">')
                        ._(me.styleList[item.state].text)
                        ._('</div>')
                        ._('</div>')
                        ._('</li>')
                }
                me.$seckillGoods.append(t.toString());
                me.dataStartTime = data.stime;
                if (data.totalstate == 0) {
                    me.beforeShowCountdown(data.stime);
                } else if (data.totalstate == 1) {
                    me.nowCountdown(data.totalend);
                }else if(data.totalstate == 2) {
                    me.show(data.totalend);
                } 
                else {
                    me.change();
                }
                me.eventHander();
                me.$sectionSeckill.removeClass("none");
            },
            // 开奖开启倒计时
            beforeShowCountdown: function(pra) {
                var me = this;
                H.secKill.type = 1;
                var beginTimeLong = timestamp(pra);
                beginTimeLong += H.secKill.dec;
                me.$seckillTitle.html(str2date(pra).getHours().toString()+"点秒杀")
                me.$skillTip.html("距离下轮开始还有 ");
                me.$skillCountdown.attr('etime', beginTimeLong);
                H.secKill.countdown();
            },
             // 摇奖结束倒计时
            show: function(pra) {
                var me = this;
                H.secKill.type = 2;
                var beginTimeLong = timestamp(pra);
                beginTimeLong += H.secKill.dec;
                me.$seckillTitle.html(str2date(me.dataStartTime).getHours().toString()+"点秒杀")
                me.$skillCountdown.attr('etime', beginTimeLong).addClass("none");
                me.$skillTip.html('本轮秒杀已结束');
                H.secKill.countdown();

            },
            // 摇奖结束倒计时
            nowCountdown: function(pra) {
                var me = this;
                H.secKill.type = 2;
                var beginTimeLong = timestamp(pra);
                beginTimeLong += H.secKill.dec;
                me.$seckillTitle.html(str2date(me.dataStartTime).getHours().toString()+"点秒杀");
                me.$skillCountdown.attr('etime', beginTimeLong);
                me.$skillTip.html("距离本轮结束还有   ");
                H.secKill.countdown();

            },
            change: function() {
                var me = this;
                // me.$skillTip.html('今日秒杀已结束');
                me.$sectionSeckill.addClass("none");
            },
            countdown: function() {
                var that = this;
                that.$skillCountdown.each(function() {
                    var $me = $(this);
                    $(this).countDown({
                        etpl: '<span class="fetal-H">%H%</span>' + ':' + '<span class="fetal-H">%M%</span>' + ':' + '<span class="fetal-H">%S%</span>' + '.' + '<span class="fetal-H">%ms%</span>', // 还有...结束
                        stpl: '<span class="fetal-H">%H%</span>' + ':' + '<span class="fetal-H">%M%</span>' + ':' + '<span class="fetal-H">%S%</span>' + '.' + '<span class="fetal-H">%ms%</span>', // 还有...开始
                        sdtpl: '',
                        otpl: '',
                        otCallback: function() {
                            if (!H.secKill.isTimeOver && H.secKill.type == 1) {
                                H.secKill.isTimeOver = true;
                                H.secKill.seckillDetail();
                                console.log("1");

                            } else if (!H.secKill.isTimeOver && H.secKill.type == 2) {
                                H.secKill.isTimeOver = true;
                                H.secKill.seckillDetail();
                                H.secKill.type == 3;
                            } else if (H.secKill.type == 3) {
                                return;
                            }
                        },
                        sdCallback: function() {
                            H.secKill.isTimeOver = false;
                        }
                    });
                });
            },
            eventHander: function() {
                var me = this;
                $(".seckill-goods").find("li").each(function(index, el) {
                    $(el).click(function() {
                        var activestate = $(this).attr("data_state");
                        var beginTime = $(this).attr("data_beginTime");
                        var nowTime = new Date().getTime();
                        var timeDesc = (timestamp(beginTime) + me.dec) - nowTime;
                        var uuid = $(this).find(".w-goods-pic").attr("data-uuid");
                        H.secKill.orderFlag = 3;

                        if (activestate != "0") {
                            H.secKill.orderFlag = 2;
                            toUrl("./html/seckill/seckillview.html?data_uuid=" + uuid);
                        } else {
                            if (timeDesc >= 5 * 60 * 1000) {
                                H.secKill.orderFlag = 0;
                                me.secKillOrder(uuid);
                            } else if (timeDesc >= 0) {
                                H.secKill.orderFlag = 1;
                                me.statusShow(1,uuid);
                            }
                        }
                    })
                })
            },
            statusShow: function(status,uuid) {
                var me = this;
                //0(开始5分钟之前),1(开始5分钟之内),2(正在秒杀或秒杀结束)
                switch (status) {
                    case 0:
                        me.dialogShow(0,uuid);
                        break;
                    case 1:
                        me.dialogShow(1,uuid);
                        break;
                    case 2:
                        break;
                    default:
                        break;
                }
            },
            dialogShow: function(status,uuid) {
                var t = simpleTpl();
                if (status == 0) {
                    t._('<section class="modal">')
                        ._('<div class="msgbox" >')
                        ._('<div class="msgbox-bd">')
                        ._('<p class="msgbox-title">秒杀提醒设置成功！</p>')
                        ._('<p>我们将提前5分钟提醒您！</p>')
                        ._('<p>请注意查看公众号通知。&nbsp;&nbsp;</p>')
                        ._('</div>')
                        ._('</div>')
                        ._('</section>')
                } else {
                    t._('<section class="modal">')
                        ._('<div class="msgbox" onclick="$(this).closest(\'.modal\').remove()">')
                        ._('<div class="msgbox-bd">')
                        ._('<p>秒杀马上开始,</p>')
                        ._('<p>请不要离开哦~</p>')
                        ._('</div>')
                        ._('</div>')
                        ._('</section>')
                }

                H.secKill.$body.append(t.toString());
                var height = $(window).height(),
                    MsgH = $(".msgbox").height();
                $(".msgbox").css({
                    'top': (height - MsgH) / 2,
                });
                $(".msgbox").click(function() {
                    $(this).closest('.modal').remove();
                    toUrl("./html/seckill/seckillview.html?data_uuid=" + uuid);
                })
                setTimeout(function()
                {
                    $(".msgbox").closest('.modal').remove();
                    toUrl("./html/seckill/seckillview.html?data_uuid=" + uuid);
                },1800);
            }
        }
        // 秒杀预约
    W.seckillOrderWarnCallBackHandler = function(data) {
        if (data.result) 
        {
            if (data.ro) 
            {
                    if(data.order)
                    {
                        H.secKill.statusShow(0,data.pid)
                    }
                    else
                    {
                        H.secKill.statusShow(1,data.pid)
                    }
            } else {
                showTips("您已经预约过了！")
                toUrl("./html/seckill/seckillview.html?data_uuid=" + data.pid);
            }
        } else {

        }
    }
    W.callBackSeckillInfoHandler = function(data)
    {
        if(data.result)
        {
             H.secKill.dec =  new Date().getTime() - data.nowtime;
             // 正式
             if(data.ifnext)
             {
                 H.secKill.secDetail(data);
             }
             else
             {
                H.secKill.$sectionSeckill.addClass("none");
             }
             // // 测试
             // else if(data.ifnextTest)
             // {

             //    H.secKill.secDetail(data);
             // }  
        }
        else
        {
            H.secKill.$sectionSeckill.addClass("none");
        }
    }
    H.secKill.init()
})(Zepto)
