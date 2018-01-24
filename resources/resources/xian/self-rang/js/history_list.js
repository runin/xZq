$(function() {
	getResult("baby/each/" + getQueryString('babyEachUuid'), {}, 'callbackBabyEachHistoryHandler',true);
});

function spellHistoryHtml(item) {
	var url = "javascript:toUrl('baby_info.html?babyInfoUuid=" + item.uid + "');";
	return '<figure class="active_box fd"><span class="nums">' + item.r
			+ '</span><a href="' + url + '" data-collect="true" data-collect-flag="baby-history_list-img-detail-btn" data-collect-desc="往期图片进入详情" ><img src="' + item.p + '" width="116"><figcaption><h4>'
			+ item.n + '</h4><p>票数：' + item.ttn + '</p></figcaption></a></figure>';
}

window.callbackBabyEachHistoryHandler = function(data){
	if (data.result) {
		$("#which_qi").empty().html("第" + data.wq + "期");
		$.each(data.items, function(index, item) {
			$("#all_baby_infos").append(spellHistoryHtml(item));
		});
		$("#baby-loading").addClass("none");
		$("#hls").removeClass("none");
	} else {
		alert("没有该期信息！");
		backUrl("index.html");
	}
}
