/*--------------wx.config---------------*/
H.openjs = {
    localId: "",
    serverId: "",
    init: function() {
        window.callbackJsapiTicketHandler = function(data) {};
        $.ajax({
            type: 'GET',
            url: domain_url + 'mp/jsapiticket',
            data: {
                appId: "wx8172be554b269be7"
            },
            async: true,
            dataType: 'jsonp',
            jsonpCallback: 'callbackJsapiTicketHandler',
            success: function(data) {
                if (data.code !== 0) {
                    return;
                }
                var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
                    timestamp = Math.round(new Date().getTime() / 1000),
                    url = window.location.href.split('#')[0],
                    signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

                wx.config({
                    debug: false,
                    appId: "wx8172be554b269be7",
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'addCard'
                    ]
                });
            },
            error: function(xhr, type) {
                alert('获取微信授权失败！');
            }
        });
    }
};
H.openjs.init();

(function() {
    var classId = {
        $lqCardCon: $(".lq-card-con"),
        $lqCardBtn: $(".lq-card-btn"),
        $downTime: $(".down-time"),
        $lqCard: $("#lq-card")
    };

    function cookFn() {
        if (localStorage.getItem("lottery_" + window.$ud)) {
            classId.$lqCardBtn.removeClass("yes");
        } else {
            classId.$lqCardBtn.addClass("yes");
        }
    };

    var lottery = {
        $href: "",
        init: function() {
            this.lotteryRound();
            this.lotteryRecord();
        },
        lotteryRound: function() { //抽奖时间段
            getResult('api/lottery/round', { at: 5 }, 'callbackLotteryRoundHandler');
        },
        lotteryRecord: function() { //查询个人的中奖记录
            getResult('api/lottery/record', { oi: openid }, 'callbackLotteryRecordHandler');
        },
        wxcardFn: function(data) { //微信卡劵跳转
            var ci = data.ci;
            var ts = data.ts;
            var si = data.si;
            wx.addCard({
                cardList: [{
                    cardId: ci,
                    cardExt: "{\"timestamp\":\"" + ts + "\",\"signature\":\"" + si + "\"}"
                }], // 需要添加的卡券列表
                success: function(res) {
                    classId.$lqCardBtn.removeClass("yes");
                    $("body").get(0).offsetWidth;
                    //var cardList = res.cardList; // 添加的卡券列表信息
                },
                fail: function(res) {
                    //alert(res.errMsg);
                },
                complete: function() {
                    //hidenewLoading();
                }
            });
        },
        downTimeFn: function(data) { //倒计时
            function nostart(time) {
                window.isNoStart = true;
                classId.$downTime.html("离抽奖开始还有：" + time);
            };

            function nextTime(time) {
                classId.$downTime.html("离抽奖开始还有：" + time);
                cookFn();
            };

            function lottery(time) {
                classId.$downTime.html("离抽奖开始还有：" + time);
                cookFn();
            };

            function timeEnd() {
                classId.$downTime.html("");
                //cookFn();

            };
            //设置胜利者
            function setWinner() {
                function setOpeater() {
                    var arr = window.playArray;
                    var arr_cunt = window.playArray_cunt;

                    function childOpeater(arr) {
                        var maxCunt = Math.max.apply(null, arr_cunt);
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].cunt == maxCunt) {
                                arr[i].item.find(".encourage-people").append("<img src='images/winner.png' class='winner'/>");
                                window.isComplete = true;
                                break;
                            }
                        }
                        $(".encourage-number").removeClass("none");
                        $(".tempcont").addClass("none");
                        var mc = parseInt($(".winner").parents(".people").find(".c-red").html());
                        var mcount = 0;
                        for (var i = 0; i < arr_cunt.length; i++) {
                            if (mcount == arr_cunt[i].cunt) {
                                mcount++;
                            }
                        }
                        if (mcount > 1) {
                            $(".winner").parents(".people").find(".c-red").html((mc + 1))
                        }
                    };
                    if (arr) {
                        childOpeater(arr);
                    } else {
                        var c = 0;
                        var inter = setInterval(function() {
                            c++;
                            if (arr) {
                                childOpeater(arr);
                            }
                            if (c > 60) {
                                clearInterval(inter);
                            }
                        }, 1000);
                    }
                }
                loadData({
                    url: domain_url + "api/voteguess/groupplayertickets",
                    callbackVoteguessGroupplayerticketsHandler: function(data) {  
                         debugger;
                        if (data.code == 0) {
                            window.playArray = [];
                            window.playArray_cunt = [];
                            for (var i = 0; i < data.items.length; i++) {
                                var m = data.items[i].puid;
                                window.player.players[m + "_item"].find(".c-red").html(data.items[i].cunt);
                                window.playArray.push({ index: i, cunt: data.items[i].cunt, item: window.player.players[m + "_item"] });
                                window.playArray_cunt.push(data.items[i].cunt);
                            }
                            setOpeater();
                        } else {
                            showTips("抱歉请稍后再试");
                        }
                    },
                    data: { groupUuid: window.player.guid },
                    showload: false
                });
            }

            function setPrizes() {
                loadData({
                    url: domain_url + "api/lottery/prizes",
                    callbackLotteryPrizesHandler: function(data) {
                        if (data && data.result == true) {
                            var pa = data.pa;
                            for (var i = 0, leg = pa.length; i < leg; i++) {
                                classId.$lqCard.find("p").eq(i).html(pa[i].pn);
                                classId.$lqCard.find("a").eq(i).attr("id", pa[i].id).html("领取");
                            }
                            cookFn();
                            classId.$lqCardBtn.unbind("click").click(function() {
                                if ($(this).hasClass("yes") && !$(this).hasClass("on")) {
                                    //$(this).addClass("on");
                                    var pu = $(this).attr("id");
                                    classId.$lqCardBtn.removeClass("yes");
                                    localStorage.setItem("lottery_" + window.$ud, pu);
                                    getResult('api/lottery/collect', { oi: openid, pu: pu }, 'callbackLotteryCollectHandler');
                                }
                            });
                        } else {
                            setTimeout(function() {
                                setPrizes();
                            }, 1000);
                        }
                    },
                    data: { at: 5 },
                    showload: false
                });
            }
            loadData({
                url: domain_url + "api/voteguess/inforoud",
                callbackVoteguessInfoHandler: function(d) {
                 debugger;
                    if (d.code == 0) {
                        window.pdst = d.pst;
                        window.pdet = d.pet;
                        var la = data.la;
                        var pdst = parseInt(timestamp(la[0].pd + " " + la[0].st)); //开始时间
                        var timeArr = [];
                        var item = {};
                        item.st = window.pdst;
                        item.et = window.pdet;
                        timeArr.push(item);
                        $("<div></div>").countDown({
                            timeArr: timeArr,
                            countDownFn: function(t, time, index,obj,nowTime) { //每次倒数回调
                          
                                $(".wydq-btn").addClass("gray");
                                window.isNoStart = true;
                                if (index == 0) { //没有开始的情况
                                    nostart(time);
                                    return;
                                }
                                nextTime(obj.showTime(pdst - nowTime));
                            },
                            atTimeFn: function(dt, index, nextstartTime, obj, nowTime, endTime) {
                         
                                $(".wydq-btn").removeClass("gray");
                                window.isNoStart = false;
                                if (nextstartTime) {
                                    lottery(obj.showTime(nextstartTime - nowTime));
                                } else {
                                    lottery(obj.showTime(pdst - nowTime));
                                }

                            },
                            inQuantumFn: function(t, index) { //在时间断内的回调函数 index 是倒到哪个时间断
                                window.isNoStart = false;
                                $(".wydq-btn").removeClass("gray");
                                window.$ud = la[index].ud;
                              
                            },
                            endFn: function(dt, index, obj, noTime) { //整个倒计时结束的回调
                                timeEnd();
                                setWinner();
                                setPrizes();
                            }
                        });

                    } else {
                        showTips("抱歉请稍后再试");
                    }
                },
                showload: false
            });

        }
    };

    W.callbackLotteryCollectHandler = function(data) {
        if (data && data.result == 0) {
            if (data.pt == 5) {
                showTips("领取成功！");
                lottery.lotteryRecord();
            } else if (data.pt == 7) {
                lottery.wxcardFn(data);
            } else if (data.pt == 9) {
                window.location.href = data.ru;
            }

        }
    };

    W.callbackLotteryRoundHandler = function(data) {
        debugger
        if (data && data.result == true) {
            lottery.downTimeFn(data);
        } else {
            classId.$lqCardBtn.removeClass("yes");
            classId.$downTime.html("敬请期待，下期更精彩");
        }
    };

    W.callbackLotteryRecordHandler = function(data) {
        if (data && data.result == true) {
            var rl = data.rl;
            var leg = rl.length - 1;
            var t = simpleTpl();
            t._('<h4>' + (rl[leg].pd || "") + '</h4>')
            if (rl[leg].cc) {
                t._('<p>兑换码：<label class="c-red">' + rl[leg].cc + '</label></p>')
            }
            $(".record-list").empty().append(t.toString()).removeClass("none");
            $(".record-title").removeClass("none");
        }
    };

    lottery.init();
})();
