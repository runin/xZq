/**
 */
(function($) {
	H.record = {
        isReady:false,
        ru: "",
		init: function () {
			this.list();
			this.event_handler();
		},
		event_handler : function() {
			$("#back-btn").on("click",function(){
                toUrl("main.html");
			});
		},
		list: function(){
            var endDate = getBeforeDate(15);
			getResult('api/lottery/record', {
                oi:openid,
                pt:7,
                su:2,
                bd:endDate
            }, 'callbackLotteryRecordHandler', true);
		},
		wxConfig: function(){
			//后台获取jsapi_ticket并wx.config
			getResult("mp/jsapiticket", {
				appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
		},
        readyFunc:function(){
            $(".accept").click(function(e) {
                e.preventDefault();
                var me = $(this);
                H.record.ru = me.parent().attr("id");
                if(!H.record.isReady){
                    showTips("网络不给力，请刷新页面稍后再试~",4,3000);
                }
                shownewLoading();
                if(!me.hasClass("flag")){
                    me.addClass("flag");
                    var ci = me.parent().attr("data-ci");
                    var ts = me.parent().attr("data-ts");
                    var si = me.parent().attr("data-si");
                    //卡券
                    wx.addCard({
                        cardList: [{
                           cardId: ci,
                           cardExt: "{\"timestamp\":\""+ ts +"\",\"signature\":\""+ si +"\"}"
                        }], 
                        success: function (res) {
                            getResult('api/lottery/receive', {
                                oi: openid,
                                ru: H.record.ru
                            }, 'callbackLotteryReceiveHandler', true);
                        },
	                   	fail: function(res){
                            recordUserOperate(openid, res.errMsg, "cctv7-meet-record-fail");
//                            var err_msg = res.err_msg;
//                            if(err_msg != "addCard:cancel" && err_msg != "addCard:fail" && err_msg != "addCard:ok"){
//                                showTips("网络不给力，请刷新页面稍后再试~",4,3000);
//                            }
	                   	},
	                   	complete:function(){
	                   		me.removeClass("flag");
                            hidenewLoading();
	                   	}
                    });
                }
            });
        }
	}
	
	W.callbackLotteryRecordHandler = function(data){
		var t = simpleTpl();
		if(!data.result){
             t._('<li>')
             	._('<span class="norecord">还没有中奖记录，继续加油哦~</span>')
             ._("</li>");
             $("#rcds").html(t.toString());
		}else{
            var rcds = data.rl;
			for(var i = 0;i < rcds.length;i++){
				var rcd = rcds[i];
				t._('<li id="'+rcd.ru+'" data-ci="'+rcd.ci+'" data-ts="'+rcd.ts+'" data-si="'+rcd.si+'">')
	             	._('<img src="./images/quan.png">')
	             	._('<div class="con">')
	             	._('<p class="prname">'+rcd.pn+'</p>')
	             	._('<p class="prtime">中奖时间：'+rcd.lt+'</p>')
	             	._('</div>')
	             	._('<a class="accept">查看</a>')
             	._("</li>");
			}
			$("#rcds").html(t.toString());
			H.record.readyFunc();
		}
	};

	W.callbackJsapiTicketHandler = function(data) {  
        var url = window.location.href.split('#')[0];
   	 	var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
   	 	var timestamp = Math.round(new Date().getTime()/1000);
		var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
        //权限校验
		wx.config({
           debug: false,
           appId: shaketv_appid,
           timestamp: timestamp,
           nonceStr:nonceStr,
           signature:signature,
           jsApiList: [
             "addCard"
           ]
        }); 
     };
    W.callbackLotteryReceiveHandler = function(data) {
        if(data.result){
            $("#"+ H.record.ru).remove();
        }
    };
})(Zepto);

$(function(){
	shownewLoading();
	//config微信jssdk
	H.record.wxConfig();
	
	wx.ready(function () {
        H.record.isReady = true;
		//wx.config成功
		//执行业务代码
		H.record.init();
	});

	wx.error(function(res){
		//alert(JSON.stringify(res));
		//wx.config失败，重新执行一遍wx.config操作
		//H.record.wxConfig();
	});
});


