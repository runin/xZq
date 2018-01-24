WeixinApi.ready(function(Api) {
	var wxData = {
        "appId": '',
        "imgUrl" : share_img,
        "link" : add_param(share_url, 'resopenid', hex_md5(openid), true),
        "desc" : "请点击查收！",
        "title" : "我托沈阳电视台新闻频道寄给您送祝福啦！"
    };

    var wxCallbacks = {
        favorite : false,
        async:true,
        ready : function() {
            var href = add_param(share_url.replace(/[^\/]*\.html/i, 'postcard.html'), 'resopenid', hex_md5(openid), true);
            href = add_param(href, 'cu', H.dialog.cu, true);
            this.dataLoaded({
                title : "我托沈阳电视台新闻频道寄给您送祝福啦",
                link: add_yao_prefix(href),
                desc: "请点击查收！",
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
