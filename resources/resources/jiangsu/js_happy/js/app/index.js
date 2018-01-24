(function($) {
    H.index = {
        init: function () {
        	this.TSystem();
        	this.getShow();
        	this.getCardPort();
        },
		TSystem: function() {
		    var startPosition, endPosition, deltaX, deltaY, moveLength, targetLength = 50,
		    	el = document.querySelector('.btn-play');
		    el.addEventListener('touchstart', function (e) {
		    	e.preventDefault();
		        var touch = e.touches[0];
		        startPosition = {
		            x: touch.pageX,
		            y: touch.pageY
		        }
		    });
		    el.addEventListener('touchmove', function (e) {
		    	e.preventDefault();
		        var touch = e.touches[0];
		        endPosition = {
		            x: touch.pageX,
		            y: touch.pageY
		        }
		        deltaX = endPosition.x - startPosition.x;
		        deltaY = endPosition.y - startPosition.y;
		        if(deltaX < 0) {
		        	moveLength = 0;
		        } else if (deltaX > 0) {
		        	moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
		        };
		        if (moveLength >= 0) {
		        	$('.icon-film').css('-webkit-transform', 'rotate(' + moveLength + 'deg)');
		        	$('.icon-arrow, .play-tips').addClass('none');
		        };
		    });
		    el.addEventListener('touchend', function (e) {
		    	e.preventDefault();
		    	if (moveLength < targetLength) {
		    		$('.icon-film').animate({'-webkit-transform' : 'rotate(0)'}, 200);
		    		$('.icon-arrow, .play-tips').removeClass('none');
		    	} else {
		    		$('body').addClass('touch-none');
		    		toUrl('reserve.html');
		    	}
		    });
		    $("#btn-rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			$(".btn-play").click(function(e){
				e.preventDefault();
				$('body').addClass('touch-none');
	    		toUrl('reserve.html');
			});
			$(".btn-go2luck").click(function(e){
				e.preventDefault();
				$('body').addClass('touch-none');
	    		toUrl('card.html');
			});
		},
        getShow: function() {
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
        },
		getCardPort: function() {
			getResult('api/lottery/dramacard/all', {
				oi: openid
			}, 'callbackLotteryDramacardAllHandler');
		}
    };

    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0 && data.gitems != undefined) {
            if (data.gitems[0].ib) {
            	var Img = new Image();
            	Img.src = data.gitems[0].ib;
            	Img.onload = function() {
            		$('.main-show').attr('src', data.gitems[0].ib).addClass('live');
            		setTimeout(function(){
            			$('.icon-show').addClass('hide');
            		}, 1000);
            	};
            }
        }
    };

    W.callbackLotteryDramacardAllHandler = function(data) {
		if (data.result) {
			if (data.ca) {
				if (data.le > 0) {
					$('#collect').addClass('none');
				} else {
					$('#collect').removeClass('none');
				}
			} else {
				$('#collect').addClass('none');
			}
		} else {
			$('#collect').addClass('none');
		}
	};
})(Zepto);                             

$(function(){
    H.index.init();
});