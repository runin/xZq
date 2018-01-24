/**
 * 靓装直播间
 */
(function($) {
	H.lottery = {
		ispass : false,
		surveyPrizelogUuid : 0,
		REQUEST_CLS: 'requesting',
		$btn_submit: $('#btn-submit'),
		$btn_lottery: $("#btn-lottery"),
		init : function(){
			$("#img_lottery_bg").attr("src", lottery_bg);
			this.event();
			this.imgReady(index_bg);
			getResult('syparty/index', {
				qid : surveyInfoUuid
			}, 'callIndexHander',true);
		},
		imgReady : function(index_bg) {
			var width = document.documentElement.clientWidth,
				height = document.documentElement.clientHeight;
			$('body').css('background', 'url('+ index_bg +') no-repeat');
			/*$('body').css('background-size',  width + 'px auto');*/
			/*$('body').css('background-size',  'auto ' + height + 'px');*/
			$('body').css('background-size',  width + 'px ' + height + 'px');

		},
		event: function() {
			var me = this;
			this.$btn_lottery.click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('disabled')) {
					return;
				}
				$(this).addClass('disabled');
				if(openid && H.lottery.ispass){
					H.lottery.drawlottery();
				}
			});

			this.$btn_submit.on('click', function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var $phone = $('#phone'),
					phone = $.trim($phone.val()),
					$name = $('#name'),
					name = $.trim($name.val()),
					$address = $('#address'),
					address = $.trim($address.val());

				if (((me.name && me.name == name) && me.phone && me.phone == phone)
					&& (me.address && me.address == address)) {
					return;
				}

				if (name.length < 2 || name.length > 30) {
					alert('姓名长度为2~30个字符');
					return false;
				}
				else if (!/^\d{11}$/.test(phone)) {
					alert('这手机号，可打不通哦...');
					return false;
				}
				  else if (address.length < 5 || address.length > 60) {
					alert('地址长度为5~60个字符');
					return false;
				}

				$(this).addClass(me.REQUEST_CLS).addClass('none');
				$('.share-img').removeClass('none');

				showLoading();
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'syparty/award',
					data: {
						openid: openid,
						surveyPrizelogUuid : this.surveyPrizelogUuid,
						phone : phone,
						name : encodeURIComponent(name),
						address : encodeURIComponent(address)
					},
					dataType : "jsonp",
					jsonpCallback : 'callbackAwardHander',
					complete: function() {
						hideLoading();
					},
					success : function(data) {
						me.$btn_submit.removeClass(me.REQUEST_CLS);

						if (data.code == 0) {
							alert('信息提交成功！');
							$('.box').addClass('none');
							$('#box-phone').removeClass('none');
							$phone.attr('disabled','disabled').addClass('inputed');
							$name.attr('disabled','disabled').addClass('inputed');
							$address.attr('disabled','disabled').addClass('inputed');
						} else if (data.code == 1) {
							alert("亲,服务器君很忙,休息一下再试吧");
						}
					}
				});
			});


		},
		drawlottery:function(){
			getResult('syparty/lottery', {
				openid : openid,
				surveyInfoUuid : surveyInfoUuid
			}, 'callbackLotteryHander',true);
		},
		fill : function(data){
			if (data.code == 0) {
				this.surveyPrizelogUuid = data.surveyPrizelogUuid;
				if(data.prizeType == 1){
					$(".prize")
						.html(
						data.prizeType == 2 ? data.prizeName
							: (data.prizeName
						+ "一" + data.prizeUnit));
					$('.lottery').addClass('none');
					$("#box-phone").removeClass("none");
					$('.copyright').addClass('relative');
					window.location.hash = "anchor";
					$("#phone").val(data.phone).focus();
				}else{
					alert("您未抽中奖，请继续抽奖");
					setTimeout("window.location.href='" + 'index.html' + "'", timer);
				}
			} else {
				alert("您未抽中奖，请继续抽奖");
				setTimeout("window.location.href='" + 'index.html' + "'", timer);
			}
		},
		lottery_point : function(data, isThank){
			// 奖项列表
			   awards = data.luckyWheel;
			// 初始化大转盘
			var lw = new luckWheel(
				{
					items : awards,
					// 回调函数
					callback : function() {
						H.lottery.fill(data);
					}
				});

			lw.run(awards[data.prizeIndex]);
		}
	};
	W.callIndexHander = function(data){
		if(data.code == 0){
			H.lottery.ispass = true;
		}
		else{
			alert(data.message);
		}
	};

	W.luckWheel = function(opt) {
		var _opt = {
			// 奖项列表
			items : [],
			// 时间长度
			duration : 7500,
			// 重复转圈次数
			repeat : 2,
			// 回调函数
			callback : function() {
			}
		};

		for ( var key in _opt) {
			this[key] = opt[key] || _opt[key];
		}

		this.run = function(v) {
			var bingos = [], index, me = this;
			for ( var i = 0, len = this.items.length; i < len; i++) {
				if (this.items[i] == v) {
					bingos.push(i);
				}
			}

			index = bingos[(new Date()).getTime() % bingos.length];
			var amount = 360 / len, fix = amount / 5, low = index * amount + fix, top = (index + 1)
				* amount - fix, range = top - low, turnTo = low
				+ (new Date()).getTime() % range;

			H.lottery.$btn_lottery.rotate({
				angle : 0,
				animateTo : turnTo + this.repeat * 360,
				duration : this.duration,
				callback : function() {
					me.callback(index);
				}
			});
		};
	};

	W.callbackLotteryHander = function(data) {
		if (data.code == 0) {
			H.lottery.lottery_point(data);
		} else {
			alert(data.message);
		}
	};
})(Zepto);

$(function() {
	H.lottery.init();
});
