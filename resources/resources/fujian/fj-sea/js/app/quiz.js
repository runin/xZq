/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		right_uuid : null,
		quizInfoUuid:null,
		isCanLottery :false,
		prizeResultUuid :null,
		init: function () {
			this.event_handler();
			this.quiz_info();
		},
		event_handler : function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$('.back-index').click(function(e) {
				e.preventDefault();
				window.location.href="index.html";
			}); 
			$('.za').click(function(e) {
				e.preventDefault();
				if(!H.index.isCanLottery){
					return;
				}
				H.index.isCanLottery = false;
				$(".chui").addClass("zaegg");
				getResult('earsonme/quiz/lottery', {openid:openid,actUuid:H.index.quizInfoUuid}, 'earsonmeLotteyrHandler',true);
			});
		},
		quiz_info : function(){
			getResult('earsonme/quiz/index/'+openid, {}, 'earsonmeIndexHandler',true);
		},
		bindClick :function(){
			$(".quiz-select").each(function(){
				$(this).click(function(){
					$(".quiz-select").removeClass("selected");
					$(this).addClass("selected");
					H.index.right_uuid = $(this).attr("attrs_uuid");
				})
			});
			$("#quiz-confrim").click(function(){
				if($(".quiz-item").find(".selected").length == 0){
					alert("请您选择答案");
					return;
				}else{
					getResult('earsonme/quiz/answer', {openid:openid,quizInfoUuid:H.index.quizInfoUuid,attrUuid:H.index.right_uuid}, 'earsonmeAnswerHandler',true);
				}
			});
			
		}
		
	};
	W.earsonmeIndexHandler = function(data){
		if(data.code == 0){
			H.index.quizInfoUuid = data.qu;
			if(data.qf){//未答题可以答题
				var t = simpleTpl();
				t._('<div class="quiz-item" data_uuid="'+data.qu+'">')
					 ._('<h2>'+data.qt+'</h2>')
				 ._('</div>');
				$("#quiz-info").append(t.toString());
				t = simpleTpl();
				for(var i = 0;i<data.qa.length;i++){
					var attrs = data.qa[i];
					t._('<span class="quiz-select" attrs_uuid="'+attrs.au+'">'+attrs.ai+'</h2></span>');
				}
				$(".quiz-item").append(t.toString());
				$(".quiz").removeClass("none");
				$(".quiz-wrong").addClass("none");
				$(".quiz-right").addClass("none");
				H.index.isCanLottery = true;
				H.index.bindClick();
			}else{//答过题目不能答题
				if(data.qff){//答对了
					if(data.qlf){//未抽过奖可以抽奖
						H.index.isCanLottery = true;
						$(".quiz").addClass("none");
						$(".quiz-wrong").addClass("none");
						$(".quiz-right").removeClass("none");
					}else{//已经抽过奖
						H.index.prizeResultUuid = data.pr;
						H.dialog.lottery.open(H.index.prizeResultUuid);
						H.dialog.lottery.award(data);
					}
				}else{
					$(".quiz").addClass("none");
					$(".quiz-right").addClass("none");
					$(".quiz-wrong").removeClass("none");
				}
			
			}
		
		}else{
			$("#quiz-info").append("<p>活动尚未开始</p>");
			$("#quiz-info p").css({"color":"#fff","font-size":"16px","line-height":"130px","text-align":"center"});
			$("#quiz-confrim").addClass("none");
			$(".quiz").removeClass("none");
		}
	};
	W.earsonmeAnswerHandler = function(data){
		if(data.code == 0){
			if(data.ar){
				$(".quiz").addClass("none");
				$(".quiz-wrong").addClass("none");
				$(".quiz-right").removeClass("none");
			}else{
				$(".quiz").addClass("none");
				$(".quiz-right").addClass("none");
				$(".quiz-wrong").removeClass("none");
			}
		}
	};
	W.earsonmeLotteyrHandler = function(data){
		if(data.code == 0){
			H.index.prizeResultUuid = data.pr;
			H.dialog.lottery.open(H.index.prizeResultUuid);
			H.dialog.lottery.award(data);
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});


