/**
 * 爱尚家具-抽奖
 */
(function($) {
	H.lottery = {
		ispass : false,
		ruuid : 0,
	    isAward : false,
		uuid: getQueryString('uuid'),
		score: getQueryString('score'),
		init : function(){
			this.event();
            getResult('advertise/checklotteryed', {
                activityUuid : this.uuid,
                openid : openid
            }, 'advertiseChecklotteryedHandler',true);
			$('#box-phone').css('width',$(window).width());
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

				/*if (!name) {
					alert('请输入姓名');
					$name.focus();
					return false;
				}*/
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
            setTimeout(function(){
                if(document.documentElement.clientHeight < document.body.scrollHeight){
                    $('.box-phone .text').css('margin-top','-6px');
                }
            }, 1000);


		},
		drawlottery:function(){
			getResult('advertise/lotterynew', {
				openid : openid,
				activityUuid : this.uuid,
				score : this.score
			}, 'advertiseLotteryNewHandler',true);
		},
		isShow : function($target, isShow){
			var $target = $('.' + $target);
			$target.removeClass('none');
			isShow ? $target.show() : $target.hide();
		},
        check_data : function(data){
            var $phone = $('#phone'), $name = $('#name');
            $('#box-phone').find('h3').hide();
            $('.award-div').find('p').html('<img class="two" src="'+ data.ptqi+'"><div>长按二维码 即可关注我们</div>');
			//$('.award-div').find('p').html('<img class="two" src="images/er-width.png"><div>长按二维码 即可关注我们</div>');
            $('#btn-submit').hide();
        },
		fill : function(data){
			if (data.code == 0) {
                $('.fir-lottery').addClass('none');
				$('.lottery').addClass('none');
				$('body').addClass('reposit');
				hideLoading($("#loading"));
				$('.sign-logo-div').addClass('none');
				luck_prize = data;
				$.fn.cookie("ruuid-"+ openid, data.ruuid,{expires:1});
				$.fn.cookie("pqi-"+ openid, data.pqi,{expires:1});
				$.fn.cookie("ptqi-"+ openid, data.ptqi,{expires:1});
				if(data.pt != 3){
					$(".prize").html(data.ptt);
					$('#box-phone').find('.fudai').html('<img src="'+ data.pi +'">');
					$("#box-phone").removeClass("none");
					window.location.hash = "anchor";
					$("#phone").val(data.phone || '');
					$("#name").val(data.name || '').focus();
				}else{
					H.lottery.isShow('thank', true);
				}

			} else {
				//H.lottery.isShow('thank', true);
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
		}
	};
	W.advertiseAwardNewHandler = function(data) {//领奖
		if (data.code == 0) {
			$('.box').addClass('none');
			$('#box-phone').removeClass('none');
			$('.award-div').find('p').html('<img class="two" src="'+ $.fn.cookie("ptqi-"+ openid) +'"><div>长按二维码 即可关注我们</div>');
			//$('.award-div').find('p').html('<img class="two" src="images/er.png"><div>长按二维码 即可关注我们</div>');
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


	W.advertiseLotteryNewHandler = function(data) {
		H.lottery.fill(data);
	};

    W.advertiseChecklotteryedHandler = function(data){//检查抽奖
        if(data.code == 0){
            if(data.flag == true){
                H.lottery.ispass = true;
            }else{//已抽过奖
                $('.fir-lottery').addClass('none');
                $('.lottery').addClass('none');
                $('body').addClass('reposit');
                $.fn.cookie("ruuid-"+ openid, data.ruuid,{expires:1});
                $.fn.cookie("pqi-"+ openid, data.pqi,{expires:1});
                $('.sign-logo-div').addClass('none');
                luck_prize = data;
                if(data.pt == 3){//谢谢参与
                    H.lottery.isShow('thank', true);
                }else if(data.pt == 4){//中卡劵
                    H.lottery.giftDrect(data);
                    $(".prize").html(data.ptt);
                    $('#box-phone').find('.fudai').html('<img src="'+ data.pi +'">');
                    if(!data.phone && !data.name){
                        $('#box-phone').find('h3').text('您上次未领奖，请填写信息！');
                    }else{
                        H.lottery.check_data(data);
                        $('.address-info').removeClass('none');
                    }
                    $('.box').addClass('none');
                    $('#box-phone').removeClass('none');
                }else if(data.pt == 1 ||data.pt == 2){
                    $(".prize").html(data.ptt);
                    $('#box-phone').find('.fudai').html('<img src="'+ data.pi +'">');
                    if(!data.phone && !data.name){
                        $('#box-phone').find('h3').text('您上次未领奖，请填写信息！');
                    }else{
                        H.index.check_data(data);
                        $('.address').text('喊小伙伴们一起来参与吧！').removeClass('none');
                    }
                    $('.box').addClass('none');
                    $('#box-phone').removeClass('none');
                }
            }

        }
        else{
            alert(data.message);
            toUrl('index.html');
        }
    };
})(Zepto);

$(function() {
	H.lottery.init();
});
