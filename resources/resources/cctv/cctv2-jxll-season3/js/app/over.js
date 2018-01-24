/**
 * Created by Chris on 2015/12/9.
 */
(function($) {
    H.over = {
        even:function(){
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
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var t = simpleTpl();
            var items = data.gitems;
            if(items && items.length > 0){
                for(var i = 0;i < items.length;i ++){
                    t._('<li class="stack__item"><img src="'+items[i].ib+'" alt="下期奖品 '+(i+1)+'" /></li>');
                }
                $("#stack_over").empty().html(t.toString());
                H.over.swiperOver();
            }
        }
    };
})(Zepto);