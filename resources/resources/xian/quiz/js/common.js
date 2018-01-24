/**
 * Created by Administrator on 2014/7/27.
 */
var resourceType = "1";
var share_img, share_title, share_desc, share_group;
var COMMON_SYSTEM_ERROR_TIP = "系统繁忙，请稍候再试！";
var getQueryString = function( name ) {
    var currentSearch = decodeURIComponent( location.search.slice( 1 ) );
    if ( currentSearch != '' ) {
        var paras = currentSearch.split( '&' );
        for ( var i = 0, l = paras.length, items; i < l; i++ ) {
            items = paras[i].split( '=' );
            if ( items[0] === name) {
                return items[1];
            }
        }
        return '';
    }
    return '';
};

var from = getQueryString("from");
var gefrom = getQueryString("gefrom");
if (from != null && from != '') {
	gefrom = from;
}
// 在需要分享后，返回首页的页面运行此方法
var noRunShare = $("#noRunShare").val();
if (!noRunShare) {
	if (from != null && from != '' && window.location.pathname.indexOf("index.html") < 0) {
		location.href = "index.html?from=" + from;
	}
}
function toUrl(url) {
	if (from != null && from != '') {
		if (url.indexOf(".html?") > 0) {
			url = url + "&gefrom=" + from;
		} else {
			url = url + "?gefrom=" + from;
		}
	}
	if (gefrom != null && gefrom != '') {
		if (url.indexOf("gefrom=") < 0) {
			if (url.indexOf(".html?") > 0) {
				url = url + "&gefrom=" + gefrom;
			} else {
				url = url + "?gefrom=" + gefrom;
			}
		}
	}
	setTimeout("window.location.href='" + url + "'", 5);
}

function jsmain(){
    var height = $(window).height();
    if($('.main').has(".winmain")){
        $('.main').css('minHeight', height - 80);
    }else{
        $('.main').css('minHeight', height - 40);
    }
}

var getResult = function(url, data, callback, showloading) {
	if (showloading) {
		showLoading();
	}
	$.ajax({
		type : 'GET',
		async : false,
		url : domain_url + url,
		data: data,
		dataType : "jsonp",
		jsonp : callback,
		complete: function() {
			if (showloading) {
				hideLoading();
			}
		},
		success : function(data) {}
	});
};
var showLoading = function() {
	var t = simpleTpl(),
		$spinner = $('#spinner');
	
	$('.main').addClass('hidden');
	if ($spinner.length > 0) {
		$spinner.show();
	} else {
		
		t._('<div class="spinner" id="spinner">')
			._('<div class="bounce1"></div>')
			._('<div class="bounce2"></div>')
			._('<div class="bounce3"></div>')
		._('</div>');

		var width = $(window).width(),
			height = $(window).height(),
			spinnerSize = 150;
		$spinner = $(t.toString()).css({'left': (width - spinnerSize) / 2, 'top': (height - spinnerSize) / 2});
		$spinner.addClass('spinner-user');
		$('body').append($spinner);
	}
};

var hideLoading = function() {
	$('#spinner').hide();
	$('.main, .copyright').removeClass('hidden');
};

var simpleTpl = function( tpl ) {
    tpl = $.isArray( tpl ) ? tpl.join( '' ) : (tpl || '');

    return {
        store: tpl,
        _: function() {
            var me = this;
            $.each( arguments, function( index, value ) {
                me.store += value;
            } );
            return this;
        },
        toString: function() {
            return this.store;
        }
    };
};
$(function() {

    jsmain();

	
	$("script").each(function(i, item) {
		var scr = $(this).attr("src");
		$(this).attr("src", scr + "?v=" + version);
	});
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "version/check",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackVersionHandler",
		success : function(data) {
			if(!data.result){
				location.href = data.redirect;
			}
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			share_group = data.sgt;
		},
		error : function() {
		}
	});
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "user/save",
		data : {
			openid : openid,
			type : resourceType,
			userProfile : userProfile
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackUserHandler",
		success : function(data) {
		},
		error : function() {
		}
	});
});
