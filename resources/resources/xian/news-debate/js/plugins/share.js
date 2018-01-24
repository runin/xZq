WeixinApi.ready(function(Api) {
	var wxData = {
        "appId": '',
        "imgUrl" : share_img,
        "link" : add_param(share_url, 'resopenid', hex_md5(openid), true),
        "desc" : share_desc,
        "title" : share_title
    };

    var wxCallbacks = {
        favorite : false,
        async:true,
        ready : function() {
            this.dataLoaded({
                title : share_title,
                link: add_yao_prefix(add_param(share_url, 'resopenid', hex_md5(openid), true)),
                desc: share_desc,
                imgUrl: share_img
            });
        },
        confirm: function(resp) {
	    	//recordUserOperate(openid, '分享成功', 'share-success');
        }
    };

    Api.shareToFriend(wxData, wxCallbacks);
    Api.shareToTimeline(wxData, wxCallbacks);
    Api.generalShare(wxData,wxCallbacks);
});
