(function($) {
    H.index = {
        nowTime: null,
        from: getQueryString('from'),
        $btnJoin: $('#btn-join'),
        $btnReserve: $('#btn-reserve'),
        $btnrule: $('#btn-rule'),
        flag: false,
        pal: null,
        init: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            this.current_time();
            this.event();
            //this.prereserve();
        },
        event: function() {
            $(".movie-image").click(function() {
                location.href = "http://v.qq.com/page/k/b/d/k01705ur2bd.html";
            });
            this.$btnJoin.click(function(e) {
                location.href = "http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzA5ODA0OTMzNw==#wechat_webview_type=1&wechat_redirect";
            });
            $("#yiku").click(function() {
                if (H.index.flag) {
                    location.href = "http://yaoyiyao.yuanbenyun.net/h5/suofeiya/home.html";
                } else {
                    showTips("不在抽奖段内");
                }
            });
            $("#anshuibao").click(function() {
                if (H.index.flag) {
                    location.href = "http://yaoyiyao.yuanbenyun.net/H5/Anyibao/Home.html";
                } else {
                    showTips("不在抽奖段内");
                }
            });
            $("#yixintang").click(function() {
                if (H.index.flag) {
                    location.href = "http://yaoyiyao.yuanbenyun.net/H5/yixintang/Home.html";
                } else {
                    showTips("不在抽奖段内");
                }
            });
            $("#kouqiang").click(function() {
                if (H.index.flag) {
                    location.href = "http://yaoyiyao.yuanbenyun.net/H5/baierkouqiang/Home.html";
                } else {
                    showTips("不在抽奖段内");
                }
            });
             $("#hongruilai").click(function() {
                if (H.index.flag) {
                    location.href = "http://yaoyiyao.yuanbenyun.net/H5/Hongruilai/Home.html";
                } else {
                    showTips("不在抽奖段内");
                }
            });
            $("#kunming").click(function() {
                if (H.index.flag) {
                    location.href = "http://mp.weixin.qq.com/s?__biz=MjM5ODg0MjgzNA==&mid=400314080&idx=1&sn=a8e5e81fff06f0e7d806cd0932950d28#wechat_redirect";
                } else {
                    showTips("不在抽奖段内");
                }
            });
            
            $(".my-card").click(function(e)
            {
                location.href="http://yhq.yuanbenyun.net/clientinfo/cardbag";
            });

            this.$btnrule.click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
            this.$btnReserve.click(function(e) {
                e.preventDefault();
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                    tvid: yao_tv_id,
                    reserveid: reserveId,
                    date: date
                }, function(d) {
                    if (d.errorCode == 0) {
                        H.index.$btnReserve.addClass('none');
                    }
                });
            });
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/program/reserve/get',
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackProgramReserveHandler',
                success: function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid: yao_tv_id,
                        reserveid: data.reserveId,
                        date: data.date
                    }, function(resp) {
                        if (resp.errorCode == 0) {
                            me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        current_time: function() {
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {},
                success: function(data) {
                    if (data.result == true) {
                        H.index.nowTime = timeTransform(data.sctm);
                        H.index.currentPrizeAct(data);
                    } else {
                        if (H.index.repeat_load) {
                            H.index.repeat_load = false;
                            setTimeout(function() {
                                H.lottery.current_time();
                            }, 5000);
                        } else {
                            hidenewLoading();
                            $(".countdown").removeClass("none");
                            $('.countdown-tip').text("活动尚未开始");
                            $('.detail-countdown').text("");
                            H.index.flag = false;
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    H.lottery.flag = false;
                }
            });
        },
        currentPrizeAct: function(data) {
            var me = this,
                nowTimeStr = H.index.nowTime,
                prizeActListAll = data.la,
                prizeLength = 0,
                prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if (prizeActListAll && prizeActListAll.length > 0) {
                for (var i = 0; i < prizeActListAll.length; i++) {
                    if (prizeActListAll[i].pd == day) {
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            H.index.pal = prizeActList;
            prizeLength = prizeActList.length;
            if (prizeActList.length > 0) {
                if (comptime(prizeActList[prizeLength - 1].pd + " " + prizeActList[prizeLength - 1].et, nowTimeStr) >= 0) { //如果最后一轮结束
                    H.index.flag = false;
                    return;
                } else {
                    H.index.flag = true;
                }
            } else {
                H.index.flag = false;
                return;
            }
        },
        cookieSave: function(data) {
            if($.fn.cookie(data))
             {
                 showTips("你已经参与次摇奖");
                 return false;

             }
             else
             {
                var exp = new Date();
                exp.setTime(exp.getTime() + 60 * 1000 * 60 * 6);
                $.fn.cookie(data, 1, {
                    expires: exp
                });
                return true;
            }
        }
    };
})(Zepto);
$(function() {
    H.index.init();
});