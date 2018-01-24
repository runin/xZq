function spellHistoryHtml(item) {
	var url = "javascript:toUrl('baby_info.html?babyInfoUuid=" + item.uuid + "');";
	return '<figure class="active_box fd"><span class="nums">' + item.rankIndex
			+ '</span><a href="' + url + '" data-collect="true" data-collect-flag="baby-history_list-img-detail-btn" data-collect-desc="往期图片进入宝宝详情" ><img src="' + item.photo + '" width="116"><figcaption><h4>'
			+ item.nickname + ":" + item.name + '</h4><p>票数：'
			+ item.totalTicketNumber + '</p></figcaption></a></figure>';
}
	
$(function() {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/each/" + getQueryString('babyEachUuid'),
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.result) {
				$("#which_qi").empty().html(
						"第" + data.babyEachDto.whichQi + "期萌宝宝");
				$.each(data.babyInfoDtos, function(index, item) {
					$("#all_baby_infos").append(spellHistoryHtml(item));
				});
				$("#baby-loading").addClass("none");
				$("#hls").removeClass("none");
			} else {
				alert("没有该期信息！");
				var url = "index.html";
				if (gefrom != null && gefrom != '') {
					url = url + "?gefrom=" + gefrom;
				}
				location.href= url;
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
});