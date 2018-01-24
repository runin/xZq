(function ($) {

    H.yao = {
        $main: $('#main'),
        $text: $('#text'),
        $num: $('#num'),
        $audioWin : $('#audio_win'),
        $audioShake : $('#audio_shake'),
        $yao: $('#yao'),

        $tangyuan: $('.tangyuan'),

        shakeEvent: null,

        bgArgs: null,
        isReturned : true,
        canShake: false,

        init: function(){
            this.resize();
            this.bindBtns();
        },

        initShake: function(){
            H.yao.shakeEvent = new Shake({
                threshold: 8,
                timeout: 1000
            });
            H.yao.shakeEvent.start();
            W.addEventListener('shake',shakeOccur, false);
        },

        bindBtns: function(){
            
        },

        toStart: function(timeleft){
            H.yao.canShake = false;
            H.yao.$text.text('距下轮抽奖开始还有');
            H.yao.$num.html(showTime(timeleft, "%H%:%M%:%S%"));
        },

        begin: function(timeleft){
            H.yao.canShake = true;
            H.yao.$text.text('距本轮抽奖结束还有');
            H.yao.$num.html(showTime(timeleft, "%H%:%M%:%S%"));
        },

        allEnd: function(){
            H.yao.canShake = false;
            H.yao.$text.text('本期抽奖结束了');
            H.yao.$num.html('祝您元宵快乐');
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

            H.yao.$main.css({
                'width': width,
                'height': height
            });

            var contentHeight = height * 0.18;
            H.yao.$text.css({
                'padding-top': contentHeight * 1 / 12 + 'px',
                'line-height': contentHeight * 1 / 3 + 'px'
            });
            H.yao.$num.css({
                'line-height': contentHeight * 1 / 3 + 'px'
            });
            
        }

    };

    W.shakeOccur = function(){

        var hasDialog = false;
        $('.dialog-wrapper').each(function(){
            if(!$(this).hasClass('none')){
                hasDialog = true;
            }
        });
        if(hasDialog){
            return false;
        }

        if(H.yao.canShake == false){
            return false;
        }
        

        H.yao.$audioShake[0].play();
        H.yao.$yao.addClass('dh-wobble');
        
        var randTangyuan = Math.floor(Math.random() * 3);
        var randAnimate = Math.floor(Math.random() * 4);
        H.yao.$tangyuan.addClass('click-' + randAnimate);

        setTimeout(function(){
            H.yao.$yao.removeClass('dh-wobble');
            H.yao.$tangyuan.removeClass('click-' + randAnimate);
            if(H.yao.isReturned == true){
                H.yao.isReturned = false;
                getResult('api/lottery/exec/luck',{
                    matk: matk
                },'callbackLotteryLuckHandler', null, null, null, null, function(){
                    H.yao.isReturned = true;
                    H.award.show({result: 'false'}, 'yao');
                });
            }

        },1100);
        
    };

    W.callbackLotteryLuckHandler = function(data){
        H.yao.isReturned = true;
        H.award.show(data, 'yao');
    }

    H.yao.init();
    
})(Zepto);