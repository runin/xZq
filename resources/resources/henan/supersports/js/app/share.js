(function($) {
    H.share = {
        cu: getQueryString('cu') || '',
        init: function() {
            if (!this.cu) {
                toUrl('index.html');
                recordUserOperate(openid, "分享页缺少cu参数", "shareEnter_fail");
                return;
            }
            this.event();
            this.getCardPort();
            recordUserOperate(openid, "分享页打开数", "shareEnter_success");
        },
        getCardPort: function() {
            var me = this;
            shownewLoading(null, '贺卡打开中...');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/ceremony/greetingcard/get' + dev,
                data: {cu: me.cu},
                dataType : "jsonp",
                jsonpCallback : 'callbackCardInfoHandler',
                timeout: 5e3,
                complete: function() {
                },
                success : function(data) {
                    if (data.result) {
                        me.fill(data);
                        me.getInfoPort();
                    }
                },
                error : function(xmlHttpRequest, error) {
                    hidenewLoading();
                }
            });
        },
        getInfoPort: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/linesdiy/info' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLinesDiyInfoHandler',
                timeout: 1e4,
                complete: function() {
                    hideLoading();
                },
                success : function(data) {
                    if (data.code == 0 && data.tt && data.gitems) {
                        saveData('lotteryTime', data.tt);
                        me.fillVideo(data.gitems);
                    }
                },
                error : function() {
                    hideLoading();
                }
            });
        },
        event: function() {
            var me = this;
            $('body').delegate('.btn-join', 'click', function(e){
                e.preventDefault();
                toUrl('index.html');
            });
        },
        fillVideo: function(data) {
            var me = this, items = data, info;
            for (i in items) {
                if (me.pid == items[i].uid) info = items[i];
            };
            $('.swiper-wrapper').html('<div class="swiper-slide"><video x-webkit-airplay="true" webkit-playsinline="yes" width="100%" height="100%" poster="' + info.is + '" controls><source src="' + info.mu + '" type="video/mp4"></source></video></div>');
        },
        check: function() {
            if ($('.word-wrapper').hasClass('none')) {
                // 语音类型
                if (!H.record.serverId) {
                    showTips('还未录制语音！');
                    return false;
                }
                return true;
            } else {
                // 文字类型
                var content = $.trim($('.btn-word').val());
                if (content.length == 0) {
                    showTips('还未填写任何内容！');
                    return false;
                }
                H.record.content = content;
                return true;
            }
        },
        fill: function(data){
            $('.avatar').attr('src', data.hi || './images/avatar.png');
            $('.boxavatar h1').text(data.nn || '猜猜我是谁');
            if (data.vi) {
                $('.btn-play').attr('data-serverId', data.vi);
                $('.timer').text(data.sn.split(';')[1] + "''");
                $('.voice-show').removeClass('none');
            } else {
                $('.word-show p').text(data.gt);
                $('.word-show').removeClass('none');
            }
            this.pid = data.sn.split(';')[0];
        }
    };

    H.record = {
        localId: null,
        serverId: null,
        init: function() {
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-play', 'click', function(e){
                e.preventDefault();
                me.serverId = $(this).attr('data-serverId');
                if (me.localId) {
                    if ($(this).hasClass('play')) {
                        me.pauseVoice();
                    } else {
                        me.playVoice();
                    }
                } else {
                    shownewLoading(null, '下载音频中，请稍后');
                    if (H.jssdk.wxIsReady) {
                        me.downloadVoice();
                    } else {
                        window.checkWXC = setInterval(function(){
                            if (H.jssdk.wxIsReady) {
                                clearInterval(window.checkWXC);
                                window.checkWXC = null;
                                me.downloadVoice();
                            }
                        }, 500);
                    }
                }
            });
        },
        downloadVoice: function() {
            var me = this;
            wx.downloadVoice({
                serverId: me.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function(res) {
                    hidenewLoading();
                    me.localId = res.localId; // 返回音频的本地ID
                    me.playVoice();
                },
                fail: function() {
                    hidenewLoading();
                    alert('音频已过期\n请您也来制作贺卡吧~');
                    toUrl('index.html');
                }
            });
        },
        playVoice: function() {
            var me = this;
            $('.dot').addClass('none');
            $('.btn-play').addClass('play');
            wx.playVoice({
                localId: me.localId // 需要播放的音频的本地ID，由stopRecord接口获得
            });
            me.onVoicePlayEnd();
        },
        pauseVoice: function() {
            var me = this;
            wx.pauseVoice({
                localId: me.localId, // 需要暂停的音频的本地ID，由stopRecord接口获得
                success: function(res) {
                    $('.btn-play').removeClass('play');
                }
            });
        },
        onVoicePlayEnd: function() {
            var me = this;
            wx.onVoicePlayEnd({
                success: function(res) {
                    $('.btn-play').removeClass('play');
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.share.init();
    H.record.init();
    H.jssdk.init();
});