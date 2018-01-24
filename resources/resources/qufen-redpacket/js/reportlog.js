+(function() {
    window.callbackReportlogHandler = function() {}
    var type = getQueryString("isShare") == 1 ? 1 : 0;
    $.ajax({
        type: "get",
        async: true,
        url: domain_url + "api/common/reportlog",
        dataType: "jsonp",
        jsonp: "callbackReportlogHandler",
        data: {
            bp: window.baseOpenid,
            opid: businessId,
            type: type
        },
        success: function(data) {}
    });
})();

+ (function() { //点击留统计 
    $('body').delegate("*[data-collect=true]", "click", function(e) {
        if (!window.baseOpenid) {
            window.baseOpenid = $.fn.cookie(KEY_BASEOPENID);
        }
        if (!window.baseOpenid || !businessId || !$(this).attr("data-flag") || !businessId) {
            return;
        }
        e.preventDefault();
        if ($(this).attr('data-stoppropagation') == 'true') {
            e.stopPropagation();
        }
        $.ajax({
            type: "get",
            async: true,
            url: domain_url + "api/common/reportclick",
            dataType: "jsonp",
            jsonp: "callbackReportlogHandler",
            data: {
                bp: window.baseOpenid,
                opid: businessId,
                omid: $(this).attr("data-flag"),
                omsg: $(this).attr("data-desc")
            },
            success: function(data) {}
        });
    });
})(); + (function() { //是否已经关注公众号
    window.callbackUserInfoHandler = function(data) {
        if (data.code == 0) {
            if (data.s == 1) {
                $.fn.cookie("subscribe_" + openid, data.s, { expires: 1 });
            }
        }
    }
    if (!$.fn.cookie("subscribe_" + openid)) {
        $.ajax({
            type: "get",
            async: true,
            url: domain_url + "api/weixin/auth/userinfo",
            dataType: "jsonp",
            jsonp: "callbackUserInfoHandler",
            data: {
                ou: businessId, //  运营商id，必填
                op: openid, //  用户openid，必填
                cop: window.codeOpenid // 用户codeopenid，必填
            },
            success: function(data) {
            }
        });
    }
})();
