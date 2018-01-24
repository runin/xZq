/**
 * 社区春晚-抽奖
 */
(function($) {
	H.lottery = {
		ispass : false,
		ruuid : 0,
	    isAward : false,
		init : function(){
			$("#img_lottery_bg").attr("src", "images/lottery_bg.png");
			this.event();
		},
		event: function() {
			var me = this;
			$("#btn-lottery").click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('disabled')) {
					return;
				}
				$(this).addClass('disabled');
				if(openid && me.ispass){
					H.lottery.drawlottery();
				}
			});

			$('#btn-submit').on('click', function(e) {
				e.preventDefault();
				if($(this).hasClass('.loading-btn')){
					return;
				}
				var $phone = $('#phone'),
					phone = $.trim($phone.val()),
					$name = $('#name'),
					name = $.trim($name.val());

				if (!name) {
					alert('请输入姓名');
					$name.focus();
					return false;
				}
				if (!phone || !/^\d{11}$/.test(phone)) {
					alert("请输入正确的手机号码！");
					$phone.focus();
					return;
				}

				if (!this.isAward) {
					this.isAward = true;
					$(this).addClass('loading-btn');
					getResult('advertise/awardnew', {
						openid : openid,
						ruuid : luck_prize.ruuid,
						ph : phone,
						name : encodeURIComponent(name)
					}, 'advertiseAwardNewHandler');
				}

			});

			$('.btn-back-simple').click(function(e) {
				e.preventDefault();
				showLoading();
				setTimeout(function(){
					toUrl('index.html');
				}, 3000);
			});


		},
		drawlottery:function(){
			getResult('advertise/lotterynew', {
				openid : openid,
				activityUuid : H.index.uuid,
				score : H.index.score
			}, 'advertiseLotteryNewHandler');
		},
		isShow : function($target, isShow){
			var $target = $('.' + $target);
			$target.removeClass('none');
			isShow ? $target.show() : $target.hide();
		},
		fill : function(data){
			if (data.code == 0) {
				hideLoading($("#loading"));
				$('.sign-logo').hide();
				luck_prize = data;
				$.fn.cookie("ruuid-"+ openid, data.ruuid,{expires:1});
				if(data.pt != 3){
					$(".prize").html(data.ptt);
					$("#box-phone").removeClass("none");
					window.location.hash = "anchor";
					$("#phone").val(data.phone || '');
					$("#name").val(data.name || '').focus();
				}else{
					H.lottery.isShow('thank', true);
				}

			} else {
				H.lottery.isShow('thank', true);
				alert("您未抽中奖品，感谢您的参与！");
				toUrl('index.html');
			}
		},
		giftDrect : function(data){
			var list = data.store || [];
			for(var i = 0, len = list.length; i< len; i++){
				$.fn.cookie("si-"+ openid + i, list[i].si,{expires:1});
				$.fn.cookie("su-"+ openid + i, list[i].su,{expires:1});
			}
			if(data.choseed){//已经选择过商家
				$('#btn-address').attr('href', 'confirm.html');
			}else{
				$('#btn-address').attr('href', 'gift.html?length='+ list.length);
			}
		},
		lottery_point : function(data){
			// 奖项列表
				awards = awards = data.luckyWheel;
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
	W.advertiseAwardNewHandler = function(data) {//领奖
		if (data.code == 0) {
			$('.box').addClass('none');
			$('#box-phone').removeClass('none');
			$('input').attr('disabled','disabled');
			$('#box-phone').find('h3').hide();
			if (luck_prize.pt == 4) {//卡券
				H.lottery.giftDrect(luck_prize);
				$('#btn-submit').addClass('none');
				$(".address-info").removeClass('none');
			}else if(luck_prize.pt == 1 || luck_prize.pt == 2){//1、普通奖品 2、积分奖品
				$('#btn-submit').addClass('none');
				$('.address').text('喊小伙伴们一起来参与吧！').removeClass('none');
			}
		} else if (data.code == 1) {
			alert("亲,服务器君很忙,休息一下再试吧");
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

			$("#btn-lottery").rotate({
				angle : 0,
				animateTo : turnTo + this.repeat * 360,
				duration : this.duration,
				callback : function() {
					me.callback(index);
				}
			});
		};
	};

	W.advertiseLotteryNewHandler = function(data) {
			H.lottery.lottery_point(data);
	};
})(Zepto);

$(function() {
	H.lottery.init();
});
