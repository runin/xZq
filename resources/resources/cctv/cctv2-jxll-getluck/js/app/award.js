(function($){
    H.award = {
        ru: '',
        an: '', //奖品下标
        isReady:false,
        awardData: null,
        isError: false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        init: function(){
            this.getRecord();
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
                shownewLoading();
                var me = $(this), awardPt = $(this).attr('data-pt');
                H.award.an = me.attr('data-an');
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
            var nowDay = timeTransform(new Date().getTime()).split(" ")[0];
            getResult('api/lottery/record', {
                oi: openid,
                pt: "1,5,7,9",
                su: 2,
                bd: "2015-08-22",
                ed: nowDay
            }, 'callbackLotteryRecordHandler', true);
        }
    };
    
    W.callbackLotteryRecordHandler = function(data) {
        var t = simpleTpl();
        if(!data.result){
             t._('<h1 class="norecord">您还没有中奖记录<br>继续加油哦</h1>');
             $(".content").html(t.toString());
        }else{
            var rcds = data.rl;
            H.award.awardData = rcds;
            for(var i = 0;i < rcds.length; i++){
                var rcd = rcds[i];
                t._('<li id="' + item.ru + '" data-an="' + i + '" data-pt="' + data.pt + '">')
                    ._('<img src="./images/icon-gift.png">')
                    ._('<div class="con-box"><div class="con">')
                    ._('<p class="prname">' + rcd.pn + '</p>')
                    ._('<p class="prtime">中奖时间：' + rcd.lt.split(" ")[0] + '</p>')
                    ._('</div>')
                    ._('<a class="accept">立即领取</a></div>')
                ._("</li>");
            }
            $("#rcds").html(t.toString());
            H.record.readyFunc();
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
    //执行业务代码
    H.award.init();
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
                    H.award.isReady = true;
                }
            }
        });
    });
    wx.error(function(res){
        H.award.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});