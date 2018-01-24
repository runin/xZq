(function($) {
    H.index = {
        localServerId: 0,
        lastDuration: 0,
        recordBegin: 0,
        currentLocalId: 0,
        intervalFlag: 0,
        recordTimeLimit: 30,
        hostArrayList: [],
        init : function(){
            cardUUID = getQueryString('uuid') || '';
            this.event();
            this.showCard();
            this.fillUserinfo();
            this.fillHostInfo();
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-go', 'click', function(e) {
                e.preventDefault();
                hidenewLoading();
                $('#unpack-dialog').addClass('none').find('#btn-play').removeClass('play');
                $('#index-dialog').addClass('none');
                $('#choice-dialog').removeClass('none');
                $('#card-dialog').removeClass('none');
                $('.word-wrapper').removeClass('input-on');
                // if (swiper == null) {
                //     H.swiper.init();
                // }
                H.unpack.audioA.pause();
                H.unpack.audioB.pause();
                H.voice.stopVoice(serverVoiceID);
            }).delegate('#btn-word', 'focus', function(e) {
                e.preventDefault();
                $('.word-wrapper').addClass('input-on');
            }).delegate('#btn-word', 'blur', function(e) {
                e.preventDefault();
                // $('.word-wrapper').removeClass('input-on');
            }).delegate('#switch-voice', 'click', function(e) {
                e.preventDefault();
                cardDetailType = 1;
                // H.swiper.changeCardInfo($('.swiper-slide-active').attr('data-hostID'));
                $('.word-wrapper').addClass('none');
                $('.voice-wrapper').removeClass('none');
                $('#switch-voice').removeClass('shine');
                $('#btn-word').val('');
            }).delegate('#switch-word', 'click', function(e) {
                e.preventDefault();
                cardDetailType = 0;
                // H.swiper.changeCardInfo($('.swiper-slide-active').attr('data-hostID'));
                $('.word-wrapper').removeClass('none');
                $('.voice-wrapper').addClass('none');
                // H.voice.reset();
                clearInterval(intervalFlag);
                lastDuration = recordBegin = intervalFlag = 0;
                localVoiceID = serverVoiceID = '';
                recordTimeLimit = 30;
            }).delegate('#btn-submit', 'click', function(e) {
                e.preventDefault();
                if (cardDetailType == 0) {
                    // 提交文字
                    var content = $.trim($('#btn-word').val());
                    content = content.replace(/<[^>]+>/g, '');
                    if (content.length == 0) {
                        showTips('什么祝福都没写呢~');
                        $('#btn-word').focus();
                        $('#btn-word').val('');
                        return false;
                    }
                    $('.word-show p').text($('#btn-word').val());
                    me.makeCardPort(content, 4);
                } else {
                    // 提交语音
                    if (localVoiceID == '') {
                        H.voice.reset();
                        showTips('点击话筒录制一段祝福吧~');
                    }
                    H.unpack.audioA.pause();
                    H.unpack.audioB.pause();
                    $('#btn-play').removeClass('play');
                    wx.stopVoice({
                        localId: localVoiceID
                    });
                    H.voice.uploadVoice();
                }
            }).delegate('#btn-upload', 'click', function(e) {   //.swiper-slide
                e.preventDefault();
                // H.upload.fileSelected();
                // if ($(this).attr('data-starNo') == 'U') {
                //     $('#input-file-upload').trigger('click');
                // }
                $('#input-file-upload').trigger('click');
            }).delegate('#share-dialog', 'click', function(e) {
                e.preventDefault();
                // $(this).addClass('none');
            }).delegate('#btn-again', 'click', function(e) {
                e.preventDefault();
                me.reset();
            }).delegate('#btn-unpack', 'click', function(e) {
                e.preventDefault();
                $('#unpack-dialog').addClass('open-card');
                setTimeout(function(){
                    $('.lock-wrapper').remove();
                }, 2000);
            }).delegate('#btn-play', 'click', function(e) {
                e.preventDefault();
                if (!$('#unpack-dialog').hasClass('none')) {
                    if (downloadFlag) {
                        if ($('#unpack-dialog #btn-play').hasClass('play')) {
                            if (!userDIYFlag) {
                                H.unpack.audioA.pause();
                                H.unpack.audioB.pause();
                            }
                            H.voice.stopVoice(serverVoiceID);
                            $('#unpack-dialog #btn-play').removeClass('play');
                        } else {
                            $('#unpack-dialog #btn-play').addClass('play');
                            H.unpack.sounds();
                        }
                    } else {
                        // showTips('音频正在下载中，请稍等');
                        shownewLoading(null, '祝福马上到您手中');
                        if (wxIsReady && playVoiceFlag) {
                            playVoiceFlag = false;
                            H.voice.playVoice();
                        }
                    }
                } else {
                    // 正常播放语音
                    if ($('#card-dialog #btn-play').hasClass('play')) {
                        H.voice.stopVoice(localVoiceID);
                        $('#card-dialog #btn-play').removeClass('play');
                    } else {
                        $('#card-dialog #btn-play').addClass('play');
                        H.voice.playLocalVoice();
                    }
                }
            }).delegate('.btn-choice', 'click', function(e) {
                e.preventDefault();
                choiceType = $(this).attr('data-type');
                $('#choice-dialog').addClass('none');
                stopCheckFlag = true;
                H.swiper.init();
                if (wxIsReady) {
                    if ($('#btn-word').val().length == 0) {
                        $('#switch-voice').trigger('click');
                    } else {
                        $('#switch-voice').addClass('shine');
                    }
                }
            });
            $('#btn-voice').bind('touchstart', function(e){
                e.preventDefault();
                wx.startRecord();
                $('#record-dialog').removeClass('none');
                $('#btn-voice').addClass('recording').html('松手&nbsp;停止');
                recordBegin = new Date().getTime();
                clearInterval(intervalFlag);
                intervalFlag = setInterval(function(){
                    recordTimeLimit--;
                    if (recordTimeLimit == 1) {
                        clearInterval(intervalFlag);
                        $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
                        $('#record-dialog').addClass('none').find('p').html('录音中...松手停止');
                        stopCheckFlag = false;
                        wx.stopRecord({
                            success: function (res) {
                                localVoiceID = res.localId;
                                $('.timer').html("30''");
                                $('.info-box').addClass('none');
                                $('.voice-show').removeClass('none');
                            },
                            fail: function (res) {
                                H.voice.reset();
                            }
                        });
                        recordTimeLimit = 30;
                    } else if (recordTimeLimit <= 11) {
                        $('#record-dialog').removeClass('none').find('p').html('还可以说<span>' + (recordTimeLimit-1) + '</span>秒');
                    }
                }, 1000);
                return false;
            });
            $('#btn-voice').bind('touchend', function(e){
                e.preventDefault();
                $('#record-dialog').addClass('none').find('p').html('录音中...松手停止');
                clearInterval(intervalFlag);
                $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
                lastDuration = new Date().getTime() - recordBegin;
                if (lastDuration <= 1500) {
                    wx.stopRecord({
                        success: function (res) {
                            showTips('录制时间太短了~请重试');
                            H.voice.reset();
                        }
                    });
                } else {
                    if (stopCheckFlag) {
                        wx.stopRecord({
                            success: function (res) {
                                localVoiceID = res.localId;
                                if (Math.ceil(lastDuration / 1000) >= 30) {
                                    $('.timer').html("30''");
                                } else {
                                    $('.timer').html(Math.ceil(lastDuration / 1000) + "''");
                                }
                                $('.info-box').addClass('none');
                                $('.voice-show').removeClass('none');
                            },
                            fail: function (res) {
                                H.voice.reset();
                                // $('#btn-voice').removeClass('recording');
                                // $('#btn-play').removeClass('play');
                            }
                        });
                    }
                }
                return false;
            });
        },
        showCard: function() {
            var me = this;
            if (cardUUID != '') {
                me.getCardPort();
            }
        },
        randomsort: function(a, b) {
            return Math.random()>.5 ? -1 : 1;
        },
        fillUserinfo: function() {
            $('#card-dialog .host-name').html(nickname ? nickname : defaultName);
            $('#card-dialog .host-avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : "./images/icon-tvlogo.png"));
            // if (userDIYFlag || userWordFlag) {
            //     $('#unpack-dialog .tips label, #unpack-dialog .host-name').html(nickname ? nickname : defaultName);
            //     $('#unpack-dialog .host-avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : "./images/icon-tvlogo.png"));
            // }
        },
        fillHostInfo: function() {
            var me = this, hostLen = hostName.length, appendString = '';
            var lastData = '<section id="swiper' + hostLen + '" class="swiper-slide" data-hostID="' + hostLen + '" data-starNo="U"><img class="upload-img" src="./images/host/host-default.png"><section id="btn-upload" class="btn-upload"><img src="./images/icon-camera.png"><p>上传照片</p></section><form id="upload-form" class="upload-form preload" enctype="multipart/form-data" method="post" action="https://yaotv.holdfun.cn/portal/api/fileupload/oss"><input type="file" class="input-file-upload" id="input-file-upload" onchange="H.upload.init();" accept="image/*" capture></form></section>';
            for (var i = 0; i < hostLen; i++) {
                var t = '<section id="swiper' + i + '" class="swiper-slide" data-hostID="' + i + '" data-starNo="' + i + '" data-name="' + hostName[i] + '" data-avatar="./images/host/avatar' + i + '.jpg"><img src="./images/host/host' + i + '.jpg"></section>';
                me.hostArrayList.push(t);
            };
            me.hostArrayList = me.hostArrayList.sort(me.randomsort);
            me.hostArrayList.push(lastData);
            for (var i = 0; i < me.hostArrayList.length; i++) {
                appendString += me.hostArrayList[i];
            };
            $('.swiper-wrapper').html(appendString);
        },
        makeCardPort: function(content, type) {
            shownewLoading(null, '贺卡制作中...');
            if (starNo != 'U') {
                var nowUploadImgUrl = '';
            } else {
                var nowUploadImgUrl = uploadImgUrl;
            }
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/ceremony/greetingcard/make' + dev,
                data: {
                    oi: shaketv_openid,
                    sn: starNo + ';' +  choiceType, //明星编号+';'+接收人类型
                    vi: uploadVoiceID,  //语音编号
                    gt: encodeURIComponent(content),   //祝福语
                    hi: headimgurl ? headimgurl : '',
                    nn: nickname ? encodeURIComponent(nickname) : defaultName,
                    ou: nowUploadImgUrl   //目前用于传递与保存图片地址
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackMakeCardHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if (data.result) {
                        cardUUID = data.cu;
                        $('.info-box').addClass('none');
                        if (cardDetailType == 0) {
                            $('.word-show').removeClass('none');
                        } else {
                            $('.voice-show').removeClass('none');
                        }
                        H.share.init();
                        H.index.saveCardPort(type, content);
                    } else {
                        hidenewLoading();
                        showTips('大家太热情了！请喝杯茶后重试^_^');
                    }
                },
                error : function(xmlHttpRequest, error) {
                    hidenewLoading();
                    showTips('大家太热情了！请喝杯茶后重试^_^');
                }
            });
        },
        getCardPort: function() {
            shownewLoading(null, '打开贺卡中...');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/ceremony/greetingcard/get' + dev,
                data: {
                    cu: cardUUID    //即贺卡在平台的唯一编号
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCardInfoHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if (data.result) {
                        H.unpack.init(data);
                    }
                },
                error : function(xmlHttpRequest, error) {
                    hidenewLoading();
                }
            });
        },
        saveCardPort: function(type, content) {
            if (type == 3) {
                var baseType = uploadVoiceID;
            } else {
                var baseType = uploadImgUrl;
            }
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/uploadrecord/save' + dev,
                data: {
                    openid: shaketv_openid,
                    nickname: nickname ? encodeURIComponent(nickname) : "",
                    headimgurl: headimgurl ? headimgurl : "",
                    title: encodeURIComponent('春节说吧'),
                    content: encodeURIComponent(content),
                    type: type,
                    url: baseType
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackUploadRecordSaveHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        reset: function() {
            $('#choice-dialog, #card-dialog').addClass('none');
            $('.info-box, btn-info').addClass('none input-on');
            $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
            $('.word-wrapper, btn-submit, #index-dialog').removeClass('none');
            $('#btn-word').val('');
            $('#btn-play').removeClass('play');
            $('.timer').text('');
            $('.upload-img').attr('src', './images/host/host-default.png').removeAttr('style').parent('.swiper-slide').removeAttr('style');
            $('#btn-upload').removeClass('none');
            lastDuration = recordBegin = intervalFlag = 0;
            localVoiceID = serverVoiceID = uploadImgUrl = cardUUID ='';
            recordTimeLimit = 30;
            swiper.slideTo(0);
        }
    };

    H.wxRegister = {
        init : function(){
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
                    me.menuToFriend(wxData);
                    me.menuShare(wxData);
                },
                fail:function (res) {
                }
            });
        }
    };

    H.swiper = {
        activeIndex: 0,
        init: function() {
            var me = this;
            // me.changeCardInfo(me.activeIndex);
            swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                autoHeight: true,
                preloadImages: false,
                lazyLoading: true,
                onSlideChangeEnd: function(swiper){
                    $('.card-wrapper').css('height', Math.ceil($('.card-container').height() + $('.swiper-container .swiper-slide-active').height()));
                },
                onSlideChangeStart: function(swiper){
                    starNo = $('.swiper-slide-active').attr('data-starNO');
                    me.activeIndex = parseInt(swiper.activeIndex);
                    // me.changeCardInfo(starNo);
                }
            });
            starNo = $('.swiper-slide-active').attr('data-starNO');
        },
        changeCardInfo: function(activeIndex) {
            var dataAvatar = $('#swiper' + activeIndex).attr('data-avatar');
            var dataName = $('#swiper' + activeIndex).attr('data-name');
            if (cardDetailType == 0) {
                $('.host-avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/icon-tvlogo.png'));
                $('.host-name').html(nickname ? nickname : defaultName);
            } else {
                if (dataAvatar == null || dataAvatar == '') {
                    $('.host-avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/icon-tvlogo.png'));
                } else {
                    $('.host-avatar').attr('src', dataAvatar);
                }
                if (dataName == null || dataName == '') {
                    $('.host-name').html(nickname ? nickname : defaultName);
                } else {
                    $('.host-name').html(dataName);
                }
            }
        }
    };

    H.upload = {
        uploadFlag: false,
        uploadProcess: false,
        init: function() {
            var me = this, $file_upload = document.getElementById('input-file-upload'), count = $file_upload.files.length, img_id = 'img-' + new Date().getTime();
            if ($file_upload.files && $file_upload.files[0]) {
                shownewLoading(null, '图片上传中...');
                // $('#btn-upload').addClass('none');
                $('#btn-upload').addClass('hide');
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target.result) {
                        $('.upload-img').attr('src', './images/host/host-default.png');
                        $('.card-wrapper').css('height', $('.swiper-slide:first').height());
                        $('.upload-img').attr('src', e.target.result).css({'opacity': '0','padding': '0'});
                        if((e.target.result).indexOf('image/') == -1){ me.uploadimg(img_id, 0, true); }
                        $file_upload.outerHTML = $file_upload.outerHTML;
                    }
                }
                reader.readAsDataURL($file_upload.files[0]);
            }
            me.uploadFile(img_id);
        },
        uploadFile: function(img_id) {
            var me = this, fd = new FormData(), count = document.getElementById('input-file-upload').files.length;
            fd.append('file', document.getElementById('input-file-upload').files[0]);
            fd.append('serviceName', 'CCTV13SpeakIMG');
            me.uploadimg(img_id, fd, true);
        },
        uploadimg: function(img_id, fd, flag) {
            var me = this, xhr = new XMLHttpRequest(), $img_id = $('#' + img_id);
            me.uploadProcess = flag;
            xhr.addEventListener("load", function(evt) {
                if (evt.target && evt.target.responseText) {
                    var data = null;
                    try {
                        data = $.parseJSON(evt.target.responseText);
                    } catch(e) {}

                    if (!data || data.code != 0) {
                        hidenewLoading();
                        showTips('上传图片失败');
                        $('.upload-img').attr('src', './images/host/host-default.png');
                        $('#btn-upload').removeClass('none');
                        return;
                    }
                    hidenewLoading();
                    if(me.uploadProcess) {
                        showTips('图片上传成功'); 
                        var minUploadImg = $('.swiper-slide:first').height(), uploadImg = $('.upload-img').height();
                        $('.upload-img').parent('.swiper-slide').css({'background': '#fcedda'});
                        if (uploadImg < minUploadImg) {
                            $('.upload-img').css('padding', ((minUploadImg - uploadImg) / 2) + 'px 0');
                            $('.swiper-wrapper').animate({'height':minUploadImg}, 500, function(){
                                $('.card-wrapper').css({ 'height': Math.ceil($('.card-container').height() + minUploadImg)});
                            });
                        } else {
                            $('.upload-img').css('padding', '0');
                            $('.swiper-wrapper').animate({'height':uploadImg}, 500, function(){
                                $('.card-wrapper').css({ 'height': Math.ceil($('.card-container').height() + uploadImg)});
                            });
                        }
                        $('.upload-img').animate({'opacity': '1'}, 500);
                        setTimeout(function(){
                            $('.card-wrapper').css('height', $('.card-wrapper').height());
                        }, 600);
                        uploadImgUrl = data.filePath;
                    }
                }
            }, false);
            if(fd == 0){ return; }
            xhr.addEventListener("error", function() {
                hidenewLoading();
                showTips('上传出错');
                $('.upload-img').attr('src', './images/host/host-default.png');
                $('#btn-upload').removeClass('none');
            }, false);
            xhr.addEventListener("abort", function() {
                hidenewLoading();
                showTips("上传已取消");
                $('.upload-img').attr('src', './images/host/host-default.png');
                $('#btn-upload').removeClass('none');
            }, false);
            xhr.open('POST', domain_url + 'api/fileupload/oss' + dev);
            // xhr.open('POST', domain_url + 'fileupload/image' + dev);
            xhr.send(fd);
        }
    };

    H.share = {
        init: function() {
            var me = this, familyType = '';
            if (choiceType == 0) {
                familyType = '您的家人';
            } else if (choiceType == 2) {
                familyType = '您的同事';
            } else {
                familyType = '您的朋友';
            }
            $('#share-dialog').removeClass('none');
            if (starNo != 'U') {
                wxshareData.imgUrl = hostCDNAvatar[parseInt(starNo)];
                wxshareData.desc = ('我是央视新闻主持人' + hostName[parseInt(starNo)] + '，' + familyType + nickname + '寄您了一份祝福，点击查看！');
            } else {
                wxshareData.imgUrl = (headimgurl ? (headimgurl + '/' + yao_avatar_size) : wxData.imgUrl);
                wxshareData.desc = (familyType + nickname + '在《春节说吧》寄您了一份祝福，点击查看！');
            }
            wxshareData.link = me.getShareUrl(openid);
            wxshareData.title = '寄出这张贺卡，我的思念说给你听。';
            
            H.wxRegister.menuShare(wxshareData);
            H.wxRegister.menuToFriend(wxshareData);
        },
        success: function() {
            $('#share-dialog').addClass('none');
            H.index.reset();
            showTips('您的思念已送出！');
            H.wxRegister.menuShare(wxData);
            H.wxRegister.menuToFriend(wxData);
        },
        fail: function() {
        },
        getShareUrl: function(openid) {
            var href = window.location.href;
            href = add_param(share_url.replace(/[^\/]*\.html/i, 'index.html'), 'resopenid', hex_md5(openid), true);
            href = add_param(href, 'uuid', cardUUID, true);
            href = add_param(href, 'from', 'share', true);
            href = delQueStr(href, "openid");
            href = delQueStr(href, "headimgurl");
            href = delQueStr(href, "nickname");
            return add_yao_prefix(href);
        }
    };

    H.voice = {
        reset: function() {
            $('#btn-voice').removeClass('recording').html('长按&nbsp;录音');
            $('#btn-play').removeClass('play');
            $('.info-box').addClass('none');
            $('.voice-wrapper').removeClass('none');
            clearInterval(intervalFlag);
            lastDuration = recordBegin = intervalFlag = 0;
            localVoiceID = serverVoiceID = '';
            recordTimeLimit = 30;
            stopCheckFlag = true;
        },
        playVoice: function() {
            var me = this;
            wx.downloadVoice({
                serverId: serverVoiceID,
                isShowProgressTips: 0,
                success: function (res) {
                    downloadFlag = true;
                    serverVoiceID = res.localId;
                    hidenewLoading();
                    $('#btn-play').trigger('click');
                }
            });
        },
        playDownloadVoice: function(){
            var me = this;
            wx.downloadVoice({
                serverId: serverVoiceID,
                isShowProgressTips: 0,
                success: function (res) {
                    wx.playVoice({
                        localId: res.localId
                    });
                    wx.onVoicePlayEnd({
                        success: function (res) {
                            $('#unpack-dialog #btn-play').removeClass('play');
                        }
                    });
                }
            });
        },
        playLocalVoice: function() {
            var me = this;
            if (localVoiceID == '') {
                me.reset();
                showTips('点击按钮录制一段祝福吧~');
                return;
            }
            wx.playVoice({
                localId: localVoiceID
            });
            wx.onVoicePlayEnd({
                success: function (res) {
                    // localVoiceID = res.localId;
                    $('#card-dialog #btn-play').removeClass('play');
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
                localId: localVoiceID,
                isShowProgressTips: 0,
                success: function (res){
                    uploadVoiceID = res.serverId;
                    // 语音上传成功后的操作
                    H.index.makeCardPort('', 3);
                    $('.info-box').addClass('none');
                    $('.voice-show').removeClass('none');
                }
            });
        }
    };

    H.unpack = {
        audioA: document.getElementById("audio-a"),
        audioB: document.getElementById("audio-b"),
        init: function(data) {
            if (data.gt == '' && data.vi == '') {
                return false;
            }
            $('#index-dialog').addClass('none');
            $('#unpack-dialog').removeClass('none').find('.lock-wrapper').removeClass('none');
            var configData = data.sn.split(';');
            if (configData[0] == 'U') {
                if (data.ou) {
                    var Img = new Image();
                    Img.src = data.ou;
                    Img.onload = function () {
                        $('#unpack-dialog .showCard-container img').attr('src', data.ou);
                        var minshowH = $(window).height()*0.6, showImgH = $('#unpack-dialog .showCard-container img').height();
                        if (showImgH < minshowH) {
                            $('#unpack-dialog .showCard-container img').css('padding-top', ((minshowH - showImgH) / 2));
                        }
                        if (data.hi) {
                            $('#unpack-dialog .host-avatar').attr('src', data.hi + '/' + yao_avatar_size);
                        } else {
                            $('#unpack-dialog .host-avatar').attr('src', './images/icon-tvlogo.png');
                        }
                    };
                } else {
                    $('#unpack-dialog .showCard-container img').attr('src', './images/swiper-default.jpg');
                }
                if (data.hi) {
                    $('#unpack-dialog .host-avatar').attr('src', data.hi + '/' + yao_avatar_size);
                } else {
                    $('#unpack-dialog .host-avatar').attr('src', './images/icon-tvlogo.png');
                }
                $('#unpack-dialog .info-wrapper .tips').addClass('none');
                $('#unpack-dialog .user-tips').removeClass('none');
            } else {
                $('#unpack-dialog .showCard-container img').attr('src', './images/host/host' + parseInt(configData[0]) + '.jpg');
                $('#unpack-dialog .host-avatar').attr('src', './images/host/avatar' + parseInt(configData[0]) + '.jpg');
                $('#unpack-dialog .lock-name, #unpack-dialog .host-name').text(hostName[configData[0]]);
                $('#unpack-dialog .info-wrapper .tips').addClass('none');
                $('#unpack-dialog .host-tips').removeClass('none');
            }
            if (configData[1] == '0') {
                $('#unpack-dialog .lock-type').text('家人');
            } else if (configData[1] == '2') {
                $('#unpack-dialog .lock-type').text('同事');
            } else {
                $('#unpack-dialog .lock-type').text('朋友');
            }
            if (data.gt != '') {
                userWordFlag = true;
                $('#unpack-dialog .showCard-wrapper .info-box').addClass('none');
                $('#unpack-dialog .showCard-wrapper .word-show').removeClass('none').find('p').text(data.gt);
                $('.tips label, #unpack-dialog .host-name').text(data.nn);
                if (configData[0] == 'U') {
                    if (data.hi) {
                        $('#unpack-dialog .host-avatar').attr('src', data.hi + '/' + yao_avatar_size);
                    } else {
                        $('#unpack-dialog .host-avatar').attr('src', './images/icon-tvlogo.png');
                    }
                } else {
                    $('#unpack-dialog .lock-wrapper .host-avatar').attr('src', './images/host/avatar' + parseInt(configData[0]) + '.jpg');
                    if (data.hi) {
                        $('#unpack-dialog .showCard-wrapper .host-avatar').attr('src', data.hi + '/' + yao_avatar_size);
                    } else {
                        $('#unpack-dialog .showCard-wrapper .host-avatar').attr('src', './images/icon-tvlogo.png');
                    }
                }
            }
            if (data.vi != '') {
                userWordFlag = false;
                serverVoiceID = data.vi;
                if (configData[0] == 'U') {
                    userDIYFlag = true;
                    $('#unpack-dialog .host-name').text(data.nn);
                } else {
                    userDIYFlag = false;
                    $('#audio-a').attr('src', './media/host' + parseInt(configData[0]) + '-a.mp3');
                    $('#audio-b').attr('src', './media/host' + parseInt(configData[0]) + '-b.mp3');
                    $('#unpack-dialog .host-avatar').attr('src', './images/host/avatar' + parseInt(configData[0]) + '.jpg');
                }
                $('#unpack-dialog .showCard-wrapper .info-box').addClass('none');
                $('#unpack-dialog .showCard-wrapper .voice-show').removeClass('none');
                $('.tips label').text(data.nn);
            }
        },
        sounds: function() {
            var me = this;
            $('#unpack-dialog .focus').addClass('none');
            if (!userDIYFlag) {
                me.audioA.loop = me.audioB.loop = false;
                me.audioA.addEventListener('ended', function () {
                    me.audioA.pause();
                    H.voice.stopVoice(serverVoiceID);
                    wx.playVoice({
                        localId: serverVoiceID
                    });
                    wx.onVoicePlayEnd({
                        success: function (res) {
                            me.audioB.play();
                        }
                    });
                }, false);
                me.audioB.addEventListener('ended', function () {
                    me.audioB.pause();
                    $('#unpack-dialog #btn-play').removeClass('play');
                }, false);
                me.audioA.play();
            } else {
                H.voice.stopVoice(serverVoiceID);
                wx.playVoice({
                    localId: serverVoiceID
                });
                wx.onVoicePlayEnd({
                    success: function (res) {
                        $('#unpack-dialog #btn-play').removeClass('play');
                    }
                });
            }
        }
    };
})(Zepto);

$(function() {
    H.index.init();
    H.wxRegister.ready();
    H.wxRegister.init();
});