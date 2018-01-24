(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function () {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function (e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function (e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			});
		},
		close: function () {
			$('.modal').addClass('none');
		},
		open: function () {
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}

			H.dialog.relocate();
		},

		relocate: function () {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').css({'width': width}).find('.btn-close').css({
				'right': width * 0.10 - 15,
				'top': top - 15
			});
			$('.dialog').each(function () {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.80,
					'height': height * 0.85,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': top,
					'bottom': height * 0.10
				});
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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tj-customer-daily-rule-dialog-closebtn" data-collect-desc="消费者日常版规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>领奖规则</h2>')
					._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><a href="#" class="btn my-zhidao close" data-collect="true" data-collect-flag="tj-customer-daily-guide-trybtn" data-collect-desc="消费者日常版规则弹层-我知道了按钮">我知道了</a></p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			open: function(data, isRight) {
				H.dialog.open.call(this);
				this.event();
				if(isRight){
					$('#sorry-lott').removeClass('none');
				}else{
					$(".card-div").removeClass("none");
					$(".giftbox").click(function(e){
						e.preventDefault();
						
					    $(".giftBoxDiv").addClass("step-1");
					    setTimeout(function(){
							H.dialog.lottery.to2();
						},500);
						
						setTimeout(function(){
							$(".card-div").addClass("none");
							if($(".card-div").hasClass("none")){
								H.dialog.lottery.update(data);
							}
						},1000);
						
					});
					
				}
				
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.clear();
					me.close();
					window.location.href= "lottery.html";
				});
	

				$('#btn-award').click(function(e){
					e.preventDefault();
					window.location
				});
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			butt_loading: function() {
				var t = simpleTpl();
				t._(' <div class="loader">')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('</div>');
				$('.dialog-copyright').before(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="tj-customer-daily-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//答错了
						._('<div class="not-lott none wrong" id="sorry-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>Sorry，答错了，快去<br/>好好看电视吧~</h1>')
							._('<a class="btn lottery-close" data-collect="true" data-collect-flag="tj-customer-daily-sorry-back-btn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						/*礼盒*/
						._('<div class="card-div none">')
							._('<h2>恭喜您答对了！<br /> 点开礼盒试试手气</h2>')
							._('<div class="gift-box" id="gift-box">')
									._('<div class="gift">')
										._('<div class="giftBoxDiv">')
											._('<div class="giftbox">')
												._('<div class="cover">')
													._('<div></div>')
												._('</div>')
												._('<div class="box"></div>')
											._('</div>')
//											._('<div class="wer">')
//					                            ._('<span></span>')
//					                            ._('<span></span>')
//					                            ._('<span></span>')
//					                            ._('<span></span>')
//					                            ._('<span></span>')
//					                            ._('<span></span>')
//											._('</div>')
										._('</div>')
									._('</div>')				
							._('</div>')
							._('<a class="btn lottery-close" data-collect="true" data-collect-flag="tj-customer-daily-gift-back-btn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//未中奖
						._('<div class="not-lott none" id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>运气不太好，未中奖！</h1>')
							._('<h2>别灰心，每天锁定节目 还有机会赢大奖！</h2>')
							._('<a class="btn lottery-close" data-collect="true" data-collect-flag="tj-customer-daily-notlott-back-btn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2></h2>')
							._('<h1><span class="ck"></span><span class="cn"></span></h1>')		
							._('<span>以上是您的领奖凭证，请关注天视汇查询</span>')
							._('<a class="btn lottery-close" data-collect="true" data-collect-flag="tj-customer-daily-lott-back-btn" data-collect-desc="消费者日常版-返回按钮">我知道了</a>')
							._('<span class="share">告诉小伙伴们一起来抽奖吧</span>')
						._('</div>')
						._('<p class="dialog-copyright"></p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			to2: function(){
//				if($('.giftBoxDiv').hasClass("step-1")){
	                $('.giftBoxDiv').removeClass('step-1').addClass('step-2');
//	                $('.wer').addClass('page-a');
//	            }
//				else{
//	                $('.giftBoxDiv').removeClass('step-2').addClass('step-1');
//	            }
	
			},
			update: function(data) {
					if(data.pt&&data.pt != 2 && data.code == 0){
						var classStatecn = typeof(data.pcn)=="undefined"?"":data.pcn;
						var classStateck = typeof(data.pck)=="undefined"?"":data.pck;
						$("#lott").find("img").attr("src",data.pi);
						$("#lott").find("h2").html("恭喜您，获得"+data.pn+"一"+data.pu);
						if(data.pt == 6){
							$("#lott").find(".ck").html(classStateck);
							$("#lott").find(".cn").html(classStatecn);
						}
						if(!data.pcn||data.pcn==null){
								$("#lott").find("h1").html(data.ptt);
						}
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else{
						this.$dialog.find("#lott").addClass("none");
						this.$dialog.find("#not-lott").removeClass("none");
					}
			},
			clear:function(){
				this.$dialog.find("#not-lott").removeClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find('input').removeAttr('disabled').css('border','1px solid #D3D3D3');
				this.$dialog.find('#btn-award').removeClass('none').addClass('btn btn-share bth-aw btn-award');
				this.$dialog.find('#lott h1').text('请填写您的联系方式以便顺利领奖');
			},
			succ: function() {
				$('.loader').addClass('none');
				this.$dialog.find('input').attr('disabled','disabled').css('border','none');
				this.$dialog.find('#btn-award').addClass('none');
				this.$dialog.find('.da-tips').removeClass('none');
				var mob = this.$dialog.find('.mobile').val();
				var nam = this.$dialog.find('.name').val();
				var address = this.$dialog.find('.address').val();
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('.address').val('地址：'+address);
				this.$dialog.find('#lott h1').text('以下是您的联系方式，请等候工作人员联系');
			}
		},
		// 超过上传次数谈层
		over: {
			$dialog: null,
			maxCount: null,
			open: function (count) {
				H.dialog.over.maxCount = count;
				H.dialog.open.call(this);
				this.event();
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.lottery-close').click(function (e) {
					e.preventDefault();
					me.close(); 
				});
			},
			tpl: function () {
				var t = simpleTpl();
				if(!H.dialog.over.maxCount){
					t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-eyes-daily-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="over-upload">')
							._('<img src="images/open-li.png">')
							._('<h1>亲，正在努力加载页面，请稍等~</h1>')	
						._('</div>')
						._('<p class="dialog-copyright"><span class="btn lottery-close" data-collect="true" data-collect-flag="js-eyes-daily-sharebtn" data-collect-desc="返回按钮">我知道啦</span><br /></p>')
					._('</div>')
					._('</section>');
					return t.toString();
				}
				t._('<section class="modal" id="lottery-dialog">')
				._('<div class="dialog lottery-dialog">')
				._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-eyes-daily-over-dialog-close-btn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					//未中奖
					._('<div class="over-upload">')
						._('<img src="images/open-li.png">')
						._('<h1>亲，您今天已经参与过了，每天只能参与'+H.dialog.over.maxCount+'次哦~明天再来吧~</h1>')	
					._('</div>')
					._('<p class="dialog-copyright"><span class="btn lottery-close" data-collect="true" data-collect-flag="js-eyes-daily-over-konw-btn" data-collect-desc="返回按钮">我知道啦</span><br /></p>')
				._('</div>')
				._('</section>');
				return t.toString();
			}
		}
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.newseyedayAwardHandler = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
			$('#btn-award').removeClass('none');
		}
	}
	
})(Zepto);
$(function(){
	H.dialog.init();
});
