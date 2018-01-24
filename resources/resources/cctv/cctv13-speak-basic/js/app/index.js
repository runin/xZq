(function($) {
    H.index = {
        isReady: false,
        localServerId: 0,
        lastDuration: 0,
        recordBegin: 0,
        currentLocalId: 0,
        intervalFlag: 0,
        recordTimeLimit: 60,
        init : function(){
            this.wxConfig();
            this.userinfo();
            this.event();
        },
        event: function() {
            var me = this;
            $('.btn-record').bind('touchstart', function(){
                me.recordBegin = new Date().getTime();
                $('.btn-record').addClass('recording');
                // $('.tip-on').addClass('none');
                // $('.tip-off').removeClass('none');
                $('.tip-on').css('opacity', '0');
                wx.startRecord();
                me.intervalFlag = setInterval(function(){
                    me.recordTimeLimit--;
                    if (me.recordTimeLimit == 1) {
                        clearInterval(me.intervalFlag);
                        $('.timetips p').removeClass('show').html('').parent('.timetips').addClass('none');
                        wx.stopRecord({
                            success: function (res) {
                                me.localServerId = res.localId;
                                $('.timer').html("60''");
                                $('.record-box').addClass('none');
                                $('.info-box').removeClass('none');
                                $('.btn-record').removeClass('recording');
                                me.userinfo();
                                // $('.tip-off').addClass('none');
                                // $('.tip-on').removeClass('none');
                                $('.tip-on').css('opacity', '1');
                            },
                            fail: function (res) {
                                $('.btn-record').removeClass('recording');
                                // $('.tip-off').addClass('none');
                                // $('.tip-on').removeClass('none');
                                $('.tip-on').css('opacity', '1');
                            }
                        });
                        me.recordTimeLimit = 60;
                    } else if (me.recordTimeLimit <= 11) {
                        // console.log('还可以说' + (me.recordTimeLimit-1) + '秒');
                        $('.timetips').removeClass('none').find('p').addClass('show').html('还可以说<span>' + (me.recordTimeLimit-1) + '</span>秒');
                    }
                }, 1000);
                return false;
            });
            $('.btn-record').bind('touchend', function(){
                me.lastDuration = new Date().getTime() - me.recordBegin;
                $('.timetips p').removeClass('show').html('').parent('.timetips').addClass('none');
                // console.log(me.lastDuration);
                if (me.lastDuration <= 1500) {
                    wx.stopRecord({
                        success: function (res) {
                            showTips('录制时间太短了~请重试');
                            me.voiceReset();
                        }
                    });
                } else {
                    wx.stopRecord({
                        success: function (res) {
                            me.localServerId = res.localId;
                            $('.timer').html(Math.ceil(me.lastDuration / 1000) + "''");
                            $('.record-box').addClass('none');
                            $('.info-box').removeClass('none');
                            $('.btn-record').removeClass('recording');
                            me.userinfo();
                            // $('.tip-off').addClass('none');
                            // $('.tip-on').removeClass('none');
                            $('.tip-on').css('opacity', '1');
                        },
                        fail: function (res) {
                            $('.btn-record').removeClass('recording');
                            // $('.tip-off').addClass('none');
                            // $('.tip-on').removeClass('none');
                            $('.tip-on').css('opacity', '1');
                        }
                    });
                }
                $('.btn-record').removeClass('recording');
                // $('.tip-off').addClass('none');
                // $('.tip-on').removeClass('none');
                $('.tip-on').css('opacity', '1');
                clearInterval(me.intervalFlag);
                me.recordTimeLimit = 60;
                return false;
            });
            $('body').delegate('.btn-play', 'tap', function(e) {
                e.preventDefault();
                if ($('.btn-play').hasClass('play')) {
                    me.stopVoice(me.localServerId);
                    $('.btn-play').removeClass('play');
                } else {
                    $('.btn-play').addClass('play');
                    me.playLocalVoice();
                }
            }).delegate('.overlay', 'tap', function(e) {
                e.preventDefault();
                $('.result').removeClass('ok');
                setTimeout(function(){
                    $('.overlay').animate({'opacity': '0'}, 500, function(){
                        $('.overlay').addClass('none');
                    });
                }, 600);
            }).delegate('.btn-submit', 'tap', function(e) {
                e.preventDefault();
                if (!$('.btn-submit').hasClass('request')) {
                    if (me.localServerId == '') {
                        me.voiceReset();
                        showTips('点击话筒录制一段祝福吧~');
                    }
                    $('.btn-submit').addClass('request');
                    wx.stopVoice({
                        localId: me.localServerId
                    });
                    me.uploadVoice(me.localServerId);
                }
            }).delegate('.btn-again', 'tap', function(e) {
                e.preventDefault();
                me.voiceReset(); 
            });
        },
        userinfo: function() {
            $('.nickname').html(nickname ? nickname : "");
            $('.avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : "./images/avatar.jpg"));
        },
        playVoice: function(serverId){
            var me = this;
            if(me.isReady){
                me.stopVoice(me.currentLocalId);
                wx.downloadVoice({
                    serverId: serverId,
                    isShowProgressTips: 1,
                    success: function (res) {
                        me.currentLocalId = res.localId;
                        wx.playVoice({
                            localId: res.localId
                        });
                    }
                });
            }
        },
        playLocalVoice: function(){
            var me = this;
            if (me.localServerId == '') {
                me.voiceReset();
                showTips('点击话筒录制一段祝福吧~');
                return;
            }
            wx.playVoice({
                localId: me.localServerId
            });
            wx.onVoicePlayEnd({
                success: function (res) {
                    // var localId = res.localId;
                    $('.btn-play').removeClass('play');
                }
            });
        },
        voiceRecordEnd: function(){
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {
                    // var localId = res.localId;
                    me.uploadVoice(res.localId);
                }
            });
        },
        stopVoice: function(localId){
            wx.stopVoice({
                localId: localId
            });
        },
        uploadVoice: function(localId){
            var me = this;
            wx.uploadVoice({
                localId: localId,
                isShowProgressTips: 1,
                    success: function (res){
                    getResult('api/uploadrecord/save', {
                        openid: $.fn.cookie(shaketv_appid + '_openid'),
                        title: encodeURIComponent('春节说吧'),
                        content: encodeURIComponent('春节说吧'),
                        url: res.serverId,
                        type: 3,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    }, 'callbackUploadRecordSaveHandler');
                    $('.overlay').removeClass('none').animate({'opacity': '1'}, 500, function() {
                        setTimeout(function(){
                            $('.result').addClass('ok');
                            me.voiceReset();
                            setTimeout(function(){
                                $('.result').removeClass('ok');
                                setTimeout(function(){
                                    $('.overlay').animate({'opacity': '0'}, 500, function(){
                                        $('.overlay').addClass('none');
                                    });
                                }, 600);
                            }, 5000);
                        }, 100);
                    });
                }
            });
        },
        voiceReset: function(){
            var me = this;
            me.stopVoice(me.localServerId);
            me.localServerId = 0;
            me.lastDuration = 0;
            me.recordBegin = 0;
            me.currentLocalId = 0;
            clearInterval(me.intervalFlag);
            me.intervalFlag = 0;
            me.recordTimeLimit = 60;
            $('.record-box').removeClass('none');
            $('.info-box').addClass('none');
            $('.btn-play').removeClass('play');
            $('.btn-submit').removeClass('request');
            $('.timetips p').removeClass('show').html('').parent('.timetips').addClass('none');
        },
        wxConfig: function(){
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
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
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                'checkJsApi',
                                'addCard',
                                'startRecord',
                                'stopRecord',
                                'onVoiceRecordEnd',
                                'playVoice',
                                'stopVoice',
                                'onVoicePlayEnd',
                                'uploadVoice',
                                'downloadVoice'
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
    H.index.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice'
            ],
            success: function (res) {
                H.index.isReady = true;
            }
        });
    });
    wx.error(function(res){
        H.index.isReady = false;
    });
});