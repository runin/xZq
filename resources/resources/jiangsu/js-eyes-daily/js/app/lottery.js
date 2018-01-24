/**
 * 江苏新闻眼日常版-话题投票页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		lotteryid : null,
		commActUid:null,
		attrUuid : "", 
		expires: {expires: 7},
		init : function(){
			var me = this;
			me.lotteryid = getQueryString("uid");
			me.currentCommentsAct();
			$("#btn-back").click(function(e){
					e.preventDefault();
					toUrl("index.html");
			});
			$(".outer").click(function(e){
				e.preventDefault();
				window.location.href = $(".outer").attr("data-href");
			})
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
		},
		bindClick: function(){
			var me = this;
			$("#btn-click").click(function(){
				if (H.comments.attrUuid == "") {
					alert("请选择您点赞的话题");
					return;
				}
				me.fill_masking(H.comments.attrUuid);
			});
		},
		currentCommentsAct : function() {
			getResult('express/themecomment/index/'+openid, {}, 'expressIndexHandler',true);
		},
		fill_masking : function(attrUuid){
			recordUserOperate(openid, "调用话题投票抽奖接口", "doSupportLottery");
			getResult('gzlive/themecomment/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid,lotteryid:H.comments.lotteryid}, 'supportHandler',true);
		}
	};

	W.expressIndexHandler = function(data){
		if(data.code == 0){
			$("#vote-title").html(data.actTle);
			H.comments.commActUid = data.actUid;
			var result = data.result;
			if(result != null && result.length != 0){
				var sumCount = data.count;
				var sumPercent = 0;
				var t = simpleTpl(), $sx_ul = $('#progress ul');
				for (var i = 0, len = result.length; i < len; i++) {
					var percent = (result[i].ac/sumCount * 100).toFixed(0);
					if(i == result.length-1){
						percent = (100.00 - sumPercent).toFixed(0);
					}
					t._('<li data-uuid = "'+ result[i].au +'">')
						._('<label>'+ result[i].av+'</label>')
						._('<p class="support-pro"><span class="bar" style="width:'+(percent)+'%;"></span><span class="lv">'+percent+'%</span></p>')
					._('</li>');
					sumPercent += percent * 1;
				}
				$sx_ul.html(t.toString());
				$(".progress li").each(function(){
				var me = $(this);
					if(me.attr("data-uuid")==data.flag){
						me.addClass("selected");
					}
				});			
				$("#progress").removeClass("none")
				$('#sup').addClass("none");
				return;
		    }
			var attrs = data.attrs;
			if(attrs != null && attrs.length != 0){
				var me = this, t = simpleTpl(), $sx_ul = $('#sup ul');
				for (var i = 0, len = attrs.length; i < len; i++) {
						t._('<li data-uuid = "'+ attrs[i].au +'">'+attrs[i].av+'</li>');	
				}
				$sx_ul.html(t.toString());
				$("#sup").removeClass("none")
				$sx_ul.removeClass("none");
				H.comments.bindClick();
				if (data.actType == 1) {
						$sx_ul.find("li").click(function() {
							if ($(this).attr("disabled") == "disabled") {
								return;
							}
							H.comments.attrUuid = $(this).attr("data-uuid");
							$sx_ul.find("li").removeClass("selected");
							$(this).addClass("selected");
						});
				} 
			return;
			}			
		}
	}


	
	W.supportHandler = function(data){
		if(data.code != 1){
			if(data.code = 3){
				H.dialog.lottery.open(data,2);
			}
			var sumCount = data.count;
			var sumPercent = 0;
			var result = data.result;
			var t = simpleTpl(), $sx_ul = $('#progress ul');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (result[i].ac/sumCount * 100).toFixed(0);
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				}
				t._('<li data-uuid = "'+ result[i].au +'">')
					._('<label>'+ result[i].av+'</label>')
					._('<p class="support-pro"><span class="bar" style="width:'+(percent)+'%;"></span><span class="lv">'+percent+'%</span></p>')
				._('</li>');
				sumPercent += percent * 1;
			}
			$sx_ul.html(t.toString());
			$(".progress li").each(function(){
				var me = $(this);
					if(me.attr("data-uuid")==data.flag){
						me.addClass("selected");
					}
				});
			$("#progress").removeClass("none")
			$('#sup').addClass("none");
			$("#btn-click").addClass("none");
			$sx_ul.removeClass("none");
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj").html(data.desc);
			$(".outer").attr("data-href",jumpUrl).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);
$(function(){
	H.comments.init();
});