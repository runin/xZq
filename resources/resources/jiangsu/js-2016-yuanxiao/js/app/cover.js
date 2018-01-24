(function ($) {

    H.cover = {
        $door: $('#door'),
        $cover: $('#cover'),
        $kuang: $('#door .door-kuang'),
        $cloud: $('#cloud'),
        $left: $('.left-door'),
        $right: $('.right-door'),
        $coverBtn: $('#cover_btn'),
        $coverContent: $('#cover .cover-content'),
        $touch: $('#touch'),
        
        init: function(){
            var cf = getQueryString('cf');
            if(!cf){
                this.resize();
                this.runAnimate();
                this.bindBtns();

                this.$door.removeClass('none');
                this.$cover.removeClass('none');
            }

            $('#main').removeClass('none');

            var isAccepted = localStorage.getItem(LS_KEY_IS_ACCPECTED_50 + openid);
            if(!isAccepted){
                getResult('api/pet/lqgold', {
                    oi: openid,
                    gd: 50
                }, 'callbackApiPetLqgold');
            }else{
                // getResult('api/pet/getgold', {oi: openid}, 'callbackApiPetGetgold');
            }
        },

        toCover: function(){
            H.cover.$touch.addClass('none');

            if(isAndroid){
                H.cover.$door.addClass('none');
                H.cover.$coverContent.addClass('scaleIn');    
            }else{
                H.cover.$door.addClass('big');    
                setTimeout(function(){
                    H.cover.$door.addClass('open');
                    H.cover.$cover.addClass('moving');
                    setTimeout(function(){
                        H.cover.$door.addClass('fadeOut');
                        H.cover.$coverContent.addClass('scaleIn');
                        setTimeout(function(){
                            H.cover.$door.addClass('none');
                        }, 1000);
                    }, 1000);
                }, 1500);
            }
        },

        bindBtns: function(){
            H.cover.$cloud.tap(function(){
                H.cover.toCover();
            });

            H.cover.$kuang.tap(function(){
                H.cover.toCover();
            });

            H.cover.$coverBtn.tap(function(){
                H.cover.$cover.addClass('none');
            });
        },

        runAnimate: function(){
            setTimeout(function(){
                H.cover.$door.addClass('moving');
            }, 100);
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();
            $('body').css({
                width: width,
                height: height
            });

            this.$coverBtn.css({
                'line-height': height * 0.08 + 'px'
            });
        }
    };

    W.callbackApiPetLqgold = function(data){
        // getResult('api/pet/getgold', {oi: openid}, 'callbackApiPetGetgold');

        if(data.code == 0){
            localStorage.setItem(LS_KEY_IS_ACCPECTED_50 + openid, true);
            $('.cover-tips').removeClass('none');
        }
    }

    H.cover.init();
    
})(Zepto);