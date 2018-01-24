(function($) {
    H.card = {
        time: 3e3,
        swiperid: 0,
        playdom: null,
        pid: getQueryString('pid') || '',
        init: function() {
            if (!this.pid) toUrl('cards.html');
            this.event();
            this.getInfoPort();
            this.getUser();
            this.advertiseport();
        },
        event: function() {
            var me = this;
            $('body').delegate('#switch-voice', 'click', function(){
                if (!getData('auth_record')) {
                    H.record.startRecord();
                } else {
                    $('.word-wrapper').addClass('none');
                    $('.voice-wrapper').removeClass('none');
                }
            }).delegate('#switch-word', 'click', function(){
                $('.word-wrapper').removeClass('none');
                $('.voice-wrapper').addClass('none');
            }).delegate('.btn-send', 'click', function(){
                if (me.check()) H.record.makeCardPort();
            }).delegate('.swiper-container-ad a', 'click', function(e) {
                e.preventDefault();
                var me = this;
                if ($(me).attr('data-url')) {
                    setTimeout(function(){
                        location.href = $(me).attr('data-url');
                    }, 3e2);
                }
            });
            // .delegate('.share', 'click', function(){
            //     $(this).addClass('knone');
            // })
        },
        advertiseport: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/ad/get' + dev,
                data: {areaNo: 'lottery'},
                dataType: "jsonp",
                jsonpCallback: 'callbackAdGetHandler',
                timeout: 5e3,
                complete: function() {
                },
                success: function(data) {
                    if (data.code == 0 && data.ads) {
                        if (data.st) me.time = parseInt(data.st)*1e3;
                        me.fillAdvertise(data.ads);
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        fillAdvertise: function(data) {
            var items = data, tpl = '';
            for(i in items) {
                if (items[i].p) tpl += '<div class="swiper-slide"><a href="javascript:void(0);" data-url="' + (items[i].l || '') + '" data-collect="true" data-collect-flag="ad_' + items[i].u + '" data-collect-desc="广告' + (i*1+1) + '"><img data-src="' + items[i].p + '" class="swiper-lazy"></a><div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div></div>'
            };
            $('.swiper-container-ad .swiper-wrapper').html(tpl);
            if (items.length > 1) {
                this.swiperad();
            } else {
                this.swiperad('noauto');
            }
        },
        getInfoPort: function() {
            var me = this;
            shownewLoading(null,'祝福正在赶来...');
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
                        me.fill(data.gitems);
                    }
                },
                error : function() {
                }
            });
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
        getUser: function() {
            $('.avatar').attr('src', headimgurl || './images/avatar.png');
        },
        fill: function(data){
            var items = data, tpl = '';
            // 倒序
            for (var a = 0, i = items.length - 1; i >= 0; i--, a++) {
                tpl += '<div id="swiper' + a + '" data-sid="' + a + '" class="swiper-slide s' + items[i].uid + '" data-id="' + items[i].uid + '" data-poster="' + items[i].is + '" data-vid="' + items[i].mu + '"><video x-webkit-airplay="true" webkit-playsinline="yes" width="100%" height="100%" controls poster="' + items[i].is + '"><source src="' + items[i].mu + '" type="video/mp4"></source></video></div>';
            };
            // 正序
            // for(i in items) {
            //     if (items[i].p) tpl += '<div class="swiper-slide"><a href="javascript:void(0);" data-url="' + (items[i].l || '') + '" data-collect="true" data-collect-flag="ad_' + items[i].u + '" data-collect-desc="广告' + (i*1+1) + '"><img data-src="' + items[i].p + '" class="swiper-lazy"></a><div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div></div>'
            // };
            $('.swiper-container-video .swiper-wrapper').html(tpl);
            this.swiper();
        },
        swiper: function() {
            var me = this;
            me.swiperid = parseInt($('.s' + me.pid).attr('data-sid'));
            var swiper = new Swiper('.swiper-container-video', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: 120,
                speed: 500,
                loop: false,
                iOSEdgeSwipeDetection: true,
                preloadImages: true,
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                onInit: function(swiper) {
                    swiper.slideTo(me.swiperid || 0, 0, false);
                },
                onSlideChangeEnd: function(swiper) {
                    var $sp = $('#swiper' + me.swiperid);
                    $sp.html('<video x-webkit-airplay="true" webkit-playsinline="yes" width="100%" height="100%" controls poster="' + $sp.attr('data-poster') + '"><source src="' + $sp.attr('data-vid') + '" type="video/mp4"></source></video>');
                    me.swiperid = parseInt(swiper.activeIndex);
                    me.pid = $('#swiper' + me.swiperid).attr('data-id');
                }
            });
        },
        swiperad: function(data) {
            var me = this;
            if (data == 'noauto') {
                var swiper = new Swiper('.swiper-container-ad', {
                    spaceBetween: 70,
                    centeredSlides: true,
                    slidesPerView: 1,
                    paginationClickable: true,
                    keyboardControl: true,
                    speed: 500,
                    loop: true,
                    iOSEdgeSwipeDetection: true,
                    preloadImages: true,
                    lazyLoading: true,
                    lazyLoadingInPrevNext: true,
                    onInit: function(swiper) {
                    },
                    onSlideChangeEnd: function(swiper) {
                    }
                });
            } else {
                var swiper = new Swiper('.swiper-container-ad', {
                    spaceBetween: 70,
                    centeredSlides: true,
                    autoplay: me.time || 3e3,
                    autoplayDisableOnInteraction: false,
                    slidesPerView: 1,
                    paginationClickable: true,
                    keyboardControl: true,
                    speed: 500,
                    loop: true,
                    iOSEdgeSwipeDetection: true,
                    preloadImages: true,
                    lazyLoading: true,
                    lazyLoadingInPrevNext: true,
                    onInit: function(swiper) {
                    },
                    onSlideChangeEnd: function(swiper) {
                    }
                });
            }
        }
    };

    H.record = {
        cu: null,
        content: '',
        localId: null,
        serverId: null,
        time: actData.recordTime,
        useTime: 0,
        init: function() {
            this.switch();
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-voice', 'touchstart', function(e){
                e.preventDefault();
                window.touchTime = 0;
                window.touchFlag = setInterval(function(){
                    window.touchTime++;
                    if (window.touchTime >= 1) {
                        clearInterval(window.touchFlag);
                        window.touchFlag = null;
                        me.startRecord();
                    } else {
                        window.touchTime = 0;
                        clearInterval(window.touchFlag);
                        window.touchFlag = null;
                        showTips('录音太短了~<br>请重新录制');
                        me.reset();
                    }
                }, 500);
            }).delegate('#btn-voice', 'touchend', function(e){
                e.preventDefault();
                if (window.touchTime == 0) {
                    clearInterval(window.touchFlag);
                    window.touchFlag = null;
                    showTips('录音太短了~<br>请重新录制');
                    me.reset();
                    return;
                }
                me.stopRecord();
            }).delegate('#btn-play', 'click', function(e){
                e.preventDefault();
                var localId = $(this).attr('data-localId');
                if (localId) {
                    if ($(this).hasClass('play')) {
                        me.stopVoice(localId);
                    } else {
                        me.playVoice(localId);
                    }
                } else {
                    showTips('很抱歉，音频无法播放！<br>请重新录制');
                    me.reset();
                }
            }).delegate('.btn-reset', 'click', function(e){
                e.preventDefault();
                me.reset();
            });
        },
        reset: function() {
            this.stopRecordFirst();
            this.stopVoice(this.localId);
            $('.voice-review').addClass('none').find('.btn-play').removeAttr('data-localId').find('.timer').text('');
            $('.btn-voice').removeClass('none');
            this.useTime = 0;
            this.localId = null;
            this.serverId = null;
        },
        recordState: function(flag) {
            var me = this;
            if (flag == 'record') {
                var timer = me.time;
                me.useTime = 0;
                $('#btn-voice').addClass('focus').html('松手停止录音');
                $('#record-dialog').removeClass('none');
                $('.left-time').html(timer--);
                window.timeFlag = setInterval(function(){
                    if (timer < 1) {
                        // 停止
                        $('.left-time').html('0');
                        $('#btn-voice').removeClass('focus').html('长按此处录制语音');
                        $('#record-dialog').addClass('none');
                        clearInterval(window.timeFlag);
                    } else {
                        me.useTime++;
                        $('.left-time').html(timer--);
                    }
                }, 1e3);
            } else {
                clearInterval(window.timeFlag);
                window.timeFlag = null;
                $('#btn-voice').removeClass('focus').html('长按此处录制语音');
                $('#record-dialog').addClass('none');
            }
        },
        switch: function() {
            $('body').removeClass('noRecord').find('.boxavatar p').html('点击下方键盘或长按语音按钮，编辑您的祝福语！');
        },
        startRecord: function() {
            var me = this;
            wx.startRecord({
                success: function() {
                    if (!getData('auth_record')) {
                        saveData('auth_record', true);
                        me.stopRecordFirst();
                        $('.word-wrapper').addClass('none');
                        $('.voice-wrapper').removeClass('none');
                    } else {
                        me.useTime = 0;
                        me.recordState('record');
                        me.onVoiceRecordEnd();
                    }
                },
                cancel: function() {
                    me.stopRecordFirst();
                    delData('auth_record');
                    alert('授权后才能录音哦~');
                    me.stopRecordFirst();
                    location.href = location.href;
                },
                fail: function() {
                    me.stopRecordFirst();
                    saveData('auth_record', true);
                    // alert('很抱歉!录音初始化失败\n请稍后重试~ TOT');
                    me.stopRecordFirst();
                }
            });
        },
        stopRecord: function() {
            var me = this;
            me.recordState('stop');
            wx.stopRecord({
                success: function(res) {
                    me.localId = res.localId;
                    me.uploadVoice();
                }
            });
        },
        stopRecordFirst: function() {
            var me = this;
            me.recordState('stop');
            wx.stopRecord({
                success: function(res) {
                }
            });
        },
        onVoiceRecordEnd: function() {
            var me = this;
            wx.onVoiceRecordEnd({
                complete: function(res) {
                    me.localId = res.localId;
                    me.uploadVoice();
                }
            });
        },
        uploadVoice: function() {
            var me = this;
            me.recordState('stop');
            if (me.useTime < 1) {
                showTips('录音太短了~<br>请重新录制');
                me.reset();
                return false;
            }
            wx.uploadVoice({
                localId: me.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                    me.serverId = res.serverId;
                    $('.btn-voice').addClass('none');
                    $('.voice-review').removeClass('none').find('.btn-play').attr('data-localId', me.localId).find('.timer').html(me.useTime + "''");
                },
                fail: function() {
                    showTips('很抱歉，音频上传失败！');
                }
            });
        },
        playVoice: function(id) {
            var me = this;
            $('.btn-play').addClass('play');
            wx.playVoice({
                localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
            });
            me.onVoicePlayEnd();
        },
        stopVoice: function(id) {
            var me = this;
            wx.stopVoice({
                localId: id, // 需要停止的音频的本地ID，由stopRecord接口获得
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
        },
        downloadVoice: function() {
            var me = this;
            wx.downloadVoice({
                serverId: '', // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                    var localId = res.localId; // 返回音频的本地ID
                }
            });
        },
        makeCardPort: function() {
            var me = this;
            shownewLoading(null, '贺卡制作中...');
            if (me.serverId) {
                recordUserOperate(openid, "制作贺卡_语音", "super_card_voice");
            } else {
                recordUserOperate(openid, "制作贺卡_文字", "super_card_word");
            }
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/ceremony/greetingcard/make' + dev,
                data: {
                    oi: openid,
                    sn: H.card.pid + ';' + me.useTime,
                    vi: me.serverId || '',  //语音编号
                    gt: encodeURIComponent(me.content),   //祝福语
                    hi: headimgurl ? headimgurl : '',
                    nn: nickname ? encodeURIComponent(nickname) : '',
                    ou: ''   //目前用于传递与保存图片地址
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackMakeCardHandler',
                timeout: 5e3,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if (data.result) {
                        me.cu = data.cu;
                        shareData = {
                            "imgUrl": headimgurl || share_img,
                            "link": updateUrl('share.html', data.cu),
                            "desc": '你的好友' + (nickname || '') + '给你送祝福啦，参与并分享，新春摇大奖！',
                            "title": '嗨翻新春！英超球星、名嘴齐拜年'
                        };
                        H.jssdk.menuShare();
                        H.jssdk.menuToFriend();
                        
                        $('.share').removeClass('knone');
                        me.saveCardPort();
                    } else {
                        showTips('大家太热情了！请喝杯茶后重试^_^');
                    }
                },
                error : function(xmlHttpRequest, error) {
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
                    cu: '3952ea7a28e041d48ebab4839b4c919f'    //即贺卡在平台的唯一编号
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCardInfoHandler',
                timeout: 5e3,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if (data.result) {
                    }
                },
                error : function(xmlHttpRequest, error) {
                    hidenewLoading();
                }
            });
        },
        saveCardPort: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/uploadrecord/save' + dev,
                data: {
                    openid: openid,
                    nickname: nickname ? encodeURIComponent(nickname) : "",
                    headimgurl: headimgurl ? headimgurl : "",
                    title: encodeURIComponent(wTitle),
                    content: encodeURIComponent(me.content),
                    type: 3,
                    url: me.serverId || ''
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackUploadRecordSaveHandler',
                timeout: 5e3,
                complete: function() {
                },
                success : function(data) {
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.card.init();
    H.jssdk.init();
});