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
        	var href = share_url;
        	if (href.indexOf('card.html') > -1) {
        		href = add_param(href, 'id', window['cardid'], true);
        	}
        	href = add_param(href, 'resopenid', hex_md5(openid), true);
        	href = add_param(href, 'from', 'share', true);
        	
        	var starName = W['localStorage'].starName;
        	if (starName) {
        		share_desc = '我跟'+ starName +'为您送上新春贺卡';
        	}
            this.dataLoaded({
                title : share_title,
                link: add_yao_prefix(href),
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
