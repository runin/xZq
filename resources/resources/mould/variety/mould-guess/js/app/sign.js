/**
 * 老三热线--每日签到页
 */
(function($){
    H.sign = {
        $qiandao: $("#qiandao"),
        bt: '',
        currentTime: '',
        puid: '',
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        init: function(){
            this.round_sign();
            this.wxConfig();
            $("#back").click(function(e){
                e.preventDefault();
                if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
                toUrl('comment.html');
            });
        },
        //获取签到活动
        round_sign: function(){
            getResult('api/sign/round', {}, 'callbackSignRoundHandler', true);
        },
        //获取签到记录
        myrecord_sign: function(){
            getResult("api/sign/myrecord", {yoi:openid},"callbackSignMyRecordHandler",true);
        },
        event: function(){
            var me = H.sign;
            $(".sign-item").click(function(e) {
                e.preventDefault();
                var auid = $(this).attr("data-uuid");
                if($(this).hasClass("missed")){
                    return;
                }
                if($(this).hasClass("signed")){
                    return;
                }
                 if($(this).hasClass("unstart")){
                 	showTips("签到尚未开始")
                    return;
                }
                if($(this).hasClass("disabled")){
                    return;
                }else{
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/sign/signed' + dev,
                        data: {
                            yoi:openid, auid:auid, wxnn:nickname, wxurl:headimgurl
                        },
                        dataType : "jsonp",
                        jsonpCallback : 'callbackSignSignedHandler',
                        timeout: 11000,
                        complete: function() {
                        },
                        success : function(data) {
                            if(data.code == 0){
                            	showTips("签到成功");
                                $(".item-"+auid).addClass("signed").removeClass("unSign");
                                $(".item-"+auid).find(".item-img img").attr("src",$(".item-"+auid).find(".item-img img").attr("data-src"));
                                if(!H.sign.wxCheck){
				                    H.sign.luckResult(null);//摇一摇
				                    return;
				                }
                                H.sign.toLottery();
                            }else{
                            	showTips("签到失败")
                            }
                        },
                        error : function(xmlHttpRequest, error) {}
                    });
                }
            })
        },
        toLottery:function(){
            var me = this;
            shownewLoading();
            recordUserOperate(openid, "签到成功调用抽奖接口", "doLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Sign'+dev,
                data: { matk: matk },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4SignHandler',
                timeout: 11000,
                complete: function() {
                   hidenewLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        H.sign.luckResult(null);
                        return;
                    }
                    if(data.result){
    					H.sign.luckResult(data);
                    }else{
                        H.sign.luckResult(null);
                    }
                },
                error : function() {
                    H.sign.luckResult(null);
                }
            });
        },
        luckResult : function(data){
	        if(data == null || data.result == false || data.pt == 0){
	            H.dialog.thank.open();
	            return;
	        }else{
	            H.dialog.lottery.open(data);
	        }
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket',
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
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
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
    }
    W.callbackSignRoundHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
        	var t = simpleTpl(),items = data.items,len = data.items.length ;	
        	var now = timeTransform(new Date().getTime());
            t._('<ul class="none" data-uuid="'+data.puid+'">')
         		for(var i = len-1;i >= 0;i--){
		            t._('<li><div data-cpst ="'+comptime(items[i].st,now)+'" data-cpet ="'+comptime(items[i].et,now)+'" data-uuid="'+items[i].uid+'" class="sign-item item-'+items[i].uid+'"><span class="item-img"><img src="images/icon-wen.png" data-src="'+items[i].i+'" /></span><span class="item-text">'+items[i].t+'</span></div></li>')
		   
         		}
			t._('</ul>');
			$("#sign-items").html(t.toString());
			$("#sign-items ul li").css({
				"width":parseInt($("#sign-items").width()/3),
				"height":parseInt($("#sign-items").width()/3)
			});
			$(".sign-item").each(function(){	
            	if(parseInt($(this).attr("data-cpet")) >= 0){
            		$(this).addClass("missed");
                 }else if(parseInt($(this).attr("data-cpst"))<= 0){
                 	$(this).addClass("unstart");
                 }
            })
			me.myrecord_sign();
        }
    };
    W.callbackSignMyRecordHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
        	var items = data.items,len = items.length;
            if(items&&len>0){
            	for(var i = 0;i < len;i++){
            		//items[i].t小
            		$(".sign-item").each(function(){
            			if($(this).attr("data-uuid") == items[i].aid){
	            			$(this).addClass("signed");
	            			$(this).find(".item-img img").attr("src",$(this).find(".item-img img").attr("data-src"));
	            		}else{
	            			$(this).addClass("unsign");
	            		}
            		})
            	}
               
            }else{
               $("#sign-items ul li").addClass("unSign");
            }
            $("#sign-items ul").removeClass("none");
            me.event();
        }
    };
})(Zepto);
$(function(){
    H.sign.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.sign.isError){
                    H.sign.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.sign.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});