/**
 * 央视两会
 */
(function($) {
	H.index = {
		$main : $('#main'),
		commActUid : null,
		attrUuid : "",
		init : function() {
			var me = this;
			this.currentCommentsAct();
			this.event_handler();
			// 一键关注
			window['shaketv'] && shaketv.subscribe(follow_shaketv_appid, function(returnData){
				// console.log(returnData.errorMsg);
			});
		},
		event_handler : function() {
			$("#submitBtn").click(function() {
				if ($(this).attr("disabled") == "disabled") {
					return;
				}
				if (H.index.attrUuid == "") {
					alert("请选择您赞同的观点");
					return;
				} else {
					H.index.attrUuid = H.index.attrUuid.substring(1);
				}
				$(this).attr("disabled", "disabled");
				getResult("cctv/save?openid=" + openid
						+ "&surveyInfoUuid=" + H.index.commActUid
						+ "&checkedParams=" + H.index.attrUuid, {},
						'callbackSurveySaveHander', true);
			});
		},
		currentCommentsAct : function() {
			getResult("cctv/current", {},'callbackSurveyCurrentHander', true);
		}
	};

	W.callbackSurveyCurrentHander = function(data) {
		if (data.code == 1) {
			H.index.commActUid = data.sinfo.uuid;
			var info_cookie = $.fn.cookie(service_no +"_news_uuid");
			var attrs = data.sinfo.tlist;
			if (attrs != null && attrs.length != 0) {
				if (info_cookie != H.index.commActUid) {
					var me = this, t = simpleTpl(), $sx_ul = $('#progress');
					for ( var i = 0, len = attrs.length; i < len; i++) {
						t._('<li data-uuid = "' + attrs[i].tuuid + '"><i></i>'+ attrs[i].sv + '</li>');
					}
					$sx_ul.html(t.toString());
					if (data.sinfo.type == 1) {
						$("#title").text(data.sinfo.tt);
						$("#progress").find('li').click(function() {
							if ($(this).attr("disabled") == "disabled") {
								return;
							}
							H.index.attrUuid = $(this).attr("data-uuid");
							$("#progress").find("i").removeClass("selected");
							$(this).find("i").addClass("selected");
						});
					} else if (data.sinfo.type == 2) {
						$("#title").text(data.sinfo.tt + "(可多选)");
						$("#progress").find('li').click(function() {
							if ($(this).attr("disabled") == "disabled") {
								return;
							}
							$(this).find("i").toggleClass('selected');
							if (!$(this).hasClass('selected')) {
								H.index.attrUuid += ","+ $(this).attr('data-uuid');
							} else {
								H.index.attrUuid = H.index.attrUuid.replace(","+ $(this).attr('data-uuid'),"");
							}
						});
					}
					$(".select-content").removeClass("none");
				} else {
					window['shaketv'] && shaketv.wxShare(share_img, H.share.getTitle(), share_desc, H.share.getUrl());
					var sumCount = data.count;
					$("#sumCount").text($("#sumCount").text() + data.cu + "人");
					var sumPercent = 0;
					var t = simpleTpl(), $sx_ul = $('#resultli');
					for ( var i = 0, len = attrs.length; i < len; i++) {
						var percent = Math.floor(attrs[i].ac / sumCount * 100);
						if (i == attrs.length - 1) {
							percent = Math.floor(100.00 - sumPercent);
						}
						t._('<li>')
							._('<label>' + attrs[i].sv + '<span>' + percent+ '%</span></label>')
							._('<i class="support-pro"><span style="width:'+ percent + '%"></span></i>')
						._('</li>');
						sumPercent += percent * 1;
					}
					$sx_ul.html(t.toString());
					$(".select-result").removeClass("none");
				}
			}

		}
	}

	W.callbackSurveySaveHander = function(data) {
		if (data.result) {
			$.fn.cookie(service_no +"_news_uuid", H.index.commActUid,{expires: 30});
			$.fn.cookie(service_no +"_news_cu", data.cu ,{expires: 30});

			window.location.href = window.location.href;
		} else {
			$("#submitBtn").addClass("gray");
			$("#submitBtn").attr("disabled", "disabled");
			$("#progress").find('li').attr("disabled", "disabled");
		}
	}
	
	H.share = {
			getUrl: function() {
				var href = window.location.href;
				href = href.replace(/[^\/]*\.html/i, 'index.html');
				href = add_param(href, 'resopenid', hex_md5(openid), true);
				href = add_param(href, 'from', 'share', true);
				return add_yao_prefix(href);
			},
			getTitle: function() {
	        	var news_cu = $.fn.cookie(service_no +"_news_cu");
	        	if (news_cu) {
	        		share_title = poll_share_val.replace("%s", news_cu);
	        	}
				return share_title;
			}
		};
})(Zepto);
$(function() {
	window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, H.share.getUrl());
	H.index.init();
});