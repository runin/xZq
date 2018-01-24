(function($) {
    H.check = {
        koi: getQueryString('koi'),
        kru: getQueryString('kru'),
        wxCheck: false,
        isError: false,
        maxConfigNum: 5,
        init: function() {
            this.initSDK();
            this.checkQRcode();
            this.event();
        },
        initSDK: function() {
            var me = this;
            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: [
                        'scanQRCode'
                    ],
                    success: function (res) {
                        me.wxCheck = true;
                    }
                });
            });
            wx.error(function(res){
                me.isError = true;
                if (me.maxConfigNum >= 0) {
                    setTimeout(function(){
                        me.maxConfigNum--;
                        me.initSDK();
                    }, 5e3);
                }
            });
            this.wxConfig();
        },
        event: function() {
            var me = this;
            $('.btn-award').click(function(e) {
                e.preventDefault();
                me.getAward();
            });
            $('.btn-qrcode').click(function(e) {
                e.preventDefault();
                if (me.wxCheck) {
                    wx.scanQRCode({
                        needResult: 1,
                        scanType: ["qrCode", "barCode"],
                        success: function (res) {
                            var url = res.resultStr;
                            me.koi = getQueryString('koi', url);
                            me.kru = getQueryString('kru', url);
                            me.checkQRcode();
                        },
                        error: function() {
                            WeixinJSBridge.invoke('closeWindow', {}, function(res){});
                        }
                    });
                } else {
                    WeixinJSBridge.invoke('closeWindow', {}, function(res){});
                }
            });
            $('.btn-fresh').click(function(e) {
                e.preventDefault();
                location.href = add_param(location.href, 'v', Math.random().toFixed(6), true);
            });
        },
        checkQRcode: function() {
            var me = this;
            this.pageReset();
            if (this.koi != '' && this.kru != '') {
                shownewLoading(null, '正在查询...');
                setTimeout(function(){me.checkAward();}, 2e3);
            } else {
                $('.page').addClass('none');
                $('.error').removeClass('none');
            }
        },
        pageReset: function() {
            $('.page').addClass('none');
            $('.geting .p-an').html('');
            $('.error .ss').html('信息查询失败，不允许继续操作！');
            $('.canget li').each(function(i, el) {
                $(this).addClass('none').find('label').html('');
            });
        },
        checkAward: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/record/info' + dev,
                data: {
                    oi: $.fn.cookie(mpappid + '_openid') || '',
                    ru: me.kru
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRecordInfo',
                timeout: 5e3,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
                    if (data && data.result) {
                        if (data.pn) {
                            $('.canget .p-an').removeClass('none').find('label').html(data.pn);
                            $('.geting .p-an').html(data.pn);
                        }
                        if (data.rn) $('.canget .p-nn').removeClass('none').find('label').html(data.rn);
                        if (data.ph) $('.canget .p-tel').removeClass('none').find('label').html(data.ph);
                        if (data.ic) $('.canget .p-id').removeClass('none').find('label').html(data.ic);
                        if (data.lt) $('.canget .p-time').removeClass('none').find('label').html(data.lt);
                        $('.page').addClass('none');
                        $('.canget').removeClass('none');
                    } else {
                        if (data.message) {
                            if (data.message.indexOf('白名单') >= 0) {
                                $('.page').addClass('none');
                                $('.s404').removeClass('none');
                            } else {
                                $('.error .ss').html(data.message);
                                $('.page').addClass('none');
                                $('.error').removeClass('none');
                            }
                        } else {
                            $('.page').addClass('none');
                            $('.error').removeClass('none');
                        }
                    }
                },
                error: function() {
                    $('.page').addClass('none');
                    $('.syserr').removeClass('none');
                }
            });
        },
        getAward: function() {
            var me = this;
            shownewLoading(null, '正在核销...');
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/record/verification' + dev,
                data: {
                    oi: openid,
                    ru: me.kru
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRecordVerification',
                timeout: 5e3,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
                    if (data && data.result) {
                        $('.page').addClass('none');
                        $('.geting').removeClass('none');
                    } else {
                        if (data.message) {
                            if (data.message.indexOf('白名单') >= 0) {
                                $('.page').addClass('none');
                                $('.s404').removeClass('none');
                            } else {
                                $('.error .ss').html(data.message);
                                $('.page').addClass('none');
                                $('.error').removeClass('none');
                            }
                        } else {
                            $('.page').addClass('none');
                            $('.error').removeClass('none');
                        }
                    }
                },
                error: function() {
                    $('.page').addClass('none');
                    $('.syserr').removeClass('none');
                }
            });
        },
        wxConfig: function(){
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 10e3,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr: nonceStr,
                            signature: signature,
                            jsApiList: [
                                'scanQRCode'
                            ]
                        });
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.check.init();
});