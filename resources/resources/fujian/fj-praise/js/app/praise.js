(function($) {
	H.praise = {
        sumNum:0,
        guid: '',
        isEnd: false,
        wxCheck: false,
        isError: false,
		init: function() {
            var me = this;
            me.event();
            me.round();
            me.ddtj();
            H.dialog.rule.open();
            me.wxConfig();
		},
        event: function(){
            var me = this;
            $(".btn-rule").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("requesting")){
                    $(this).addClass("requesting");
                    H.dialog.rule.open();
                    setTimeout(function(){
                        $(".btn-rule").removeClass("requesting");
                    },2000);
                }
            });
        },
        bandClick: function(){
            var me = this;
            $('.zan').click(function(e) {
                e.preventDefault();
                if($(this).hasClass("gray")){
                    showTips("今天的点赞次数已用完，明天再来");
                    return;
                }
                var guid = $(this).attr('data-guid');
                var pid = $(this).attr('data-pid');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer' + dev,
                    data: { yoi: openid,
                        guid: guid,
                        pluids: pid },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    timeout: 5000,
                    complete: function() {
                    },
                    success : function(data) {
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });

                // 投票成功，存入cookie
                var date=new Date();
                date.setTime(date.getTime()+20*60*60*1000);
                $("#"+pid).attr("data-num",($("#"+pid).attr("data-num")*1+1));
                $("#"+pid).text($("#"+pid).attr("data-num"));
                H.praise.sumNum ++;
                $.fn.cookie(openid,H.praise.sumNum,{expires:date});
                if(H.praise.sumNum >= 3){
                    $('.zan').each(function() {
                        $(this).text($(this).attr("data-num"));
                        $(this).addClass("gray");
                    });
                }

                $(".praise").animate({'opacity': '0'});
                setTimeout(function(){
                    $(".praise").addClass("none");
                    $(".lottery").removeClass("none");
                    $(".lottery").animate({'opacity': '1'});
                },1000);
            });
            $('.eg-hammer,.eg').click(function(e) {
                if(!$(this).parent().hasClass("clicked")){
                    $(this).parent().addClass("clicked");
                    shownewLoading();
                    me.voteLottery_port();
                    setTimeout(function(){
                        $(".lottery").removeClass("clicked");
                    },2000);
                }
            });
        },
        round : function(){
            getResult("api/voteguess/inforoud",{},"callbackVoteguessInfoHandler");
        },
        tickets: function(guid){
            getResult("api/voteguess/groupplayertickets",{groupUuid:guid},"callbackVoteguessGroupplayerticketsHandler");
        },
        isvote: function(guid){
            getResult("api/voteguess/isvote",{yoi:openid,guid:guid},"callbackVoteguessIsvoteHandler");
        },
        voteLottery_port: function() {
            var me = this, sn = new Date().getTime() + '';
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck4Vote' + dev,
                data: { oi: openid , sn : sn },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        sn = new Date().getTime() + '';
                        me.voteLottery_show(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime() + '';
                            me.voteLottery_show(data);
                        }
                    }else{
                        sn = new Date().getTime() + '';
                        me.voteLottery_show(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime() + '';
                    me.voteLottery_show(null);
                }
            });
            recordUserOperate(openid, "调用投票抽奖接口", "doVoteLottery");
            recordUserPage(openid, "调用投票抽奖接口", 0);
        },
        voteLottery_show: function(data) {
            if(data == null || data.result == false || data.pt == 0){
                H.dialog.thanksLottery.open();
                return;
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            }
            else if(data.pt == 9)
            {
                H.dialog.linkLottery.open(data);
            }else  if(data.pt == 7)
            {
                H.dialog.wxcardLottery.open(data);
            }
            else
            {
                H.dialog.thanksLottery.open();
            }
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'mp/jsapiticket'+dev,
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
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
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }

                },
                error:function(xmlHttpRequest, error) {
                }
            });
        }
	};

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            if(data.url.split(";")[0])
            {
                 $('#ddtj').attr('href', (data.url.split(";")[0] || '')).removeClass('none');
                 $(".ddtj-context").text(data.desc.split(";")[0] || '');
            }
           if(data.url.split(";")[1])
            {
                $('#outline').attr('href', (data.url.split(";")[1] || '')).removeClass('none');
                $(".outline-context").text(data.desc.split(";")[1] || '');
            }
           
        } else {
            $('#ddtj').remove();
            $('#outline').remove();
        }
    };

    W.callbackVoteguessInfoHandler = function(data){
        if(data.code == 0){
            //主题图
            var iul = data.iul;
            if(iul){
                $(".advertise").attr("src",data.iul);
                $(".advertise").removeClass("none");
            }
            if(data.items){
                var items = data.items[0];
                //如果最后一轮结束
                var nowTimeStr = timeTransform(data.cud*1);
                if(comptime(items.get,nowTimeStr) >= 0){
                    H.praise.isEnd = true;
                }
                var pitems = items.pitems;
                var t = simpleTpl();
                for(var i = 0; i < pitems.length; i++){
                    t._('<li>')
                        ._('<i></i>')
                        ._('<span class="number">'+(i+1)+'</span>')
                        ._('<img class="avatar" src="'+pitems[i].im+'">')
                        ._('<span class="uname">'+pitems[i].na+'</span>')
                        ._('<a id="'+pitems[i].pid+'" class="zan none" data-pid="'+pitems[i].pid+'" data-guid="'+items.guid+'" data-leftnum="3" data-collect="true" data-collect-flag="praise-praisebtn" data-collect-desc="点赞页-点赞按钮">点赞</a>')
                        ._('</li>');
                }
                $("#per-list").html(t.toString());
                H.praise.tickets(items.guid);
                H.praise.guid = items.guid;
            }
        }
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items){
                for(var i = 0;i < items.length; i++){
                    $("#"+items[i].puid).attr("data-num",items[i].cunt);
                }
            }
            if(H.praise.isEnd){
                $(".zan").addClass("gray");
                $('.zan').each(function() {
                    $(this).text($(this).attr("data-num"));
                });
                $(".zan").removeClass("none");
            }else{
                H.praise.isvote(H.praise.guid);
            }
        }
    };
    W.callbackVoteguessIsvoteHandler = function(data){
        if(data.code == 0 && data.so){
            var list = data.so.split(",");
            var sumnum = 0;
            var n = parseInt($.fn.cookie(openid));
            if(n && n >= list.length){
                sumnum = n;
            }else{
                sumnum = list.length;
            }
            H.praise.sumNum = sumnum;
            if(sumnum >= 3){
                // 今天的投票次数用完
                $(".zan").addClass("gray");
                $('.zan').each(function() {
                    $(this).text($(this).attr("data-num"));
                });
            }else{
                for(var j = 0; j < list.length; j++){
                    $("#"+list[j]).text($("#"+list[j]).attr("data-num"));
                }
            }
        }
        $(".zan").removeClass("none");
        H.praise.bandClick();
    };
})(Zepto);

$(function() {
	H.praise.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.lottery.isError){
                    H.praise.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.praise.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});