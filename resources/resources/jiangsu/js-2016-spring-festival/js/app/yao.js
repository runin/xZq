(function ($) {

    H.yao = {
        $bg : $('.yao-wrapper'),
        $coverTop : $('#cover_top'),
        $coverBottom : $('#cover_bottom'),
        $audioWin : $('#audio_win'),
        $audioShake : $('#audio_shake'),
        
        // 背景图长宽比
        bgRatio : 320 / 200,
        bgHeight : 0,
        shakeEvent: null,
        bgArgs: null,
        isReturned : true,

        randMin: 1,
        randMax: 2,
        yaoran: 0,
        yaotime: 0,

        isLiukong: false,


        init: function(){
            this.resize();
            this.initShake();
            this.bindBtn();
            if(H.countdown.roundData[H.countdown.currentRound] && H.countdown.roundData[H.countdown.currentRound].bi){
                this.bgArgs = H.countdown.roundData[H.countdown.currentRound].bi.split(',');
                preloadimages(this.bgArgs); 
            }
            this.randomBg();

            H.yao.yaoran = H.yao.randMin + Math.round(Math.random() * ( H.yao.randMax - H.yao.randMin ));
        },

        luckCallback: function(data){
            H.award.show(data, 'yao');
        },

        randomBg: function(){
            if(this.bgArgs && this.bgArgs.length > 0){
                this.bgArgs = H.countdown.roundData[H.countdown.currentRound].bi.split(',');
                var rand = Math.floor(Math.random() * this.bgArgs.length);
                if(this.bgArgs[rand] == ""){
                    this.$bg.css('background-image','url("./images/bg-yao-default.jpg")');
                }else{
                    this.$bg.css('background-image','url(' + this.bgArgs[rand] + ')');  
                }
            }else{
                this.$bg.css('background-image','url("./images/bg-yao-default.jpg")');
            }
        },

        initShake: function(){
            this.shakeEvent = new Shake({
                threshold: 4,
                timeout: 1300
            });
            W.addEventListener('shake',shakeOccur, false);

            // FIX ME 待删除
            this.shakeEvent.start();
        },

        bindBtn: function(){
            $('#btn_back_index').tap(function(){
                H.router.slideTo('index');
                return false;
            });
        },

        liuKong: function(){
            var liukong = Math.ceil(Math.random() * (30 - 10)) + 10;
            H.yao.isLiukong = true;
            setTimeout(function(){
                H.yao.isLiukong = false;
            }, liukong * 1000);
        },

        resize: function(){
            var width = $(window).width();
        	var height = $(window).height();
        	var topRatio = 380 / 1009;
        	var bottomRatio = 629 / 1009;
            var bottomHeight = height * bottomRatio + 1;
            var countDownTextRatio = 63 / 85;
            var countDownTextSperRatio = 10 / 640;

            var countDownContentHeightRatio = 223 / 629;
            var countDownContentTopRatio = 217 / 629;
            var countDownRatio = 86 / 629;
            var countDownMinWidthRatio = 44 / 640;
            var countDownMinRatio = 44 / 53;

            

        	$('#cover_top').css({
        		height : height * topRatio
        	});

        	$('#cover_bottom').css({
        		height : bottomHeight
        	});

            this.bgHeight = width / this.bgRatio;
            this.$bg.css({
                'background-position-y' : height * topRatio - this.bgHeight / 2,
                'background-size' : width + 'px ' + this.bgHeight + 'px'
            }).removeClass('none');

            var countDownHeight = bottomHeight * countDownContentHeightRatio;
            $('.count-down-wrapper').css({
                'top' : bottomHeight * countDownContentTopRatio,
                'height' : countDownHeight,
            });

            var timeHeight = bottomHeight * countDownRatio;
            var timeWidth = timeHeight * countDownTextRatio;
            $('.count-down-wrapper .count-down-time').css({
                'height' : timeHeight
            });
            $('.count-down-wrapper .count-down-time .count-down-num').css({
                'width' : timeWidth,
                'height' : timeHeight,
                'line-height' : timeHeight + 'px'
            });
            $('.count-down-wrapper .count-down-time .count-down-space').css({
                'width' : width * countDownTextSperRatio
            });

            var countMinHeight = countDownMinWidthRatio * width / countDownMinRatio;
            $('.count-down-wrapper .count-down-time .count-down-min').css({
                'width' : countDownMinWidthRatio * width,
                'height' : countMinHeight,
                'line-height' : countMinHeight + 'px',
                'padding-top' : countDownMinWidthRatio * width / countDownMinRatio - countDownMinWidthRatio * width - 2,
                'bottom' : -1 * countDownMinWidthRatio * width / countDownMinRatio,
                'left' : -1 * countDownMinWidthRatio * width / 2
            });
            $('.count-down-wrapper .count-down-time').css({
                'width' : (timeWidth + 2) * 6 + width * countDownTextSperRatio * 2
            });

            var h2Height = countDownHeight - timeHeight - countMinHeight;
            $('.count-down-wrapper h2').css({
                'height' : h2Height,
                'line-height' : h2Height + 'px'
            });
        }
    };


    W.shakeOccur = function(){

        if(H.router.curSlide == 'index'){
            return false;
        }

        var hasDialog = false;
        $('.dialog-wrapper').each(function(){
            if(!$(this).hasClass('none')){
                hasDialog = true;
            }
        });
        if(hasDialog){
            return false;
        }
        

        H.yao.$audioShake[0].play();
        H.yao.yaotime++;

        var heightMove = H.yao.bgHeight / 2 - 2;
        borderWidth = '0';
        borderColor = 'transparent';

         H.yao.$coverTop.css({
            '-webkit-transform': 'translate(0px,-'+heightMove+'px)',
            'border-bottom' : borderColor + ' ' + borderWidth  + 'px solid',
            'box-shadow' : '0px 1px 10px #44241A'
         });

         H.yao.$coverBottom.css({
            '-webkit-transform': 'translate(0px,'+heightMove+'px)',
            'border-top' : borderColor + ' ' + borderWidth + 'px solid',
            'box-shadow' : '0px 1px 10px #44241A'
         });

        setTimeout(function(){

             H.yao.$coverTop.css({
                '-webkit-transform': 'translate(0px,0px)',
             });

             H.yao.$coverBottom.css({
                '-webkit-transform': 'translate(0px,0px)',
             });

             setTimeout(function(){

                 H.yao.$coverTop.css({
                    'border-width' : '0px',
                    'box-shadow' : 'none'
                 });

                 H.yao.$coverBottom.css({
                    'border-width' : '0px',
                    'box-shadow' : 'none'
                 });

                 H.yao.randomBg();

                 if(H.yao.isLiukong){
                    H.nothing.showTips();
                    return;
                 }

                 if(H.yao.yaotime % H.yao.yaoran == 0){
                    H.yao.yaoran = H.yao.randMin + Math.round(Math.random() * ( H.yao.randMax - H.yao.randMin ));
                    H.yao.yaotime = 0;
                     if(H.yao.isReturned == true){
                        H.yao.isReturned = false;
                        getResult('api/lottery/luck',{
                            oi: openid
                        },'callbackLotteryLuckHandler', null, null, null, 15000, function(){
                            H.yao.isReturned = true;
                            H.yao.liuKong();
                        });
                    }
                }else{
                    H.nothing.showTips();
                }

             }, 150);

        },1100);
        
    };

    W.callbackLotteryLuckHandler = function(data){
        H.yao.isReturned = true;
        if(data.result == true){
            H.yao.luckCallback(data);
        }else if(data.flow && data.flow == 1){
            H.yao.liuKong();
        }else{
            H.nothing.showTips();
        }
    };


})(Zepto);