$(function(){
	
	(function($) {
		
		H.vote = {
			$main: $('.body'),
			$footer: $('footer'),
			$bar_up: $('#bar_up'),
			$bar_down: $('#bar_down'),
			$num_up: $('#num_up'),
			$num_down: $('#num_down'),
			$lottery_btn: $('#lottery_btn'),
			$lottery_remark: $('#lottery_remark'),
			init: function() {
				if($.fn.cookie("luid")){
					// 如果之前已经中奖但没有提交资料，则显示成功页
					location.href = "./lottery.html";
				}else{
					H.utils.resize();
					showLoading();
					getResult('stock/info',{}, 'callbackStockInfo');
					getResult('stock/index',{}, 'callbackStockIndex');
				}
			},
			initRule: function(data){
				this.saveRule(data);
				
				var msg = H.utils.getValidTimeMsg();
				if(msg != ""){
					// 活动未开始或已结束
					this.$lottery_remark.css("display","block");
					this.$lottery_remark.text(msg);
					this.$main.css("display","block");
					this.$footer.css("display","block");
				}else{
					if($.fn.cookie("hasVoted") == "true"){
						this.initBtn();
						this.$main.css("display","block");
						this.$footer.css("display","block");
					}else{
						var timeLeave = H.utils.getValidVoteTime();
						if(timeLeave > 0){
							// 投票抽奖倒计时
							this.countDown(timeLeave);
							this.$main.css("display","block");
							this.$footer.css("display","block");
						}else{
							location.href = "./index.html";
						}
					}
					
				}
			},
			saveRule: function(data){
				$.fn.cookie("pst",timestamp(data.pst));
				$.fn.cookie("pet",timestamp(data.pet));
				$.fn.cookie("cut",timestamp(data.cut));
				$.fn.cookie("jgt",data.jgt);
			},
			updateStock: function(data){
				var num_up = data.rc;
				var num_down = data.fc;
				this.$num_up.text(num_up);
				this.$num_down.text(num_down);
				this.$bar_up.css('height',100 * num_up / (num_up + num_down) + "%");
				this.$bar_down.css('height',100 * num_down / (num_up + num_down) + "%");
			},
			initBtn: function(){
				this.$lottery_btn.css('display','block');
				this.$lottery_btn.click(function(){
					location.href = "./lottery.html";
				});
			},
			countDown: function(timeLeave){
				if(timeLeave <= 0){
					location.href = "./index.html";
					return;
				}
				this.$lottery_remark.css("display","block");
				if(timeLeave > 60000){
					this.$lottery_remark.text(Math.floor(timeLeave / 60000) + "分钟后进行下一次抽奖");
				}else{
					this.$lottery_remark.text("请耐心等待~ 还有" + Math.floor(timeLeave / 1000) + "秒");
				}
				setTimeout(function(){
					H.vote.countDown(timeLeave - 1000);
				},1000);
			}
		};
		
		
		H.utils = {
			$body: $(".body"),
			$wrapper: $(".compare-wrapper"),
			resize: function() {
				var height = $(window).height();
				this.$body.css("height",height - 48);
				if(height <= 420){
					/* iphone4 hack */
					this.$wrapper.css("padding-top","5px");
				}
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
		
		/**活动规则**/
		W.callbackStockIndex = function(data){
			if(data.code == 0){
				H.vote.initRule(data);
			}
		}

		/**投票结果**/
		W.callbackStockInfo = function(data){
			if(data.code == 0){
				hideLoading();
				H.vote.updateStock(data);
				setTimeout(function(){
					getResult('stock/info',{}, 'callbackStockInfo');
				},5000);
			}
		}
		
	})(Zepto);

	H.vote.init();
});
