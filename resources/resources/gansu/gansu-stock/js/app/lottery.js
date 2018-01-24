$(function(){
	
	(function($) {
		
		H.lottery = {
			$main: $('.body'),
			$footer: $('footer'),
			$lottery_page: $('#lottery_page'),
			$lottery_btn: $('#lottery_btn'),
			init: function() {
				H.utils.resize();
				
				if($.fn.cookie("luid")){
					// 如果之前已经中奖但没有提交资料，则显示成功页
				    H.success.setAward({ luid: $.fn.cookie("luid"), pi: $.fn.cookie("award_pic_url"), AwardTip: $.fn.cookie("slogon-success-tip") });
					showLoading();
					getResult('stock/user',{
						op:openid
					}, 'callbackStockUser');

					this.$main.css("display","block");
					this.$footer.css("display","block");
				}else{
					this.$lottery_page.css("display","block");
					showLoading();
					getResult('stock/index',{}, 'callbackStockIndex');
				}
			},
			initRule: function(data){
				this.saveRule(data);
				var msg = H.utils.getValidTimeMsg();
				if(msg != ""){
					// 活动未开始或已结束
					location.href = "./vote.html";
				}else{
					
					if($.fn.cookie("hasVoted") != "true"){
						location.href = "./index.html";
					}else{
						this.initBtns();
						this.$main.css("display","block");
						this.$footer.css("display","block");
					}
				}
			},
			saveRule: function(data){
				$.fn.cookie("pst",timestamp(data.pst));
				$.fn.cookie("pet",timestamp(data.pet));
				$.fn.cookie("cut",timestamp(data.cut));
				$.fn.cookie("jgt",data.jgt);
			},
			initBtns: function() {
				this.$lottery_btn.click(function(){
					showLoading();
					getResult('stock/lottery',{
						op:openid
					}, 'callbackStockLottery');
				});
			}
		};
		
		H.success = {
			$lottery_page: $('#lottery_page'),
			$success_page: $('#success_page'),
			$success_page_award: $('#success_page').find(".bg img"),
			$success_btn: $('#success_btn'),
			$user_dialog: $('#user_dialog'),
			$user_dialog_submit: $('#dialog_submit_btn'),
			$user_dialog_close: $('#dialog_close_btn'),
			$luid: 0,
			$user_info: {},
			init: function(data) {
				
				if($.fn.cookie("award_pic_url")){
					var height = $(window).height();
					//$('#success_page').find(".slogon img").css("height",height * 0.15);
					$('#success_page').find(".btn-wrapper img").css("height",height * 0.1);
					$('#success_page').find(".bg").css("bottom","0");
					this.$success_page_award
						.attr('src',$.fn.cookie("award_pic_url"))
						.css('height',height * 0.5)
						.parent().css("display","block");
				}
				
				
				this.$lottery_page.css("display","none");
				this.$success_page.css("display","block");
				if(data && data.code == 0){
					this.$user_info = {
						rl : data.rl ? data.rl : '',
						ph : data.ph ? data.ph : '',
						ad : data.ad ? data.ad : ''
					}
				}
				this.initBtns();
			},
			initBtns: function(){
				var me = this;
				this.$success_btn.click(function(){
					$('#dialog_form input').each(function(){
						var key = $(this).attr('name');
						$(this).val(me.$user_info[key] ? me.$user_info[key] : "" );
					});
					me.$user_dialog.css("display","block");
				});

				this.$user_dialog_close.click(function(){
					me.$user_dialog.css("display","none");
				});
				
				this.$user_dialog_submit.click(function(){
					
					var args = {};
					$('#dialog_form input').each(function(){
						args[$(this).attr('name')] = $(this).val();
					});
					
					if(H.utils.validateData(args)){
						args['op'] = openid;
						args['luid'] = me.$luid;
						showLoading();
						for(var i in args){
							args[i] = encodeURIComponent(args[i]);
						}
						getResult('stock/award',args, 'callbackStockAward');
					}
					
				});
			},
			setAward: function(data){
			    this.$luid = data.luid;
			    $.fn.cookie("luid", data.luid);
			    $.fn.cookie("award_pic_url", data.pi);
			    $.fn.cookie("slogon-success-tip", data.AwardTip);
			    $("#slogon-success-tip").html(data.AwardTip);

			},
			submitSuccess: function(){
				alert("提交成功！工作人员稍后会致电给您确认信息");
				this.$user_dialog.css("display","none");
				location.href = "./vote.html";
			}
		};
		
		H.fail = {
			$lottery_page: $('#lottery_page'),
			$fail_page: $('#fail_page'),
			init: function() {
				this.$lottery_page.css("display","none");
				this.$fail_page.css("display","block");
			}
		};
		
		H.utils = {
			$body: $(".body"),
			$voteBtns: $(".vote-wrapper"),
			$slogon: $(".slogon"),
			$bg: $(".bg"),
			resize: function() {
				var height = $(window).height();
				this.$body.css("height",height - 48);
				
				if(height <= 500){
					/* iphone4 hack */
					this.$bg.css("bottom","-55px");
					this.$slogon.css('padding-top',"5px");
				}
			},
			validateData: function(args){
				var rl = args['rl'];
				var ph = args['ph'];
				var ad = args['ad'];
				var $test = /^1\d{10}$/;
				console.log(rl);
				if(rl.trim()=="" ){
					alert("请输入姓名");
					return false;
				}else if (rl.length > 20) {
					alert('姓名太太太长了！');
					return false;
				}
				if (!/^\d{11}$/.test(ph)) {
					alert('这手机号，可打不通...');
					return false;
				}
				if (ad.length < 5 || ad.length > 60) {
					alert('地址长度为5~60个字符');
					return false;
				}
				return true;
			},
			getValidTimeMsg: function(){
				var now = new Date();
				var start = $.fn.cookie("pst");
				var end = $.fn.cookie("pet");
				
				if(now.getTime() < start){
					return "活动还未开始哦";
				}else if(now.getTime() > end){
					return "活动已经结束了";
				}
				return "";
			},
			getValidVoteTime: function(){
				var lastVoteTime = $.fn.cookie("lastVoteTime");
				var now = new Date();
				if(!lastVoteTime || now.getTime() - lastVoteTime > $.fn.cookie("jgt") * 1000 ){
					return 0;
				}else{
					return $.fn.cookie("jgt") * 1000 - (now.getTime() - lastVoteTime);
				}
			}
		};
		
		
		/**立即抽奖**/
		W.callbackStockLottery = function(data){
			hideLoading();
			$.fn.cookie("hasVoted","false");

			if (data.code == 0) {
			    data.AwardTip = "恭喜您，抽中了" + " <br />" + data.pn + data.pc + data.pu;
				// 抽中奖品
				H.success.setAward(data);
				showLoading();
				getResult('stock/user',{
					op:openid
				}, 'callbackStockUser');
			}else if(data.code == 2){
				// 未抽中
				H.fail.init();
			}else if(data.code == 3){
				// 不能抽奖
				alert(data.message);
			}else{
				// 其他错误
				alert(data.message);
			}
		}
		
		/**活动规则**/
		W.callbackStockIndex = function(data){
			if(data.code == 0){
				hideLoading();
				H.lottery.initRule(data);
			}
		}
		
		/**获取用户信息**/
		W.callbackStockUser = function(data){
			hideLoading();
			H.success.init(data);
		}
		
		/**提交用户信息**/
		W.callbackStockAward = function(data){
			hideLoading();			
			if(data.code == 0){
				$.fn.cookie("luid","");
				H.success.submitSuccess();
			}else{
				alert(data.message);
			}
		}
		
		
	})(Zepto);

	H.lottery.init();
});
