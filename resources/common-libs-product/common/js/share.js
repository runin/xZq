WeixinApi.ready(function(Api) {
	var wxData = {
        "appId": '',
        "imgUrl" : share_img,
        "link" : '',
        "desc" : share_desc,
        "title" : share_title
    };

    var wxCallbacks = {
        favorite : false,
        async:true,
        ready : function() {
        	// 分享动态内容的，在这里设置
            this.dataLoaded({
                title : share_title,
                link: add_yao_prefix(share_url),
                desc: share_desc,
                imgUrl: share_img
            });
        },
        confirm: function(resp) {
        	var starName = W['localStorage'].starName;
        	if (starName) {
        		H.dialog.confirm.open();
        	}
        }
    };

    Api.shareToFriend(wxData, wxCallbacks);
    Api.shareToTimeline(wxData, wxCallbacks);
    Api.generalShare(wxData,wxCallbacks);
});
