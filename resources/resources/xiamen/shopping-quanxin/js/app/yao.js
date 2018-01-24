/**
 * 摇红包页
 */
(function ($) {

    H.yao = {
        $body: $("body"),
        $shake: $('.shake'),
        $hongbao: $('.hongbao'),
        $hongbaoopen: $('.hongbao-open'),
        $noprise: $('.no-prise'),
        $integral: $('.integral'),
        $countDown: $('#count_down'),
        $audioShake: $('#audio_shake'),
        $audioWin: $('#audio_win'),
        $tips: $('.tips'),
        $awardText: $('#award_text'),

        shakeEvent: null,
        isReturned: true,
        timeOffset: 0,
        roundData: null,
        currentRound: 0,
        interval: null,
        intervalStart: 0,
        intervalEnd: 0,

        init: function () {
            this.resize();
            showLoading();
            getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler');
            this.initRedpackOpen();
            this.promotion();
        },

        promotion: function () {
            getResult('api/common/promotion', {oi: openid}, W.commonApiPromotionHandler);
        },

        initRedpackOpen: function () {
            var rp = getQueryString('rp');
            if (rp && rp == 1) {
                this.showHongbaoOpen();
            }
        },

        initCountDown: function (data) {
            var now = new Date();
            this.timeOffset = data.sctm - now.getTime();
            this.roundData = data.la;
            this.currentRound = this.getCurrentRound();
            if (this.currentRound < 0) {
                this.end();
            } else {
                this.initShake();
                this.updateCountDown();
            }
        },

        getCurrentRound: function () {
            var now = new Date().getTime() + this.timeOffset;
            for (var i in this.roundData) {
                var et = this.roundData[i].pd + ' ' + this.roundData[i].et;
                var st = this.roundData[i].pd + ' ' + this.roundData[i].st;
                if (now <= timestamp(et) && now >= timestamp(st)) {
                    return i;
                }
            }
            return -1;
        },

        updateCountDown: function () {

            this.$countDown.html('距本轮结束还有<span class="time">00:00</span>');
            var st = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
            var et = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;

            this.intervalStart = timestamp(st);
            this.intervalEnd = timestamp(et);
            clearInterval(this.interval);
            this.interval = setInterval(function () {
                var nowTime = new Date().getTime() + H.yao.timeOffset;
                var sT = isNaN(H.yao.intervalStart) ? 0 : H.yao.intervalStart - nowTime;
                var eT = isNaN(H.yao.intervalEnd) ? 0 : H.yao.intervalEnd - nowTime;

                if (sT >= 0) {
                    // 即将开始
                    H.yao.showTime(sT, '%H%:%M%:%S%');
                } else if (eT >= 0) {
                    //正在进行
                    H.yao.showTime(eT, '%H%:%M%:%S%');
                } else {
                    // 结束
                    H.yao.end();
                }
            }, 100);
        },

        showTime: function (rT, showTpl) {
            var s_ = Math.round((rT % 60000) / 100);
            s_ = H.yao.subNum(H.yao.dateNum(Math.round(s_ / 1000 * 100)));
            var m_ = H.yao.subNum(H.yao.dateNum(Math.floor((rT % 3600000) / 60000)));
            var h_ = H.yao.subNum(H.yao.dateNum(Math.floor((rT % 86400000) / 3600000)));
            var d_ = H.yao.subNum(H.yao.dateNum(Math.floor(rT / 86400000)));
            this.$countDown.find('.time').html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
        },

        subNum: function (num) {
            numF = num.toString().substring(0, 1);
            numS = num.toString().substring(1, num.length);
            return num = "<label>" + numF + "</label><label>" + numS + '</label>';
        },

        dateNum: function (num) {
            return num < 10 ? '0' + num : num;
        },

        end: function () {
            location.href = './index.html';
        },


        initShake: function () {
            this.shakeEvent = new Shake({
                threshold: 7,
                timeout: 1000
            });
            W.addEventListener('shake', W.shakeOccur, false);
            var rp = getQueryString('rp');
            if (rp && rp == 1) {
                this.shakeEvent.stop();
            }
            else {
                this.shakeEvent.start();
            }
        },

        award: function (data) {
            var prizeType = data.pt;
            if (prizeType == 2) {
                this.shakeEvent.stop();
                data.pv && $("#integral-value").text("获得" + data.pv + "积分");
                data.ph && $("#integral-mobile").val(data.ph);
                this.$hongbao.find('#open-redpack').unbind('click');
                this.$hongbao.find('#open-redpack').bind('click', function () {
                    H.yao.showIntegral();
                    H.yao.$hongbao.addClass('none');
                });
                setTimeout(function () {
                    H.yao.showHongbao();
                }, 1000);
            }
            else if (prizeType == 4) {
                this.shakeEvent.stop();
                data.rp && $.fn.cookie(mpappid + '_awardText', data.pn, {expires: 1});
                this.$hongbao.find('#open-redpack').unbind('click');
                this.$hongbao.find('#open-redpack').bind('click', function () {
                    data.rp && (location.href = data.rp);
                });
                setTimeout(function () {
                    H.yao.showHongbao();
                }, 1000);
            }
            else {
                H.yao.showNoPrise();
            }
        },

        showHongbao: function () {
            this.$audioWin[0].play();
            H.yao.$hongbao.removeClass('none');
            setTimeout(function () {
                H.yao.$hongbao.find('.hongbao-bg').addClass('fadeIn');
            }, 100);
        },

        showHongbaoOpen: function () {
            var awardText = $.fn.cookie(mpappid + '_awardText');
            awardText && this.$awardText.text(awardText);
            H.yao.$hongbaoopen.removeClass('none');
            setTimeout(function () {
                H.yao.$hongbaoopen.find('.hongbao-bg').addClass('fadeIn');
            }, 100);
            H.yao.$hongbaoopen.find('.hongbao-bg').click(function () {
                H.yao.$hongbaoopen.addClass('none');
                H.yao.$hongbaoopen.find('.hongbao-bg').removeClass('fadeIn');
                $.fn.cookie(mpappid + '_awardText', null, {expires: -1});
                H.yao.shakeEvent.start();
            });
        },

        showIntegral: function () {
            H.yao.$integral.find(".integral-close").unbind('click');
            H.yao.$integral.find(".integral-close").bind('click', function () {
                H.yao.$integral.addClass('none');
                H.yao.shakeEvent.start();
            });
            H.yao.$integral.find(".integral-button").unbind('click');
            H.yao.$integral.find(".integral-button").bind('click', function () {
                var mobile = $.trim($("#integral-mobile").val());
                if (mobile) {
                    showLoading();
                    getResult("api/lottery/xmshop/award", {
                        oi: openid,
                        nn: encodeURIComponent(nickname),
                        hi: headimgurl,
                        ph: mobile
                    }, "W.callbackLotteryAwardHandler");
                }
                else {
                    alert("请输入电话号码");
                }
            });
            H.yao.$integral.removeClass('none');
            setTimeout(function () {
                H.yao.$integral.find('.integral-bg').addClass('fadeIn');
            }, 100);
        },

        showNoPrise: function () {
            this.shakeEvent.stop();
            setTimeout(function () {
                var ran = Math.floor(Math.random() * 4 + 1);
                H.yao.$noprise.find('.noprise-bg').css({
                    'background': 'url(./images/noprise-' + ran + '.png) no-repeat',
                    'background-size': $(W).width() + 'px ' + $(W).height() + 'px'
                });
                H.yao.$noprise.removeClass('none');
                H.yao.$noprise.find('.noprise-bg').addClass('fadeIn');
            }, 800);
            H.yao.$noprise.find('.noprise-bg').click(function () {
                H.yao.$noprise.addClass('none');
                H.yao.$noprise.find('.noprise-bg').removeClass('fadeIn');
                H.yao.shakeEvent.start();
            });
            setTimeout(function () {
                H.yao.$noprise.addClass('none');
                H.yao.$noprise.find('.noprise-bg').removeClass('fadeIn');
                H.yao.shakeEvent.start();
            }, 2500);
        },

        lostTips: function () {
            var lostTips = [
                '加油，还差一点就中奖了',
                '可惜，红包就在近在咫尺了啊',
                '哎，下一次就是人品爆发的时候',
                '啊呀，再来一次！'
            ];
            var ran = Math.floor(Math.random() * 4);
            this.$tips.text(lostTips[ran]);
        },

        shakingTips: function () {
            var lostTips = [
                '祈祷中...',
                '求个红包~',
                '。。。'
            ];
            var ran = Math.floor(Math.random() * 3);
            this.$tips.text(lostTips[ran]);
        },

        resize: function () {
            var w = $(window).width();
            var h = $(window).height();
            this.$body.css("background-size", w + "px " + h + "px");

            var pt = (h - 150) / 2;
            this.$shake.css('padding-top', pt).removeClass('none');
            this.$shake.find('img').attr('width', w * 0.4 + "px");

            var left = (w - 288) / 2;
            var top = (h - 385) / 2;
            this.$hongbao.find('.hongbao-bg').css({
                'left': left,
                'top': top
            });
            this.$hongbaoopen.find('.hongbao-bg').css({
                'background-size': w + 'px ' + h + 'px'
            });
            this.$hongbaoopen.find('.hongbao-text').css({
                'padding-top': h * 0.4 + 'px'
            });

            this.$integral.find('.integral-bg').css({
                'background-size': w + 'px ' + h + 'px'
            });
            this.$integral.find('.integral-text').css({
                'padding-top': h * 0.38 + 'px'
            });

            this.$noprise.find('.noprise-bg').css({
                'background-size': w + 'px ' + h + 'px'
            });
            this.$noprise.find('.noprise-text').css({
                'padding-top': h * 0.3 + 'px'
            });

            // FIXME for test
            /*this.$shake.click(function () {
                W.shakeOccur();
            });*/
        }
    };


    W.callbackLotteryRoundHandler = function (data) {
        hideLoading();
        if (data.result == true) {
            H.yao.initCountDown(data);
        } else {
            alert('网络错误，请刷新页面');
        }
    };

    W.shakeOccur = function () {
        H.yao.$audioShake[0].play();
        H.yao.$shake.find('img').addClass('shake');
        H.yao.shakingTips();
        setTimeout(function () {
            H.yao.$shake.find('img').removeClass('shake');
        }, 800);

        if (H.yao.isReturned == true) {
            H.yao.isReturned = false;
            getResult('api/lottery/exec/luck?test=1', {
                matk: matk,
            }, 'callbackLotteryLuckHandler');
        }

    };

    W.callbackLotteryLuckHandler = function (data) {
        H.yao.isReturned = true;
        if (data.result == true) {
            H.yao.award(data);
        } else {
            H.yao.lostTips();
            H.yao.showNoPrise();
        }
    };

    W.callbackLotteryAwardHandler = function (data) {
        hideLoading();
        if (data.result && data.pt == 2) {
            location.href = data.redirectUrl;
        } else {
            alert('领取失败！');
        }
    }

    W.commonApiPromotionHandler = function (data) {
        if (data.code == 0) {
            $('#tttj').removeClass('none');
            $('#tttj').html(data.desc).attr('href', data.url);
        }
    };

    $(window).resize(function () {
        H.yao.resize();
    });

    H.yao.init();

})(Zepto);