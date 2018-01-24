(function ($) {

    H.cardView = {
        $dialogBigWrapper : $('#card_view_dialog_big'),
        $dialogSmallWrapper : $('#card_view_dialog_small'),
        $dialogBig : $('#card_view_dialog_big .dialog'),
        $dialogSmall : $('#card_view_dialog_small .dialog'),
        $videoSmall : $('#card_view_dialog_small .video-wrapper'),
        $videoBig : $('#card_view_dialog_big .video-wrapper'),

        $titleBig: $('#card_view_dialog_big .card-title'),
        $actorBig: $('#card_view_dialog_big .card-text'),
        $friendLi: $('#card_view_dialog_big .card-friend-list ul li img'),
        
        

        $actorSmall: $('#card_view_dialog_small .card-text'),
        $titleSmall: $('#card_view_dialog_small .card-title'),

        $btnBigClose : $('#card_view_dialog_big .btn-close'),
        $btnSmallClose : $('#card_view_dialog_small .btn-close'),

        $btnMakeBig : $('#card_big_make_btn'),
        $btnMakeSmall : $('#card_small_make_btn'),

        cardData : null,

        init: function(){
            this.bindBtns();
        },

        show: function(data){
            H.cardView.cardData = data;
            
            if(data.fl){
                for(var i in data.fl){
                    H.cardView.$friendLi.eq(i).attr('src',data.fl[i].hi ? data.fl[i].hi : './images/avatar.jpg');
                }

                H.cardView.$titleBig.text(data.tt);
                H.cardView.$actorBig.text(data.ct);
                H.cardView.$dialogBigWrapper.removeClass('none');
                H.cardView.$dialogBig.addClass('transparent');

                setTimeout(function(){
                    H.cardView.$dialogBig.removeClass('transparent');
                    var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                    H.cardView.$dialogBig.playKeyframe({
                        name: 'bigcard-'+index+'-open',
                        duration: 300,
                        timingFunction: 'ease',
                        complete: function(){
                            
                        }
                    });
                },100);

                H.card.initVideoEvents(data.cd, data.ulli ,H.cardView.$videoBig);
            }else{
                
                H.cardView.$titleSmall.text(data.tt);
                H.cardView.$actorSmall.text(data.ct);
                H.cardView.$dialogSmallWrapper.removeClass('none');
                H.cardView.$dialogSmall.addClass('transparent');

                setTimeout(function(){
                    H.cardView.$dialogSmall.removeClass('transparent');
                    var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                    H.cardView.$dialogSmall.playKeyframe({
                        name: 'smallcard-'+index+'-open',
                        duration: 300,
                        timingFunction: 'ease',
                        complete: function(){
                            
                        }
                    });
                },100);

                H.card.initVideoEvents(data.cd, data.ulli, H.cardView.$videoSmall);
            }
        },

        showLiukong: function(index){
            H.cardView.show(H.card.cardData.ml[index]);
        },

        bindBtns: function(){
            H.cardView.$btnBigClose.tap(function(){
                var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                H.cardView.$dialogBig.playKeyframe({
                    name: 'smallcard-'+index+'-close',
                    duration: 300,
                    timingFunction: 'ease',
                    complete: function () {
                        H.card.closeVideo(H.cardView.$videoBig);
                        setTimeout(function(){
                            H.cardView.$dialogBigWrapper.addClass('none');  
                            H.cardView.$dialogBig.css({
                                '-webkit-animation':'none',
                                'animation':'none'
                            });  
                        }, 100);
                    }
                });
            });

            H.cardView.$btnSmallClose.tap(function(){

                var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                H.cardView.$dialogSmall.playKeyframe({
                    name: 'smallcard-'+index+'-close',
                    duration: 300,
                    timingFunction: 'ease',
                    complete: function () {
                        H.card.closeVideo(H.cardView.$videoSmall);
                        setTimeout(function(){
                            H.cardView.$dialogSmallWrapper.addClass('none'); 
                            H.cardView.$dialogSmall.css({
                                '-webkit-animation':'none',
                                'animation':'none'
                            });  
                        }, 100);
                    }
                });

            });

            H.cardView.$btnMakeBig.tap(function(){
                H.cardView.$dialogBigWrapper.addClass('none');
                H.cardView.$dialogBig.css({
                    '-webkit-animation':'none',
                    'animation':'none'
                });

                H.cardSend.show(H.cardView.cardData);
                
                H.card.closeVideo(H.cardView.$videoBig);
            });

            H.cardView.$btnMakeSmall.tap(function(){
                H.cardView.$dialogSmallWrapper.addClass('none');
                H.cardView.$dialogSmall.css({
                    '-webkit-animation':'none',
                    'animation':'none'
                });
                H.cardSend.show(H.cardView.cardData);

                H.card.closeVideo(H.cardView.$videoSmall);
            });

        },

        resize : function(width, bigDialogHeight, smallDialogHeight, videoTop, videoHeight){

            var bigBtnTopRatio = 742 / 864;
            var bigBtnHeightRatio = 71 / 864
            var bigFriendWidthRatio = 470 / 640;

            var smallBtnTopRatio = 560 / 702;
            var smallBtnHeightRatio = 71 / 702;

            $('#card_view_dialog_big .card-make-btn').css({
                'top' : bigDialogHeight * bigBtnTopRatio,
                'height' : bigDialogHeight * bigBtnHeightRatio
            });
            $('#card_view_dialog_big .card-friend-list ul').css({
                'width' : width * bigFriendWidthRatio
            });
            $('#card_view_dialog_big .card-friend-list ul li').css({
                'width' : width * bigFriendWidthRatio / 4 - 4,
                'height': width * bigFriendWidthRatio / 4 - 4
            });
            $('#card_view_dialog_small .card-make-btn').css({
                'top' : smallDialogHeight * smallBtnTopRatio,
                'height' : smallDialogHeight * smallBtnHeightRatio
            });

            var leftHeightBig = bigDialogHeight * bigBtnTopRatio -  videoTop - videoHeight - (width * bigFriendWidthRatio / 4 - 4) - 50;
            $('#card_view_dialog_big .card-title').css({
                'height' : leftHeightBig / 2 - 12,
                'line-height' : leftHeightBig / 2 - 12 + 'px',
                'margin' : '8px 0 4px'
            });
            $('#card_view_dialog_big .card-text').css({
                'height' : leftHeightBig / 2 - 12,
                'line-height' : leftHeightBig / 2 - 12 + 'px',
                'margin' : '4px 0 8px'
            });

            var leftHeightSmall = smallDialogHeight * smallBtnTopRatio -  videoTop - videoHeight -  20;
            $('#card_view_dialog_small .card-title').css({
                'height' : leftHeightSmall / 2 - 12,
                'line-height' : leftHeightSmall / 2 - 12 + 'px',
                'margin' : '8px 0 4px'
            });
            $('#card_view_dialog_small .card-text').css({
                'height' : leftHeightSmall / 2 - 12,
                'line-height' : leftHeightSmall / 2 - 12 + 'px',
                'margin' : '4px 0 8px'
            });

        }
    };

    H.cardView.init();

})(Zepto);