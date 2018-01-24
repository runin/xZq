(function($) {
	H.qiandao = {
        context2D:null,
        pic:null,
        puid: null,
        auid: null,
        beginDate:null,
		init: function() {
            var me = this;
            var week = new Date().getDay();
            if(week == 1){
                $(".zhouyi-btn").removeClass("none");
            }
            $(window).scroll(function(){
                var scroH = $(this).scrollTop(),
                    $fix = $('.bottom-btn');
                if(scroH > 100){
                    $fix.animate({
                            opacity: 1
                        }, 500,
                        'ease-in');
                }else if(scroH == 0){
                    $fix.animate({
                            opacity: 0
                        }, 500,
                        'ease-out');
                }
            });
            me.signActivity();
            me.event_handler();
            me.loadGuide();
            me.ddtj();
            var week = new Date().getDay();
            location.href = "#bg"+week;
		},
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        loadGuide: function() {
            if($.fn.cookie(mpappid + '_qiandao')){
            }else{
                H.dialog.qiandao.open();
                var Days = 1;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                $.fn.cookie(mpappid + '_qiandao', true, {expires: exp});
            };
        },
        event_handler:function(){
            $(".qiandao").click(function(e){
                if($(this).hasClass("gray")){
                    return;
                }
                var auid = $(this).parent().attr("id");
                H.qiandao.auid = auid;
                getResult("api/sign/signed",{yoi:openid,auid:auid,wxnn:nickname,wxurl:headimgurl},"callbackSignSignedHandler",true);
            });
        },
        signActivity: function(){
            getResult("api/sign/round",{},"callbackSignRoundHandler",true);
        },
        signRecord: function(){
            getResult("api/sign/myrecord",{yoi:openid,bt:H.qiandao.beginDate},"callbackSignMyRecordHandler",true);
        }
	};
    W.callbackSignRoundHandler = function(data){
        if(data.code == 0){
            H.qiandao.puid = data.puid;
            var items = data.items;
            H.qiandao.beginDate = items[items.length-1].st.split(" ")[0];
            for(var i = 0; i< items.length;i++){
                var myDate = new Date(Date.parse(items[i].st.replace(/-/g, "/")));
                var day = myDate.getDay();
                if(day == 0){
                    day = 7;
                }
                $(".bg"+(day)).attr("id",items[i].uid);
                $("#"+items[i].uid).find(".view").attr("src",items[i].i);
                $("#"+items[i].uid).find(".qiandao").html(items[i].t);
                $("#"+items[i].uid).find(".content").html(items[i].d);
            }
            H.qiandao.signRecord();
        }
    }
    W.callbackSignMyRecordHandler = function(data){
        var week = new Date().getDay();
        $(".bg"+week).find(".qiandao").removeClass("gray");
        if(data.code == 0){
            var items = data.items;
            for(var i = 0; i< items.length;i++){
                $("#"+items[i].aid).find(".flag").removeClass("none");
                $("#"+items[i].aid).find(".content").removeClass("none");
                $("#"+items[i].aid).find(".qiandao").addClass("none");
                if(i == items.length -1){
                    $(".car").addClass("none");
                    $("#"+items[i].aid).find(".car").removeClass("none");
                }
            }
        }
    }
    W.callbackSignSignedHandler = function(data){
        if(data.code == 0){
            $(".run-bg").removeClass("none");
            setTimeout(function(){
                $(".run-bg").addClass("none");
                $("#"+ H.qiandao.auid).find(".qiandao").addClass("none");
                $("#"+ H.qiandao.auid).find(".flag").removeClass("none");
                $("#"+ H.qiandao.auid).find(".content").removeClass("none");
                $(".car").addClass("none");
                $("#"+H.qiandao.auid).find(".car").removeClass("none");
            },4000);
        }
    }

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
})(Zepto);

$(function() {
	H.qiandao.init();
});