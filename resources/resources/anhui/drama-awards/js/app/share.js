WeixinApi.ready(function(Api) {
	
	var wxData = {
        "appId": shaketv_token,
        "imgUrl" : share_img,
        "link" : add_param(share_url.replace('stars.html', 'index.html'), 'resopenid', hex_md5(openid), true),
        "desc" : share_desc,
        "title" : share_title
    };

    var wxCallbacks = {
        favorite : false,
        async:true,
        ready : function() {
        	var $btn_send = $('#btn-sendcard');
        	if ($btn_send && !$btn_send.hasClass('shared')) {
        		$btn_send.trigger('click');
        	}
            this.dataLoaded({
                title : share_title,
                link: add_yao_prefix(add_param(share_url.replace('stars.html', 'index.html'), 'resopenid', hex_md5(openid), true)),
                desc: share_desc,
                imgUrl: share_img
            });
        }
    };

    Api.shareToFriend(wxData, wxCallbacks);
    Api.shareToTimeline(wxData, wxCallbacks);
    Api.generalShare(wxData,wxCallbacks);
});