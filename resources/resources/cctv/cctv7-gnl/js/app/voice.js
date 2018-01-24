    H.index = {
        serverVoiceID: "",
        localVoiceID:"",//用户录制的本地音频id
        lastDuration: 0,//录音结束的时间
        recordBegin: 0,//录音开始的时间
        currentLocalId: 0,
        intervalFlag: 0,//录音计时定时器
        recordTimeLimit: 30,//录音的时间限制
        cardDetailType :"",//文字卡片为0，语音卡片为1
        stopCheckFlag : true,
        init : function(){
            this.event();
            this.fillUserinfo();
        },
        fillUserinfo: function() {
            $('.head_img img').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : "images/default-head.png"));
        },
        event: function() {
            var me = this;
            $('#switch-voice').click(function(e) {
                e.preventDefault();
                me.cardDetailType = 1;
                $('.voice-wrapper').find(".voice-show").addClass("none");
                $('.voice-wrapper').find(".btn-voice").removeClass("none")
                $('.word-wrapper').addClass('none');
                $('.voice-wrapper').removeClass('none');
                $('.zfyd').val('');
                $("#wyzhk").removeClass("requesting");
            });
            $('#switch-word').click(function(e) {
                e.preventDefault();
                var me = H.index ;
                me.cardDetailType = 0;
                $('.word-wrapper').removeClass('none');
                $('.voice-wrapper').addClass('none');
                $("#wyzhk").removeClass("requesting");
                clearInterval(me.intervalFlag);
                me.lastDuration = me.recordBegin = me.intervalFlag = 0;
                me.localVoiceID = me.serverVoiceID = '';
                me.recordTimeLimit = 30;
                H.voice.stopVoice(H.index.localVoiceID);
            });
           $('#btn-voice').bind('touchstart', function(e){
                e.preventDefault();
                var me = H.index ;
                wx.startRecord();//开始录音接口
                $('#record-dialog').removeClass('none');
                $('#btn-voice').addClass('recording').html('松手&nbsp;停止');
                me.recordBegin = new Date().getTime();//记录开始录音的时间
                clearInterval(me.intervalFlag);
                me.intervalFlag = setInterval(function(){
                    me.recordTimeLimit--;
                    if (me.recordTimeLimit == 1) {
                        clearInterval(me.intervalFlag);
                        $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
                        $('#record-dialog').addClass('none').find('p').html('录音中...松手停止');
                        me.stopCheckFlag = false;
                        //停止录音
                        wx.stopRecord({
                            success: function (res) {
                                H.index.localVoiceID = res.localId;
                                $('.timer').html("30''");
                                $('.voice-wrapper').find(".voice-show").removeClass("none");
				                $('.voice-wrapper').find(".btn-voice").addClass("none");
				                $('.word-wrapper').addClass('none');
				                $('.voice-wrapper').removeClass('none');
                            },
                            fail: function (res) {
                                H.voice.reset();
                            }
                        });
                        me.recordTimeLimit = 30;
                    } else if (me.recordTimeLimit <= 11) {
                        $('#record-dialog').removeClass('none').find('p').html('还可以说<span>' + (me.recordTimeLimit-1) + '</span>秒');
                    }
                }, 1000);
                return false;
            });
            $('#btn-voice').bind('touchend', function(e){
                e.preventDefault();
                $('#record-dialog').addClass('none').find('p').html('录音中...松手停止');
                clearInterval(me.intervalFlag);
                $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
                me.lastDuration = new Date().getTime() - me.recordBegin;
                if (me.lastDuration <= 1500) {
                    wx.stopRecord({
                        success: function (res) {
                            showTips('录制时间太短了~请重试');
                            H.voice.reset();
                        }
                    });
                } else {
                    if (me.stopCheckFlag) {
                        wx.stopRecord({
                            success: function (res) {
                                H.index.localVoiceID = res.localId;
                                if (Math.ceil(me.lastDuration / 1000) >= 30) {
                                    $('.timer').html("30''");
                                } else {
                                    $('.timer').html(Math.ceil(me.lastDuration / 1000) + "''");
                                }
                                $('.voice-wrapper').find(".voice-show").removeClass("none");
				                $('.voice-wrapper').find(".btn-voice").addClass("none");
				                $('.word-wrapper').addClass('none');
				                $('.voice-wrapper').removeClass('none');
                            },
                            fail: function (res) {
                                H.voice.reset();
                            }
                        });
                    }
                }
                return false;
            });
        }
    };

    H.wxRegister = {
        init : function(fn){
            this.wxConfig();
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('.btn-play', 'tap', function(e) {
                e.preventDefault();
            });
        },
        ready: function() {
            var me = this;
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
                        'downloadVoice',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'hideAllNonBaseMenuItem',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideOptionMenu',
                        'showOptionMenu'
                    ],
                    success: function (res) {
                        wxIsReady = true;
                        $('body').removeClass('error');
                    }
                });

                //me.wxChooseCard();
                //me.hideMenuList();
                wx.hideOptionMenu();
                //wx.hideAllNonBaseMenuItem();
                me.showMenuList(wxData);
            });
            wx.error(function(res){
                wxIsReady = false;
                $('body').addClass('error');
            });
        },
        wxConfig: function(){
        	shownewLoading();
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                	hidenewLoading();
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
                                'addCard',
                                'startRecord',
                                'stopRecord',
                                'onVoiceRecordEnd',
                                'playVoice',
                                'stopVoice',
                                'onVoicePlayEnd',
                                'uploadVoice',
                                'downloadVoice',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'hideAllNonBaseMenuItem',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideOptionMenu',
                                'showOptionMenu'
                            ]
                        });
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        //分享朋友圈
        menuShare: function(wxData) {
            wx.onMenuShareTimeline({
                title: wxData.title,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                trigger: function(res) {
                },
                success: function(res) {
                    H.share.success();
                },
                cancel: function(res) {
                    H.share.fail();
                },
                fail: function(res) {
                    H.share.fail();
                }
            })
        },
        // 分享给朋友
        menuToFriend: function(wxData) {
            wx.onMenuShareAppMessage({
                title: wxData.title,
                desc: wxData.desc,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                success: function(res) {
                    H.share.success();
                },
                cancel: function(res) {
                    H.share.fail();
                },
                fail: function(res) {
                    H.share.fail();
                }
            });
        },
        hideMenuList:function() {
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.hideMenuItems({
                menuList: [
                    // "menuItem:share:appMessage",
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
        showMenuList:function(wxData) {
            var me = this;
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite"
                ],
                success:function (res) {
                    H.wxRegister.menuShare(wxshareData);
            		H.wxRegister.menuToFriend(wxshareData);
                },
                fail:function (res) {
                }
            });
        }
    };
     H.share = {
        init: function(cu) {
        	var me = this;
            wxshareData.desc = ('想知道我说了什么悄悄话吗？或写下了什么样的新年祝福吗？');
            wxshareData.imgUrl = (headimgurl ? (headimgurl + '/' + yao_avatar_size) : wxData.imgUrl);
            wxshareData.link = me.getShareUrl(openid,cu);
            wxshareData.title = (nickname + '在CCTV-7农业节目给您拜年啦！');
            H.wxRegister.menuShare(wxshareData);
            H.wxRegister.menuToFriend(wxshareData);
        },
        success: function() {
            $('#share-dialog').addClass('none');
            $("#ok").addClass("none");
            $("#wyzhk").removeClass("none").removeClass("requesting");
            H.wxRegister.menuShare(wxData);
            H.wxRegister.menuToFriend(wxData);
        },
        fail: function() {
        },
        getShareUrl: function(openid,cu) {
            var href = window.location.href;
            href = add_param(share_url.replace(/[^\/]*\.html/i, 'card.html'), 'resopenid', hex_md5(openid), true);
            href = add_param(href, 'from', 'share', true);
            href = add_param(href, 'cu', cu, true);
            href = delQueStr(href, "openid");
            href = delQueStr(href, "type");
            href = delQueStr(href, "headimgurl");
            href = delQueStr(href, "nickname");
            return add_yao_prefix(href);
        }
    };
    H.voice = {
    	downloadFlag :false,
        reset: function() {
            $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
            $('#btn-play').removeClass('play');
            $('.voice-wrapper').find("voice-show").addClass('none');
            $('.word-wrapper').addClass('none');
            $('.voice-wrapper').removeClass('none');
            clearInterval(H.index.intervalFlag);
            H.index.lastDuration = H.index.recordBegin = H.index.intervalFlag = 0;
            H.index.localVoiceID = H.index.serverVoiceID = '';
            H.index.recordTimeLimit = 30;
            H.index.stopCheckFlag = true;
        },
       downloadVoice: function(voiceID) {
            var me = this;
            wx.downloadVoice({
                serverId: voiceID,
                isShowProgressTips: 0,
                success: function (res) {
                    H.voice.downloadFlag = true;
                    H.card.localVoiceID = res.localId;

                    hidenewLoading();
                }
            });
        },
        playDownloadVoice: function(voiceID){
            var me = this;
            wx.downloadVoice({
                serverId: voiceID,
                isShowProgressTips: 0,
                success: function (res) {
                	H.voice.downloadFlag = true;
                	H.card.localVoiceID = res.localId;
                	$('#btn-play').addClass('play');
                    wx.playVoice({
                        localId: res.localId
                    });
                    wx.onVoicePlayEnd({
                        success: function (res) {
                            $('#btn-play').removeClass('play');
                        }
                    });
                }
            });
        },
        playVoice: function(voiceID) {
            var me = this;
            wx.playVoice({
                localId: voiceID
            });
            wx.onVoicePlayEnd({
                success: function (res) {
                    $('#btn-play').removeClass('play');
                }
            });
        },
        stopVoice: function(voiceID) {
            wx.stopVoice({
                localId: voiceID
            });
        },
        uploadVoice: function() {
            var me = this;
            wx.uploadVoice({
                localId: H.index.localVoiceID,
                isShowProgressTips: 0,
                success: function (res){
                    H.index.serverVoiceID = res.serverId;
                    H.make.uploadVoiceID = res.serverId;
                    //语音上传成功后的操作
                    H.make.make_card(3);
                }
            });
        }
    };
