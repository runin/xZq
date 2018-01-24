

+(function ($) {
    var comment = {
        initParam: function () {
            this.gotolottery = $(".gotolottery"); //去摇奖
            this.send_hear = $(".send_hear"); //头像
            this.downcount = $(".downcount"); //倒计时模块
            this.golottery = $(".gotolottery"); //去抽奖
            this.play_game = $(".play_game"); //去抽奖
        },
        initEvent: function () {
            this.gotolottery.click(function () {
                window.location.href = "lottery.html";
            });
            this.play_game.click(function () {
                window.location.href = "http://www.kxtui.cn/g/i.jsp?idcm=142100&jgiscre=lnHd0_uVibRxQa52SIHND_3sGsL_mcgl&tidus=73580355&from=singlemessage&isappinstalled=0";
            });
            this.setHear();
        },
        setHear: function () {//设置头像
            if (headimgurl) {
                this.send_hear.css({ 'background': 'url(' + headimgurl + ') no-repeat center center', 'background-size': 'contain' });
            }
        },
        loadLottery: function () { //加载抽奖
            var that = this;
            var lottery = {
                loadData: function () {  //加载抽奖
                    loadData({ url: domain_url + "api/lottery/round", callbackLotteryRoundHandler: function (data) {
                        if (data.result == true) {
                            //开始倒计时
                            lottery.downStart(data);
                        } else {
                        }
                    }, data: {}
                    });
                },
                downStart: function (data) {
                    var timeArr = [];
                    if (!data || !data.la) {
                        return;
                    }
                    for (var i = 0; i < data.la.length; i++) {
                        var tiem = {};
                        tiem.st = data.la[i].pd + " " + data.la[i].st
                        tiem.et = data.la[i].pd + " " + data.la[i].et
                        timeArr.push(tiem);
                    }
                    function downCountFn(time) { //显示到时
                        that.golottery.addClass("none");
                        that.downcount.removeClass("none");
                        if (time) {
                            var h = time.split(":")[0];
                            var m = time.split(":")[1];
                            var s = time.split(":")[2];
                            if (parseInt(h) != 0) {
                                m = parseInt(m) + parseInt(h) * 60;
                            }
                            that.downcount.find(".minute").html(m);
                            that.downcount.find(".second").html(s);
                        }
                    };
                    function golottery() { //去抽奖
                        that.downcount.addClass("none");
                        that.golottery.removeClass("none");

                    };
                    $("<div></div>").countDown({ timeArr: timeArr,
                        countDownFn: function (t, time, index) {
                            downCountFn(time);
                        }, atTimeFn: function (dt, index, nextstartTime, obj, nowTime, endTime) {
                            golottery();
                        }, inQuantumFn: function (t, index) {
                            golottery();
                        }, endFn: function (dt, index, obj, noTime) {
                            that.golottery.addClass("none");
                            that.downcount.addClass("none");
                        }
                    });
                },
                init: function () {
                    this.loadData();
                }
            };
            lottery.init();
        },
        init: function () {
            this.initParam();
            this.initEvent();
            this.loadLottery();

        }
    };
    comment.init();
})(Zepto)