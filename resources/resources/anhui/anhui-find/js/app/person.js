/**
 * 我要找到你-本期人物
 */
(function($) {
    H.person = {
    	uid: null,
    	expires_in : {expires: 7},
        init: function () {
            var me = this,
            height = document.documentElement.clientHeight - $('header').height();
            $('.person-info').height(height - 78);
            this.event_handler();
            getResult('findyou/info', {}, 'callbackFindyouInfo', true);
        },
        event_handler : function() {
            var me = this;
            $(".for-help").click(function(e){
            	e.preventDefault();
            	var zan_uid = $.fn.cookie('find-zan');
            	if(zan_uid == null || zan_uid != H.person.uid){
                	getResult('findyou/info/support', {uid:H.person.uid,yoi:openid}, 'callbackFindyouSupport', true);
            	}
            });
            $("#xs-btn").click(function(e){
            	e.preventDefault();
            	toUrl("baoliao.html?type=1&uid="+H.person.uid);
            });
            $("#xr-btn").click(function(e){
            	e.preventDefault();
            	toUrl("baoliao.html?type=2&uid="+H.person.uid);
            });
            $("#share-btn").click(function(e){
            	e.preventDefault();
            	share();
            });
        },
        fill_data: function(data){
            $('.ctrls').css({
                'background': 'url('+data.hi+') no-repeat',
                'background-size': '50%',
				'background-position': 'bottom left',
            });
            $('#xun-name').attr('src', data.rl);
            $('.title').html('<img src="'+ data.ti +'">');
            $('.info-box').html(data.desc);
        },
        update_count: function(){
        		setTimeout(function () {
        			getResult('findyou/info/getSupport', {uid:H.person.uid}, 'callbackFindyouGetSupport');
        			H.person.update_count();
        		},5000);
        }
    };

    W.callbackFindyouInfo = function(data){
        if(data.code == 0){
            H.person.fill_data(data);
            H.person.uid = data.uid;
            var zan_uid = $.fn.cookie('find-zan');
            if(zan_uid != null && zan_uid == H.person.uid){
            	$(".for-help").find("img").attr("src","images/love-ed.png");
        	}
            getResult('findyou/info/getSupport', {uid:H.person.uid}, 'callbackFindyouGetSupport', true);
            H.person.update_count();
        }
    };
    W.callbackFindyouGetSupport = function(data){
    	if(data.code == 0){
    		$("#sc-count").html(data.sc);
    	}
    };
    W.callbackFindyouSupport = function(data){
    	if(data.code == 0){
    		$("#sc-count").html($("#sc-count").html()*1+1);
    		$(".for-help").find("img").attr("src","images/love-ed.png");
    		$.fn.cookie('find-zan',H.person.uid, H.person.expires_in);
    	}
    };
})(Zepto);

$(function(){
    H.person.init();
});


