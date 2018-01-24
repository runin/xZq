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
        	var href = share_url,
        		starName = W['localStorage'].starName,
        		cardid = W['localStorage'].cardid;
        	
        	if (starName) {
        		share_desc = '我跟'+ starName +'为您送上新春贺卡';
        	}
        	if (cardid) {
        		href = add_param(href.replace(/[^\/]*\.html/i, 'card.html'), 'id', cardid, true);
        	} else {
        		href = href.replace(/[^\/]*\.html/i, 'index.html');
        	}
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
        	var starName = W['localStorage'].starName;
        	if (starName) {
        		H.dialog.confirm.open();
        	}
        }
    };
    
    var wxCallbacks2 = {
            favorite : false,
            async:true,
            ready : function() {
            	var href = share_url,
            		starName = W['localStorage'].starName,
            		cardid = W['localStorage'].cardid;
            	
            	if (starName) {
            		share_desc = '我跟'+ starName +'为您送上新春贺卡';
            	}
            	if (cardid) {
            		href = add_param(href.replace(/[^\/]*\.html/i, 'card.html'), 'id', cardid, true);
            	} else {
            		href = href.replace(/[^\/]*\.html/i, 'index.html');
            	}
            	href = add_param(href, 'resopenid', hex_md5(openid), true);
            	href = add_param(href, 'from', 'share', true);
            	
                this.dataLoaded({
                    title : share_desc,
                    link: add_yao_prefix(href),
                    desc: share_title,
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
    Api.shareToTimeline(wxData, wxCallbacks2);
    Api.generalShare(wxData,wxCallbacks);
});
