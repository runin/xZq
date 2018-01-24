(function($){
    H.award = {
        ru: '',
        an: '', //奖品下标
        id: null,
        isReady:false,
        awardData: null,
        isError: false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        pt: "1,5,9",
        init: function(){
            this.getRecord();
            $.fn.cookie('jumpNum', 0, {expires: -1});
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        },
        readyFunc:function(){
            $("li").click(function(e) {
                e.preventDefault();
                var me = $(this), awardPt = $(this).attr('data-pt');
                H.award.an = me.attr('data-an');
                H.award.id = me.attr('id');
                if(awardPt == 7 || awardPt == 9){
                    //卡券或外链
                    H.dialog.lottery.open(H.award.awardData[parseInt(H.award.an)]);
                } else if(awardPt == 5 || awardPt == 1){
                    //兑换码或实物奖
                    H.dialog.Entlottery.open(H.award.awardData[parseInt(H.award.an)]);
                }
            });
        },
        getRecord: function() {
            var endDate = getBeforeDate(7), nowDay = timeTransform(new Date().getTime()).split(" ")[0];
            getResult('api/lottery/record', {
                oi: openid,
                pt: H.award.pt,
                su: 2,
                bd: endDate,
                ed: nowDay
            }, 'callbackLotteryRecordHandler', true);
        }
    };
    
    W.callbackLotteryRecordHandler = function(data) {
        var t = simpleTpl();
        if(!data.result){
            if(data.flow) {
                 t._('<h1 class="norecord">俗话说先来后到，领奖人数太多<br>收藏本页面，等下再来领哦~</h1>');
                 $(".content").html(t.toString());
             } else {
                 t._('<h1 class="norecord">您当前没有未领奖的记录</h1>');
                 $(".content").html(t.toString());
             }
        }else{
            $("#rcds").empty();
            var rcds = data.rl;
            H.award.awardData = rcds;
            for(var i = 0;i < rcds.length; i++){
                var rcd = rcds[i];
                if (!$.fn.cookie(rcd.ru)) {
                    t._('<li id="' + rcd.ru + '" data-an="' + i + '" data-pt="' + rcd.pt + '">')
                        ._('<img src="./images/icon-gift.png">')
                        ._('<div class="con-box"><div class="con">')
                        ._('<p class="prname">' + rcd.pn + '</p>')
                        ._('<p class="prtime">中奖时间：' + rcd.lt.split(" ")[0] + '</p>')
                        ._('</div>')
                        ._('<a class="accept">立即领取</a></div>')
                    ._("</li>");
                }
            }
            $("#rcds").html(t.toString());
            if ($('ul li').length <= 0) {
                $('.content').html('<h1 class="norecord">您当前没有未领奖的记录</h1>');
            }
            H.award.readyFunc();
        }
    };

    W.callbackJsapiTicketHandler = function(data) {  
        var url = window.location.href.split('#')[0];
        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
        var timestamp = Math.round(new Date().getTime()/1000);
        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
        //权限校验
        wx.config({
           debug: false,
           appId: shaketv_appid,
           timestamp: timestamp,
           nonceStr:nonceStr,
           signature:signature,
           jsApiList: [
             "addCard"
           ]
        }); 
     };
})(Zepto);

$(function(){
    shownewLoading();
    //config微信jssdk
    H.award.wxConfig();
    wx.ready(function () {
        //wx.config成功
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.award.isError){
                    H.award.pt = "1,5,7,9";
                }
                //执行业务代码
                H.award.init();
            }
        });
    });
    wx.error(function(res){
        H.award.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.award.wxConfig();
    });
});