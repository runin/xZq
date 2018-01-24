+(function () {
    var lottery = {
        initParam: function () {
            this.comeback = $(".comeback"); //返回
            this.bar_down = $(".bar_down"); //提示条
            this.nogetWin = $("#dialog3"); //不中奖弹出框
            this.prizeList = $(".prizeList"); //奖品列表
            this.prize_close = $(".prize_close"); //奖品框的关闭按钮
            this.prizes = $(".prizes"); //奖品列表容器
        },
        initEvent: function () {
            var that = this;
            this.comeback.click(function () {//返回按钮
                window.location.href = "comment.html";
            });
            this.nogetWin.find(".no_close").click(function () {//不中奖关闭
                that.nogetWin.addClass("none");
            });
            this.nogetWin.find(".no_back").click(function () {//不中奖返回
                that.nogetWin.addClass("none");
            });
            this.prizeList.click(function () {//
                that.getprizeList(function () {
                    $("#dialog5").removeClass("none");
                });
            });
            this.prize_close.click(function () {
                $("#dialog5").addClass("none");
            });

            //调试
            //现金
            // H.yao.luckCallback({ result: true, tt: "恭喜你中了二十元", pv: 20, rp: "http://baidu.com", pt: 4, pi: "http://cdn.holdfun.cn/lottery/prize/images/20151216/9a2e1ecde2cc4332be99f794e1af60b3.png" });
            //外连
            // H.yao.luckCallback({ result: true, tt: "恭喜你中天天淘金",  ru: "http://baidu.com", pt: 9, pi: "http://cdn.holdfun.cn/lottery/prize/images/20151216/b20161b76e454f20831b5ffcbabf6ba9.png" });
            //卡卷
            //H.yao.luckCallback({ result: true, tt: "恭喜你中天天淘金", ru: "http://baidu.com", pt: 7, pi: "http://cdn.holdfun.cn/lottery/prize/images/20151216/e309cf574dd1498e841c88e99bd3fff4.jpg" });
            // shakeOccur();
            //兑换类型
            //H.yao.luckCallback({ cc: "004KYKQEH7", result: true, tt: "恭喜你中天天淘金", ru: "http://www.huanghou.cc/weixininvitation.html", pt: 5, pi: "http://cdn.holdfun.cn/lottery/prize/images/20151216/e309cf574dd1498e841c88e99bd3fff4.jpg" });

        },
        getprizeList: function (fn) {//获取奖品列表
            var that = this;
            loadData({ url: domain_url + "api/lottery/prizes", callbackLotteryPrizesHandler: function (data) {
                if (data.result == true) {
                    that.prizes.empty();
                    for (var i = 0; i < data.pa.length; i++) {
                        var pitem = $('<div class="prize"><h2></h2><div class="prizeImg"></div></div>');
                        pitem.find("h2").html(data.pa[i].pn);
                        pitem.find(".prizeImg").css({ "background": " url('" + data.pa[i].pi + "') no-repeat center center", "background-size": "100% 100%" });
                        that.prizes.append(pitem);
                    }
                    if (fn) {
                        fn();
                    }
                } else {
                }
            }, showload: fn ? true : false
            });
        },
        loadLottery: function () { //加载抽奖数据
            var that = this;
            var lot = {
                loadLot: function () {
                    var cin = setInterval(function () {
                        if (window.lotteryData) {
                            //开始倒计时
                            that.bar_down.removeClass("none");
                            lot.downStart(window.lotteryData);
                            clearInterval(cin);
                        }
                    }, 50);
                },
                downStart: function (data) {

                    var timeArr = [];
                    if (!data || !data.la) {
                        that.bar_down.html("摇奖还没有开始哦~");
                        return;
                    }
                    for (var i = 0; i < data.la.length; i++) {
                        var tiem = {};
                        tiem.st = data.la[i].pd + " " + data.la[i].st
                        tiem.et = data.la[i].pd + " " + data.la[i].et
                        timeArr.push(tiem);
                    }
                    function splitTime(time) {//分居时间
                        var o = {};
                        if (time) {
                            var h = time.split(":")[0];
                            var m = time.split(":")[1];
                            var s = time.split(":")[2];
                            if (parseInt(h) != 0) {
                                m = parseInt(m) + parseInt(h) * 60;
                            }
                            o.h = h;
                            o.m = m;
                            o.s = s;
                        }
                        return o;
                    };
                    function startFn(time) {//摇奖的第一次开始  
                        that.bar_down.find(".bar_msg").html("距摇奖开始还有");
                        var timeo = splitTime(time);
                        that.bar_down.find(".minute").html(timeo.m);
                        that.bar_down.find(".second").html(timeo.s);

                    };
                    function CountOwnEndFn(time) {//距离本轮结束还有  
                        that.bar_down.find(".bar_msg").html("距本轮摇奖结束还有");
                        if (time) {
                            var timeo = splitTime(time);
                            that.bar_down.find(".minute").html(timeo.m);
                            that.bar_down.find(".second").html(timeo.s);
                        }
                    };
                    function CountNextTimeFn(time) {//距离下轮开始还有
                        that.bar_down.find(".bar_msg").html("距离下轮开始还有");
                        if (time) {
                            var timeo = splitTime(time);
                            that.bar_down.find(".minute").html(timeo.m);
                            that.bar_down.find(".second").html(timeo.s);
                        }
                    };
                    $("<div></div>").countDown({ timeArr: timeArr,
                        countDownFn: function (t, time, index) {
                            if (index == 0) { //第一次的情况
                                startFn(time);
                                return;
                            }
                            CountNextTimeFn(time);
                        }, atTimeFn: function (dt, index, nextstartTime, obj, nowTime, endTime) {
                            CountOwnEndFn(obj.showTime(endTime - nowTime));
                        }, inQuantumFn: function (t, index) {
                        }, endFn: function (dt, index, obj, noTime) {
                            that.bar_down.html("抽奖活动已经结束");
                            setTimeout(function () {
                                window.location.href = "comment.html";
                            }, 2000);
                        }
                    });
                },
                init: function () {
                    this.loadLot();
                }
            };
            lot.init();
        },
        init: function () {
            this.initParam();
            this.initEvent();
            this.loadLottery();
            this.getprizeList(); //

            getResult('api/common/promotion', { oi: openid }, 'commonApiPromotionHandler', true);
            window.commonApiPromotionHandler = function (data) {
                if (data.code == 0) {
                    if (data.url && data.desc) {
                        $('.outer').text(data.desc).attr('href', data.url).removeClass('none');
                    }
                }
            }
        }
    };
    lottery.init();
})(Zepto);