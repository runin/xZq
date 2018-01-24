(function ($) {

    H.award = {
        $dialogWrapper: $('#award_dialog'),
        $dialog: $('#award_dialog .dialog'),
        $count: $('.award-count'),
        $audioWin : $('#audio_win'),

        from: 'yao',
        isKaquanReady: false,
        $lastDialog: null,

        isAwardReturn: true,

        isWailian: false,
        wailianUrl: null,

        init: function(){
            H.award.resize();
            getResult("mp/jsapiticket", {
                appId: W.mpappid
            }, 'callbackJsapiTicketHandler');
        },

        isAwardShowing: function(){
            var hasAward = false;
            $('.award-wrapper').each(function(){
                if(!$(this).hasClass('none')){
                    hasAward = true;
                }
            });
            return hasAward;
        },

        show: function(data, from){
            H.award.from = from;

            if(data.result == false){
                // 未中奖
                H.nothing.show();
                return;
            }
            
            if(data.pt == 0){
                // 未中奖
                H.nothing.show();
                return ;

            }else if(data.pt == 1){
                // 实物
                H.award.$audioWin[0].play();
                if(data.pd == 'infi'){
                    H.award.infinitiAward(data);
                }else if(data.pd == 'suning'){
                    H.award.suningAward(data);
                }else{
                    H.award.didiAward(data);
                }
            }else if(data.pt == 7){
                // 卡券
                H.award.$audioWin[0].play();
                H.award.kaquanAward(data);
            }else if(data.pt == 9){
                H.award.$audioWin[0].play();
                H.award.wailianAward(data);
            }else{
                // 未中奖
                H.nothing.show();
                return;
            }

        },

        close: function(){
            if(H.award.from == 'vip'){
                H.vip.reset();
            }

            if(H.award.from == 'accept'){
                H.cardAccept.didiDone();
            }
        },

        resize: function(){
            var height = $(window).height();
            var dialogRatio = 770 / 1009

            var dialogHeight = height * dialogRatio;
            $('#award_dialog .dialog').css({
                'height' : dialogHeight,
                'top' : (height - dialogHeight)/2
            });
        },

        infinitiAward: function(data){
            
            var width = $(window).width();
            var height = $(window).height();
            var ratio = 500 / 690;

            var infiHeight = width * 0.8 / ratio;
            $('#infiniti_award_dialog').removeClass('none');

            $('#infiniti_award_dialog .dialog').addClass('award-in').css({
                'height': infiHeight,
                'top': (height - infiHeight) / 2,
                'background-image': 'url('+data.pi+')'
            });

            $('#infiniti_name').val(data.rn ? data.rn : '');
            $('#infiniti_tel').val(data.ph ? data.ph : '');
            $('#infiniti_addr').val(data.ad ? data.ad : '');

            $('#infiniti_award_dialog .award-btn').tap(function(){
                if(!H.award.isAwardReturn){
                    return false;
                }

                var name = $('#infiniti_name').val();
                if(name.length == 0){
                    showTips('请输入您的姓名');
                    return false;
                }

                var tel = $('#infiniti_tel').val();
                if(!/^\d{11}$/.test(tel)){
                    showTips('请正确填写您的电话');
                    return false;
                }

                var addr = $('#infiniti_addr').val();
                if(addr.length == 0){
                    showTips('请输入您的地址');
                    return false;
                }

                H.award.$lastDialog = $('#infiniti_award_dialog');
                H.award.isAwardReturn = false;
                getResult('api/lottery/award',{
                    oi : openid,
                    nn : encodeURIComponent(nickname),
                    hi : headimgurl,
                    ph : tel,
                    rn : encodeURIComponent(name),
                    ad : encodeURIComponent(addr)
                },'callbackLotteryAwardHandler');

            });
            
        },

        suningAward: function(data){

            var width = $(window).width();
            var height = $(window).height();
            var ratio = 500 / 801;

            var suningHeight = width * 0.8 / ratio;
            $('#suning_award_dialog').removeClass('none');

            $('#suning_award_dialog .dialog').addClass('award-in').css({
                'height': suningHeight,
                'top': (height - suningHeight) / 2,
                'background-image': 'url('+data.pi+')'
            });

            $('#suning_name').val(data.rn ? data.rn : '');
            $('#suning_tel').val(data.ph ? data.ph : '');
            $('#suning_addr').val(data.ad ? data.ad : '');

            $('#suning_award_dialog .award-btn').tap(function(){
                if(!H.award.isAwardReturn){
                    return false;
                }

                var name = $('#suning_name').val();
                if(name.length == 0){
                    showTips('请输入您的姓名');
                    return false;
                }

                var tel = $('#suning_tel').val();
                if(!/^\d{11}$/.test(tel)){
                    showTips('请正确填写您的电话');
                    return false;
                }

                var addr = $('#suning_addr').val();
                if(addr.length == 0){
                    showTips('请输入您的地址');
                    return false;
                }

                H.award.$lastDialog = $('#suning_award_dialog');
                H.award.isAwardReturn = false;
                getResult('api/lottery/award',{
                    oi : openid,
                    nn : encodeURIComponent(nickname),
                    hi : headimgurl,
                    ph : tel,
                    rn : encodeURIComponent(name),
                    ad : encodeURIComponent(addr)
                },'callbackLotteryAwardHandler');

            });
            
        },

        didiAward: function(data){
            
            var width = $(window).width();
            var height = $(window).height();
            var ratio = 500 / 720;

            var didiHeight = width * 0.8 / ratio;
            $('#didi_award_dialog').removeClass('none');

            $('#didi_award_dialog .dialog').addClass('award-in').css({
                'height': didiHeight,
                'top': (height - didiHeight) / 2,
                'background-image': 'url('+data.pi+')'
            });

            $('#didi_tel').val(data.ph ? data.ph : '');

            $('#didi_award_dialog .award-btn').tap(function(){
                if(!H.award.isAwardReturn){
                    return false;
                }

                var tel = $('#didi_tel').val();
                if(!/^\d{11}$/.test(tel)){
                    showTips('请正确填写您的电话');
                    return false;
                }

                H.award.$lastDialog = $('#didi_award_dialog');
                H.award.isAwardReturn = false;
                getResult('api/lottery/award',{
                    oi : openid,
                    nn : encodeURIComponent(nickname),
                    hi : headimgurl,
                    ph : tel
                },'callbackLotteryAwardHandler');

            });
        },

        kaquanAward: function(data){
            if(!H.award.isKaquanReady){
                H.nothing.show();
                return false;
            }

            var width = $(window).width();
            var height = $(window).height();
            var ratio = 475 / 700;

            var kaquanHeight = width * 0.8 / ratio;
            $('#kaquan_award_dialog').removeClass('none');

            $('#kaquan_award_dialog .dialog').addClass('award-in').css({
                'height': kaquanHeight,
                'top': (height - kaquanHeight) / 2,
                'background-image': 'url('+data.pi+')'
            });

            $('#kaquan_award_dialog .dialog').unbind('tap').tap(function(){
                if($(this).hasClass('disabled')){
                    return false;
                }
                showLoading(null, '领取中');
                setTimeout(function(){
                    hideLoading();
                }, 15000);

                wx.addCard({
                    cardList: [{
                        cardId: data.ci,
                        cardExt: "{\"timestamp\":\""+ data.ts +"\",\"signature\":\""+ data.si +"\"}"
                    }],
                    success: function (res) {
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');

                        $('#kaquan_award_dialog .dialog').removeClass('disabled');
                    },

                    fail: function(res){
                        hideLoading();
                        $('#kaquan_award_dialog .dialog').removeClass('disabled');
                    },
                        
                    complete:function(){
                        hideLoading();
                        $('#kaquan_award_dialog').addClass('none');
                        H.award.close();
                    },

                    cancel:function(){
                        hideLoading();
                        $('#kaquan_award_dialog .dialog').removeClass('disabled');
                    }
                });

            });
        },

        wailianAward: function(data){

            var width = $(window).width();
            var height = $(window).height();
            var ratio = 475 / 700;

            var wailianHeight = width * 0.8 / ratio;
            $('#wailian_award_dialog').removeClass('none');

            $('#wailian_award_dialog .dialog').addClass('award-in').css({
                'height': wailianHeight,
                'top': (height - wailianHeight) / 2,
                'background-image': 'url('+data.pi+')'
            });

            $('#wailian_award_dialog .dialog').unbind('tap').tap(function(){
                if($(this).hasClass('disabled')){
                    return false;
                }
                showLoading(null, '领取中');
                setTimeout(function(){
                    hideLoading();
                }, 15000);
                H.award.isWailian = true;
                H.award.wailianUrl = data.ru;
                getResult('api/lottery/award', {
                    oi: openid,
                    hi: headimgurl,
                    nn: nickname
                }, 'callbackLotteryAwardHandler');

            });

        }

    };

    W.callbackLotteryAwardCountHandler = function(data){
        if(data.result == true){
            H.award.$count.text('已发奖品：' + data.ac).removeClass('none');
            setTimeout(function(){
                H.award.initCount();
            }, 5000);
        }
    };

    W.callbackLotteryAwardHandler = function(data){
        H.award.isAwardReturn = true;
        if(data.result == true){
            if(H.award.isWailian && H.award.wailianUrl){
                location.href = H.award.wailianUrl;
                H.award.isWailian = false;
                H.award.wailianUrl = null;
            }else{
               showTips('领取成功');
               H.award.$lastDialog.addClass('none');
               H.award.close(); 
            }
        }
    };

    W.callbackJsapiTicketHandler = function(data){
        var url = window.location.href;
        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
        var timestamp = Math.round(new Date().getTime()/1000);
        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

        wx.config({
            appId: W.mpappid,
            timestamp: timestamp,
            nonceStr:nonceStr,
            signature:signature,
            jsApiList: [
                'checkJsApi',
                'addCard'
            ]
        });

        wx.ready(function () {
            wx.checkJsApi({
                jsApiList: [
                    'addCard'
                ],
                success: function (res) {
                    H.award.isKaquanReady = true;
                }
            });
        });

        wx.error(function(res){
            H.award.isKaquanReady = false;
        });
    };

    H.award.init();

})(Zepto);