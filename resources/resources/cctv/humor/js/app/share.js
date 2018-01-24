WeixinApi.ready(function(Api) {
	
	var wxData = {
        "appId": '',
        "imgUrl" : share_img,
        "link" : share_url,
        "desc" : share_desc,
        "title" : share_title
    };

    var wxCallbacks = {
        favorite : false,
        async:true,
        ready : function() {
        	var $curr = $('.page.current'),
        		title = $curr.attr('data-title'),
        		guid = $curr.attr('data-guid');
        	
			share_title = title ? ('《'+ title +'》这节目太幽默了，太有才了！') : '这节目太幽默了，太有才了！';
        	var href = add_param(share_url, 'resopenid', hex_md5(openid), true);
        	
//        	if (guid) {
//        		href = href.replace('index.html', 'about.html');
//        		href = add_param(href, 'guid', guid, true);
//        	}
        	href = add_yao_prefix(href);
        	
            this.dataLoaded({
                title : share_title,
                link: href,
                desc: share_desc,
                imgUrl: share_img
            });
        },
        confirm: function(resp) {
	    	recordUserOperate(openid, '分享成功', 'share-success');
        }
    };

    Api.shareToFriend(wxData, wxCallbacks);
    Api.shareToTimeline(wxData, wxCallbacks);
    Api.generalShare(wxData,wxCallbacks);
});
