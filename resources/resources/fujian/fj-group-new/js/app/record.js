/**
 */
(function($) {
	H.record = {
		c:getQueryString("c"),
		init: function () {
			this.list();
			this.event_handler();
		},
		event_handler : function() {
			$("#back-btn").on("click",function(){
				if(H.record.c == "index"){
					window.location.href = "index.html";
				}else{
					window.location.href = "support.html";
				}
			});
		},
		list: function(){
			getResult('fjtv/record', {openid:openid}, 'callbackFjtvRecord', true);
		}
	}
	
	W.callbackFjtvRecord = function(data){
		var rcds = data.rcds;
		var t = simpleTpl();
		if(rcds == null){
             t._('<li>')
             	._('<span class="norecord">还没有中奖记录，继续加油哦~</span>')
             ._("</li>");
             $("#rcds").html(t.toString());
		}else{
			for(var i = 0;i < rcds.length;i++){
				var rcd = rcds[i];
				var img = rcd.pt == 4?"./images/red.png":rcd.ri;
				var cls = rcd.rs == 1?"accept":"noaccept";
				var licls = rcd.rs == 1?"yes":"no";
				var txt = rcd.rs == 1?"未领取":"已领取";
				var qrdata = "";
				var qrtxt = "";
				if(rcd.pt == 6){
					cls = "accept";
					licls = "yes"
					txt = "二维码";
					qrdata = rcd.key;
				}
				if(rcd.pt == 8){
					cls = "accept";
					licls = "yes"
					txt = "查看";
				}
				t._('<li class="'+licls+'" id="'+rcd.ru+'" data-source="'+qrdata+'">')
	             	._('<img src="'+img+'">')
	             	._('<div class="con">')
	             	._('<p class="prname">'+rcd.rn+'</p>')
	             	._('<p class="prtime">中奖时间：'+rcd.rt+'</p>')
	             	._('</div>')
	             	._('<a class="'+cls+'">'+txt+'</a>')
             	._("</li>");
			}
			$("#rcds").html(t.toString());
			$(".yes").on("click",function(){
				window.location.href = "award.html?ru="+$(this).attr("id");
			});
		}
	};
})(Zepto);

$(function(){
	H.record.init();
});


