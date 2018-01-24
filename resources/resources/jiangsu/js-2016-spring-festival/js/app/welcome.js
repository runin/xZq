(function ($) {

    H.welcome = {
        $dialogWrapper: $('#welcome_dialog'),
        $dialog: $('#welcome_dialog .dialog'),
        $bg: $('#welcome_dialog .welcome-dialog-bg'),
        $btnOk: $('#welcome_dialog .welcome-btn'),
    	fanStep: 0,

        init: function () {
            H.welcome.resize();
            H.welcome.bindBtn();
            
            var pv = localStorage.getItem(openid + LS_KEY_FIRST_VISIT_PV_PREFIX);
            if(!pv){
                getResult('api/common/servicepv', null, 'commonApiSPVHander'); 
            }else{
                H.welcome.allBeigin();
            }
        },

        allBeigin: function(){
            H.welcome.initShare();
            H.card.beginCountdown();
            H.zhibo.init();

            getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler', null, null, null, 15000, function(){
                H.countdown.end();
                $('.bar-tips-dialog p').text('距下轮摇奖开始还有5分钟');
            });
        },

        openFan: function(){
        	if(H.welcome.fanStep + 1 < 8){
        		$('#welcome_dialog .welcome-fan').removeClass('s' + H.welcome.fanStep);
        		H.welcome.fanStep ++;
        		$('#welcome_dialog .welcome-fan').addClass('s' + H.welcome.fanStep);
	        	setTimeout(function(){
	        		H.welcome.openFan();
	        	}, 100);
	        }
        },

        initShare: function(){
            var pv = localStorage.getItem(openid + LS_KEY_FIRST_VISIT_PV_PREFIX);
            H.share.commonShare(pv);
        },

        bindBtn: function(){
            H.welcome.$btnOk.tap(function(){
                H.welcome.$dialog.removeClass('bounceInDown').addClass('bounceOutUp');
                H.welcome.$bg.removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    H.welcome.$dialogWrapper.addClass('none');
                    H.welcome.$bg.removeClass('bounceOutUp');
                    H.welcome.$dialog.removeClass('bounceOutUp');

                    H.welcome.allBeigin();
                }, 500);
            });
        },

        show: function(data){
            if(data.c >= 0){
                localStorage.setItem(openid + LS_KEY_FIRST_VISIT_PV_PREFIX, data.c);
                $('#welcome_dialog .gold').text(data.c);
                H.welcome.$dialogWrapper.removeClass('none');
                H.welcome.$dialog.addClass('transparent');
                H.welcome.$bg.addClass('transparent');
                setTimeout(function(){
                    H.welcome.$dialog.removeClass('transparent');
                    H.welcome.$dialog.addClass('bounceInDown');
                    H.welcome.$bg.removeClass('transparent');
                    H.welcome.$bg.addClass('bounceInDown');
                },100);
                H.welcome.initShare();
            }
        },

        resize: function(){
        	var width = $(window).width();
        	var height = $(window).height();
            var welcomeTopRatio = 640 / 730;
        	var welcomeWidthRatio = 640 / 606;
        	var welcomeHeightRatio = 640 / 723;
        	var fanTopRatio = 723 / 88;
        	var fanWidthRatio = 640 / 425;
        	var fanHeightRatio = 640 / 259;

            var btnWidthRatio = 640 / 238;
            var btnHeightRatio = 640 / 69;
            var btnTopRatio = 723 / 595;

        	var welcomeWidth = width / welcomeWidthRatio;
        	var welcomeHeight = width / welcomeHeightRatio;

        	var fanWidth = width / fanWidthRatio;
        	var fanHeight = width / fanHeightRatio;

            var btnWidth = width / btnWidthRatio;
            var btnHeight = width / btnHeightRatio;

        	$('#welcome_dialog .dialog').css({
        		'width' : welcomeWidth,
        		'height' : welcomeHeight,
        		'background-size': welcomeWidth + 'px ' + welcomeHeight + 'px',
                'top' : ( height - welcomeHeight / welcomeTopRatio ) / 2
        	});

            $('#welcome_dialog .welcome-dialog-bg').css({
                'top' : ( height - welcomeHeight / welcomeTopRatio ) / 2,
                'width' : welcomeWidth,
                'height' : welcomeHeight / 2,
                'background-size': welcomeWidth + 'px ' + welcomeHeight / 2 + 'px'
            });

        	$('#welcome_dialog .welcome-fan').css({
        		'width' : fanWidth,
        		'height' : fanHeight,
        		'top' : welcomeHeight / fanTopRatio,
        		'left' : ( width - fanWidth ) / 2,
        		'background-size': fanWidth + 'px ' + fanHeight + 'px'
        	});

            $('#welcome_dialog .welcome-btn').css({
                'width' : btnWidth,
                'height' : btnHeight,
                'top' : welcomeHeight / btnTopRatio,
                'left' : ( width - btnWidth ) / 2,
                'background-size': btnWidth + 'px ' + btnHeight + 'px'
            });

            var textTop = ( welcomeHeight / fanTopRatio + fanHeight );
            var textHeight = welcomeHeight / btnTopRatio - textTop;
            $('#welcome_dialog .welcome-text').css({
                'width' : fanWidth,
                'height' : textHeight,
                'top' : textTop,
                'left' : ( width - fanWidth ) / 2,
                'padding-top' :  ( textHeight - 42 ) / 2
            });
        	
        }
    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0){
            H.welcome.show(data);
        }
    };

})(Zepto);