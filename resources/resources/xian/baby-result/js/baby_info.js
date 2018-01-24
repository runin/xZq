var babyEachUuid = null;
$(function() {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/detail/" + getQueryString('babyInfoUuid'),
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			$("#bigPhoto").attr("src", data.babyInfoDto.bigPhoto);
			$("#name").empty().html(data.babyInfoDto.name);
			$("#introduction").empty().html(data.babyInfoDto.introduction);
			$("#ticket").empty().html(data.babyInfoDto.totalTicketNumber);
			$("#ranking").empty().html("第" + data.ranking + "名");
			babyEachUuid = data.babyEachDto.uuid;
			$("#share-ticket").removeClass("none");
			$("#baby-loading").addClass("none");
		},
		error : function() {
			$("#share-ticket").removeClass("none");
			$("#baby-loading").addClass("none");
		}
	});
});

function moreRang() {
	var url = 'history_list.html?babyEachUuid=' + babyEachUuid;
	if (gefrom != null && gefrom != '') {
		url = url + "&gefrom=" + gefrom;
	}
	location.href = url;
}