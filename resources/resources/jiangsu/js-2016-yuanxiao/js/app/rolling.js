(function ($) {

    H.rolling = {
        $open: $('#to_rolling'),
        $close: $('#rolling_close'),
        $wrapper: $('#rolling'),
        $dialog: $('#rolling .dialog'),
        $rollingText: $('#rolling_text'),
        $rollingNum: $('#rolling_num'),
        $tips: $('#rolling .tips'),
        $rouletteWrapper: $('#rolling .roulette-wrapper'),
        $gold: $('#gold'),
        $goldCost: $('.gold-cost'),

        rotateDuration: 5 * 1000,
        rotateNum: 10,

        $bg : $('.roulette-wrapper'),
        $btn: $('.roulette-wrapper .roulette-btn'),
        $arrow: $('.roulette-wrapper .roulette-needle-start'),
        $arrow2: $('.roulette-wrapper .roulette-needle-end'),
        $audioWin : $('#audio_win'),
        isFinished : true,
        luckData: null,
        lostData: null,
        laestDeg: 0,

        awardData: null,
        myGold: 0,

        init: function(){
            this.resize();
            this.bindBtns();
            this.initAwardData();
        },

        fillGold: function(data){
            H.rolling.$gold.text(data.gold + '枚');
            H.rolling.myGold = parseInt(data.gold, 10);
            if(parseInt(data.gold, 10) >= W.rollingCost){
                H.rolling.$btn.removeClass('disabled');
            }else{
                H.rolling.$btn.addClass('disabled');
            }
        },

        toStart: function(timeleft){
            H.rolling.$rollingText.text('距下轮抽奖开始还有');
            H.rolling.$rollingNum.html(showTime(timeleft, "%H%:%M%:%S%"));
            H.rolling.$btn.addClass('starting');
        },

        begin: function(timeleft){
            H.rolling.$rollingText.text('距本轮抽奖结束还有');
            H.rolling.$rollingNum.html(showTime(timeleft, "%H%:%M%:%S%"));
            H.rolling.$btn.removeClass('starting');
        },

        allEnd: function(){
            H.rolling.$rollingText.text('本期抽奖结束了');
            H.rolling.$rollingNum.html('祝您元宵快乐');
            H.rolling.$btn.addClass('end');
        },

        roundError: function(){
            H.rolling.$rollingText.text('本轮抽奖准备中');
            H.rolling.$rollingNum.html('请稍后');
            H.rolling.$btn.addClass('starting');
        },

        bindBtns: function(){
            H.rolling.$open.tap(function(){
                H.rolling.$wrapper.removeClass('none');
                H.rolling.$dialog.addClass('transparent');
                setTimeout(function(){
                    H.rolling.$dialog.removeClass('transparent');
                    H.rolling.$dialog.addClass('bounceInUp');
                },100);
            });

            H.rolling.$close.tap(function(){
                H.rolling.$wrapper.find('.dialog').removeClass('bounceInUp').addClass('bounceOutDown');
                setTimeout(function(){
                    H.rolling.$wrapper.addClass('none');
                    H.rolling.$wrapper.find('.dialog').removeClass('bounceOutDown');
                }, 500);
            });

            H.rolling.$btn.click(function(){
                if($(this).hasClass('roll')){
                    return false;
                }else if($(this).hasClass('disabled')){
                    showTips('您的金币还不够，赶紧参加游戏赢取吧');
                }else if($(this).hasClass('starting')){
                    showTips('该轮抽奖还没开始哦');
                }else if($(this).hasClass('end')){
                    showTips('本期抽奖结束了');
                }else{
                    
                    H.rolling.myGold = H.rolling.myGold - W.rollingCost;
                    if(H.rolling.myGold < 0){
                        H.rolling.myGold = 0;
                        showTips('您的金币还不够，赶紧参加游戏赢取吧');
                        return false;
                    }

                    $(this).addClass('roll');
                    H.rolling.$gold.text(H.rolling.myGold + '枚');
                    H.rolling.$goldCost.removeClass('none').addClass('gold_cost');
                    setTimeout(function(){
                        H.rolling.$goldCost.addClass('none').removeClass('gold_cost');
                    }, 800);

                    showLoading(null, '幸运降临中');
                    getResult('api/lottery/luck4Pet',{
                        oi: openid
                    },'callbackLotteryLuck4PetHandler',null, null, null, null, function(){
                        hideLoading();
                        H.rolling.luckCallback({result: false});
                    });
                }
            });
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

            var contentHeight = height * 0.88 * 0.15;
            var tipsHeight = height * 0.88 * 0.05;

            H.rolling.$rollingText.css({
                'padding': contentHeight * 1 / 12 + 'px 0px',
                'line-height': contentHeight * 1 / 3 + 'px'
            });
            H.rolling.$rollingNum.css({
                'line-height': contentHeight * 1 / 3 + 'px'
            });
            H.rolling.$tips.css({
                'line-height': tipsHeight + 'px'
            });

            var rouletteSize = 0;
            if(height * 0.88 * 0.65 > width * 0.86){
                rouletteSize = width * 0.86;
            }else{
                rouletteSize = height * 0.88 * 0.65;
            }

            H.rolling.$rouletteWrapper.css({
                'width' : rouletteSize,
                'height': rouletteSize
            });
        },


        luckCallback: function(data){
            H.rolling.luckData = data; 
            var deg = H.rolling.getLuckDeg();
            H.rolling.arrowRotateTo(deg);
        },

        getLuckDeg: function(){
            var data = H.rolling.luckData;
            var awrad = H.rolling.awardData;
            if(data.result == false){
                // 谢谢参与
                return H.rolling.getLuckNothingDeg();
            }

            var name = data.pd;
            for(var i in awrad){
                if(awrad[i].name.length > 0){
                    var reg = new RegExp(awrad[i].name,'g');
                    if(reg.test(name)){
                        return H.rolling.randDeg(awrad[i].st, awrad[i].et);
                    }
                }
            }
            return H.rolling.getLuckNothingDeg();
        },

        arrowRotateTo: function(deg) {
            var dest = deg + (360 * H.rolling.rotateNum);

            $.keyframe.define({
                name: 'roulette-rotate',
                from: {
                    transform: 'rotate(0deg)'
                },
                to: {
                    transform: 'rotate(' + dest + 'deg)'
                }
            });

            H.rolling.$arrow.playKeyframe({
                name: 'roulette-rotate',
                duration: H.rolling.rotateDuration,
                timingFunction: 'cubic-bezier(.2,0,.4,1.05)',
                complete: function () {
                    H.rolling.endRoulette();
                }
            });

            H.rolling.laestDeg = deg;

        },

        initAwardData: function(){
            H.rolling.awardData = [];
            H.rolling.lostData = [];
            var award = [
                {
                    'st':'transform: rotate(0deg);',
                    'et':'transform: rotate(60deg);',
                    'name':'零食',
                    'lost':false
                },{
                    'st':'transform: rotate(60deg);',
                    'et':'transform: rotate(120deg);',
                    'name':'名表',
                    'lost':false
                },{
                    'st':'transform: rotate(120deg);',
                    'et':'transform: rotate(180deg);',
                    'name':'美肤',
                    'lost':false
                },{
                    'st':'transform: rotate(180deg);',
                    'et':'transform: rotate(240deg);',
                    'name':'谢谢参与',
                    'lost':true
                },{
                    'st':'transform: rotate(240deg);',
                    'et':'transform: rotate(300deg);',
                    'name':'滴滴',
                    'lost':false
                },{
                    'st':'transform: rotate(300deg);',
                    'et':'transform: rotate(360deg);',
                    'name':'包包',
                    'lost':false
                }
            ];
            if(award && award.length > 0){
                for(var i in award){
                    if(award[i].lost == true){
                        H.rolling.lostData.push({
                            name : award[i].name,
                            st: H.rolling.parseRotate2Float(award[i].st),
                            et: H.rolling.parseRotate2Float(award[i].et)
                        });
                    }else{
                        H.rolling.awardData.push({
                            name : award[i].name,
                            st: H.rolling.parseRotate2Float(award[i].st),
                            et: H.rolling.parseRotate2Float(award[i].et)
                        });
                    }
                }
            }
        },

        parseRotate2Float: function(rotateStr){
            var args = /rotate\((.*?)deg\)/.exec(rotateStr)
            if(args && args.length > 1){
                return parseFloat(args[1]);
            }else{
                return 0;
            }
        },

        randDeg: function(st, et){
            return st + Math.random() * (et - st);
        },

        getLuckNothingDeg: function(){
            var lostData = H.rolling.lostData;

            if(lostData.length > 0){
                var i = Math.floor( Math.random() * lostData.length );
                return H.rolling.randDeg(lostData[i].st, lostData[i].et);
            }else{
                return 0;   
            }
        },
        
        endRoulette: function(){
            var data = H.rolling.luckData;
            var handled = false;

            H.award.show(data, 'index');

            if(data.result == false){
                setTimeout(function(){
                    H.rolling.reset();
                }, 2000);
                return;
            }
            

            setTimeout(function(){
                H.rolling.reset();
            }, 2000);
            

        },

        reset: function(){

            $.keyframe.define({
                name: 'roulette-reset',
                from: {
                    transform: 'rotate('+H.rolling.laestDeg+'deg)'
                },
                to: {
                    transform: 'rotate(0deg)'
                }
            });

            H.rolling.$arrow.playKeyframe({
                name: 'roulette-reset',
                duration: 500,
                timingFunction: 'ease',
                complete: function () {
                    H.rolling.$btn.removeClass('roll');
                    H.rolling.$arrow.css('transform', 'none');
                    H.rolling.$arrow.css('animation', 'none');
                }
            });
        },

    };

    W.callbackLotteryLuck4PetHandler = function(data){
        hideLoading();
        H.rolling.luckCallback(data);
    };

    W.callbackApiPetGetgold = function(data){
        if(data.code == 0){
            H.rolling.fillGold(data);
        }
    }

    H.rolling.init();
    
})(Zepto);

