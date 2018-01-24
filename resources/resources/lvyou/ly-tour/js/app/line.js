(function($) {
	H.line = {
        puid:null,
        signNum:0,
        signPriceNum:0,
        beginDate:null,
		init: function() {
            var me = this;
            me.signActivity();

		},
        event_handler:function(){

        },
        signRecord: function(){
            getResult("api/sign/myrecord",{yoi:openid,bt:H.line.beginDate},"callbackSignMyRecordHandler",true);
        },
        signPrice: function(){
            getResult("api/lottery/integral/rank/self",{oi:openid,pu: H.line.puid},"callbackIntegralRankSelfRoundHandler",true);
        },
        signActivity: function(){
            getResult("api/sign/round",{},"callbackSignRoundHandler",true);
        },
        lineList: function(){
            getResult("travel/line",{oi:openid,su:H.line.puid},"callbackTravelIndexHander",true);
        }
	};
    W.callbackSignRoundHandler = function(data){
        if(data.code == 0){
            H.line.puid = data.puid;
            var items = data.items;
            H.line.beginDate = items[items.length-1].st.split(" ")[0];
            H.line.signRecord();
            H.line.signPrice();
            H.line.lineList();
        }
    }
    W.callbackTravelIndexHander = function(data){
        if(data.code == 0){
            $(".top").find("img").attr("src",data.ti);
            $(".title-bg").find(".title").html(data.tt);
            $(".title-bg").find(".desc").html(data.td);

            var cjs = data.cjs;
            var t = new simpleTpl();
            if(cjs){
                for(var i = 0;i<cjs.length;i++){
                    t._();
                    t._('<div class="item">')
                        ._('<div class="desc">')
                        ._('<span class="flag">|</span>')
                        ._('<span class="name">'+cjs[i].ct+'</span>')
                        ._('</div>')
                        ._('<ul>');
                    var ljs = cjs[i].lines;
                    if(ljs){
                        for(var j = 0 ; j< ljs.length; j++){
                            var url = ljs[j].lu ? ljs[j].lu : "";
                            t._('<li class="line-item">')
                                ._('<img src="'+ljs[j].li+'">')
                                ._('<div>')
                                ._('<a class="line-buy" href="'+url+'" data-collect="true" data-collect-flag="ly-tour-line-detail" data-collect-desc="线路页-查看详情按钮">查看详情</a>')
                                ._('</div>')
                                ._('</li>');
                        }
                    }
                    t._('</ul>')
                        ._('</div>');
                }
            }

            $(".content").html(t.toString());
        }
    }
    W.callbackSignMyRecordHandler = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items){
                H.line.signNum = items.length;
                $(".sign-num").html(H.line.signNum);
            }
        }
    }

    W.callbackIntegralRankSelfRoundHandler = function(data){
        if(data.result){
            H.line.signPriceNum = data.in;
            $(".sign-price").html(H.line.signPriceNum);
        }
    }
})(Zepto);

$(function() {
	H.line.init();
});