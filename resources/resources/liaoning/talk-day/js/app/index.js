/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		init: function () {
			this.event_handler();
			$(".enter img").attr("src","images/title.png");
			$(".enter img").get(0).onload = function(){
				var me = this;
				$(".enter-box").removeClass("none");
				H.index.type();
			}
			$(".say").attr("src","images/say.png")
			$(".say").get(0).onload = function(){
				var me = this;
				$(this).addClass("rotateInDownRight");
				$(".say-word").addClass("show");	
			}
		},
		
		event_handler : function() {
			$(".enter-btn").click(function(e){
				e.preventDefault();
				toUrl("join.html")
			});
		},
		type : function(){
			var index = 0;
			var word = "talk show |";
			var typeWord = function(){
				if(index <= word.length){
					$("#go").html(word.substring(0,index++)) ;
				}else{
					clearInterval(timer);
					return;
				}
				
				
			};
			var timer = setInterval(function(){
				typeWord();
			},200);
			
		}
	}

})(Zepto);                             

$(function(){
	H.index.init();
});


