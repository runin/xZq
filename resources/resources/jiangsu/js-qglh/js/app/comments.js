/**
 * 广州第一现场-评论页
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
			$(".back").click(function(e){
					e.preventDefault();
					toUrl("index.html");
			});
		},
		bindClick: function(){
			var me = this;
			
			$("#btn-vote").click(function(){
				if (H.comments.attrUuid == "") {
					alert("请选择您赞同的观点");
					return;
				}
				me.fill_masking(H.comments.attrUuid);
			})
		},
		currentCommentsAct : function() {
			getResult('express/themecomment/index/'+openid, {}, 'expressIndexHandler',true);
		},
		fill_masking : function(attrUuid){
			getResult('gzlive/themecomment/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid,lotteryid:H.comments.lotteryid}, 'supportHandler',true);
		}
	};

	W.expressIndexHandler = function(data){
		if(data.code == 0){
			H.comments.commActUid = data.actUid;
			if (data.actType == 1) {	
				$("#vote-title").text(data.actTle+"(单选)");
			}else if(data.actType == 2){
				$("#vote-title").text(data.actTle + "(可多选)");
			}
			var result = data.result;
			if(result != null && result.length != 0){
				var sumCount = data.count;
				var sumPercent = 0;
				var t = simpleTpl(), $sx_ul = $('#progress');
				for (var i = 0, len = result.length; i < len; i++) {
					var percent = (result[i].ac/sumCount * 100).toFixed(0);
					if(i == result.length-1){
						percent = (100.00 - sumPercent).toFixed(0);
					}
					t._('<p>')
						._('<label>'+ result[i].av +'<span class="lv">'+percent+'%</span>'+'</label>')
						._('<i class="support-pro"><span style="width:'+(percent-2)+'%;background:'+result[i].acl+'"></span></i>')
					._('</p>');
					sumPercent += percent * 1;
				}
				$sx_ul.html(t.toString());
				$("#btn-vote").addClass("none");
				$sx_ul.removeClass("none");
				$(".tips").removeClass("none");
				
				return;
		    }
			var attrs = data.attrs;
			if(attrs != null && attrs.length != 0){
				var me = this, t = simpleTpl(), $sx_ul = $('#sup');
				for (var i = 0, len = attrs.length; i < len; i++) {
					if(attrs[i].ai != ""){
						t._('<p class="support"  data-uuid = "'+ attrs[i].au +'">'+attrs[i].av+'</a>');
					}else{
						t._('<p class="support"  data-uuid = "'+ attrs[i].au +'">'+attrs[i].av+'</a>');
					}
				}
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				H.comments.bindClick();
				
				if (data.actType == 1) {
						$("#sup").find(".support").click(function() {
							if ($(this).attr("disabled") == "disabled") {
								return;
							}
							H.comments.attrUuid = $(this).attr("data-uuid");
							$("#sup").find(".support").removeClass("selected");
							$(this).addClass("selected");
						});
					} else if (data.actType == 2) {
						var attrUuids="";
						$("#sup").find(".support").click(function() {
						$(this).toggleClass('selected');
							if ($(this).hasClass('selected')) {
								attrUuids += $(this).attr('data-uuid')+",";
								H.comments.attrUuid = attrUuids.substring(0,attrUuids.length-1);
							} else {
								H.comments.attrUuid = H.comments.attrUuid.replace(","+ $(this).attr('data-uuid'),"");
							}
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
			var t = simpleTpl(), $sx_ul = $('#progress');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (result[i].ac/sumCount * 100).toFixed(0);
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				}
				t._('<p>')
					._('<label>'+ result[i].av +'<span class="lv">'+percent+'%</span>'+'</label>')
					._('<i class="support-pro"><span style="width:'+(percent-2)+'%;background:'+result[i].acl+'"></span></i>')	
				._('</p>');
				sumPercent += percent * 1;
			}
			
			$sx_ul.html(t.toString());
			$('#sup').addClass("none");
			$("#btn-vote").addClass("none");
			$sx_ul.removeClass("none");
			$(".tips").removeClass("none");
		}
	}
})(Zepto);
$(function(){
	H.comments.init();
});