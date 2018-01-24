
(function($){
	H.index = {
       init : function(){
       	   this.car_record();
       },
       car_record: function(){
       	 getResult("api/lottery/allrecord",{at:1,pt:1,ol:1},"callbackLotteryAllRecordHandler");
       }
	}
	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var h = "images/danmu-head.jpg"
			var prize_list = data.rl,t = simpleTpl();
			for (var i = 0;i<prize_list.length;i++) {
				t._('<li>')
	  	    		._('<div class="prize-item">')
						._('<label><img src="'+(prize_list[i].hi||h)+'"/></label>')
						._('<div>')
							._('<p>'+(prize_list[i].un||"匿名用户")+'</p>')
							._('<p><span>城市：'+(prize_list[i].cn||"***********") +'</span><span>电话：'+(prize_list[i].up||"***********")+'</span> </p>')
						._('</div>')
					._('</div>')
				._('</li>')
			}
			$(".prize-list").html(t.toString());
		}else{
			$(".prize-list").html('<div class="no-prize"><p>汽车大奖还在</p><p>抓紧时间摇吧</p></div>');
		}
	}
})(Zepto)


$(function(){
	H.index.init();
});

