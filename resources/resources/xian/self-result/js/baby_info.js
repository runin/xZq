$(function() {
	getResult("baby/detail/" + getQueryString('babyInfoUuid'), {}, 'callbackBabyDetailHandler',true);
});
window.callbackBabyDetailHandler = function(data){
	if(data.result){
		$("#bigPhoto").attr("src", data.p);
		$("#name").empty().html(data.n);
//		$("#introduction").empty().html(data.indesc);
		$("#ticket").empty().html(data.ttn);
		$("#ranking").empty().html("第" + data.ranking + "名");
		$('body').data('euid', data.euid || 0);
		$("#share-ticket").removeClass("none");
		$("#baby-loading").addClass("none");
	}else{
		alert(data.message);
		backUrl("index.html");
	}
}

function moreRang() {
	backUrl('history_list.html?babyEachUuid=' + $('body').data('euid'));
}