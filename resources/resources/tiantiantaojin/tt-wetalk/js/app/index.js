H.index = {
    bgPic: null,
    timeFlag: null,
    firstTime: null,
    firstHello: null,
    wxIsReady: false,
    isCanShare: false,
    firstSendFlag: false,
    limitTime: 20,
    topicUUID: '',
    hostName: '匿名用户',
    hostAvatar: './images/avatar.jpg',
    time: getQueryString('time') || '',
    uuid: getQueryString('uuid') || '',
    bgPicState: getQueryString('bgPic') || '',
    loadWXconfig: false,
    tongjiFlag: true,
    init: function() {
        this.event();
        if (this.uuid == '') {
            this.topicPort();
        } else {
            this.fillListMsg();
            this.listMsgPort();
        }
    },
    topicPort: function() {
        getJsonp('topic/index', {appId: busiAppId}, 'callBackTopicIndexHandler');
    },
    listMsgPort: function() {
        getJsonp('topic/listMsg', {
            appId: busiAppId,
            uuid: this.uuid
        }, 'callBackListMsgHandler');
    },
    fillListMsg: function() {
        var me = this;
        document.title = '我和仲基老公的聊天记录';
        var $iframe = $('<iframe src="./images/emoji.png" class="preload"></iframe>');
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($('body'));
        if (me.bgPicState != '') {
            if (me.bgPicState <= 6 && me.bgPicState > 0) {
                $('#record-chat').css({
                    'background': 'url(./images/bg/' + me.bgPicState + '.jpg) no-repeat center center',
                    'background-size': 'auto 100%'
                });
            }
        }
        if (me.time != '') {
            $('#record-chat .chat-wrapper').append('<section class="time-wrapper"><i>' + decodeURIComponent(me.time) + '</i></section>');
        }
    },
    resize: function() {
        var winH = $(window).height(), winW  = $(window).width(), offMargin = 2*6 + 2*6;
        var commentWidth = $('.send-wrapper').width() - $('.btn-send').width() - $('.btn-emoji').width();
        $('#conment').css('width', commentWidth - offMargin);
        $('body, .layer').css({
            'width': winW,
            'height': winH
        });
    },
    writeState: function(flag) {
        if (flag) {
            document.title = '对方正在输入...';
        } else {
            document.title = this.hostName;
        }
        var $iframe = $('<iframe src="./images/emoji.png" class="preload"></iframe>');
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($('body'));
    },
    event: function() {
        var me = this;
        document.onkeydown = function(e){ 
            var nowKeydown = document.all ? window.event : e;
            if(nowKeydown.keyCode == 13) {
                $('.btn-send').trigger('click');
                $('.emoji-wrapper').addClass('none');
                $('.btn-emoji').removeClass('on').attr('src', './images/emoji.png');
                H.index.chatToBottom();
                H.index.showShare();
                setTimeout(function(){
                    $("#editor").blur().empty();
                },5);
            }
        };
        $('#editor').focus(function(e) {
            e.preventDefault();
            H.index.chatToBottom();
            $('#share-chat').addClass('none');
            clearInterval(H.index.timeFlag);
        });
        $('#editor').blur(function(e) {
            e.preventDefault();
            H.index.showShare();
        });
        $('.chat-wrapper').click(function(e) {
            e.preventDefault();
            $('#editor').blur();
            $('.emoji-wrapper').addClass('none');
            $('.btn-emoji').removeClass('on').attr('src', './images/emoji.png');
            H.index.chatToBottom();
            H.index.showShare();
        });
        if (is_android()) {
            $('.btn-send').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) return;
                var comment = $.trim($("#editor").html().replace(/&nbsp;/g, ' ')) || '';
                var newComment = me.emojiToCode(comment),
                    newComment = newComment.replace(/<[^>]+>/g, ''),
                    len = newComment.length;
                if (debug) console.log(newComment);
                if (len < 1) {
                    $("#editor").focus();
                    return;
                } else if (len >= 500) {
                    $("#editor").focus();
                    showTips('说的太多了，删除点试试~');
                    return;
                }
                $(this).addClass('requesting');
                H.index.writeState(true);
                H.index.firstSendFlag = true;
                var sn = Math.sn();
                H.index.showShare();
                if ($('#layer-chat .npc').length <= 1) {
                    var msg = 'R:' + H.index.firstHello + ';U:' + newComment;
                } else {
                    var msg = 'U:' + newComment;
                }
                getJsonp('topic/talk', {
                    openId: openid,
                    message: encodeURIComponent(msg),
                    uuid: me.topicUUID,
                    rid: sn
                }, 'callBackTopicTalkHandler');
                var avatar = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                $('.chat-wrapper').append('<section class="me" id="' + sn + '"><img class="host" src="' + avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" /><p>' + H.index.emojiToIMG(comment) + '</p></section>');
                $(".btn-send").removeClass('requesting');
                $("#editor").blur().empty();
                H.index.chatToBottom();
            });
            $('#share-chat').click(function(e) {
                e.preventDefault();
                H.index.showShare();
                $('#share-chat').addClass('none');
            });
            $('.btn-wetalk').click(function(e) {
                e.preventDefault();
                toUrl('index.html');
            });
            $('body').delegate('#layer-chat .host', 'click', function(e) {
                e.preventDefault();
                var randomPic = getRandomArbitrary(1,7);
                me.bgPic = randomPic;
                $('#layer-chat').css({
                    'background': 'url(./images/bg/' + randomPic + '.jpg) no-repeat center center',
                    'background-size': 'auto 100%'
                });
            }).delegate('.emoji-wrapper ul li', 'click', function(e) {
                var type = $(this).attr('data-type'), name = $(this).attr('data-name').replace('[', '').replace(']', '');
                if (type == 'insert') {
                    $('#editor').append('<img src="./images/emoji/' + name + '" />');
                    $('#conment').scrollToTop($('#editor').height());
                } else if (type == 'direct') {
                    var sn = Math.sn();
                    var avatar = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                    $('.chat-wrapper').append('<section class="me" id="' + sn + '"><img class="host" src="' + avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" /><img class="ani" src="./images/emoji/' + name + '" /></section>');
                    if ($('#layer-chat .npc').length <= 1) {
                        var msg = 'R:' + H.index.firstHello + ';U:' + $(this).attr('data-name');
                    } else {
                        var msg = 'U:' + $(this).attr('data-name');
                    }
                    H.index.writeState(true);
                    getJsonp('topic/talk', {
                        openId: openid,
                        message: encodeURIComponent(msg),
                        uuid: H.index.topicUUID,
                        rid: sn
                    }, 'callBackTopicTalkHandler');
                    $('#editor').blur();
                    $('.emoji-wrapper').addClass('none');
                    $('.btn-emoji').removeClass('on').attr('src', './images/emoji.png');
                    H.index.chatToBottom();
                }
                H.index.showShare();
            });
            $('.btn-emoji').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('on')) {
                    $('.emoji-wrapper').addClass('none');
                    $(this).removeClass('on').attr('src', './images/emoji.png');
                    H.index.chatToBottom();
                } else {
                    $('.emoji-wrapper').removeClass('none');
                    $(this).addClass('on').attr('src', './images/emoji-h.png');
                    H.index.chatToBottom();
                }
                H.index.showShare();
            });
        } else {
            $('.btn-send').tap(function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) return;
                var comment = $.trim($("#editor").html().replace(/&nbsp;/g, ' ')) || '';
                var newComment = me.emojiToCode(comment),
                    newComment = newComment.replace(/<[^>]+>/g, ''),
                    len = newComment.length;
                if (debug) console.log(newComment);
                if (len < 1) {
                    $("#editor").focus().empty();
                    return;
                } else if (len >= 500) {
                    $("#editor").focus();
                    showTips('说的太多了，删除点试试~');
                    return;
                }
                $(this).addClass('requesting');
                H.index.writeState(true);
                var sn = Math.sn();
                H.index.firstSendFlag = true;
                H.index.showShare();
                if ($('#layer-chat .npc').length <= 1) {
                    var msg = 'R:' + H.index.firstHello + ';U:' + newComment;
                } else {
                    var msg = 'U:' + newComment;
                }
                getJsonp('topic/talk', {
                    openId: openid,
                    message: encodeURIComponent(msg),
                    uuid: me.topicUUID,
                    rid: sn
                }, 'callBackTopicTalkHandler');
                var avatar = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                $('.chat-wrapper').append('<section class="me" id="' + sn + '"><img class="host" src="' + avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" /><p>' + H.index.emojiToIMG(comment) + '</p></section>');
                $(".btn-send").removeClass('requesting');
                $("#editor").blur().empty();
                H.index.chatToBottom();
            });
            $('#share-chat').tap(function(e) {
                e.preventDefault();
                H.index.showShare();
            });
            $('.btn-wetalk').tap(function(e) {
                e.preventDefault();
                toUrl('index.html');
            });
            $('body').delegate('#layer-chat .host', 'tap', function(e) {
                e.preventDefault();
                var randomPic = getRandomArbitrary(1,7);
                me.bgPic = randomPic;
                $('#layer-chat').css({
                    'background': 'url(./images/bg/' + randomPic + '.jpg) no-repeat center center',
                    'background-size': 'auto 100%'
                });
            }).delegate('.emoji-wrapper ul li', 'tap', function(e) {
                var sn = Math.sn();
                var type = $(this).attr('data-type'), name = $(this).attr('data-name').replace('[', '').replace(']', '');
                if (type == 'insert') {
                    $('#editor').append('<img src="./images/emoji/' + name + '" />');
                    $('#conment').scrollToTop($('#editor').height());
                } else if (type == 'direct') {
                    var avatar = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                    $('.chat-wrapper').append('<section class="me" id="' + sn + '"><img class="host" src="' + avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" /><img class="ani" src="./images/emoji/' + name + '" /></section>');
                    if ($('#layer-chat .npc').length <= 1) {
                        var msg = 'R:' + H.index.firstHello + ';U:' + $(this).attr('data-name');
                    } else {
                        var msg = 'U:' + $(this).attr('data-name');
                    }
                    H.index.writeState(true);
                    getJsonp('topic/talk', {
                        openId: openid,
                        message: encodeURIComponent(msg),
                        uuid: H.index.topicUUID,
                        rid: sn
                    }, 'callBackTopicTalkHandler');
                    $('#editor').blur();
                    $('.emoji-wrapper').addClass('none');
                    $('.btn-emoji').removeClass('on').attr('src', './images/emoji.png');
                    H.index.chatToBottom();
                }
                H.index.showShare();
            });
            $('.btn-emoji').tap(function(e) {
                e.preventDefault();
                if ($(this).hasClass('on')) {
                    $('.emoji-wrapper').addClass('none');
                    $(this).removeClass('on').attr('src', './images/emoji.png');
                    H.index.chatToBottom();
                } else {
                    $('.emoji-wrapper').removeClass('none');
                    $(this).addClass('on').attr('src', './images/emoji-h.png');
                    H.index.chatToBottom();
                }
                H.index.showShare();
            });
        }
    },
    smartTime: function(time) {
        if (timeTransform(time).indexOf('NaN') >= 0) return;
        if (new Date().getTime() * 1 <= time * 1) return;
        var nowTime = timeTransform(new Date().getTime()), fixTime = timeTransform(time);
        
    },
    fillTopic: function(data) {
        this.fillTime();
        var talkTPL = '<section class="npc"><img class="host" src="' + this.hostAvatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" /><p>' + this.emojiToIMG(data.it) + '</p></section>';
        $('#layer-chat .chat-wrapper').append(talkTPL);
        $('.layer').addClass('none');
        $('#layer-chat').removeClass('none');
        this.playSounds();
        H.index.writeState();
        $('.layer').addClass('none');
        $('#layer-chat').removeClass('none');
        this.resize();
        this.fillEmoji();
    },
    thisTime: function() {
        var now = new Date(new Date().getTime()), hours = now.getHours(), minutes = now.getMinutes(), seconds = now.getSeconds()
        var time = '' + ((hours >= 12) ? '下午 ' : '上午 ');
        time += ((hours > 12) ? ((((hours - 12) < 10) ? '0' : '') + (hours - 12)) : hours);
        time += ((minutes < 10) ? ':0' : ':') + minutes;
        this.firstTime = time;
        return time;
    },
    fillTime: function() {
        $('.chat-wrapper').append('<section class="time-wrapper"><i>' + this.thisTime() + '</i></section>')
    },
    chatToBottom: function() {
        $('#layer-chat .chat-wrapper').css('padding-bottom', $('#layer-chat footer').height());
        $('#layer-chat').scrollToTop($('#layer-chat .chat-wrapper').height());
    },
    fillEmoji: function() {
        var emojiString = '<section class="emoji-wrapper none"><ul class="emoji small"><li data-type="insert" data-name="[zaijian.gif]"><img src="./images/emoji/zaijian.gif"></li><li data-type="insert" data-name="[haixiu.gif]"><img src="./images/emoji/haixiu.gif"></li><li data-type="insert" data-name="[tushetou.gif]"><img src="./images/emoji/tushetou.gif"></li><li data-type="insert" data-name="[gandong.gif]"><img src="./images/emoji/gandong.gif"></li><li data-type="insert" data-name="[liuhan.gif]"><img src="./images/emoji/liuhan.gif"></li><li data-type="insert" data-name="[chuizi.gif]"><img src="./images/emoji/chuizi.gif"></li><li data-type="insert" data-name="[weixiao.gif]"><img src="./images/emoji/weixiao.gif"></li><li data-type="insert" data-name="[yinxiao.gif]"><img src="./images/emoji/yinxiao.gif"></li><li data-type="insert" data-name="[koubi.gif]"><img src="./images/emoji/koubi.gif"></li><li data-type="insert" data-name="[baofa.gif]"><img src="./images/emoji/baofa.gif"></li><li data-type="insert" data-name="[yiwen.gif]"><img src="./images/emoji/yiwen.gif"></li><li data-type="insert" data-name="[chijing.gif]"><img src="./images/emoji/chijing.gif"></li><li data-type="insert" data-name="[bishi.gif]"><img src="./images/emoji/bishi.gif"></li><li data-type="insert" data-name="[deyi.gif]"><img src="./images/emoji/deyi.gif"></li><li data-type="insert" data-name="[jingxia.gif]"><img src="./images/emoji/jingxia.gif"></li><li data-type="insert" data-name="[daku.gif]"><img src="./images/emoji/daku.gif"></li><li data-type="insert" data-name="[cahan.gif]"><img src="./images/emoji/cahan.gif"></li><li data-type="insert" data-name="[yun.gif]"><img src="./images/emoji/yun.gif"></li><li data-type="insert" data-name="[touxiao.gif]"><img src="./images/emoji/touxiao.gif"></li><li data-type="insert" data-name="[guzhang.gif]"><img src="./images/emoji/guzhang.gif"></li><li data-type="insert" data-name="[aimu.gif]"><img src="./images/emoji/aimu.gif"></li><li data-type="insert" data-name="[fadai.gif]"><img src="./images/emoji/fadai.gif"></li><li data-type="insert" data-name="[daxiao.gif]"><img src="./images/emoji/daxiao.gif"></li><li data-type="insert" data-name="[qinqin.gif]"><img src="./images/emoji/qinqin.gif"></li></ul><ul class="szjkt big none"><li data-type="direct" data-name="[szj-110.jpg]"><img src="./images/emoji/szj-110.jpg"><p>妖妖灵</p></li><li data-type="direct" data-name="[szj-gd.jpg]"><img src="./images/emoji/szj-gd.jpg"><p>关灯</p></li><li data-type="direct" data-name="[szj-kfw.jpg]"><img src="./images/emoji/szj-kfw.jpg"><p>快扶我</p></li><li data-type="direct" data-name="[szj-sdl.jpg]"><img src="./images/emoji/szj-sdl.jpg"><p>摔倒了</p></li><li data-type="direct" data-name="[szj-sx.jpg]"><img src="./images/emoji/szj-sx.jpg"><p>帅醒</p></li><li data-type="direct" data-name="[szj-wf.jpg]"><img src="./images/emoji/szj-wf.jpg"><p>喂饭</p></li><li data-type="direct" data-name="[szj-ybsnlwa.jpg]"><img src="./images/emoji/szj-ybsnlwa.jpg"><p>你撩我</p></li></ul><section class="emoji-tab"><span data-tab="emoji" class="hover">常用表情</span><span data-tab="szjkt">宋仲基（暴走）</span></section></section>';
        $('#layer-chat footer').append(emojiString);
        if (is_android()) {
            $('.emoji-tab span').click(function(e) {
                e.preventDefault();
                var that = this;
                if ($(that).hasClass('hover')) {
                    return;
                } else {
                    $('.emoji-tab span').removeClass('hover');
                    $('.emoji-wrapper ul').addClass('none');
                    $('.' + $(that).attr('data-tab')).removeClass('none');
                    $(that).addClass('hover');
                }
                H.index.chatToBottom();
                H.index.showShare();
            });
        } else {
            $('.emoji-tab span').tap(function(e) {
                e.preventDefault();
                var that = this;
                if ($(that).hasClass('hover')) {
                    return;
                } else {
                    $('.emoji-tab span').removeClass('hover');
                    $('.emoji-wrapper ul').addClass('none');
                    $('.' + $(that).attr('data-tab')).removeClass('none');
                    $(that).addClass('hover');
                }
                H.index.chatToBottom();
                H.index.showShare();
            });
        }
    },
    emojiToIMG: function(content) {
        var regxFlag = /\[([^\]\[\/ ]+)\]/gi, rs = content.match(regxFlag), targetHTML = '';
        if (rs != null) {
            for(var i = 0; i < rs.length; i++) {
                if (emojiList.indexOf(rs[i]) >= 0) {
                    if (rs[i].replace('[','').replace(']','').indexOf('.png') > 0 || rs[i].replace('[','').replace(']','').indexOf('.jpg') > 0) {
                        targetHTML = "<img class='ani' src='./images/emoji/" + rs[i].replace('[','').replace(']','') + "' />";
                    } else {
                        targetHTML = "<img src='./images/emoji/" + rs[i].replace('[','').replace(']','') + "' />";
                    }
                    content = content.replace(rs[i], targetHTML);
                }
            };
        }
        if (debug) console.log(content);
        return content;
    },
    emojiToCode: function(content) {
        var regxImg = /<img.*?(?:>|\/>)/gi, regxSrc = /src=[\'\"]?([^\'\"]*)[\'\"]?/i, rs = content.match(regxImg);
        if (rs != null) {
            for(var i = 0; i < rs.length; i++) {
                var src = rs[i].match(regxSrc), targetSrc = '[' + src[1].replace('./images/emoji/', '').replace(window.location.origin + '/images/emoji/', '') + ']';
                if (emojiList.indexOf(targetSrc) >= 0) {
                    content = content.replace(rs[i], targetSrc);
                }
            };
        }
        if (debug) console.log(content);
        return content;
    },
    showShare: function() {
        var me = this;
        if (!me.limitTime || me.limitTime < 10) {
            me.limitTime = 10;
        }
        if (H.index.firstSendFlag) {
            $('#share-chat').addClass('none');
            clearInterval(me.timeFlag);
            maxTime = me.limitTime;
            me.timeFlag = setInterval(function(){
                maxTime--;
                if (maxTime <= 0) {
                    $('#share-chat').removeClass('none');
                    maxTime == me.limitTime;
                    clearInterval(me.timeFlag);
                }
                if (debug) {console.log('当前剩余时间：' + maxTime)}
            }, 1000);
        }
    },
    fillShareData: function() {
        var me = this;
        wxshareData.imgUrl = (wxData.imgUrl);
        wxshareData.desc = ('阿西巴，宋仲基老公竟然在撩我❤❤');
        wxshareData.link = getshareUrl(openid);
        wxshareData.title = ('宋仲基发来一条私信');
        
        H.JSSDK.menuShare(wxshareData);
        H.JSSDK.menuToFriend(wxshareData);
        if (debug) {console.log('注册分享JSSDK!');}
    },
    fillRecord: function(data) {
        var me = this, content = data.content, R_avatar = data.rImg, U_avatar = data.headImg;
        if (me.uuid != '') {
            $('.layer').addClass('none');
            $('#record-chat').removeClass('none');
            var recordList = content.split(';');
            for(var i = 0; i < recordList.length; i++) {
                var recordDetail = recordList[i].split(':');
                if (recordDetail[0] == 'R') {
                    if (recordDetail[1].indexOf('.jpg') > 0 || recordDetail[1].indexOf('.png') > 0) {
                        $('#record-chat .chat-wrapper').append('<section class="npc"><img src="' + R_avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景">' + me.emojiToIMG(recordDetail[1]) + '</section>');
                    } else {
                        $('#record-chat .chat-wrapper').append('<section class="npc"><img src="' + R_avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景"><p>' + me.emojiToIMG(recordDetail[1]) + '</p></section>');
                    }
                } else if (recordDetail[0] == 'U') {
                    if (recordDetail[1].indexOf('.jpg') > 0 || recordDetail[1].indexOf('.png') > 0) {
                        $('#record-chat .chat-wrapper').append('<section class="me"><img class="host" src="' + U_avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景">' + me.emojiToIMG(recordDetail[1]) + '</section>');
                    } else {
                        $('#record-chat .chat-wrapper').append('<section class="me"><img class="host" src="' + U_avatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景"><p>' + me.emojiToIMG(recordDetail[1]) + '</p></section>');
                    }
                } else {
                    toUrl('index.html');
                }
            };
            $('#record-chat .chat-wrapper').append('<section class="qrcode-wrapper"><img src="./images/qrcode.png"><p>关注“天天淘金”公众号，来和老公聊天吧</p></section>');
            $('#record-chat .chat-wrapper').css('padding-bottom', $('#record-chat footer').height());
        } else {
            toUrl('index.html');
        }
    },
    playSounds: function() {
        if (is_android()) {
            // $("#msg-android").get(0).pause();
            // $("#msg-android").get(0).play();
        } else {
            $("#msg-iphone").get(0).pause();
            $("#msg-iphone").get(0).play();
        }
    },
    stopSounds: function() {
        if (is_android()) {
            // $("#msg-android").get(0).pause();
        } else {
            $("#msg-iphone").get(0).pause();
        }
    },
    tongji: function() {
        if (H.index.tongjiFlag) {
            H.index.tongjiFlag = false;
            $.ajax({
                type:"GET",
                dataType:"jsonp",
                jsonp: "callback",
                url: tttj_url + "user/log/add",
                data: {
                    appId: busiAppId,
                    openId: openid,
                    eventDesc: encodeURIComponent('宋仲基-首次聊天'),
                    eventId: 'tt-wetalk-firstTalk',
                    operateType: state,
                    isPageLoad: false
                },
                showload: false
            });
        }
    }
};

H.JSSDK = {
    init : function(){
        this.ready();
        this.wxConfig();
    },
    ready: function() {
        var me = this;
        wx.ready(function () {
            wx.checkJsApi({
                jsApiList: [
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
                    me.wxIsReady = true;
                }
            });
            wx.hideOptionMenu();
            me.showMenuList(wxData);
        });
        wx.error(function(res){
            me.wxIsReady = false;
            if (!H.index.loadWXconfig) {
                setTimeout(function(){
                    H.index.loadWXconfig = true;
                    H.JSSDK.init();
                }, 3000);
            }
        });
    },
    wxConfig: function(){
        $.ajax({
            type: 'GET',
            async: true,
            url: domain_url + 'mp/jsapiticket' + dev,
            data: {appId: mpappid},
            dataType: "jsonp",
            jsonpCallback: 'callbackJsapiTicketHandler',
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
                        appId: mpappid,
                        timestamp: timestamp,
                        nonceStr:nonceStr,
                        signature:signature,
                        jsApiList: [
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
                    H.index.isCanShare = true;
                }
            },
            error : function(xmlHttpRequest, error) {
            }
        });
    },
    menuShare: function(wxData) {
        var me = this;
        wx.onMenuShareTimeline({
            title: wxData.title,
            desc: wxData.desc,
            link: wxData.link,
            imgUrl: wxData.imgUrl,
            trigger: function(res) {
            },
            success: function(res) {
                me.shareSuccess();
            },
            cancel: function(res) {
                me.shareSuccess();
            },
            fail: function(res) {
                me.shareSuccess();
            }
        })
    },
    menuToFriend: function(wxData) {
        var me = this;
        wx.onMenuShareAppMessage({
            title: wxData.title,
            desc: wxData.desc,
            link: wxData.link,
            imgUrl: wxData.imgUrl,
            success: function(res) {
                me.shareSuccess();
            },
            cancel: function(res) {
                me.shareSuccess();
            },
            fail: function(res) {
                me.shareSuccess();
            }
        });
    },
    hideMenuList: function() {
        wx.hideMenuItems({
            menuList: [
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
    showMenuList: function(wxData) {
        var me = this;
        wx.showMenuItems({
            menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline",
                "menuItem:favorite",
                "menuItem:copyUrl",
                "menuItem:share:email"
            ],
            success:function (res) {
                me.menuToFriend(wxData);
                me.menuShare(wxData);
            },
            fail:function (res) {
            }
        });
    },
    shareSuccess: function() {
        H.index.showShare();
        getJsonp('topic/makeRecord', {
            oid: openid,
            uuid: H.index.topicUUID,
            img: H.index.hostAvatar
        }, 'callBackTalkMsgHandler');
    }
};

W.callBackTopicIndexHandler = function(data) {
    if (data.result) {
        H.index.hostAvatar = (data.im || './images/avatar.jpg');
        H.index.hostName = (data.na || '匿名用户');
        H.index.limitTime = data.et;
        H.index.firstHello = data.it;
        H.index.fillTopic(data);
    } else {
        $('.layer').remove();
        if (data.message) {
            $('body').append('<p class="keyTips">' + data.message + '</p>');
        }
    }
};

W.callBackTopicTalkHandler = function(data) {
    if (data.result) {
        if (data.uid && data.reply) {
            H.index.topicUUID = data.uid;
            if (debug) {H.index.topicUUID}
            if (data.reply.indexOf('.jpg') > 0 || data.reply.indexOf('.png') > 0) {
                $('.chat-wrapper').append('<section class="npc"><img class="host" src="' + H.index.hostAvatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" />' + H.index.emojiToIMG(data.reply) + '</section>');
            } else {
                $('.chat-wrapper').append('<section class="npc"><img class="host" src="' + H.index.hostAvatar + '" data-collect="true" data-collect-flag="tt-wetalk-changeBG" data-collect-desc="宋仲基-切换背景" /><p>' + H.index.emojiToIMG(data.reply) + '</p></section>');
            }
            H.index.chatToBottom();
            H.index.showShare();
            H.index.fillShareData();
            H.index.tongji();
        } else if (data.ig == 1) {
            if (data.rid) {
                $('#' + data.rid).remove();
            }
            showTips('树新风 讲文明<br>亲，你使用了不恰当的言语');
        }
        H.index.writeState();
    }
};

W.callBackListMsgHandler = function(data) {
    if (data.result) {
        H.index.fillRecord(data);
    } else {
        toUrl('index.html');
    }
};

W.callBackTalkMsgHandler = function(data) {};

$(function() {
    H.index.init();
    H.JSSDK.init();
});