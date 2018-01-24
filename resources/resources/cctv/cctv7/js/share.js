
WeixinApi.enableDebugMode(true);
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
        	
        	href = add_param(href, 'resopenid', hex_md5(openid), true);
        	href = add_param(href, 'from', 'share', true);
        	
            this.dataLoaded({
                title : share_title,
                link: add_yao_prefix(href),
                desc: share_desc,
                imgUrl: share_img
            });
        },
        confirm: function(resp) {
	    
        }
    };


    var wxCallbacks2 = {
        favorite : false,
        async:true,
        ready : function() {
            var href = share_url;
            
            href = add_param(href, 'resopenid', hex_md5(openid), true);
            href = add_param(href, 'from', 'share', true);
            
            this.dataLoaded({
                title : share_title,
                link: add_yao_prefix(href),
                desc: share_desc,
                imgUrl: share_img
            });
        },
        confirm: function(resp) {
         
        }
    };

    Api.shareToFriend(wxData, wxCallbacks);
    Api.shareToTimeline(wxData, wxCallbacks2);
    Api.generalShare(wxData,wxCallbacks);
});
