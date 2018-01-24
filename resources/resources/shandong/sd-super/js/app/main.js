(function($) {
    H.comment = {
        init: function() {
            var me = this;
            window.CACHESEND = [];
            window.CACHEMSG = [];
            window.CACHEMSGINDEX = 0;
            clearInterval(window.bar);
            window.bar = null;

            window.CACHEMSG.push("超级惊喜提醒您<i>  每周四晚21:20 不见不散~~</i>");
            $('#comments').remove();
            $('.home-box').append('<div class="comments" id="comments"></div>');
            W['barrage'] = $('#comments').barrage();
            W['barrage'].start(1);
            me.flash();
            window.bar = setInterval(function() {me.flash();}, 60e3);
            // window.bar = setInterval(function() {H.comment.init();}, 60e3);
        },
        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/lottery/allrecord" + dev,
                data: {ol:1},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryAllRecordHandler',
                timeout: 3e4,
                success : function(data) {
                    if(data.result){
                        var list = data.rl;
                        if(list && list.length > 0){
                            for(var i = 0 ; i < list.length; i++){
                                barrage.pushMsg((list[i].ni || "匿名用户") + "<i> 中了 " + list[i].pn + "</i>");
                            };
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    clearInterval(window.bar);
                    window.bar = null;
                    $('#comments').remove();
                }
            });
        }
    };

    H.over = {
        even:function(){
            $('body').delegate('.stack li', 'tap', function(e){
                e.preventDefault();
                if ($(this).attr('data-url')) location.href = $(this).attr('data-url');
            });
        },
        nextPrize:function(){
            var me = this;
            getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",true);
            this.even();
        },
        swiperOver: function() {
            var me = this;
            var support = { animations : Modernizr.cssanimations },
                animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
                animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
                onEndAnimation = function( el, callback ) {
                    var onEndCallbackFn = function( ev ) {
                        if( support.animations ) {
                            if(ev.target != this) return;
                            this.removeEventListener( animEndEventName, onEndCallbackFn);
                        }
                        if(callback && typeof callback === 'function') {callback.call();}
                    };
                    if( support.animations ) {
                        el.addEventListener(animEndEventName, onEndCallbackFn);
                    }
                    else {
                        onEndCallbackFn();
                    }
                };
            [].slice.call(document.querySelectorAll('.button--sonar')).forEach(function(el) {
                el.addEventListener("click", function(ev) {
                    if( el.getAttribute('data-state') !== 'locked' ) {
                        classie.add(el, 'button--active');
                        onEndAnimation(el, function() {
                            classie.remove(el, 'button--active');
                        });
                    }
                });
            });

            me.iman = new Stack(document.getElementById('stack_over'), {
                stackItemsAnimation : {
                    duration: 800,
                    type: dynamics.spring
                },
                stackItemsPreAnimation : {
                    accept : {
                        elastic: true,
                        animationProperties: {translateX : 100, translateY : 10, rotateZ: 5},
                        animationSettings: {
                            duration: 100,
                            type: dynamics.easeIn
                        }
                    },
                    reject : {
                        elastic: true,
                        animationProperties: {translateX : -100, translateY : 10, rotateZ: -5},
                        animationSettings: {
                            duration: 100,
                            type: dynamics.easeIn
                        }
                    }
                }
            });
            me.toucha();
        },
        // controls the click ring effect on the button
        buttonClickCallback: function(bttn) {
            var bttn = bttn || this;
            bttn.setAttribute('data-state', 'unlocked');
        },
        toucha: function () {
            var me = this;
            var moveLength = 0,
                isLeft = false,
                deltaX = 0,
                deltaY = 0,
                constx = 0,
                consty = 0;
            var obj = document.querySelector('#stack_over');
            obj.addEventListener("touchstart", function (ts) {
                if (ts.targetTouches.length == 1) {
                    ts.preventDefault();
                    var touch = ts.targetTouches[0];
                }
                constx = touch.pageX;
                consty = touch.pageY;
            });
            obj.addEventListener("touchmove", function (e) {
                e.preventDefault();
                e = e.changedTouches[0];
                deltaX = e.pageX - constx;
                deltaY = e.pageY - consty;
                if(deltaX > 0 && deltaX < 5) {
                    isLeft = false;
                    moveLength = 0;
                } else if (deltaX > 0 && deltaX >= 5) {
                    isLeft = false;
                    moveLength = Math.abs(deltaX);
                }else if(deltaX < 0 && deltaX > -5){
                    isLeft = true;
                    moveLength = 0;
                }else if(deltaX < 0 && deltaX <= -5){
                    isLeft = true;
                    moveLength = Math.abs(deltaX);
                }
                if (moveLength > 0) {
                    if(isLeft){
                        $('.stack__item--current').css('-webkit-transform', 'rotate(-' + (moveLength/320*5) + 'deg) translateX(-' + (moveLength/320*100) + 'px)');
                    }else{
                        $('.stack__item--current').css('-webkit-transform', 'rotate(' + (moveLength/320*5) + 'deg) translateX(' + (moveLength/320*100) + 'px)');
                    }
                }
            });
            obj.addEventListener("touchend", function () {
                if (moveLength > 0) {
                    if(isLeft){
                        me.iman.reject(me.buttonClickCallback.bind(this));
                    }else{
                        me.iman.accept(me.buttonClickCallback.bind(this));
                    }
                    moveLength = 0;
                }
            });
        }
    };

    H.vote = {
        num: 3,
        boxs: [],
        $dom: null,
        init: function () {
            // delData("box");
            this.boxs = JSON.parse(getData("box") || "[]") || [];
            $('.leftbig label').text(this.num - this.boxs.length);
            this.checkbox();
            this.event();
        },
        event: function() {
            var me = this;
            $('.box').click(function(e){
                e.preventDefault();
                if (me.boxs.length >= me.num) {
                    showTips('本轮机会已用光<br>摇奖后还能继续开哦~');
                    return;
                }
                me.$dom = $(this);
                me.luckvote();
            });
        },
        luckvote: function(){
            var me = this, sn = new Date().getTime()+'';
            shownewLoading(null,'宝箱打开中...');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: { matk: matk , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3,6);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        me.fill(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            me.fill(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        me.fill(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime()+'';
                    me.fill(null);
                }
            });
        },
        fill : function(data){
            var me = this;
            hidenewLoading();
            if(data == null || data.result == false || data.pt == 0){
                me.thanks();
                return;
            }
            if(data.pt == 7){
                //卡券
                me.bingo();
                H.dialog.wxcardLottery4vote.open(data);
            }else if(data.pt == 9){
                //外链
                me.bingo();
                H.dialog.linkLottery4vote.open(data);
            }else if(data.pt == 1){
                //实物奖
                me.bingo();
                H.dialog.shiwuLottery4vote.open(data);
            } else {
                me.thanks();
            }
        },
        thanks: function() {
            var me = this;
            hidenewLoading();
            $('.thanks-tips').addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
            }, 1500);
        },
        checkbox: function() {
            for (i in this.boxs) {
                $('.box' + this.boxs[i]).addClass('off');
            };
            $('.ttv').removeAttr('style');
        },
        bingo: function() {
            var me = this;
            this.$dom.addClass('off');
            this.boxs.push(me.$dom.attr('data-box')*1);
            saveData("box", JSON.stringify(me.boxs));
            $('.leftbig label').text(me.num - me.boxs.length);
        }
    };

    H.common = {
        dec:0,
        isLottery:false,
        stretch:93,
        overStretch:70,
        init: function () {
            // 进入页面之后判断抽奖
            this.event();
            H.lottery.init();
            if(is_android()){
                $(".copyright").css({
                    "font-size": "20px",
                    "line-height": "25px"
                });
            } else {
                $(".copyright").css({
                    "font-size": "12px",
                    "line-height": "15px"
                });
            }
        },
        event: function() {
            $('.gold a').click(function(e){
                e.preventDefault();
                var that = this;
                setTimeout(function(){
                    location.href = $(that).attr('data-url');
                }, 150);
            });
        },
        showOver : function(){
            if(this.isLottery) return;
            H.common.showPage($("#over"));
            setTimeout(function(){
                H.over.nextPrize();
            },300);
        },
        showLottery : function(){
            var me = this;
            me.showPage($("#lottery"));
        },
        showVote : function(){
            var me = this;
            H.vote.init();
            me.showPage($("#vote"));
        },
        showPage : function($id){
            var me = this;
            window.CACHESEND = [];
            window.CACHEMSG = [];
            window.CACHEMSGINDEX = 0;

            clearInterval(window.bar);
            window.bar = null;
            $('#comments').remove();
            $(".page").animate({'opacity': '0'},200);
            setTimeout(function(){
                $(".page").addClass("knone");
                $($id).removeClass("knone");
                $($id).animate({'opacity': '1'},200);
                hidenewLoading();
            },200);
        },
        ping: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        var nowTimeStemp = new Date().getTime();
                        H.common.dec = nowTimeStemp - data.t*1;
                    }
                }
            });
        }
    };

    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var t = simpleTpl();
            var items = data.gitems;
            if(items && items.length > 0){
                for(var i = 0;i < items.length;i ++){
                    t._('<li class="stack__item" data-url="' + (items[i].mu || '') + '"><img src="'+items[i].ib+'" alt="下期奖品 '+(i+1)+'" /></li>');
                };
                $("#stack_over").empty().html(t.toString());
                H.over.swiperOver();
            }
        }
    };
})(Zepto);

$(function(){
    shownewLoading();
    H.common.init();
    
    // H.lottery.wxConfig();

    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.lottery.isError){
                    H.lottery.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.lottery.isError = true;
    });
});