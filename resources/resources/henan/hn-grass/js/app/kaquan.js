(function ($) {

    H.kaquan = {
        $wrapper: $('.kaquan-wrapper'),
        isError: false,
        isReady: false,
        wxTimeout: null,
        btnText: '',

        init: function () {
            this.bindBtns();
            this.resize();
            $.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js", function () {
                $.getScript("http://cdn.holdfun.cn/static/sha1.min.js", function () {
                    if (!W.mpappid || W.mpappid == '') {
                        alert('微信卡券需要mpappid,请在config文件中完善信息');
                        return false;
                    }
                    getResult("mp/jsapiticket", {
                        appId: W.mpappid
                    }, 'callbackJsapiTicketHandler');
                });
            });
        },
        show: function (data) {
            if (H.kaquan.isReady != true) {
                // FIX ME 错误事件处理
                return false;
            }
            var data = JSON.parse(data);
            H.kaquan.$wrapper.find('.hongbao-kaquan img').attr('src', data.pi);
            H.kaquan.$wrapper.find('.hongbao-click').attr('ci', data.ci);
            H.kaquan.$wrapper.find('.hongbao-click').attr('ts', data.ts);
            H.kaquan.$wrapper.find('.hongbao-click').attr('si', data.si);
            if (data.tt) {
                H.kaquan.$wrapper.find('.hongbao-text').html(data.tt);
            }
            H.kaquan.$wrapper.parent().removeClass('none');
            H.kaquan.$wrapper.find('.hongbao-click').click(function (e) {
                e.preventDefault();
                if (!$(this).hasClass("clicked")) {
                    H.kaquan.btnText = $(this).html();
                    //                    $(this).html("领取中");
                    $(this).addClass("clicked");
                    showLoading();
                    H.kaquan.wxTimeout = setTimeout(function () {
                        hideLoading();
                    }, 15000);

                    var ci = H.kaquan.$wrapper.find('.hongbao-click').attr('ci');
                    var ts = H.kaquan.$wrapper.find('.hongbao-click').attr('ts');
                    var si = H.kaquan.$wrapper.find('.hongbao-click').attr('si');

                    H.kaquan.wx_card(ci, ts, si);
                }
            });

        },
        wx_card: function (ci, ts, si) {
            //卡券
            wx.addCard({
                cardList: [{
                    cardId: ci,
                    cardExt: "{\"timestamp\":\"" + ts + "\",\"signature\":\"" + si + "\"}"
                }],
                success: function (res) {
                    H.kaquan.isReady = true;
                    loadData({ url: domain_url + 'api/lottery/award', callbackLotteryAwardHandler: function (data) {
                        hideLoading();
                        if (data.result) {
                            showTips('领取成功');
                        }
                    }, data: {
                        oi: openid,
                        hi: headimgurl,
                        nn: nickname
                    }
                    });

                    H.kaquan.finish();
                },

                fail: function (res) {
                    hideLoading();
                    recordUserOperate(openid, res.errMsg, "card-fail");
                    H.kaquan.finish();
                },

                complete: function () {
                    hideLoading();
                    H.kaquan.wxTimeout && clearTimeout(H.kaquan.wxTimeout);
                    H.kaquan.$wrapper.parent().addClass('none');
                },

                cancel: function () {
                    hideLoading();
                    H.kaquan.finish();
                }
            });

        },

        finish: function () {
            H.kaquan.$wrapper.find('.hongbao-click').html(H.kaquan.btnText).removeClass('clicked');
        },

        bindBtns: function () {
            H.kaquan.$wrapper.find('.hongbao-close').click(function () {
                H.event.handle(H.kaquan.$wrapper.attr('onkaquanClose'));
                H.kaquan.$wrapper.parent().addClass('none');
            });

        },

        resize: function () {
            var title = H.kaquan.$wrapper.find('.hongbao-title');
            H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom']);
        }

    };


    W.callbackJsapiTicketHandler = function (data) {

        var url = window.location.href;
        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
        var timestamp = Math.round(new Date().getTime() / 1000);
        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
        wx.config({
            appId: mpappid,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
				"addCard",
				"checkJsApi"
		    ]
        });

        wx.ready(function () {
            wx.checkJsApi({
                jsApiList: [
					'addCard'
			    ],
                success: function (res) {
                    var t = res.checkResult.addCard;
                    if (t && !H.kaquan.isError) {
                        H.kaquan.isReady = true;
                    }
                }
            });
        });

        wx.error(function (res) {
            H.kaquan.isError = true;
        });
    };
    H.kaquan.init();
})(Zepto);
