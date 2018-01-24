(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        redpack : '',
        iscroll: null,
        isJump :true, 
        outurl :null,
        init: function() {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                me.close();
            })
        },
        close: function() {
            $('.modal').addClass('none');
        },
        open: function() {
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }
            H.dialog.relocate();
        },
        relocate : function(){
        	var height = $(window).height(),
        		width = $(window).width(),
        		top = $(window).scrollTop();
            $('.dialog').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height*0.9, 
                    'left': 0,
                    'top': height*0.04
                });
            });
            $(".rule-dialog").css({
                    'width': width * 0.82, 
                    'height': height * 0.6, 
                    'left': width * 0.09,
                    'right': width * 0.09,
                    'top': height * 0.2,
                    'bottom': height * 0.2
            });
            $(".rule-dialog .content").css({
                    'height': $(".rule-dialog").height() - 70, 
            });
        },
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-travel-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
			open: function() {
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
			},
			close: function() {
				this.$dialog.find(".btn-close").addClass("none");
				this.$dialog.find("#gift-box").removeClass("none");
				this.$dialog.find("#not-lott").addClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
					return;
				});
				
				this.$dialog.find('#btn-open').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					//getResult('api/lottery/luck', {oi:openid}, 'callbackLotteryLuckHandler', true, this.$dialog);
					showLoading();
			          $.ajax({
			              type : 'GET',
			              async : false,
			              url : domain_url + 'api/lottery/luck',
			              data: { oi: openid },
			                 dataType : "jsonp",
			                 jsonpCallback : 'callbackLotteryLuckHandler',
			                 complete: function() {
			                     hideLoading();
			                 },
			                    success : function(data) {
			                    },
			                    error : function() {
			                    	$(".dialog").find("#gift-box").addClass("none");
									$(".dialog").find("#not-lott").removeClass("none");
									$(".dialog").find("#lott").addClass("none");
									$(".dialog").find(".btn-close").removeClass("none");
			                    }
			                });
					
				});
				this.$dialog.find('#btn-thank').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-awardGoods').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if (!me.checkInfo()) {
						return false;
					}
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.address').val());
					getResult('api/lottery/award', {
						ph: mobile,
						rn: encodeURIComponent(name),
						ad: encodeURIComponent(address),
						oi: openid
					}, 'callbackLotteryAwardHandler',true);
				
				});	
				this.$dialog.find('#btn-awardQuan').click(function(e) {
					e.preventDefault();
					showLoading();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if($(this).attr("href").split("?")[0] == "http://www.ut2o.com/promotion/weChatShake/token.json"){
						$(this).attr("href","#");
							$.ajax({
								type : "get",
								async : true,
								url :H.dialog.outurl,
								dataType : "jsonp",
								jsonp : "callback",
								jsonpCallback : "callbackTokenHandler",
								data : {		
								}
							});
						}
				});
			},
			checkInfo: function() {
				var me = this;
					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$address = me.$dialog.find('.address'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val()),
						address = $.trim($address.val());

					if (!name) {
						$name.focus();
						alert('请先输入姓名');
						$("#btn-awardGoods").removeClass("requesting");
						return false;
					}
					if (!mobile || !/^\d{11}$/.test(mobile)) {
						alert('请先输入正确的手机号');
						$("#btn-awardGoods").removeClass("requesting");
						$mobile.focus();
						return false;
					}
					if (!address) {
						alert('请先输入正确的地址');
						$("#btn-awardGoods").removeClass("requesting");
						$address.focus();
						return false;
					}
				return true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog">')
					._('<a href="#" class="btn-close lottery-close none" data-collect="true" data-collect-flag="tv-travel-lott-dialog-closebtn" data-collect-desc="旅游囤购节抽奖弹层-关闭按钮"></a>')
						//礼盒
						._('<div class="gift-box" id="gift-box">')
							._('<a class="btn btn-open" id="btn-open" data-collect="true" data-collect-flag="tv-travel-open-btn" data-collect-desc="旅游囤购节抽奖弹层-确定按钮">拆开看看</a>')
						._('</div>')
						
						//未中奖
						._('<div class="not-lott none" id="not-lott">')
						  ._('<div class="area">')
							._('<img src="images/sad.png"/>')
							._('<h1>真遗憾，没有中奖  </h1>')
							._('<h1>下次加油喽~ </h1>')
							._('<a class="btn" id="btn-thank" data-collect="true" data-collect-flag="tv-travel-back" data-collect-desc="旅游囤购节-返回按钮">活动活动，继续摇奖吧</a>')
						  ._('</div>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
						    ._('<h1></h1>')
						    //中卡券
							._('<div class="quan area">')	
								    ._('<img src=" "/>')
									._('<a class="btn" id="btn-awardQuan" data-collect="true" data-collect-flag="tv-travel-com-award-btn" data-collect-desc="旅游囤购节抽奖弹层-确定按钮">领取</a>')	
							._('</div>')
							//中实物奖
							._('<div class="goods area none">')
								._('<img src=" ">')
								._('<h2>请填写您的联系方式以便顺利领奖</h2>')
								._('<input type="text" class="name"  placeholder="姓名：(必填)" />')
								._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
								._('<input type="text" class="address" placeholder="地址：(必填)" />')
								._('<a class="btn" id="btn-awardGoods" data-collect="true" data-collect-flag="tv-travel-com-info-btn" data-collect-desc="旅游囤购节-确定信息按钮">确定</a>')
							._('</div>')
						._('</div>')
						
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
	            //接口回调成功且中奖
			    if(data&&data.result&&data.pt != 0){
						this.$dialog.find(".btn-close").removeClass("none");
						this.$dialog.find("#gift-box").addClass("none");
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					//实物奖品
					if(data.pt == 1){

						$("#lott").find(".quan").addClass("none");
						$("#lott").find(".goods").removeClass("none");
						$('#btn-awardGoods').removeClass('none');
						$(".goods").find("img").attr("src",data.pi);
						$("#lott").find("h1").html("恭喜您，获得大礼包一份");
					    $(".mobile").val(data.ph || "");
						$(".name").val(data.rn || "");
						$(".address").val(data.ad || "");
					//外链奖品
					}else if(data.pt == 9){
						$("#lott").find("h1").html("恭喜您，获得礼券一份");
						$("#lott").find(".quan").removeClass("none");
						$("#lott").find(".goods").addClass("none");
						$(".quan").find("img").attr("src",data.pi);
						$(".quan").find("#btn-awardQuan").attr("href",data.ru);
					}
				//接口回调成功但未中奖
				}else if(data&&data.result&&data.pt == 0){
					this.$dialog.find("#gift-box").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find(".btn-close").removeClass("none");
				}else{//接口回调失败
					this.$dialog.find("#gift-box").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find(".btn-close").removeClass("none");
				}
			}
		},

    };
    W.callbackLotteryLuckHandler = function(data){
    	H.dialog.outurl = data.ru;
    	$('#btn-open').removeClass("requesting");
    	H.dialog.lottery.update(data);
    	
    };
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			$("#btn-awardGoods").removeClass("requesting");
			$("#btn-awardGoods").addClass("none");
			$(".dialog").find(".goods input").attr("disabled","disabled");
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
			$('#btn-awardGoods').removeClass('none');
		}
	};
	W.callbackTokenHandler = function(data){
		var serial = data.serial;
		var signature = data.signature;
		var uri ="http://ut2o.com/promotion/weChatShake/"+serial+".html?signature="+signature;
		var redirect_uri = encodeURIComponent(uri);
		$('#btn-awardQuan').removeClass("requesting");
		toUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1b0ff719d4a2ea76&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_base&state=super1#wechat_redirect");
	}
    
})(Zepto);

$(function() {
    H.dialog.init();
});
