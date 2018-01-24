(function($){
    H.card = {
    	cu : getQueryString("cu"),
    	type :getQueryString("type"),
    	serverVoiceID : "",
        init: function(){
            this.init_card();
            H.share.init(this.cu);
            this.event();
        },
        event: function(){
            var me = this;
            $('#wyzhk').click(function(e){
                e.preventDefault();
                toUrl("make.html");
            });
            $('#ok').click(function(e){
                e.preventDefault();
                H.dialog.share.open();
            });
            $('#btn-play').click(function(e) {
                e.preventDefault();
                if(H.voice.downloadFlag) {
                    if ($('#btn-play').hasClass('play')) {
                        H.voice.stopVoice(H.card.localVoiceID);
                        $('#btn-play').removeClass('play');
                     } else {
                        $('#btn-play').addClass('play');
                         H.voice.playVoice(H.card.localVoiceID);
                     }
                 } else {
                     showTips('音频正在下载中，请稍等');
                     H.voice.playDownloadVoice(H.card.serverVoiceID)
                 }
              
             }) 
     	},
     	init_card :function(){
     		var me = this;
     		if(me.type == "make"){
     			shownewLoading(null, '贺卡制作中...');
		        $("#wyzhk").addClass("none");
		        $("#ok").removeClass("none");
		    }else{
		    	shownewLoading(null, '贺卡收取中...');
		        $("#wyzhk").removeClass("none");
		        $("#ok").addClass("none");
		    }
		    if(getQueryString("from") == "share"){
		        H.dialog.tip.open();
		    }
            if (me.cu) {
                $.ajax({
	                type: 'GET',
	                async: true,
	                url: domain_url + 'api/ceremony/greetingcard/get' + dev,
	                data: {cu: me.cu},
	                dataType: "jsonp",
	                jsonpCallback: 'callbackCardInfoHandler',
	                complete: function() {hidenewLoading()},
	                success: function(data) {
		                 if (data.result) {
		                 	 $(".push_img").attr("src", data.ou ||"images/default-head.png");
		                 	 $("#hk").attr("src","images/card/"+(data.sn||"images/card/hk1")+".jpg");
		                 	 $(".head_img img").attr("src", data.hi || "images/default-head.png");
		                 	 //祝福语
		                 	if (data.gt != ''|| data.gt.length > 0) {
		                 		$(".zfy").val(data.gt).attr("disabled","disabled")
				             	$(".card-word").removeClass("none");
				             	$(".card-voice").addClass("none");
				            }
		                 	if (data.vi&&data.vi != '') {
		                 		H.card.serverVoiceID = data.vi;
		                 		if(wxIsReady){
		                 			 H.voice.downloadVoice(data.vi);
		                 			 $(".card-voice").css({
		                 			 	"visibility": "visible"
		                 			 })
		                 		}
						        $(".card-word").addClass("none");
						        $(".card-voice").removeClass("none");
					        } 
		                 }else{
		                 	toUrl("make.html");
		                 }
	                 },
	                 error: function(xmlHttpRequest, error) {toUrl("make.html");}
	                });
	          }else{
	               toUrl("make.html")
	          }
     	}
    };      
})(Zepto);
$(function(){
	H.wxRegister.ready();
    H.wxRegister.init();
    H.card.init();
});
