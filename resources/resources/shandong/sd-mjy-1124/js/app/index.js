(function($) {
    H.index = {
        init: function() {
            this.wxConfig();
            this.event();
            this.prereserve();
        },
        prereserve: function() {
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        event: function() {
            var me = this;
            /*$('#btn-reserve').click(function(e) {
                e.preventDefault();
                var that = this, reserveId = $(this).attr('data-reserveid'), date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                }
                window['shaketv'] && shaketv.reserve_v2({
                    tvid: yao_tv_id,
                    reserveid: reserveId,
                    date: date},
                function(d){
                    if(d.errorCode == 0){
                        $("#btn-reserve").addClass('none');
                    }
                });
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        $(that).removeClass('requesting');
                    }, 1000);
                }
            });*/
            $('#btn-go').click(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    toUrl('lottery.html');
                }
            });/*
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    H.dialog.rule.open();
                }
            });*/
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        hideMenuList:function() {
            // Ҫ���صĲ˵��ֻ�����ء������ࡱ�͡������ࡱ��ť
            wx.hideMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite",
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //Ȩ��У��
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                'hideAllNonBaseMenuItem',
                                'hideMenuItems',
                                'hideOptionMenu'
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.index.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'hideAllNonBaseMenuItem',
                'hideMenuItems',
                'hideOptionMenu'
            ],
            success: function (res) {
            }
        });
        H.index.hideMenuList();
        wx.hideOptionMenu();
        wx.hideAllNonBaseMenuItem();
        //wx.config�ɹ�
    });
});