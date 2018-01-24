(function ($) {

    H.tangyuan = {
        $dialogWrapper: $('#tangyuan_dialog'),
        $dialog: $('#tangyuan_dialog .dialog'),
        $dialogGet: $('#tangyuan_get_dialog'),
        $dialogCollect: $('#tangyuan_collect_dialog'),
        $count: $('.award-count'),
        $audioWin : $('#audio_win'),
        $btnBox: $(".btn-box a"),
        $petType: $("#pet_type"),
        $btnPlay: $("#what-play"),
        $btnClose: $('#tangyuan_collect_dialog .i-close'),
        $btnOutClose: $('#tangyuan_dialog .btn-horn'),

        $pet : null,
        $type : null,
        $curPet : 0,


        init: function(){
            H.tangyuan.bindBtns();
        },

        show: function(){
            H.tangyuan.$dialogWrapper.removeClass('none');
            H.tangyuan.$dialog.addClass('transparent');
            setTimeout(function(){
                H.tangyuan.$dialog.removeClass('transparent');
                H.tangyuan.$dialog.addClass('bounceInDown');
            },100);

            H.tangyuan.resize();
        },

        showEgg: function(petid){
            H.tangyuan.$petType.addClass('pet'+(parseInt(petid, 10) -1));
            H.tangyuan.$dialogGet.removeClass('none');
        },

        close: function(){
            H.tangyuan.$dialogCollect.addClass('none');
            H.tangyuan.$dialogGet.addClass('none');
            H.tangyuan.$dialog.removeClass('bounceInDown').addClass('bounceOutUp');
            setTimeout(function(){
                H.tangyuan.$dialogWrapper.addClass('none');
                H.tangyuan.$dialog.removeClass('bounceOutUp');
            }, 500);
        },

        bindBtns: function(){
            H.tangyuan.$btnBox.tap(function(){
                var index = $(this).index();
                H.tangyuan.$curPet = index + 1;
                H.tangyuan.$pet = "pet_no" + (index + 1);
                H.tangyuan.$type = "pet" + index;
                
                $(this).removeClass("btn-a-"+index).addClass("btn-b-"+index);

                H.tangyuan.petAdopt();
            });

            H.tangyuan.$btnPlay.removeClass('none').tap(function() {
                H.tangyuan.$dialogCollect.removeClass("none").addClass("zoom-in");
            });

            H.tangyuan.$btnClose.tap(function() {
                H.tangyuan.close();
                H.tangyuan.$dialogCollect.removeClass("zoom-in").addClass("zoom-out");
                setTimeout(function() {
                    H.tangyuan.$dialogCollect.removeClass("zoom-out").addClass("none");
                },500);
            });

            H.tangyuan.$btnOutClose.tap(function(){
                H.tangyuan.close();
            });
        },

        petAdopt: function(){
            getResult('api/pet/thirdadopt', {
                oi : openid,
                pet : H.tangyuan.$pet,
                serviceNo : petServiceNo,
                nn : nickname ? nickname : '',
                hu : headimgurl ? headimgurl : ''
            }, 'callbackApiPetAdopt');
        },

        petHtml: function() {
            H.tangyuan.$petType.addClass(H.tangyuan.$type);
            H.tangyuan.$dialogGet.removeClass('none');
            localStorage.setItem(openid + LS_KEY_PET_ID, H.tangyuan.$curPet);
            H.index.updateTangyuan(H.tangyuan.$curPet);
        },

        resize: function(){
            var height = $(window).height();
            var width = $(window).width();

            H.tangyuan.$dialog.css({
                'background-size': width + 'px ' + height + 'px'
            });

            var yRadiusRatio = 50 / 640;
            var xRadiusRatio = 210 / 640;
            var showcase = jQuery("#showcase")

            showcase.Cloud9Carousel({
                yOrigin: 0,
                yRadius: yRadiusRatio * width / 2,
                xRadius: xRadiusRatio * width,
                autoPlay: 1,
                bringToFront: true
            });
        }

    };

    W.callbackApiPetAdopt = function(data) {
        if(data && data.code == 0) {
            H.tangyuan.petHtml();
        }else{
            showTips('大家太热情啦，请稍后重试');
        }
    };

    H.tangyuan.init();

})(Zepto);