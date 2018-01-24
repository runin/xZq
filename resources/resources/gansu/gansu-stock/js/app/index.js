$(function(){

	(function($) {
		
		H.index = {
			$btn_up: $('#btn_up'),
			$btn_down: $('#btn_down'),
			$main: $('.body'),
			$footer: $('footer'),
			init: function() {
				if($.fn.cookie("luid")){
					// 如果之前已经中奖但没有提交资料，则显示成功页
					location.href = "./lottery.html";
				}else{
					H.utils.resize();
					showLoading();
					getResult('stock/index',{}, 'callbackStockIndex');
				}
			},
			
			initRule: function(data) {
				this.saveRule(data);
				
				if(!H.utils.isValidTime()){
					location.href = "./vote.html";
					return;
				}else{
					this.initBtns();
					this.$main.css("display","block");
					this.$footer.css("display","block");
				}
			},
			
			saveRule: function(data){
				$.fn.cookie("pst",timestamp(data.pst));
				$.fn.cookie("pet",timestamp(data.pet));
				$.fn.cookie("cut",timestamp(data.cut));
				$.fn.cookie("jgt",data.jgt);
			},
			
			initBtns: function() {
				if(openid){
					this.$btn_up.click(function(){
						getResult('stock/vote',{
							op:openid,
							type:'1',
						}, 'callbackStockVote');
					});
					
					this.$btn_down.click(function(){
						getResult('stock/vote',{
							op:openid,
							type:'2',
						}, 'callbackStockVote');
					});
				}else{
					this.$btn_up.addClass('none');
					this.$btn_down.addClass('none');
				}
			}
		};
		
		
		H.utils = {
			$body: $(".body"),
			$voteBtns: $(".vote-wrapper"),
			resize: function() {
				var height = $(window).height();
				this.$body.css("height",height - 48);
				
				if(height <= 420){
					/* iphone4 hack */
					this.$voteBtns.css("bottom","37px");
				}
			},
			isValidTime: function(){
				var current = $.fn.cookie("cut");
				var start = $.fn.cookie("pst");
				var end = $.fn.cookie("pet");

				if(current < start){
					alert("活动还未开始哦");
					return false;
				}else if(current > end){
					alert("活动已经结束了");
					return false;
				}else{
					var lastVoteTime = $.fn.cookie("lastVoteTime");
					var now = new Date();
					if(!lastVoteTime || now.getTime() - lastVoteTime > $.fn.cookie("jgt") * 1000 ){
						return true;
					}else{
						return false;
					}
				}
				return true;
			}
		};
		
		
		/**活动规则**/
		W.callbackStockIndex = function(data){
			if(data.code == 0){
				hideLoading();
				H.index.initRule(data);
			}
		}
		
		/**活动投票**/
		W.callbackStockVote = function(data){
			if(data.code == 0){
				var now = new Date();
				$.fn.cookie("lastVoteTime",now.getTime());
				$.fn.cookie("hasVoted","true");
				
				location.href = "./vote.html";
			}
		}
		
	})(Zepto);

	H.index.init();
});
