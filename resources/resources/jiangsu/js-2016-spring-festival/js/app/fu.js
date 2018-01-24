(function ($) {

    H.fu = {
    	$fu : $('#fu'),
        $fuList : $('#fu_list'),
        $tips: $('#fu_tips'),

    	fuX : 0,
    	fuY : 0,
    	fuSize : 0,
    	touchX : 0,
    	touchY : 0,
    	fuOuterRatio : 110 / 422,
    	threshold : 50,
    	startDir : null,
    	isRolling: false,
        total: 0,
        cur: 0,
        isUnlocked: false,
        mu: 0,
        roi: null,

        init: function () {
            this.resize();
            H.fu.bindBtns();

            H.fu.mu = getQueryString('ud');
            H.fu.roi = getQueryString('roi');
            if(!H.fu.mu || !H.fu.roi){
                location.href = "./index.html";
            }

            showLoading();
            getResult('api/greetingcard/material/get', {
                'oi' : H.fu.roi,
                'mu' : H.fu.mu
            }, 'callbackGreetingcardMaterialGetHandler', null, null, null, 15000, function(){
                hideLoading();
                H.fu.initFu({});
                H.fu.autoRolling();
            });

            H.share.fuShare(H.fu.mu, H.fu.roi);
        },

        initFu: function(data){
            H.fu.total = data.uu;

            if(data.fl){
                H.fu.cur = data.fl.length;
                for(var i in data.fl){
                    if(data.fl[i].oi == openid){
                        H.fu.isUnlocked = true;
                    }
                    H.fu.$fuList.find("li:eq("+i+")").removeClass('num').html('<img onerror="this.src=\'./images/avatar.jpg\'" src="'+data.fl[i].hi+'" />');
                }
                H.fu.$fu.css({
                    '-webkit-transform' : 'rotate('+45 * H.fu.cur+'deg)'
                });
            }

            if(H.fu.isUnlocked){
                H.fu.$tips.text('终于等到你，还好我没放弃');
            }

            setTimeout(function(){
                H.fu.$fu.addClass('animate');
            }, 100);

            if(H.fu.cur < H.fu.total){
                H.fu.autoRolling();
            }else{
                // 已完全解锁提示
                H.fu.$tips.text('您的好友已经可以发送该贺卡了');
            }

            $('.fu-tips').removeClass('none');
            $('.fu-wrapper').removeClass('none');
            $('.fu-friends').removeClass('none');


        },

        afterGain: function(data){

            H.fu.$fuList.find('li.num:first').html('<img onerror="this.src=\'./images/avatar.jpg\'" src="'+headimgurl+'" />');
            if(data.us == false){
                // 仍未解锁
                showTips('您已成功为好友助力');
                H.fu.$tips.text('终于等到你，还好我没放弃');
            }else{
                // 解锁成功
                showTips('您已成功为好友助力');
                H.fu.$tips.text('您的好友已经可以发送该贺卡了');
            }

            
            
        },

        bindBtns: function(){
        	$('#btn_join').tap(function(){
        		location.href = 'index.html';
        	});

            $('#btn_infi').tap(function(){
                location.href = 'http://h5s.moneplus.cn/2016/didi/?_mz_utm_source=60002';
            });
        },

        
        moveEvent: function(){

            if(H.fu.isUnlocked == true){
                // showTips('您已经解锁过了');
                return false;
            }

            if(H.fu.isRolling){
                return false;
            }
           
            H.fu.isRolling = true;
            H.fu.$fu.css({
                '-webkit-transform' : 'rotate(' + 45 * (H.fu.cur + 1) + 'deg)'
            });
            setTimeout(function(){
                getResult('api/greetingcard/material/unlock', {
                    oi : openid,
                    nn : nickname ? nickname : '',
                    hi : headimgurl ? headimgurl : '',
                    roi : H.fu.roi,
                    mu : H.fu.mu
                }, 'callbackGreetingcardMaterialUnlockHandler', null, null, null, 15000, function(){
                    H.fu.afterGain({us: false });
                });
            }, 2000);
            
        },

        autoRolling: function(){
            setTimeout(function(){
                H.fu.moveEvent();
            }, 500);
        },

        resize: function(){
        	var width = $(window).width();
        	var height = $(window).height();

        	var logoHeightRatio = 69 / 1009;
        	var logoTopRatio = 55 / 1009;

        	var fuHeightRatio = 422 / 1009;
        	var fuTopRatio = 85 / 1009;

        	var joinTopRatio = 875 / 1009;
        	var joinHeightRatio = 75 / 1009;

        	var friendsTopRatio = 52 / 1009;
        	var friendsListMarginRatio = 8 / 640;
        	var friendsListRatio = 118 / 1009;

        	$('.unlock-wrapper').css({
        		'width' : width,
        		'height' : height,
        		'background-size' : width + 'px ' + height + 'px'
        	});

        	$('.logo').css({
        		'height' : logoHeightRatio * height,
        		'top' : logoTopRatio * height
        	});

        	$('.fu-wrapper').css({
        		'padding-top' : fuTopRatio * height,
        	});

        	H.fu.fuSize = fuHeightRatio * height;
        	H.fu.fuX = ( width - H.fu.fuSize ) / 2;
        	H.fu.fuY = fuTopRatio * height;
        	$('.fu').css({
        		'width' : H.fu.fuSize,
        		'height' : H.fu.fuSize
        	});

        	$('.fu-join').css({
        		'top' : joinTopRatio * height,
        		'height' : joinHeightRatio * height
        	});

        	$('.fu-friends').css({
        		'padding-top' : friendsTopRatio * height,
        	});

        	$('.fu-friends li').css({
        		'width' : friendsListRatio * height,
        		'height' : friendsListRatio * height,
        		'line-height' : friendsListRatio * height + 'px',
        		'margin-left' : friendsListMarginRatio * width,
        		'margin-right' : friendsListMarginRatio * width,
        	});

        	$('.fu-friends-list').css({
        		'width' : 4 * friendsListRatio * height + 8 * friendsListMarginRatio * width,
        	});
        }
    };

    W.callbackGreetingcardMaterialGetHandler = function (data){
        hideLoading();
        if(data.result == true){
            H.fu.initFu(data);
        }
    };

    W.callbackGreetingcardMaterialUnlockHandler = function(data){
        if(data.result == true){
            H.fu.afterGain(data);
        }else{
            // FIX ME 解锁失败情况处理
        }
    };

    H.fu.init();

})(Zepto);