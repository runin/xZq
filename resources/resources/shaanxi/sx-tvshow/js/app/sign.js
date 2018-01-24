(function($){
	// 弹幕_S
	H.sign = {
		signUuid : null,
		init : function(){
			var me = this;
			me.get_sign_act();
			me.query_jf();
			me.event();
		},
		event : function(){
			$("#btn-sign").click(function(e){
				e.preventDefault();
				if($(this).hasClass("signed")){
					return;
				}
				if($(this).hasClass("error")){
					showTips("未在签到活动时间段内");
					return;
				}
				H.sign.sign_save_current(H.sign.signUuid);
			});
		},
		//获取签到活动
		get_sign_act :function(){
			getResult('api/sign/round', {}, 'callbackSignRoundHandler');
		},
		query_jf : function(){
			getResult('api/lottery/integral/my', {oi:openid}, 'callbackIntegralMyHandler');
		},
		is_sign_current : function(signUuid){
			getResult('api/sign/issign', {yoi :openid, auid : signUuid}, 'callbackSignIsHandler');
		},
		sign_save_current : function(signUuid){
			getResult('api/sign/signed', {yoi :openid, auid : signUuid,wxnn:nickname||"",wxurl:headimgurl||""}, 'callbackSignSignedHandler');
		}
	}
	W.callbackSignRoundHandler = function(data){
		
		if(data&&data.code == 0){
			var items = data.items,
				day = timeTransform(parseInt(data.cud)).split(" ")[0],
				currentItem = null;
			if(items&&items.length>0){
				for ( var i = 0; i < items.length; i++) {
	                if(items[i].st.split(" ")[0] == day){
	                  currentItem = items[i];
	                }
	            }
				if(currentItem&&currentItem !=null){
					H.sign.signUuid = currentItem.uid;
		    		H.sign.is_sign_current(H.sign.signUuid)
				}else{
					$("#btn-sign").addClass("error").addClass("none");
				}
			}else{
				$("#btn-sign").addClass("error").addClass("none");
			}
		}else{
			$("#btn-sign").addClass("error").addClass("none");
		}
	}
	W.callbackSignIsHandler = function(data){
		if(data&&data.result == false){
			$("#btn-sign").text("签到").removeClass("none");
		}else{
			$("#btn-sign").text("已签到").removeClass("none").addClass("signed");
		}
	}
	W.callbackSignSignedHandler = function(data){
		if(data&&data.code == 0){
			showTips("<span>+"+data.signVal+"</span>");
			$(".tips").addClass("jf-tip");
			$("#btn-sign").text("已签到").removeClass("none").addClass("signed");
			$(".jf").html("<span class='jfNum'>"+((parseInt($(".jfNum").html())+parseInt(data.signVal))||0)+"</span>积分");
	
		}else{
			showTips("签到失败");
			$("#btn-sign").addClass("none").removeClass("signed");
		}
	}
	W.callbackIntegralMyHandler = function(data){
		if(data&&data.result == true){
			$(".jf").html("<span class='jfNum'>"+(data.in||0)+"</span>"+"积分");
		}
	}
})(Zepto);

