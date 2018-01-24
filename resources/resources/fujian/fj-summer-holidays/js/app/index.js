(function($) {
	
	H.index = {
		$countDown : $('.countdown'),

		btnRatio : 640 / 1008,

		init: function() {
			this.resize();
			this.bindBtns();
		},

		ruleCallback: function(data){
            $('.dialog-content').html(data.rule);
        },

        ruleError: function(){
            alert('网络错误，请稍后重试');
            $('.dialog-wrapper').addClass('none');
        },

		resize: function(){
			var width = $(window).width();
			var height = $(window).height();
			$('.main').css({
				'height': height,
				'background-size': width + 'px ' + height + 'px'
			});

			$('.nav-wrapper').css({
				'top' : this.btnRatio * height
			}).removeClass('none');

			$('.dialog').css({
				'height' : height * 0.85,
				'margin-top' : height * 0.1
			});

			$('.dialog-content').css({
				'height' : height * 0.85 - 90
			});
		},

		bindBtns: function(){
			this.$countDown.click(function(){
				if($(this).hasClass('active')){
					location.href = './yao.html';
				}
			});

			$('#rule').click(function(){
				$('#rule_dialog').removeClass('none');
				showLoading();
				getResult('api/common/rule',null, 'commonApiRuleHandler');
            });
            getResult('program/reserve/get', null, 'callbackProgramReserveHandler');
            $('#preBtn').click(function () {
                var reserveId = window.reserveId_t;
				var dateT = window.date_t;
                if (!reserveId) {
                    return;
                }
				shaketv.reserve_v2({tvid:yao_tv_id, reserveid:reserveId, date:dateT},function(data) {});
            });

			$('.dialog-close').click(function(){
				$(this).parent().parent().addClass('none');
			});
		}
	};

	W.roundLoaded = function(){
		H.index.$countDown.removeClass('none');
	}

	W.roundToStart = function(timeLeft){
		H.index.$countDown.removeClass('active');
		H.index.$countDown.html('距离下次摇奖'+showTime(timeLeft, '%H%:%M%:%S%'));
	};

	W.rounding = function(timeLeft){
		H.index.$countDown.addClass('active');
	};

	W.roundAllEnd = function(){
		H.index.$countDown.removeClass('active');
		H.index.$countDown.html('本期摇旅游结束了');
	};

	W.commonApiRuleHandler = function(data){
		hideLoading();
        if(data.code == 0){
            H.index.ruleCallback(data);
        }else{
            H.index.ruleError();
        }
    };
    W.callbackProgramReserveHandler = function (data) {
        hideLoading();
        if (!data.reserveId) {
            $("#preBtn").addClass("none");
            return;
        } else {
            window.reserveId_t = data.reserveId;
			window.date_t = data.date;
			window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:data.reserveId, date:data.date}, function(resp) {
				if(resp.errorCode == 0) {
					$("#preBtn").removeClass("none");
				}
            });
        }
    };
	H.index.init();

})(Zepto);