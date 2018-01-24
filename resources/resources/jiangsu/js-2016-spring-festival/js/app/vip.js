(function ($) {

  H.vip = {
    $dialogWrapper : $('#vip_dialog'),
    $dialog : $('#vip_dialog .dialog'),
    $btnClose : $('#vip_dialog .btn-close'),
    $content : $('#vip_dialog .vip-container'),
    $btnOpen : $('#btn_door'),
    $btnClose: $('#vip_dialog .vip-close'),
    $btnStart: $('#vip_dialog .vip-start'),

    $carousel : $('#carousel'),
    $tmplPrize: $('#tmpl_vip_prize'),
    $navButtons : $('#navigation button'),
    $percent: $('#btn_door_cover'),
    panelCount : 9,
    theta : 0,
    translateZ : 0,
    stopAuto: true,
    isReturn: true,
    autoTimeout: null,

    isLiukong: false,

    init: function(){
      H.vip.resize();
      getResult('api/lottery/round4callback',{
        at : 9
      }, 'callbackVipLotteryRoundHandler');
    },

    initPrizes: function(data){
      getResult('api/lottery/prizes',{
        at : 9
      }, 'callbackLotteryPrizesHandler');
    },

    fillPrizes: function(data){
      var prizeHtml = '';
      for(var i in data.pa){
        prizeHtml += H.vip.$tmplPrize.tmpl({
          image: data.pa[i].tp,
          name: data.pa[i].pn
        });
      }
      
      var length = data.pa.length;
      if(8 - length > 0){
        for(var i = (8 - length) ; i>0 ; i-- ){
          var rand = Math.floor(Math.random() * length);
          prizeHtml += H.vip.$tmplPrize.tmpl({
            image: data.pa[rand].tp,
            name: data.pa[rand].pn
          });
        }
      }

      prizeHtml += H.vip.$tmplPrize.tmpl({
          image: './images/nothing/nothing.jpg',
          name: '继续努力吧'
      });

      H.vip.$carousel.html(prizeHtml);
      this.resizePrize();
      this.bindBtns();

      H.vip.$btnOpen.addClass('ready');
      H.vip.updateCardCount();
    },

    updateCardCount: function(){
      getResult('api/greetingcard/material/gainCount', {oi : openid}, 'callbackGreetingcardMaterialGainCountHandler');
    },

    updatePercent: function(data){
      if(H.card.cardData && H.card.cardData.ml && H.card.cardData.ml.length > 0){
        var length = H.card.cardData.ml.length;
        
        H.vip.$percent.css('height', ( data.gc / length * 100 ) + '%' );
        H.vip.$btnStart.attr('data-left', length - data.gc);
        if(data.gc >= length){
          H.vip.$btnStart.removeClass('disabled');
          H.vip.$btnStart.find('img').attr('src', './images/btn-vip-start.png');
        };

      }
    },

    liuKong: function(){
        var liukong = Math.ceil(Math.random() * (30 - 10)) + 10;
        H.vip.isLiukong = true;
        setTimeout(function(){
            H.vip.isLiukong = false;
        }, liukong * 1000);
    },

    show: function(){
        H.vip.stopAuto = false;
        H.vip.autoRolling();
        H.vip.$dialogWrapper.removeClass('none');
        H.vip.$dialog.addClass('transparent');
        setTimeout(function(){
            H.vip.$dialog.removeClass('transparent');
            H.vip.$dialog.addClass('bounceInDown');
        },100);
    },

    autoRolling: function(){

      if(H.vip.stopAuto){
        return false;
      }

      H.vip.theta += ( 360 / H.vip.panelCount ) * -1;
      H.vip.$carousel.css('-webkit-transform' ,'translateZ( '+ -1 * H.vip.translateZ +'px ) rotateY(' + H.vip.theta + 'deg)');
        H.vip.autoTimeout = setTimeout(function(){
          H.vip.autoRolling();
        },3000);
    },

    bindBtns: function(){

      H.vip.$btnClose.tap(function(){
        H.vip.stopAuto = true;
        clearTimeout(H.vip.autoTimeout);

        H.vip.$dialog.removeClass('bounceInDown').addClass('bounceOutUp');
        setTimeout(function(){
            H.vip.$dialogWrapper.addClass('none');
            H.vip.$dialog.removeClass('bounceOutUp');
        }, 500);
      });

      H.vip.$btnStart.tap(function(){
        if($(this).hasClass('disabled')){
          var left = $(this).attr('data-left');
          if(left){
            if(left < 0){
              left = 0;
            }
            showTips('您还差' + left + '张贺卡，请继续努力哦');  
          }else{
            showTips('您还未收集到全部贺卡，请继续努力哦');  
          }
          
        }else{
          
          if(H.vip.isReturn){
            H.vip.isReturn = false;
            H.vip.stopAuto = true;

            if(H.vip.isLiukong){
              H.vip.nothing();
              return;
            }

            showLoading(null, '幸运降临中');
            getResult('api/lottery/luck4Vip',{
              oi: openid
            }, 'callbackLotteryLuck4VipHandler', null, null, null, 15000, function(){
              hideLoading();
              H.vip.liuKong();
              H.vip.nothing();
            });
          }
        }
        
      });
    },

    rolling: function(data){
      H.vip.rollingTo(data.px - 1, function(){
        setTimeout(function(){
          H.award.show(data, 'vip');
          H.vip.isReturn = true;
        }, 1000);
      });
    },

    nothing: function(){
      // 谢谢参与
      H.vip.rollingTo(8, function(){
        setTimeout(function(){
          H.nothing.show('./images/nothing/nothing.jpg', 'vip');
          H.vip.isReturn = true;
        }, 1000);
      });
    },



    reset: function(){
      H.vip.$carousel.resetKeyframe();
      H.vip.stopAuto = false;
      H.vip.autoRolling();
    },

    rollingTo: function(index, callback){

      var theta = index * ( 360 / H.vip.panelCount ) * -1;
      $.keyframe.define({
          name: 'vip-rotate',
          from: {
              '-webkit-transform': 'translateZ( '+ -1 * H.vip.translateZ +'px ) rotateY(0deg)'
          },
          to: {
              '-webkit-transform': 'translateZ( '+ -1 * H.vip.translateZ +'px ) rotateY(' + (-3600 + theta) + 'deg)'
          }
      });

      H.vip.$carousel.playKeyframe({
          name: 'vip-rotate',
          duration: 5000,
          timingFunction: 'cubic-bezier(.2,0,.4,1.05)',
          complete: function () {
            callback();
          }
      });
    },

    resize : function(){
        var width = $(window).width();
        var height = $(window).height();

        var contentRatio = 247 / 640;
        var contentYRatio = 247 / 400;
        var contentPaddingRatio = 140 / 1009;
        

        var contentWidth = width * contentRatio;
        var contentHeight = contentWidth / contentYRatio;
        

        H.vip.$dialog.css({
          'width': width,
          'height': height,
          'background-size' : width + 'px ' + height + 'px',
        });

        H.vip.$content.css({
          'width' : contentWidth,
          'height' : contentHeight,
          'padding-top' : contentPaddingRatio * height
        });

        if(height < 500){
          H.vip.$btnStart.css({
            'top' : '68%'
          });
        }
    },

    resizePrize: function(){
      var width = $(window).width();
      var translateZRatio = 215 / 123;
      var translateZ = H.vip.translateZ = width / translateZRatio;

      H.vip.$content.find('figure').each(function(){
        var index = $(this).index();
        var offset = index * 40;
        $(this).css({
          '-webkit-transform': 'rotateY('+offset+'deg) translateZ('+translateZ+'px)',
          '-moz-transform': 'rotateY('+offset+'deg) translateZ('+translateZ+'px)',
          '-o-transform': 'rotateY('+offset+'deg) translateZ('+translateZ+'px)',
          'transform': 'rotateY('+offset+'deg) translateZ('+translateZ+'px)'
        })
      });

      H.vip.$carousel.css({
        '-webkit-transform': 'translateZ( '+ -1 * H.vip.translateZ +'px ) rotateY(0deg)'
      });
    }
  };

  W.callbackLotteryPrizesHandler = function(data){
    if(data.result == true){
      H.vip.fillPrizes(data);
    }
  };

  W.callbackLotteryLuck4VipHandler = function(data){
    hideLoading();    
    if(data.result == true){
      H.vip.rolling(data);
    }else if(data.flow && data.flow == 1){
        H.vip.liuKong();
        H.vip.nothing();
    }else{
      H.vip.nothing();
    }
  };

  W.callbackGreetingcardMaterialGainCountHandler = function(data){
    if(data.result == true){
      H.vip.updatePercent(data);
      setTimeout(function(){
        H.vip.updateCardCount();
      }, 5000);
    }
    
  };

  W.callbackVipLotteryRoundHandler = function(data){
    if(data.result == true){
      H.vip.initPrizes(data);
    }
  };

})(Zepto);